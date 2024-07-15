import { Component } from "../base/Component"
import { IOrder, TOrderResult } from "../../types"
import { IEvents } from "../base/events"
import { ensureElement } from "../../utils/utils"

interface ISuccess {
    total: number
}

export class Success extends Component<ISuccess> {

    protected _totalCost: HTMLElement
    protected _acceptButton: HTMLButtonElement

    constructor( container: HTMLElement, events: IEvents ) {
        super(container)
        this._totalCost = ensureElement<HTMLElement>('.order-success__description', container)
        this._acceptButton = ensureElement<HTMLButtonElement>('.order-success__close', container)

        this._acceptButton.addEventListener('click', ()=> {
            events.emit('success:done')
        })
    }

    set total(total: number) {
        this.setText(this._totalCost, `Списано ${total} синапсов`)
    }

}