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
var index_1 = __importDefault(require("./index"));
var Utils = {
    isArray: function (a) {
        return (!!a) && (a.constructor === Array);
    },
    isObject: function (a) {
        return (!!a) && (a.constructor === Object);
    },
    formBuild: function (fields) {
        return __awaiter(this, void 0, void 0, function () {
            var form, isFile, _a, _b, _i, field, value, index;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        form = new FormData();
                        isFile = false;
                        _a = [];
                        for (_b in fields)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        field = _a[_i];
                        if (!(typeof fields[field] !== 'undefined')) return [3 /*break*/, 7];
                        value = fields[field];
                        if (value === null)
                            return [3 /*break*/, 7];
                        return [4 /*yield*/, value];
                    case 2:
                        value = _c.sent();
                        if (!(value instanceof Event)) return [3 /*break*/, 4];
                        isFile = true;
                        return [4 /*yield*/, index_1.default.File(value)];
                    case 3:
                        value = _c.sent();
                        _c.label = 4;
                    case 4:
                        value = value === false ? 0 : (value === true) ? 1 : value;
                        if (!(value instanceof Promise)) return [3 /*break*/, 6];
                        return [4 /*yield*/, value];
                    case 5:
                        value = _c.sent();
                        _c.label = 6;
                    case 6:
                        if ((Utils.isArray(value) || Utils.isObject(value)) && !isFile) {
                            value = JSON.stringify(value);
                        }
                        if (isFile && Array.isArray(value)) {
                            for (index in value) {
                                form.append(field + ("[" + index + "]"), value[index]);
                            }
                        }
                        else {
                            form.append(field, value);
                        }
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, form];
                }
            });
        });
    },
    processFile: function (event, allowed_file_types) {
        if (allowed_file_types === void 0) { allowed_file_types = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var files, selected_files, _a, _b, _i, index, file, selected_file_mime, preview;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    files = [];
                                    selected_files = Array.from(event.target.files);
                                    _a = [];
                                    for (_b in selected_files)
                                        _a.push(_b);
                                    _i = 0;
                                    _c.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    index = _a[_i];
                                    file = selected_files[index];
                                    selected_file_mime = file.type;
                                    if (allowed_file_types && allowed_file_types.length && !allowed_file_types.includes(selected_file_mime)) {
                                        reject('You can only upload an image file!');
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, Utils.fileToBas64(file)];
                                case 2:
                                    preview = _c.sent();
                                    files.push({
                                        preview: preview,
                                        file: file
                                    });
                                    _c.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    resolve(files.length === 1 ? files[0] : files);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    },
    extractPostable: function (files) {
        if (Array.isArray(files)) {
            return files.map(function (file) { return file.file; });
        }
        return files.file;
    },
    fileToBas64: function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var reader;
            return __generator(this, function (_a) {
                reader = new FileReader();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function () {
                            reject(reader.error);
                        };
                        reader.onabort = function () {
                            reject(null);
                        };
                    })];
            });
        });
    }
};
exports.default = Utils;
