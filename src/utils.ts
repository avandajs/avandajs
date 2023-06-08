import Datum from "./types/Datum";
import Graph from "./index";
import FileInput from "./types/FIleInput";

let Utils = {
    isArray(a: Datum) {
        return (!!a) && (a.constructor === Array);
    },
    isObject(a: Datum) {
        return (!!a) && (a.constructor === Object);
    },
    async formBuild(fields: Datum) {
        let form: FormData | null = new FormData();
        let isNodeEnv = typeof window === 'undefined'
        let isFile = false
        for (let field in fields) {
            if (typeof fields[field] !== 'undefined') {
                let value = fields[field];
                if (value === null)
                    continue;

                value = await value;

                if (typeof Event != 'undefined' && value instanceof Event) {
                    isFile = true
                    value = await Graph.File(value)
                }
                value = value === false ? 0 : (value === true) ? 1 : value;

                if (value instanceof Promise) {
                    value = await value
                }

                if ((Utils.isArray(value) || Utils.isObject(value)) && !isFile) {
                    value = JSON.stringify(value);
                }

                fields[field] = value;
                
                if(!isNodeEnv){
                    if (isFile && Array.isArray(value)) {
                        for (let index in value) {
                            form?.append(field + `[${index}]`, value[index]);
                        }
                    } else {
                        form?.append(field, value);
                    }
                }
                
            }
        }
        return isNodeEnv ? fields : form;
    },
    async processFile(event: Event, allowed_file_types = []): Promise<FileInput | FileInput[]> {
        return new Promise(async (resolve, reject) => {
            let files = [];
            // @ts-ignore
            let selected_files = Array.from(event?.target?.files) as { [i: number]: { type: string } };
            for (let index in selected_files) {
                let file = selected_files[index]
                let selected_file_mime = file.type;
                if (allowed_file_types && allowed_file_types.length && !allowed_file_types.includes(selected_file_mime as never)) {
                    reject('You can only upload an image file!');
                    return;
                }
                let preview = await Utils.fileToBas64(file as Blob)

                files.push({
                    preview,
                    file
                })
            }
            // @ts-ignore
            resolve(files.length === 1 ? files[0] : files);
        })
    },
    extractPostable(files: FileInput | FileInput[]) {
        if (Array.isArray(files)) {
            return files.map(file => file.file);
        }
        return files.file
    },
    async fileToBas64(file: Blob) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = () => {
                reject(reader.error)
            }
            reader.onabort = () => {
                reject(null)
            }
        })

    }

}


export default Utils