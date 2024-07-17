import { Component } from "./base/Component"
import { IOrder, TOrderResult, IFormErrors } from "../types"
import { IEvents } from "./base/events"
import { ensureAllElements, ensureElement } from "../utils/utils"
import { Form } from "./common/Form"

interface IDeliveryForm {
    address: string
    payment: string
}

export class DeliveryForm extends Form<IDeliveryForm> {

    protected _paymentTypeButtons: HTMLButtonElement[]

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this._paymentTypeButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container)

        // LISTENERS
        this._paymentTypeButtons.forEach((btn) => {
            btn.addEventListener('click', ()=> {
                this._paymentTypeButtons.forEach((button) => {
                    this.toggleClass(button, 'button_alt-active', false);
                })
                this.toggleClass(btn, 'button_alt-active', true)
                events.emit(`${this.container.name}.payment:change`, {
                    field: 'payment',
                    value: btn.textContent
                })
            })
        })

    }

}