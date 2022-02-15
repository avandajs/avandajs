"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = exports.Graph = void 0;
// @ts-ignore
var axios_1 = __importDefault(require("axios"));
// @ts-ignore
var pure_md5_1 = require("pure-md5");
var response_1 = require("./response");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return response_1.Response; } });
var utils_1 = __importDefault(require("./utils"));
var Graph = /** @class */ (function () {
    function Graph() {
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
    Graph.setRequestConfig = function (config) {
        Graph.requestConfig = __assign(__assign({}, Graph.requestConfig), config);
    };
    Graph.Column = function (column) {
        if (/[^\w_]/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    };
    Graph.File = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = utils_1.default).extractPostable;
                        return [4 /*yield*/, utils_1.default.processFile(event)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    Graph.validColOnly = function (column) {
        if (!/[\w._]+/.test(column)) {
            throw new Error("Invalid column name");
        }
        return column;
    };
    Graph.Col = function (column) {
        return Graph.Column(column);
    };
    Graph.prototype.disableAutoLink = function () {
        this.auto_link = false;
        return this;
    };
    Graph.prototype.service = function (name) {
        var tokens = name.split("/");
        this.queryTree.f = tokens[1] !== "undefined" ? tokens[1] : undefined;
        this.queryTree.n = tokens[0];
        return this;
    };
    ;
    Graph.prototype.where = function (conditions) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on');
        if (typeof conditions == 'object')
            this.queryTree.ft = this.objToFilter(conditions);
        else
            this.last_col = conditions;
        return this;
    };
    ;
    Graph.prototype.objToFilter = function (obj) {
        var filters = {};
        for (var k in obj) {
            filters[k] = {
                vl: obj[k],
                op: "="
            };
        }
        return filters;
    };
    Graph.prototype.andWhere = function (conditions) {
        if (!this.queryTree)
            throw new Error('Specify service to apply where clause on');
        if (typeof conditions == 'object')
            this.queryTree.ft = __assign(__assign({}, this.queryTree.ft), conditions);
        else
            this.last_col = conditions;
        return this;
    };
    ;
    Graph.prototype.greaterThan = function (value) {
        return this.addCustomFilter(value, ">");
    };
    Graph.prototype.lessThan = function (value) {
        return this.addCustomFilter(value, "<");
    };
    Graph.prototype.equals = function (value) {
        return this.addCustomFilter(value, "==");
    };
    Graph.prototype.notEquals = function (value) {
        return this.addCustomFilter(value, "!=");
    };
    Graph.prototype.isNull = function () {
        return this.addCustomFilter(null, "NULL");
    };
    Graph.prototype.isNotNull = function () {
        return this.addCustomFilter(null, "NOTNULL");
    };
    // matches (value: string) {
    //     return this.addCustomFilter(value,"MATCHES")
    // }
    Graph.prototype.isLike = function (value) {
        return this.addCustomFilter(value, "LIKES");
    };
    Graph.prototype.isNotLike = function (value) {
        return this.addCustomFilter(value, "NOT-LIKES");
    };
    Graph.prototype.addCustomFilter = function (value, operator) {
        var _a;
        if (!this.last_col)
            throw new Error("Specify column to compare " + value + " with");
        var filter = (_a = {},
            _a[this.last_col] = {
                vl: value,
                op: operator
            },
            _a);
        if (!this.queryTree)
            throw new Error('Specify service to apply where clauses');
        this.queryTree.ft = __assign(__assign({}, (this.accumulate ? this.queryTree.ft : null)), filter);
        this.last_col = undefined;
        this.accumulate = false;
        return this;
    };
    Graph.prototype.ref = function (id) {
        if (this.queryTree) {
            this.queryTree.ft = __assign(__assign({}, this.queryTree.ft), this.objToFilter({
                id: id
            }));
        }
        return this;
    };
    ;
    Graph.prototype.page = function (page) {
        if (isNaN(parseInt(page))) {
            throw new Error("Page must be a valid number");
        }
        if (this.queryTree) {
            this.queryTree.p = page;
        }
        return this;
    };
    ;
    Graph.prototype.search = function (col, keyword) {
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
    ;
    Graph.prototype.select = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = "get";
        this.fetch.apply(this, columns);
        return this;
    };
    ;
    Graph.prototype.selectAll = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = "getAll";
        this.fetch.apply(this, columns);
        return this;
    };
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
    Graph.prototype.func = function (func) {
        if (!this.queryTree) {
            throw new Error('Specify service to select from');
        }
        this.queryTree.f = func;
        return this;
    };
    ;
    Graph.prototype.fetch = function () {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        if (!this.queryTree) {
            throw new Error('Specify service to fetch from');
        }
        this.queryTree.c = columns.map(function (column) {
            if (column instanceof Graph) {
                return column.queryTree;
            }
            return typeof column == "string" ? Graph.Column(column) : column;
        });
        return this;
    };
    ;
    Graph.prototype.as = function (alias) {
        if (!this.queryTree) {
            throw new Error('Specify service to apply alias to');
        }
        this.queryTree.a = alias;
        return this.queryTree;
    };
    ;
    Graph.prototype.getCacheHash = function () {
        return (0, pure_md5_1.md5)(JSON.stringify(this.queryTree));
    };
    ;
    Graph.prototype.toLink = function () {
        if (!this.queryTree)
            throw new Error("Service not specified");
        var query;
        this.queryTree.al = this.auto_link;
        query = JSON.stringify(this.queryTree);
        if (query) {
            return "query=" + query;
        }
        else
            throw new Error('Unable to generate query string');
    };
    ;
    Graph.prototype.makeRequest = function (endpoint, method, params) {
        if (method === void 0) { method = 'get'; }
        if (params === void 0) { params = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var req;
            var _this = this;
            return __generator(this, function (_a) {
                req = axios_1.default.create(Graph.requestConfig);
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a, _b, _c, e_1, err, error, netRes;
                        var _d, _e, _f, _g, _h, _j, _k;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    _l.trys.push([0, 3, , 4]);
                                    _b = (_a = req)[method];
                                    _c = [endpoint];
                                    return [4 /*yield*/, params];
                                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_l.sent(), Graph.requestConfig]))];
                                case 2:
                                    res = _l.sent();
                                    res = res.data;
                                    resolve(new response_1.Response(res));
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _l.sent();
                                    err = e_1;
                                    error = {
                                        currentPage: 0,
                                        data: undefined,
                                        msg: "",
                                        networkMsg: (_d = err === null || err === void 0 ? void 0 : err.message) !== null && _d !== void 0 ? _d : "unknown",
                                        status: 0,
                                        totalPages: 0
                                    };
                                    netRes = void 0;
                                    if (axios_1.default.isAxiosError(err)) {
                                        netRes = err.response;
                                        error.data = (_e = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _e === void 0 ? void 0 : _e.data;
                                        error.msg = (_f = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _f === void 0 ? void 0 : _f.msg;
                                        error.status = (_g = netRes === null || netRes === void 0 ? void 0 : netRes.status) !== null && _g !== void 0 ? _g : (_h = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _h === void 0 ? void 0 : _h.statusCode;
                                        error.totalPages = (_j = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _j === void 0 ? void 0 : _j.totalPages;
                                        error.currentPage = (_k = netRes === null || netRes === void 0 ? void 0 : netRes.data) === null || _k === void 0 ? void 0 : _k.currentPage;
                                    }
                                    error.networkMsg = err.message;
                                    reject(new response_1.Response(error));
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    ;
    Graph.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = Graph.endpoint + '?' + this.toLink();
                        return [4 /*yield*/, this.makeRequest(link, 'get')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    Graph.prototype.post = function (values) {
        if (values === void 0) { values = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.set(values)];
            });
        });
    };
    ;
    Graph.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = Graph.endpoint + '?' + this.toLink();
                        return [4 /*yield*/, this.makeRequest(link, 'delete')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    Graph.prototype.set = function (values) {
        if (values === void 0) { values = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.queryTree)
                            throw new Error('Specify service to send request to');
                        this.postData = values;
                        link = Graph.endpoint + '?' + this.toLink();
                        return [4 /*yield*/, this.makeRequest(link, 'post', utils_1.default.formBuild(this.postData))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    Graph.prototype.update = function (values) {
        if (values === void 0) { values = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.queryTree)
                            throw new Error('Specify service to send request to');
                        this.postData = values;
                        link = Graph.endpoint + '?' + this.toLink() + '&_method=PATCH';
                        return [4 /*yield*/, this.makeRequest(link, 'post', utils_1.default.formBuild(this.postData))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    Graph.prototype.params = function (params) {
        if (!this.queryTree)
            throw new Error('Specify service to bind param to');
        this.queryTree.pr = params;
        return this;
    };
    ;
    Graph.endpoint = "/";
    return Graph;
}());
exports.Graph = Graph;
exports.default = Graph;
