import { IEvents } from "../components/base/events";

export type CardСategory = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';
export type TPayment = 'Онлайн' | 'При получении';
export type TBasketItem = Pick<ICardDate, 'id' | 'title' | 'price'>;
export type TPaymentForm = Pick<IOrder, 'payment' | 'address'>
export type TContactForm = Pick<IOrder, 'email' | 'phone'>
export type TOrderResult = {
  total: number
  id: string
}

export interface ICardDate {
  id: string
  category: CardСategory
  title: string
  description?: string
  image: string
  price: number
}

export interface IOrderForm {
  email: string;
  phone: string;
  address: string;
  payment: string;
}

export interface IOrder extends IOrderForm {
  items: string[];
  total: number;
}

export interface IAppState {
	catalog: ICardDate[];
	basket: TBasketItem[];
	order: IOrder | null;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

