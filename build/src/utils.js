"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Utils = {
    isArray(a) {
        return (!!a) && (a.constructor === Array);
    },
    isObject(a) {
        return (!!a) && (a.constructor === Object);
    },
    async EventToFile(event) {
        return Utils.extractPostable(await Utils.processFile(event));
    },
    async formBuild(fields) {
        return new Promise(async (resolve, reject) => {
            let form = new FormData();
            let isFile = false;
            fields = await fields;
            for (let field in fields) {
                if (typeof fields[field] !== 'undefined') {
                    let value = fields[field];
                    if (value === null)
                        continue;
                    value = await value;
                    if (value instanceof Event) {
                        isFile = true;
                        value = await this.EventToFile(value);
                    }
                    value = value === false ? 0 : (value === true) ? 1 : value;
                    if (value instanceof Promise) {
                        value = await value;
                    }
                    if ((Utils.isArray(value) || Utils.isObject(value)) && !isFile) {
                        value = JSON.stringify(value);
                    }
                    if (isFile && Array.isArray(value)) {
                        for (let index in value) {
                            form.append(field, value[index]);
                        }
                    }
                    else {
                        form.append(field, value);
                    }
                }
            }
            resolve(form);
        });
    },
    async processFile(event, allowed_file_types = []) {
        return new Promise(async (resolve, reject) => {
            let files = [];
            let selected_files = Array.from(event.target.files);
            for (let index in selected_files) {
                let file = selected_files[index];
                let selected_file_mime = file.type;
                if (allowed_file_types && allowed_file_types.length && !allowed_file_types.includes(selected_file_mime)) {
                    reject('You can only upload an image file!');
                    return;
                }
                let preview = await Utils.fileToBas64(file);
                files.push({
                    preview,
                    file
                });
            }
            resolve(files.length === 1 ? files[0] : files);
        });
    },
    extractPostable(files) {
        if (Array.isArray(files)) {
            return files.map(file => file.file);
        }
        return files.file;
    },
    async fileToBas64(file) {
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
    }
};
exports.default = Utils;
