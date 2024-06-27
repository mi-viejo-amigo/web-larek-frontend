import { Api, ApiListResponse } from './base/api';
import {TOrderResult, ICardDate, IOrder} from "../types/index";



export interface IProdAPI {
    getCardList: () => Promise<ICardDate[]>;
    orderItems: (order: IOrder) => Promise<TOrderResult>;
}

export class ProdAPI extends Api implements IProdAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICardDate[]> {
        return this.get('/product').then((data: ApiListResponse<ICardDate>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<TOrderResult> {
        return this.post('/order', order).then(
            (data: TOrderResult) => data
        );
    }

}