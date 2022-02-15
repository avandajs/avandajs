import ResponseStruct from "./types/ResponseStruct";


<<<<<<< HEAD
export default class Response {
=======
export class Response {
>>>>>>> 56d1a3148d4e1359ea6dcb387e9bdd9db5827caf

    constructor(
        private rawResponse: ResponseStruct = {
            data: null,
            msg: "",
            status: 0,
            totalPages: 0,
            currentPage: 1
        }
    ) {}

    public getData<DataType>(): DataType | any {
        return this.rawResponse.data;
    }

    public setData<DataType>(data: DataType | any) {
        this.rawResponse.data = data;
        return this;
    }

    public getMsg(): string {
        return this.rawResponse.msg;
    }

    public getNetworkErrorMsg(): string | null {
        return this.rawResponse.networkMsg ?? null;
    }

    public getStatus(): number {
        return this.rawResponse.status;
    }

    public getTotalPages(): number {
        return this.rawResponse.totalPages;
    }

    public getCurrentPage(): number {
        return this.rawResponse.currentPage
    }
}
