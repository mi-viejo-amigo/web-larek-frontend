import { Api } from './base/api';
import {TOrderResult, IProduct, IOrder, TServerProduct, IServerOrder} from "../types/index";



export type ApiListResponse<T> = {
    total: number,
    items: T[]
};

export interface IProdAPI {
    getCardList: () => Promise<TServerProduct[]>;
    orderItems: (userDates: IOrder, itemsId: string[], totalPrice: number) => Promise<TOrderResult>; 
}

export class ProdAPI extends Api implements IProdAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<TServerProduct[]> {
        return this.get<ApiListResponse<TServerProduct>>('/product').then((data: ApiListResponse<TServerProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IServerOrder): Promise<TOrderResult> {
        return this.post<TOrderResult>('/order', order).then(
            (data: TOrderResult) => data
        );
    }

}