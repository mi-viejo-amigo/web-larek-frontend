import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/events"
import { Component } from "../base/Component"
import { createElement } from  "../../utils/utils"

interface IBasket {
    items: HTMLElement[]
    total: number
}

export class BasketView extends Component<IBasket> {
    protected _itemsList: HTMLUListElement
    protected _totalPrice: HTMLElement
    protected _button: HTMLButtonElement

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this._itemsList = ensureElement<HTMLUListElement>('.basket__list', this.container)
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container)
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', this.container)

        
        this._button.addEventListener('click', ()=> {
            this.events.emit('order:open')
        })
        this.items = []

    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._itemsList.replaceChildren(...items)
        } else {
            this._itemsList.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }))
        }
        
    }

    set total(total: number) {
        this.setText(this._totalPrice, `${total} синапсов`)
    }

}
