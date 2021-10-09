import Datum from "./Datum";
import Filters from "./Filters";

type Service = {
    n?: string,//service name
    f?: string,//service function
    c: Array<string|Service>,// service columns
    al?: string,//service alias
    p: number,//service page
    pr: Datum,//Service params
    ft: Filters,
    q?: {//search query
        c: string,//column
        k: string//keyword
    }
}

export default Service