import { Model } from './base/Model';
import {IOrder, TContactForm, TPaymentForm, TPayment, TOrderResult, FormErrors} from "../types";

interface IOrderActions {
    getUserDate(): IOrder
    setPayments(payment: TPayment, address: string): void
    validateOrder():boolean
    setContacts(phone: string, email: string): void
    validateContact(): boolean
    clearOrder(): void
}

export class Order extends Model<IOrder> implements IOrderActions {
    payment: string = ''
    address: string = ''
    phone: string = ''
    email: string = ''
    formErrors: FormErrors = {}

    getUserDate() {
        return { 
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
         }
    }

    setPayments(payment: TPayment, address: string) {
        // добавить валидацию
        this.payment = payment
        this.address = address
    }

    setContacts(phone: string, email: string) {
        // добавить валидацию
        this.phone = phone
        this.email = email
    }

    clearOrder() {
        this.address = ''
        this.email = ''
        this.payment = ''
        this.phone = ''
    }

    // методы валидации

    validateContact() {
        const errors: typeof this.formErrors = {}
        if (!this.phone) {
            errors.phone = 'Необходимо указать номер телефона.'
        }
        if (!this.email) {
            errors.email = 'Необходимо указать адрес электронной почты.'
        }
        this.formErrors = errors
        this.events.emit('formErrorsContact:change', this.formErrors)
        return Object.keys(errors).length === 0;
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this.payment) {
            errors.payment= 'Необходимо выбрать способ оплаты';
       }
       if (!this.address) {
        errors.address = 'Необходимо указать адрес';
       }
     
        this.formErrors = errors;
        this.events.emit('formErrorsOrder:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
