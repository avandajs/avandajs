"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(rawResponse = {
        data: null,
        msg: "",
        status: 0,
        totalPages: 0,
        currentPage: 1
    }) {
        this.rawResponse = rawResponse;
    }
    getData() {
        return this.rawResponse.data;
    }
    setData(data) {
        this.rawResponse.data = data;
        return this;
    }
    getMsg() {
        return this.rawResponse.msg;
    }
    getNetworkErrorMsg() {
        var _a;
        return (_a = this.rawResponse.networkMsg) !== null && _a !== void 0 ? _a : null;
    }
    getStatus() {
        return this.rawResponse.status;
    }
    getTotalPages() {
        return this.rawResponse.totalPages;
    }
    getCurrentPage() {
        return this.rawResponse.currentPage;
    }
}
exports.default = Response;
