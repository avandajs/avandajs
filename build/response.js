"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var Response = /** @class */ (function () {
    function Response(rawResponse) {
        if (rawResponse === void 0) { rawResponse = {
            data: null,
            msg: "",
            status: 0,
            totalPages: 0,
            currentPage: 1
        }; }
        this.rawResponse = rawResponse;
    }
    Response.prototype.getData = function () {
        return this.rawResponse.data;
    };
    Response.prototype.setData = function (data) {
        this.rawResponse.data = data;
        return this;
    };
    Response.prototype.getMsg = function () {
        return this.rawResponse.msg;
    };
    Response.prototype.getNetworkErrorMsg = function () {
        var _a;
        return (_a = this.rawResponse.networkMsg) !== null && _a !== void 0 ? _a : null;
    };
    Response.prototype.getStatus = function () {
        return this.rawResponse.status;
    };
    Response.prototype.getTotalPages = function () {
        return this.rawResponse.totalPages;
    };
    Response.prototype.getCurrentPage = function () {
        return this.rawResponse.currentPage;
    };
    return Response;
}());
exports.Response = Response;
