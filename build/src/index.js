"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.Graph = void 0;
// @ts-ignore
const axios_1 = __importDefault(require("axios"));
// @ts-ignore
const pure_md5_1 = require("pure-md5");
const response_1 = __importDefault(require("./response"));
exports.Response = response_1.default;
const utils_1 = __importDefault(require("./utils"));
class Graph {
    constructor() {
        this.queryTree = {
            al: undefined,
            ft: {},
            c: [],
            f: '',
            n: '',
            p: 0,
            pr: {}
        };
        this.auto_link = true;
        this.accumulate = false;
    }
    static setRequestConfig(config) {
        Graph.requestConfig = Object.assign(Object.assign({}, Graph.requestConfig), config);
    }
    static Column(column) {
        if (/[^\w_]/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    }
    static validColOnly(column) {
        if (!/[\w._]+/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    }
    static Col(column) {
        return Graph.Column(column);
    }
    disableAutoLink() {
        this.auto_link = false;
        return this;
    }
    service(name) {
        let tokens = name.split("/");
        this.queryTree.f = tokens[1] !== "undefined" ? tokens[1] : undefined;
        this.queryTree.n = tokens[0];
        return this;
    }
    ;
    where(conditions) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on');
        if (typeof conditions == 'object')
            this.queryTree.ft = this.objToFilter(conditions);
        else
            this.last_col = conditions;
        return this;
    }
    ;
    objToFilter(obj) {
        let filters = {};
        for (let k in obj) {
            filters[k] = {
                vl: obj[k],
                op: "="
            };
        }
        return filters;
    }
    andWhere(conditions) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on');
        if (typeof conditions == 'object')
            this.queryTree.ft = Object.assign(Object.assign({}, this.queryTree.ft), conditions);
        else
            this.last_col = conditions;
        return this;
    }
    ;
    greaterThan(value) {
        return this.addCustomFilter(value, ">");
    }
    lessThan(value) {
        return this.addCustomFilter(value, "<");
    }
    equals(value) {
        return this.addCustomFilter(value, "==");
    }
    notEquals(value) {
        return this.addCustomFilter(value, "!=");
    }
    isNull() {
        return this.addCustomFilter(null, "NULL");
    }
    isNotNull() {
        return this.addCustomFilter(null, "NOTNULL");
    }
    // matches (value: string) {
    //     return this.addCustomFilter(value,"MATCHES")
    // }
    isLike(value) {
        return this.addCustomFilter(value, "LIKES");
    }
    isNotLike(value) {
        return this.addCustomFilter(value, "NOT-LIKES");
    }
    addCustomFilter(value, operator) {
        if (!this.last_col)
            throw new Error(`Specify column to compare ${value} with`);
        let filter = {
            [this.last_col]: {
                vl: value,
                op: operator
            }
        };
        if (!this.queryTree)
            throw new Error('Specify service to apply where clauses');
        this.queryTree.ft = Object.assign(Object.assign({}, (this.accumulate ? this.queryTree.ft : null)), filter);
        this.last_col = undefined;
        this.accumulate = false;
        return this;
    }
    ref(id) {
        if (this.queryTree) {
            this.queryTree.ft = Object.assign(Object.assign({}, this.queryTree.ft), this.objToFilter({
                id
            }));
        }
        return this;
    }
    ;
    page(page) {
        if (isNaN(parseInt(page))) {
            throw new Error("Page must be a valid number");
        }
        if (this.queryTree) {
            this.queryTree.p = page;
        }
        return this;
    }
    ;
    search(col, keyword) {
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
    }
    ;
    select(...columns) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = "get";
        this.fetch(...columns);
        return this;
    }
    ;
    selectAll(...columns) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = "getAll";
        this.fetch(...columns);
        return this;
    }
    ;
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
    func(func) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = func;
        return this;
    }
    ;
    fetch(...columns) {
        if (!this.queryTree) {
            throw new Error('Specify service to fetch from');
        }
        this.queryTree.c = columns.map((column) => {
            if (column instanceof Graph) {
                return column.queryTree;
            }
            return typeof column == "string" ? Graph.Column(column) : column;
        });
        return this;
    }
    ;
    as(alias) {
        if (!this.queryTree) {
            throw new Error('Specify service to apply alias to');
        }
        this.queryTree.a = alias;
        return this.queryTree;
    }
    ;
    getCacheHash() {
        return (0, pure_md5_1.md5)(JSON.stringify(this.queryTree));
    }
    ;
    toLink() {
        if (!this.queryTree)
            throw new Error("Service not specified");
        let query;
        this.queryTree.al = this.auto_link;
        query = JSON.stringify(this.queryTree);
        if (query) {
            return "query=" + query;
        }
        else
            throw new Error('Unable to generate query string');
    }
    ;
    async makeRequest(endpoint, method = 'get', params = {}) {
        let req = axios_1.default.create(Graph.requestConfig);
        console.log({ params });
        return new Promise(async (resolve, reject) => {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                let res = await req[method](endpoint, await params, Graph.requestConfig);
                console.log({ res });
                res = res.data;
                resolve(new response_1.default(res));
            }
            catch (e) {
                let err = e;
                let error = {
                    currentPage: 0,
                    data: undefined,
                    msg: "",
                    networkMsg: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : "unknown",
                    status: 0,
                    totalPages: 0
                };
                let netRes;
                if (axios_1.default.isAxiosError(err)) {
                    netRes = err.response;
                    error.data = (_b = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _b === void 0 ? void 0 : _b.data;
                    error.msg = (_c = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _c === void 0 ? void 0 : _c.msg;
                    error.status = (_d = netRes === null || netRes === void 0 ? void 0 : netRes.status) !== null && _d !== void 0 ? _d : (_e = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _e === void 0 ? void 0 : _e.statusCode;
                    error.totalPages = (_f = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _f === void 0 ? void 0 : _f.totalPages;
                    error.currentPage = (_g = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _g === void 0 ? void 0 : _g.currentPage;
                }
                error.networkMsg = err.message;
                reject(new response_1.default(error));
            }
        });
    }
    ;
    async get() {
        let link = Graph.endpoint + '?' + this.toLink();
        return await this.makeRequest(link, 'get');
    }
    ;
    async post(values = {}) {
        return this.set(values);
    }
    ;
    async delete() {
        let link = Graph.endpoint + '?' + this.toLink();
        return await this.makeRequest(link, 'delete');
    }
    ;
    async set(values = {}) {
        if (!this.queryTree)
            throw new Error('Specify service to send request to');
        console.log({ values });
        this.postData = values;
        let link = Graph.endpoint + '?' + this.toLink();
        return await this.makeRequest(link, 'post', utils_1.default.formBuild(this.postData));
    }
    ;
    async update(values = {}) {
        if (!this.queryTree)
            throw new Error('Specify service to send request to');
        console.log({ values });
        this.postData = values;
        let link = Graph.endpoint + '?' + this.toLink() + '&_method=PATCH';
        return await this.makeRequest(link, 'post', utils_1.default.formBuild(this.postData));
    }
    ;
    params(params) {
        if (!this.queryTree)
            throw new Error('Specify service to bind param to');
        this.queryTree.pr = params;
        return this;
    }
    ;
}
exports.default = Graph;
exports.Graph = Graph;
Graph.endpoint = "/";
