export type CardСategory = 'хард-скил' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'другое';


export interface ICardItem {
  id: string
  category: CardСategory
  title: string
  description?: string
  image: string
  price: number
}

// export interface IInitialCatalog {
//   total: number
//   cards: ICardItem[]
// }

export type IBasketItem = Pick<ICardItem, 'id' | 'title' | 'price'>;

export type PaymentType = 'Онлайн' | 'При получении';



export interface IOrder {
  payment: PaymentType
  address: string
  email: string
  phone: string
  total: number
  items: string[]
}

export type IPaymentForm = Pick<IOrder, 'payment' | 'address'>

export type IContactForm = Pick<IOrder, 'email' | 'phone'>;

export interface IAppState {
  total: number
  catalog: ICardItem[];
  basket: string[] | null;
  order: IOrder | null;
  orderHistory: IOrderResult[] | IOrderResult | null;
}

export interface IOrderResult {
  total: number
  id: string
}
