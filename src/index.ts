// @ts-ignore
import axios, { AxiosError, AxiosRequestConfig } from "axios";
// @ts-ignore
import { md5 } from "pure-md5"
import { Response } from "./response";
import Service from "./types/Service";
import Datum from "./types/Datum";
import ResponseStruct from "./types/ResponseStruct";
import Utils from "./utils";
import Filters from "./types/Filters";
import AvandaStream from "./stream";


interface AvandaConfig {
    secureWebSocket?: boolean;
    rootUrl: string;
    wsUrl?: string
  
}

export default class Graph {
    static axiosRequestConfig: AxiosRequestConfig
    static config: AvandaConfig = {
        rootUrl:'/',
        secureWebSocket: false,
    }

    static endpoint: string = "/"

    private queryTree: Service = {
        al: undefined,
        ft: {},
        c: [],
        f: '',
        n: '',
        p: 0,
        pr: {}
    };
    private auto_link: boolean = true;
    private last_col?: string;
    private accumulate = false;

    private postData?: Datum

    constructor() {

    }

    static setAxiosRequestConfig(config: AxiosRequestConfig) {
        Graph.axiosRequestConfig = {
            ...{ baseURL: this.config.rootUrl },
            ...Graph.axiosRequestConfig,
            ...config,
        };
    }

    static setAvandaConfig(config: AvandaConfig) {
        Graph.config = config;
    }


    static Column(column: string) {
        if (/[^\w_\*]/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    }

    static async File(event): Promise<File | File[]> {
        return Utils.extractPostable(await Utils.processFile(event));
    }

    static validColOnly(column: string) {
        if (!/[\w._\*]+/.test(column)) {
            throw new Error("Invalid column name");
        }

        return column;
    }

    static Col(column: string) {
        return Graph.Column(column);
    }

    public disableAutoLink() {
        this.auto_link = false;
        return this;
    }

    service(name: string) {
        let tokens = name.split("/");
        this.queryTree.f = tokens[1] !== "undefined" ? tokens[1] : undefined;
        this.queryTree.n = tokens[0]
        return this;
    };

    where(conditions: Datum | string) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on')

        if (typeof conditions == 'object')
            this.queryTree.ft = this.objToFilter(conditions);
        else
            this.last_col = conditions
        return this;
    };


    andWhere(conditions: Datum | string) {
        this.accumulate = true;
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on')

        if(typeof conditions == 'object')
            this.queryTree.ft = {
                ...(this.queryTree.ft ?? null),
                ...this.objToFilter(conditions)
            };
        else
            this.last_col = conditions
        return this;
    };

    objToFilter(obj: { [k: string]: any }): Filters {
        let filters: Filters = {};

        for (let k in obj) {
            filters[k] = {
                vl: obj[k],
                op: "="
            }
        }

        return filters

    }


    greaterThan(value: number) {
        return this.addCustomFilter(value, ">")
    }
    lessThan(value: number) {
        return this.addCustomFilter(value, "<")
    }
    equals(value: any) {
        return this.addCustomFilter(value, "==")
    }
    notEquals(value: any) {
        return this.addCustomFilter(value, "!=")
    }
    isNull() {
        return this.addCustomFilter(null, "NULL")
    }
    isNotNull() {
        return this.addCustomFilter(null, "NOTNULL")
    }
    // matches (value: string) {
    //     return this.addCustomFilter(value,"MATCHES")
    // }
    isLike(value: any) {
        return this.addCustomFilter(value, "LIKES")
    }
    isNotLike(value: any) {
        return this.addCustomFilter(value, "NOT-LIKES")
    }

    addCustomFilter(value: any, operator: string) {
        if (!this.last_col)
            throw new Error(`Specify column to compare ${value} with`);

        let filter = {
            [this.last_col]: {
                vl: value,
                op: operator
            }
        }

        if (!this.queryTree)
            throw new Error('Specify service to apply where clauses')

        this.queryTree.ft = {
            ...(this.accumulate ? this.queryTree.ft : null),
            ...filter
        }
        this.last_col = undefined;
        this.accumulate = false;
        return this;
    }


    public ref(id: number) {
        if (this.queryTree) {
            this.queryTree.ft = {
                ...this.queryTree.ft,
                ...this.objToFilter({
                    id
                })
            };
        }
        return this;
    };

    public page(page: number) {
        if (isNaN(parseInt(page as unknown as string))) {
            throw new Error("Page must be a valid number");
        }
        if (this.queryTree) {
            this.queryTree.p = page;
        }
        return this;
    };


    search(col: string, keyword: string) {
        if (!col) {
            throw new Error("Specify column to search");
        }
        if (this.queryTree) {
            this.queryTree.q = {
                c: Graph.validColOnly(col),
                k: keyword
            };
        }

        return this;
    };

    public select(...columns: Array<string | Service | Graph>) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = "get";
        this.fetch(...columns);
        return this;
    };
    public selectAll(...columns: Array<string | Service | Graph>) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = "getAll";
        this.fetch(...columns);
        return this;
    };

    func(func: string) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = func;
        return this;
    };

    fetch(...columns: Array<string | Service | Graph>) {
        if (!this.queryTree) {
            throw new Error('Specify service to fetch from')
        }

        this.queryTree.c = columns.map((column) => {
            if (column instanceof Graph) {
                return column.queryTree
            }
            return typeof column == "string" ? Graph.Column(column) : column
        });

        return this;
    };

    public as(alias: string): Service {
        if (!this.queryTree) {
            throw new Error('Specify service to apply alias to')
        }

        this.queryTree.a = alias;
        return this.queryTree;
    };

    public getCacheHash() {
        return md5(JSON.stringify(this.queryTree));
    };

    private toLink() {
        if (!this.queryTree) throw new Error("Service not specified");
        let query: string;

        this.queryTree.al = this.auto_link
        query = JSON.stringify(this.queryTree)

        if (query) {
            return "query=" + query;
        } else
            throw new Error('Unable to generate query string')
    };

    private async makeRequest(endpoint: string, method: string = 'get', params: Datum = {}): Promise<Response> {
        let req = axios.create(Graph.axiosRequestConfig);
        return new Promise(async (resolve, reject) => {
            try {
                let res = await (req as any)[method](endpoint, await params, Graph.axiosRequestConfig);
                res = res.data;
                resolve(new Response(res));
            } catch (e) {
                let err = e as (Error | AxiosError)

                let error: ResponseStruct = {
                    currentPage: 0,
                    data: undefined,
                    msg: "",
                    networkMsg: err?.message ?? "unknown",
                    status: 0,
                    totalPages: 0
                };

                let netRes: ResponseStruct


                if (axios.isAxiosError(err)) {
                    netRes = (err.response as unknown as ResponseStruct)
                    error.data = netRes?.data?.data
                    error.msg = netRes?.data?.msg
                    error.status = netRes?.status ?? netRes?.data?.statusCode
                    error.totalPages = netRes?.data?.totalPages
                    error.currentPage = netRes?.data?.currentPage
                }

                error.networkMsg = err.message

                reject(new Response(error));
            }
        });
    };

    public async get(): Promise<Response> {
        let link = Graph.endpoint + '?' + this.toLink()
        return await this.makeRequest(link, 'get');
    };

    public async post(values: Datum = {}): Promise<Response> {
        return this.set(values);
    };

    public async delete(): Promise<Response> {

        let link = Graph.endpoint + '?' + this.toLink();
        return await this.makeRequest(link, 'delete');
    };


    public async set(values: Datum = {}): Promise<Response> {
        if (!this.queryTree)
            throw new Error('Specify service to send request to')

        this.postData = values;
        let link = Graph.endpoint + '?' + this.toLink();
        return await this.makeRequest(link, 'post', Utils.formBuild(this.postData));
    };

    public async update(values: Datum = {}): Promise<Response> {
        if (!this.queryTree)
            throw new Error('Specify service to send request to')

        this.postData = values;

        let link = Graph.endpoint + '?' + this.toLink() + '&_method=PATCH';
        return await this.makeRequest(link, 'post', Utils.formBuild(this.postData));
    };

    params(params: Datum) {
        if (!this.queryTree)
            throw new Error('Specify service to bind param to')
        this.queryTree.pr = params;
        return this;
    };



    public watch(): AvandaStream {
        let link = (Graph.config.wsUrl || Graph.config.rootUrl) + Graph.endpoint + '?' + this.toLink()
        let url = new URL(link);
        url.protocol = Graph.config.secureWebSocket ? 'wss' : 'ws'
        url.pathname = '/watch'
        return new AvandaStream(
            url.toString()
        )
    };
}

export {
    Graph,
    Response
};
