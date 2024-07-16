import './scss/styles.scss'
import { ensureElement, cloneTemplate } from './utils/utils'
import { CDN_URL, API_URL } from './utils/constants'
import { EventEmitter } from './components/base/events'
import { ProdAPI } from './components/ProdAPI'
import { ProductsData } from './components/ProductData'
import { Card } from './components/Card'
import { Order } from './components/Order'
import { IFormErrors, IOrder, IProduct, TOrderResult, TPayment, IServerOrder } from './types'
import { Page } from './components/Page'
import { Modal } from './components/common/Modal'
import { BasketView } from './components/common/Basket'
import { PaymentForm } from './components/common/PaymentForm'
import { ContactsForm } from './components/common/ContactForm'
import { Success } from './components/common/Success'

// Шаблоны Карточек
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')

// Шаблон Корзины
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
// Шаблоны Форм
const paymentFormTemplate = ensureElement<HTMLTemplateElement>('#order')
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
const paymentForm = new PaymentForm(cloneTemplate(paymentFormTemplate), events)
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
events.on('payment:open', ()=> {
    modal.render({content: paymentForm.render()})
})

events.on('payment:change', (data: IFormErrors)=> {
    orderData.setPayments(data.payment as TPayment, data.address)
})

events.on('formErrorsPayment:change', (formErrors: IFormErrors)=> {
    if (Object.keys(formErrors).length !== 0) {
        paymentForm.isButtonDisabled(true)
        if (formErrors.address) {
            paymentForm.setErrorMassage(formErrors.address)
        } else if (formErrors.payment) {
            paymentForm.setErrorMassage(formErrors.payment)
        }
    } else {
        paymentForm.setErrorMassage('')
        paymentForm.isButtonDisabled(false)
    }
})

events.on('payments:submit', (data: IOrder)=> {
    orderData.setPayments(data.payment, data.address)
    modal.render({content: contactsForm.render()})
})

events.on('contacts:change', (data: IFormErrors)=> {
    orderData.setContacts(data.phone, data.email)
})

events.on('formErrorsContact:change', (formErrors: IFormErrors)=> {
    if (Object.keys(formErrors).length > 0) {
        contactsForm.isButtonDisabled(true)
        if(formErrors.email) {
            contactsForm.setErrorMassage(formErrors.email)
        } else if (formErrors.phone) {
            contactsForm.setErrorMassage(formErrors.phone)
        }
    } else {
        contactsForm.setErrorMassage('')
        contactsForm.isButtonDisabled(false)
    }
})

events.on('contacts:submit', (data: IOrder)=> {
    orderData.setContacts(data.phone, data.email)
    const totalOrderPrice = appData.getTotalPrice()
    const basketIdArray = appData.getBasketItemsId()
    const usersDates = orderData.getUserDate()
    const order = {...usersDates, items: basketIdArray, total: totalOrderPrice}
    api.orderItems(order as IServerOrder)
        .then((response: TOrderResult)=> {
            modal.render({content: successView.render({total: response.total})})
        })
        .then(()=> {
            appData.clearBasket()
            orderData.clearOrder()
        })
    
})

events.on('success:done', ()=> {
    modal.close()
})

// События открытия Модалки, блокировка прокрутки страницы
events.on('modal:opened', ()=> { page.isPageLocked(true) })
events.on('modal:closed', ()=> { page.isPageLocked(false) })


// Получаем карточки с сервера
api.getCardList()
    .then((items) => {
        appData.setCatalogItems(items)
    })
    .catch(err => { console.error(err)})



