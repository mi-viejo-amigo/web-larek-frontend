import { Model } from './base/Model'
import {IOrder, TContactForm, TPaymentForm, TOrderResult, IFormErrors} from "../types"
// Импорт объекта с методами для валидации почты и телефона
import validator from 'validator' 

interface IOrderActions {
    getUserDate(): IOrder
    setPayments(field: keyof IOrder, value: string): void
    validateOrder():boolean
    setContacts(field: keyof IOrder, value: string): void
    validateContact(): boolean
    clearOrder(): void
}

export class Order extends Model<IOrder> implements IOrderActions {
    protected payment: string = ''
    protected address: string = ''
    protected phone: string = ''
    protected email: string = ''
    protected formErrors: IFormErrors = {}

    getUserDate() {
        return { 
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
         }
    }

    setPayments(field: keyof IOrder, value: string) {
        this[field] = value
        this.validateOrder()
    }

    setContacts(field: keyof IOrder, value: string) {
        this[field] = value
        this.validateContact()
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
            errors.phone = 'Необходимо указать номер телефона.';
        } else if (!validator.isMobilePhone(this.phone, 'any', { strictMode: true })) {
            errors.phone = 'Неверный формат номера телефона.';
        }

        if (!this.email) {
            errors.email = 'Необходимо указать адрес электронной почты.';
        } else if (!validator.isEmail(this.email)) {
            errors.email = 'Неверный формат электронной почты.';
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
