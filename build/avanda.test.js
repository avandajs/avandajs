"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const _1 = __importDefault(require("."));
(0, vitest_1.test)('should work as expected', () => {
    let avanda = new _1.default();
    let stream = avanda.service("User/name").watch();
    stream.listen((data) => {
    });
    console.log(avanda);
    (0, vitest_1.expect)(Math.sqrt(4)).toBe(3);
});
