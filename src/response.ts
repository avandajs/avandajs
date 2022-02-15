import ResponseStruct from "./types/ResponseStruct";


export class Response {

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
