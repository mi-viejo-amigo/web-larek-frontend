import './scss/styles.scss'
import { ensureElement, cloneTemplate } from './utils/utils'
import { CDN_URL, API_URL } from './utils/constants'
import { EventEmitter } from './components/base/events'
import { ProdAPI } from './components/ProdAPI'
import { ProductsData } from './components/ProductData'
import { Card } from './components/Card'
import { Order } from './components/Order'
import { IFormErrors, IOrder, IProduct, TOrderResult, IServerOrder } from './types'
import { Page } from './components/Page'
import { Modal } from './components/common/Modal'
import { BasketView } from './components/Basket'
import { DeliveryForm } from './components/DeliveryForm'
import { ContactsForm } from './components/ContactForm'
import { Success } from './components/Success' 

// Шаблоны Карточек
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')

// Шаблон Корзины
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
// Шаблоны Форм
const deliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactFormTemplate = ensureElement<HTMLTemplateElement>('#contacts')
// Шаблон подтверждения Успешной покупки
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Элемент модального Окна
const modalContainer = ensureElement<HTMLElement>('#modal-container')


const events = new EventEmitter()
const api = new ProdAPI(CDN_URL, API_URL)
const appData = new ProductsData({}, events)
const orderData = new Order({}, events)
const page = new Page(document.body, events)
const modal = new Modal(modalContainer, events)
const basket = new BasketView(cloneTemplate(basketTemplate), events)
const deliveryForm = new DeliveryForm(cloneTemplate(deliveryFormTemplate), events)
const contactsForm = new ContactsForm(cloneTemplate(contactFormTemplate), events)
const successView = new Success(cloneTemplate(successTemplate), events)


// Начальное отображение карточек
events.on('items:changed', (data: { items: IProduct[] })=> {
    const cardsArrayHTML = data.items.map((item) => {
        const card = new Card(
            cloneTemplate(cardCatalogTemplate), 
            { onClick: () => events.emit('card:select', item) }
        )
        return card.render(item)
    })
    page.render({catalog: cardsArrayHTML})
})

// Карточка и Превью
events.on('card:select', (item: IProduct)=> {
    appData.setPreview(item)
})

events.on('preview:changed', (item: IProduct)=> {
    const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), { onClick: () => events.emit('card:add', item) })
    cardPreview.isButtonDisabled(item.id, appData.getBasketItemsId(), item.price)
    modal.render({content: cardPreview.render(item)})
})

// События Корзины
events.on('basket:changed', () => {
    const basketItems = appData.items.filter((item)=> item.inBasket)
	const cardsForBasketHTMLElements = basketItems.map((item, index)=> {
        const card = new Card(cloneTemplate(cardBasketTemplate), 
            { onClick: () => {
                appData.removeFromBasket(item)
                page.basketCounter = appData.getBasketItemsId().length
                basket.total = appData.getTotalPrice()
            } }
        )
        Object.assign(item, {index: index + 1})
        return card.render(item)
    })
    basket.items = cardsForBasketHTMLElements
    basket.total = appData.getTotalPrice()
    page.basketCounter = basketItems.length
    basket.isButtonDisabled(basketItems.length === 0)
});

events.on('card:add', (item: IProduct)=> {
    appData.addItemToBasket(item)
    modal.close()
})

events.on('basket:open', ()=> {
    basket.isButtonDisabled(appData.getBasketItemsId().length === 0)
    modal.render({content: basket.render()})
})

// События заказа
events.on('order:open', ()=> {
    modal.render({content: deliveryForm.render({
            valid: false,
            errors: [],
            address: '',
            payment: ''
        }
    )})
})

events.on(/^contacts\..*:change/, (data: { field: keyof IOrder; value: string }) => {
    const { field, value } = data
    orderData.setContacts(field, value)
})

events.on('formErrorsOrder:change', (formErrors: IFormErrors)=> {
    const isEmpty = Object.keys(formErrors).length === 0
    const validation = {errors: [formErrors.address || '', formErrors.payment || ''], valid: isEmpty}
    deliveryForm.render(validation)
})

events.on('order:submit', ()=> {
    // console.log(orderData.getUserDate());
    modal.render({content: contactsForm.render({
        valid: false,
        errors: [],
        phone: '',
        email: ''
    })})
})

events.on(/^order\..*:change/, (data: { field: keyof IOrder; value: string }) => {
    const { field, value } = data
    orderData.setPayments(field, value)
})

events.on('formErrorsContact:change', (formErrors: IFormErrors)=> {
    const isEmpty = Object.keys(formErrors).length === 0
    const validation = {errors: [formErrors.email || '', formErrors.phone || ''], valid: isEmpty}
    contactsForm.render(validation)
})

events.on('contacts:submit', ()=> {
    const totalOrderPrice = appData.getTotalPrice()
    const basketIdArray = appData.getBasketItemsId()
    const usersDates = orderData.getUserDate()
    // console.log(orderData.getUserDate());
    const order = {...usersDates, items: basketIdArray, total: totalOrderPrice}
    api.orderItems(order as IServerOrder)
        .then((response: TOrderResult)=> {
            modal.render({content: successView.render({total: response.total})})
            appData.clearBasket()
            orderData.clearOrder()
        })
        .catch(err => { console.error(err)})
    
})

events.on('success:done', ()=> {
    modal.close()
})

// События открытия Модалки, блокировка прокрутки страницы
events.on('modal:open', ()=> { page.render({locked: true}) })
events.on('modal:close', ()=> { page.render({locked: false}) })


// Получаем карточки с сервера
api.getCardList()
    .then((items) => {
        appData.setCatalogItems(items)
    })
    .catch(err => { console.error(err)})



