import './scss/styles.scss'
import { ensureElement, cloneTemplate } from './utils/utils'
import { CDN_URL, API_URL } from './utils/constants'
import { EventEmitter } from './components/base/events'
import { ProdAPI } from './components/ProdAPI'
import { ProductsData } from './components/ProductData'
import { Card } from './components/Card'
import { Order } from './components/Order'
import { IOrder, IProduct } from './types'
import { Page } from './components/Page'
import { Modal } from './components/common/Modal'
import { BasketView } from './components/common/Basket'

// Шаблоны Карточек
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')

// Шаблон Корзины
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')

// Элемент модального Окна
const modalContainer = ensureElement<HTMLElement>('#modal-container')


const events = new EventEmitter()
const api = new ProdAPI(CDN_URL, API_URL)
const appData = new ProductsData({}, events)
const page = new Page(document.body, events)
const modal = new Modal(modalContainer, events)
const basket = new BasketView(cloneTemplate(basketTemplate), events)

events.on('card:select', (item: IProduct)=> {
    appData.setPreview(item)
    
})

events.on('preview:changed', (item: IProduct)=> {
    const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), { onClick: () => events.emit('card:add', item) })
    cardPreview.isButtonDisabled(item.id, appData.getBasketItemsId(), item.price)
    modal.render({content: cardPreview.render(item)})
})

events.on('basket:changed', () => {
    const basketItems = appData.items.filter((item)=> item.inBasket)
	const basketHTMLElements = basketItems.map((item, index)=> {
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
    basket.items = basketHTMLElements
    basket.total = appData.getTotalPrice()
    page.basketCounter = basketItems.length
});

events.on('card:add', (item: IProduct)=> {
    appData.addItemToBasket(item)
    modal.close()
})

events.on('basket:open', ()=> {
    modal.render({content: basket.render()})
})

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

events.on('modal:opened', ()=> { page.isPageLocked(true) })

events.on('modal:closed', ()=> { page.isPageLocked(false) })


// Получаем карточки с сервера
api.getCardList()
    .then((items) => {
        appData.setCatalogItems(items)
    })
    .catch(err => { console.error(err)})

// api.getCardList()
//     .then((items) => {
        
//         appData.setCatalogItems(items)
//         appData.addItemToBasket(items[1] as IProduct)
//         appData.addItemToBasket(items[0] as IProduct)
//         let cardArray: HTMLElement[] = []
        
//         // Создаем карточку и добавляем ее в контейнер
//         appData.getCatalogItems().forEach((item)=>{
            
//             const card1 = new Card(cloneTemplate(cardCatalogTemplate), {
//                 onClick: () => events.emit('card:select', item),
//             });

//             cardArray.push(card1.render({
//                 title: item.title,
//                 image: item.image,
//                 category: item.category,
//                 price: item.price
//             },
//         ))
//         })
//         return cardArray
        
//     })
//     .then((cards) => {
//         page.render({catalog: cards})
//     })
    


// const userOrder = new Order({}, events)
// userOrder.setContacts('89759108785', 'nkt.frlv7@yandex.ru')
// userOrder.setPayments('Онлайн', 'улица Пушкина, дом колотушкина')


// setTimeout(()=> {
    
    
//     api.orderItems(userOrder.getUserDate(), appData.getBasketItemsId(), appData.getTotalPrice())
//     .then((res)=> {
//         console.log(res)
//     })
//     .catch((error) => {
//         console.error("Order failed: ", error);
//     });
// }, 1000)









// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })

// const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// const card = new Card(cloneTemplate(cardCatalogTemplate))




