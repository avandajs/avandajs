type ResponseStruct = {
    msg: string;
    data: any;
    status: number,
    networkMsg?: string,
    totalPages: number,
    currentPage: number
}

export default ResponseStruct