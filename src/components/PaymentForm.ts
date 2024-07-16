import { Component } from "./base/Component"
import { IOrder, TOrderResult, IFormErrors, TPayment } from "../types"
import { IEvents } from "./base/events"
import { ensureAllElements, ensureElement } from "../utils/utils"


interface IPaymentForm {
    errors: string[]
    valid: boolean
}

export class PaymentForm extends Component<IPaymentForm> {

    protected _formContainer: HTMLFormElement
    protected _paymentTypeButtons: HTMLButtonElement[]
    protected _addressTextArea: HTMLInputElement
    protected _errorElement: HTMLSpanElement
    protected _submitBtn: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container)
        this._formContainer = container
        this._paymentTypeButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container)
        this._addressTextArea = ensureElement<HTMLInputElement>('.form__input', container)
        this._errorElement = ensureElement<HTMLSpanElement>('.form__errors', container)
        this._submitBtn = ensureElement<HTMLButtonElement>('.order__button', container)

        this._addressTextArea.addEventListener('input', ()=> {
            const selectedBtn = this._paymentTypeButtons.find((btn)=> btn.classList.contains('button_alt-active'))
            // Добавляем проверку на undefined
            const paymentValue = selectedBtn ? selectedBtn.textContent : '';
            events.emit('payment:change', {address: this._addressTextArea.value, payment: paymentValue} as IOrder)
        })
        
        // LISTENERS
        this._paymentTypeButtons.forEach((btn) => {
            btn.addEventListener('click', ()=> {
                this._paymentTypeButtons.forEach((button) => {
                    this.toggleClass(button, 'button_alt-active', false);
                })
                this.toggleClass(btn, 'button_alt-active', true)
                events.emit('payment:change', {
                    payment: btn.textContent,
                    address: this._addressTextArea.value
                })
            })
        })

        this._submitBtn.addEventListener('click', (evt)=> {
            evt.preventDefault()
            const selectedButton = this._paymentTypeButtons.find((btn)=> btn.classList.contains('button_alt-active'))
            events.emit('payments:submit', {
                payment: selectedButton.textContent,
                address: this._addressTextArea.value
            })
        })
    }

    set errors(massages: string[]) {
        this.setText(this._errorElement, massages.join('\n'))
    }

    set valid(state: boolean) {
        this.setDisabled(this._submitBtn, !state)
    }

}