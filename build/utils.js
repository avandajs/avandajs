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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
let Utils = {
    isArray(a) {
        return (!!a) && (a.constructor === Array);
    },
    isObject(a) {
        return (!!a) && (a.constructor === Object);
    },
    formBuild(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let form = new FormData();
            let isNodeEnv = typeof window === 'undefined';
            let isFile = false;
            for (let field in fields) {
                if (typeof fields[field] !== 'undefined') {
                    let value = fields[field];
                    if (value === null)
                        continue;
                    value = yield value;
                    if (typeof Event != 'undefined' && value instanceof Event) {
                        isFile = true;
                        value = yield index_1.default.File(value);
                    }
                    value = value === false ? 0 : (value === true) ? 1 : value;
                    if (value instanceof Promise) {
                        value = yield value;
                    }
                    if ((Utils.isArray(value) || Utils.isObject(value)) && !isFile) {
                        value = JSON.stringify(value);
                    }
                    fields[field] = value;
                    if (!isNodeEnv) {
                        if (isFile && Array.isArray(value)) {
                            for (let index in value) {
                                form === null || form === void 0 ? void 0 : form.append(field + `[${index}]`, value[index]);
                            }
                        }
                        else {
                            form === null || form === void 0 ? void 0 : form.append(field, value);
                        }
                    }
                }
            }
            return isNodeEnv ? fields : form;
        });
    },
    processFile(event, allowed_file_types = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let files = [];
                // @ts-ignore
                let selected_files = Array.from((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.files);
                for (let index in selected_files) {
                    let file = selected_files[index];
                    let selected_file_mime = file.type;
                    if (allowed_file_types && allowed_file_types.length && !allowed_file_types.includes(selected_file_mime)) {
                        reject('You can only upload an image file!');
                        return;
                    }
                    let preview = yield Utils.fileToBas64(file);
                    files.push({
                        preview,
                        file
                    });
                }
                // @ts-ignore
                resolve(files.length === 1 ? files[0] : files);
            }));
        });
    },
    extractPostable(files) {
        if (Array.isArray(files)) {
            return files.map(file => file.file);
        }
        return files.file;
    },
    fileToBas64(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.onabort = () => {
                    reject(null);
                };
            });
        });
    }
};
exports.default = Utils;
