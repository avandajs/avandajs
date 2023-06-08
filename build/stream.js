"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("./response");
class AvandaStream {
    constructor(url) {
        this.url = url;
        this.retryDelayTime = 3000;
    }
    listen(onData) {
        this.socket = new WebSocket(this.url);
        this.socket.addEventListener('message', (event) => {
            onData(new response_1.Response(JSON.parse(event.data)));
        });
        this.socket.addEventListener('open', (event) => {
            if (typeof this.onOpenedFunc == 'function') {
                this.onOpenedFunc();
            }
        });
        this.socket.addEventListener('close', (event) => __awaiter(this, void 0, void 0, function* () {
            if (this.manualClosed)
                return;
            yield new Promise((resolve) => setTimeout(resolve, this.retryDelayTime));
            this.listen(onData);
        }));
    }
    close(code) {
        var _a;
        this.manualClosed = true;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close(code);
        if (typeof this.onClosedFunc == 'function') {
            this.onClosedFunc();
        }
        return this;
    }
    onError(onError) {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    onOpened(onOpened) {
        if (onOpened != null) {
            this.onOpenedFunc = onOpened;
        }
        return this;
    }
    onClosed(onClosed) {
        if (onClosed != null) {
            this.onClosedFunc = onClosed;
        }
        return this;
    }
}
exports.default = AvandaStream;
