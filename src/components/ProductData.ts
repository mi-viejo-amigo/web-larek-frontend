import { Model } from './base/Model';
import {IProduct, TServerProduct } from "../types";


// Интерфейс хранения данных.
interface IProductsData {
	items: IProduct[]
    setCatalogItems(items: TServerProduct[]): void
    setPreview(item: IProduct): void
    checkProductInBasket(id: string): boolean
    getTotalPrice(): number
    getBasketItemsId(): string[]
    addItemToBasket(item:IProduct):IProduct
    removeFromBasket(item:IProduct): void
    clearBasket(): void
  
}

export class ProductsData extends Model<IProductsData> {

    protected _items: IProduct[] = []

    get items() {
        return this._items
    }

    setCatalogItems(items: TServerProduct[]) {
        const updatedItems = items.map(item => Object.assign(item, { inBasket: false } as IProduct))
        this._items = updatedItems
        this.emitChanges('items:changed', { items: this._items });
    }

    setPreview(item: IProduct) {
        this.emitChanges('preview:changed', item);
    }

    checkProductInBasket(id: string) {
		return this._items.some((item)=> item.id === id && item.inBasket)
	}

    getTotalPrice() {
        return this._items
            .filter((prod)=> prod.inBasket)
            .reduce((total, prod)=> total + prod.price, 0)
    }

    getBasketItemsId() {
        return this._items
            .filter((prod)=> prod.inBasket === true)
            .map((item)=> item.id)  
    }

    addItemToBasket(item:IProduct) {
        if (!this.checkProductInBasket(item.id)) {
            this._items = this._items.map((prod) => {
                return prod.id === item.id ? {...prod, inBasket: true} : prod
            })
            this.emitChanges('basket:changed')
        }
    }

    removeFromBasket(item:IProduct) {
        this._items = this._items.map((prod) => {
            return prod.id === item.id ? {...prod, inBasket: false} : prod
        })
        this.emitChanges('basket:changed')
    }

    clearBasket() {
        this._items = this._items.map((prod)=> {
            prod.inBasket = false
            return prod
        })
        this.emitChanges('basket:changed')
    }

}

