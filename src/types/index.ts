import { IEvents } from "../components/base/events"

export type CardСategory = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое'
export type TPayment = 'Онлайн' | 'При получении' | ''
export type TPaymentForm = Pick<IOrder, 'payment' | 'address'>
export type TContactForm = Pick<IOrder, 'email' | 'phone'>
export type TBasketData = Pick<IProduct , 'id' | 'title' | 'price'>

// Типы для данных получаемых с севера.
export type TServerProduct = Partial<IProduct>
export type TOrderResult = {
  total: number
  id: string
}

// Интерфейс хранения данных приложения.
export interface IProduct {
  id: string
  category: CardСategory
  title: string
  description?: string
  image: string
  price: number | null
  inBasket: boolean
}

export interface IOrder {
  email: string;
  phone: string;
  address: string;
  payment: TPayment;
}

export interface IServerOrder extends IOrder {
  items: string[]
  total: number
}

export type IFormErrors = Partial<Record<keyof IOrder, string>>;

