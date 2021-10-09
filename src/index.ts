// @ts-ignore
import axios, {AxiosError,AxiosRequestConfig} from "axios";
// @ts-ignore
import {md5} from "pure-md5"
import {Response} from "./response";
import Service from "./types/Service";
import Datum from "./types/Datum";
import ResponseStruct from "./types/ResponseStruct";
import Utils from "./utils";
import Filters from "./types/Filters";

export default class Graph {
    static requestConfig: AxiosRequestConfig
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

    static setRequestConfig(config: AxiosRequestConfig) {
        Graph.requestConfig = {
            ...Graph.requestConfig,
            ...config,
        };
    }

    static Column(column: string) {
        if (/[^\w_]/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    }

    static validColOnly(column: string) {
        if (!/[\w._]+/.test(column)) {
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

        this.queryTree = {
            al: undefined,
            ft: {},
            c: [],
            f: tokens[1] !== "undefined" ? tokens[1] : undefined,
            n: tokens[0],
            p: 0,
            pr: {}
        }

        return this;
    };

    where(conditions: Datum | string) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on')

        if(typeof conditions == 'object')
            this.queryTree.ft = this.objToFilter(conditions);
        else
            this.last_col = conditions
        return this;
    };

    objToFilter(obj: {[k:string]: any}): Filters{
        let filters: Filters = {};

        for (let k in obj){
            filters[k] = {
                vl: obj[k],
                op: "="
            }
        }

        return filters

    }

    andWhere(conditions: object | string) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on')

        if(typeof conditions == 'object')
            this.queryTree.ft = {...this.queryTree.ft,...conditions};
        else
            this.last_col = conditions
        return this;
    };

    greaterThan(value: number) {
        return this.addCustomFilter(value,">")
    }
    lessThan (value: number) {
        return this.addCustomFilter(value,"<")
    }
    equals (value: any) {
        return this.addCustomFilter(value,"==")
    }
    notEquals (value: any) {
        return this.addCustomFilter(value,"!=")
    }
    isNull () {
        return this.addCustomFilter(null,"NULL")
    }
    isNotNull () {
        return this.addCustomFilter(null,"NOTNULL")
    }
    // matches (value: string) {
    //     return this.addCustomFilter(value,"MATCHES")
    // }
    isLike (value: any) {
        return this.addCustomFilter(value,"LIKES")
    }
    isNotLike (value: any) {
        return this.addCustomFilter(value,"NOT-LIKES")
    }

    addCustomFilter(value: any,operator: string) {
        if(!this.last_col)
            throw new Error(`Specify column to compare ${value} with`);

        let filter = {
            [this.last_col]:{
                vl: value,
                op: operator
            }
        }

        if (!this.queryTree)
            throw new Error('Specify service to apply where clauses')

        this.queryTree.ft = {
            ...(this.accumulate ? this.queryTree.ft:null),
            ...filter
        }
        this.last_col = undefined;
        this.accumulate = false;
        return this;
    }


    public ref(id: number) {
        if (this.queryTree){
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
        if (isNaN(page)) {
            throw new Error("Page must be a valid number");
        }
        if (this.queryTree){
            this.queryTree.p = page;
        }
        return this;
    };


    search(col: string,keyword: string) {
        if (!col) {
            throw new Error("Page must be a valid number");
        }
        if(this.queryTree){
            this.queryTree.q = {
                c: Graph.validColOnly(col),
                k: keyword
            };
        }

        return this;
    };

    public select(...columns: Array<string|Service|Graph>) {
        if (!this.queryTree){
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = "get";
        this.fetch(...columns);
        return this;
    };
    public selectAll(...columns: Array<string|Service|Graph>) {
        if (!this.queryTree){
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = "getAll";
        this.fetch(...columns);
        return this;
    };

    // public async getOne(...columns: Array<string|Service>) {
    //     if (!this.queryTree){
    //         throw new Error('Specify service to select from')
    //     }
    //     this.queryTree.f = "get";
    //     columns = [...this.queryTree.c,...columns]
    //
    //     this.fetch(...columns);
    //     return await this.get();
    // };
    // getAll(...columns: Array<string|Service>) {
    //     if (!this.queryTree){
    //         throw new Error('Specify service to select from')
    //     }
    //     this.queryTree.f = "getAll";
    //
    //     columns = [...this.queryTree.c,...columns]
    //     this.fetch(...columns);
    //     return this.get();
    // };

    func(func: string) {
        if (!this.queryTree){
            throw new Error('Specify service to select from')
        }
        this.queryTree.f = func;
        return this;
    };

    fetch(...columns: Array<string|Service|Graph>) {
        if (!this.queryTree){
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
        if (!this.queryTree){
            throw new Error('Specify service to apply alias to')
        }

        this.queryTree.al = alias;
        return this.queryTree;
    };

    public getCacheHash(){
        return md5(JSON.stringify(this.queryTree));
    };

    private toLink() {
        // console.log(JSON.stringify(this.queryTree))
        if (!this.queryTree) throw new Error("Service not specified");
        let query: string;

        if(query = JSON.stringify(this.queryTree)){
            return "query="+query;
        }else
            throw new Error('Unable to generate query string')
    };

    private async makeRequest(endpoint: string, method:string = 'get', params: Datum = {}): Promise<Response> {

        let req = axios.create(Graph.requestConfig);
        return new Promise(async (resolve, reject) => {
            try {
                let res = await (req as any)[method](endpoint, params);
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


                if (axios.isAxiosError(err)){
                   netRes =  (err.response as unknown as ResponseStruct)
                   error.data = netRes?.data
                   error.msg = netRes?.msg
                   error.status = netRes?.status
                   error.totalPages = netRes?.totalPages
                   error.currentPage = netRes?.currentPage
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

    public async post(values = {}): Promise<Response> {
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
}

export {
    Graph
};
