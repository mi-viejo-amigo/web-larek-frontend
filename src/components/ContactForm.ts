import { Component } from "./base/Component"
import { IOrder, TOrderResult, IFormErrors, TPayment } from "../types"
import { ensureAllElements, ensureElement } from "../utils/utils"
import { IEvents } from "./base/events"

interface IContactsForm {
    errors: string[]
    valid: boolean
}

export class ContactsForm extends Component<IContactsForm> {
    protected _formContainer: HTMLFormElement
    protected _emailField: HTMLInputElement
    protected _phoneField: HTMLInputElement
    protected _errorElement: HTMLSpanElement
    protected _submitButton: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container)
        this._errorElement = ensureElement<HTMLSpanElement>('.form__errors', container)
        this._submitButton = ensureElement<HTMLButtonElement>('.button', container)
        this._emailField = ensureElement<HTMLInputElement>('input[name="email"]', container)
        this._phoneField = ensureElement<HTMLInputElement>('input[name="phone"]', container)

        const formInputs = [this._emailField, this._phoneField]
        formInputs.forEach((i)=> {
            i.addEventListener('input', ()=> {
                events.emit('contacts:change', {
                    email: this._emailField.value,
                    phone: this._phoneField.value
                } as IOrder) 
            })
        })

        this._submitButton.addEventListener('click', (evt)=> {
            evt.preventDefault()
            events.emit('contacts:submit', {
                email: this._emailField.value,
                phone: this._phoneField.value
            } as IOrder)
        })
    }

    set errors(massages: string[]) {
        this.setText(this._errorElement, massages.join('\n'))
    }

    set valid(state: boolean) {
        this.setDisabled(this._submitButton, !state)
    }

}