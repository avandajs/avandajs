"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Utils = {
    isArray(a) {
        return (!!a) && (a.constructor === Array);
    },
    isObject(a) {
        return (!!a) && (a.constructor === Object);
    },
    formBuild(fields) {
        let form = new FormData();
        for (let field in fields) {
            if (typeof fields[field] !== 'undefined') {
                let value = fields[field];
                if (value === null)
                    continue;
                value = value === false ? 0 : (value === true) ? 1 : value;
                if (Utils.isArray(value) || Utils.isObject(value)) {
                    value = JSON.stringify(value);
                }
                form.append(field, value);
            }
        }
        return form;
    }
};
exports.default = Utils;
