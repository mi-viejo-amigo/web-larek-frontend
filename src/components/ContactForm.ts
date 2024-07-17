import { Component } from "./base/Component"
import { IOrder, TOrderResult, IFormErrors } from "../types"
import { ensureAllElements, ensureElement } from "../utils/utils"
import { IEvents } from "./base/events"
import { Form } from "./common/Form"

interface IContactsForm {
    phone: string
    email: string
}

export class ContactsForm extends Form<IContactsForm> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    }
    
}