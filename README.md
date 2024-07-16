# Проектная работа "Веб-ларек"

## Web-ларёк: Интернет-магазин для веб-разработчиков
Добро пожаловать в Web-ларёк! Этот проект представляет собой интернет-магазин, где вы можете просматривать каталог товаров для веб-разработчиков, добавлять товары в корзину и оформлять заказы. В данном документе приведено описание архитектуры проекта, его функциональные требования и используемые интерфейсы.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

## Сборка

```
npm run build
```

## Описание типов данных

* ```TServerProduct``` - тип для данных продукта получаемых с сервера, при сохранении в приложении преобразуется к виду интерфейса `IProduct`.
* ```IProduct``` - интерфейс описывающий структуру данных продукта хранимых приложением, включает в себя: id, описание, URL изображения, название, категорию, стоимость товара и статус `inBasket` говорящий о том , находится ли данный товар в корзине.
* ```IProductsData ```-  интерфейс для хранения данных о товарах (содержит набор методов для управления превью и корзиной заказов)
* ```IOrder``` -  интерфейс для указания атрибутов формы заказа, включает в себя данные: адреса доставки, способа оплаты, электронную почту и номер телефона.
* ```IOrderResult``` - интерфейс для результата оформления заказа.

## Архитектура
Код приложения использует событийно ориентированный подход :
- **Слой представления** - отвечает за отображение данных на странице
- **Слой данных** - отвечает за хранение и изменение данных
- **Передатчик событий** - отвечает за связь представления и данных
 
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.


## Базовый код

1. Класс ```EventEmitter``` обеспечивает работу событий. 

`constructor() { this._events = new Map<EventName, Set<Subscriber>>(); }` - Конструктор инициализирует _events как пустую Map, где ключами будут имена событий (строки или регулярные выражения), а значениями - множества подписчиков.

   * `on` - устанавливает обработчик на событие.
   * `off` - снимает обработчик с события.
   * `emit` - инициирует событие с данными.

2. Класс ```Api``` используется для взаимодействия с внешними системами.\

    `constructor(baseUrl: string, options: RequestInit = {})` - принимает основную ссылку запроса и опции для заголовков запроса.
   * `handleResponse()` - используется внутри каждого метода запроса на сервер, для обработки ответа.
   * возможность отправлять GET и POST-запросы;

3. Класс ```Component``` является базовым классом для компонентов представления.\

   `constructor(protected readonly container: HTMLElement)` - принимает контейнер дочернего класса, сохраняет его в своем поле для последующего выполнения рендера внуть этого контейнера.

   Методы:

   * `toggleClass` - переключает класс элемента.
   * `setText` - устанавливает текстовое содержание.
   * `setDisabled` - меняет статус блокировки элемента.
   * `setHidden` - скрывает элемент.
   * `setVisible` - показывает элемент.
   * `setImage` - устанавливает изображение с альтернативным текстом.
   * `render`- возвращает корневой DOM-элемент.

4. Класс ```Model``` базовый класс для создания классов моделей данных.
   * `emitChanges` - сообщает всем, что модель изменилась


## Компоненты модели данных

 ```AppData``` реализует работу с моделью приложения.

 **Класс `ProductsData`**: - Хранит глобальное состояние приложения, включая информацию о корзине, каталоге продуктов.
   - Использует родительский конструктор от класса `Model<IProductsData>`
   - Содержит единственное защищенное поле `_items` для хранение данных о товаре и манипуляции с ними.
   - Содержит методы для работы с данными, такие как обновленние каталога, его получение, расчет общей суммы корзины, проверка наличия товара в корзине, добавление/удаление продуктов в корзину, очистка корзины и передача данных о товаре для превью:
     * `setCatalogItems()` - устанавливает новый массив товаров.
     * `getCatalogItems()` - отдаёт целиком массив товаров.
     * `getTotalPrice()` - отдаёт сумму товаров из корзины
     * `getBasketItemsId()` - отдает массив строк ID товарок находящихся в корзине.
     * `addItemToBasket()` - добавляет товар в корзину
     * `removeFromBusket()` - удаляет товар из корзины
     * `clearBasket()` - очищает корзину
     * `checkProductInBasket()` - проверяет наличие товара в корзине
     * `setPreview()` - передает данные о выбранном товаре для его предпросмотра и дальнейшего добавления в корзину.

    - Cвойства:\
    `protected _items: IProduct[] = []`

   **Класс `Order`**: - Хранит данные о заказе, адрес, способ оплаты, номер телефона, почту заказчика и объект ошибок валидации этих полей.
   - Использует родительский конструктор от класса `Model<Order>`
   - Содержит методы для работы с данными, такие как передача нового объекта с данными о заказе, установка данных о платеже, установка контактных данных заказчика, отчистка заказа, методы для валидации этих данных.

  * `getUserDate()` - передача объекта данных для формирования запроса на сервер.
  * `setOrderField()` - заполняет данные формы в заказ (тип оплаты, адрес) 
  * `setPayments()` - заполняет данные формы в заказ ( способ оплаты, адресс)
  * `validateOrder()` - проверяет валидацию типа оплаты и адреса
  * `setContacts()` - заполняет данные формы в заказ ( email, телефон)
  * `validateContact()` - проверяет данные почты и телефона

  - Cвойства:\
    `   email: '',`\
    `   phone: '',`\
    `   payment: '',`\
    `   address: '',`\

### Интерфейс `IProdAPI`

- Интерфейс IProdAPI определяет методы для взаимодействия с API относительно продуктов.
- Методы:
  - `getCardList`: получение списка продуктов в виде массива товаров.
  - `orderItems`: оформление заказа с передачей информации о заказе(формирует объект заказа для отпраки на сервер) и получение результата заказа.

### Класс `ProdAPI` - для взаимодействие с сервером.

- Класс ProdAPI реализует интерфейс IProdAPI и предоставляет методы для работы с продуктами через API, наследуя функционал от базового класса Api.
- Методы класса:
  - `getCardList()`: выполняет GET-запрос на сервер для получения списка продуктов и обработки данных.
  - `orderItems(order: IServerOrder)`: выполняет POST-запрос на сервер для оформления заказа и получения результата.

Этот класс представляет API для взаимодействия с продуктами, включая получение списка продуктов и заказ товаров.

## Представление

### Класс `Page` - для управления отображения каталога товаров, счётчика корзины, блокировка прокрутки. 

- Класс `Page` является наследником класса `Component<IPage>`.
- Конструктор принимает контейнер страницы и объект класса EventEmitter.
- Поля класса:
  - `_basketCounter`: элемент счетчика корзины.
  - `_catalog`: элемент каталога.
  - `_wrapper`: обертка страницы.
  - `_basketBtn`: элемент кнопка корзины.

- Для изменения значений в полях класса используются следующие сеттеры:
  - `set basketCounter(value: number)`: устанавливает значение счетчика в корзине, обновляя текст элемента.
  - `set catalog(items: HTMLElement[])`: добавляет карточки на страницу, заменяя текущие элементы.
  - `set locked(value: boolean)`: блокирует/разблокирует прокрутку страницы путем toggle переключения класса.

Этот класс предоставляет архитектуру компонента страницы (Page) с базовым функционалом управления элементами на странице.


### Класс `Card` - для отображения карточки товара.

- Класс `Card` является наследником класса `Component<ICard>`.
- Конструктор класса `Card` принимает шаблон разметки карточки и `callback` в качестве необязательного параметра, с целью устанавливать на той или иной карточке необходимые слушатели.
```constructor(container: HTMLElement, actions?: ICardActions)```

- Поля класса:
  - `_title`: элемент заголовка карточки.
  - `_image`: элемент изображения.
  - `_description`: элемент описания.
  - `_button`: элемент кнопки.
  - `_category`: элемент категории карточки.
  - `_price`: элемент цены.
  - `_index`: елемент позиции товара(карточки) в корзине.
  
- Для изменения значений в полях класса используются следующие сеттеры:
  - `id`: устанавливает значение идентификатора для данных карточки.
  - `title`: устанавливает или возвращает текст заголовка карточки.
  - `image`: устанавливает изображение для карточки.
  - `description`: устанавливает текст описания карточки.
  - `category`: устанавливает текст категории и добавляет соответствующий класс категории.
  - `price`: устанавливает текст цены карточки (или текст 'Бесценно' для null значения).
  - `index`: устанавливает номер позиции карточки находящейся в корзине.

- Метод ``isButtonDisabled()``: принимает 3 аргумента, при совпадении id или отсутствии цены блокирует кнопку карточки используя метод `setDisabled()` родительского класса.

Этот класс предоставляет компонент карточки (Card) с возможностью управления текста, изображения, описания, категории и бесценой карточки. 

### Класс `Modal` -  для отображения модального окна.

- Класс `Modal` является наследником класса `Component<IModalData>`.
- Поля класса:
  - `_closeButton`: кнопка закрытия модального окна.
  - `_content`: содержимое модального окна.
  
- Добавляются слушатели событий 'click' на кнопку закрытия, на сам контейнер модального окна для закрытия и на обертку внутри контейнера модального окна для предотвращения закрытия.
  
- Свойства класса:
  - `content`: устанавливает содержимое модального окна, заменяя текущее содержимое.
  
- Методы класса:
  - `open()`: открывает модальное окно.
  - `close()`: закрывает модальное окно.
  - `render(data: IModalData)`: рендерит модальное окно с заданными данными, открывая его сразу после рендеринга.

Этот класс предоставляет управление модальным окном (Modal) с возможностью открытия, закрытия и установки контента.

### Класс `Basket` - для отображения корзины.

- Класс `Basket` представляет компонент корзины товаров.
- Класс является наследником `Component<IBasketView>`.
- Поля класса:
  - `_itemsList`: элемент списка товаров в корзине.
  - `_totalPrice`: элемент для отображения общей суммы товаров в корзине.
  - `_button`: элемент кнопки для открытия оформления заказа.
  
- Свойства oбъекта:
  - `items` (массив `HTMLElement`): устанавливает список элементов товаров в корзине, обновляя содержимое в `_list`.
  - `total`: устанавливает и отображает общую сумму товаров в корзине в элементе.

Этот класс предоставляет компонент корзины (Basket) с возможностью управления товарами, отображения общей суммы и обработки выбранных элементов.


### Класс `PaymentForm` - для отображения формы способа Оплаты и Адреса.

- Класс `PaymentForm` представляет компонент Формы.
- Класс является наследником `Component<IPaymentForm>`.
- Поля класса:
  - `_paymentTypeButtons`: массив кнопок для выбора способа оплаты.
  - `_addressTextArea`: элемент для ввода адреса пользователем.
  - `_errorElement`: элемент для отображения сообщения об ошибках валидации.
   - `_submitBtn`: элемент кнопки подтверждения введенных данных, переход к следующей форме заказа.
  
- Сеттеры oбъекта:
  - `set errors(massages: string[])` - принимает соответствующее сообщение о ошибке валидации и устанавливает его в тектовый элемент ошибки.
  - `set valid(state: boolean)` - сеттер получающий булевое значение для блокировки кнопки отправки формы.

Этот класс предоставляет компонент формы заполнения адреса и способа оплаты.


### Класс `ContactsForm` - для отображения формы ввода почты и номера телефона.

- Класс `ContactsForm` представляет компонент Формы.
- Класс является наследником `Component<IContactsForm>`.
- Поля класса:
  - `_emailField`: элемент для ввода пользователем своей почты.
  - `_phoneField`: элемент для ввода номера телефона пользователя.
  - `_errorElement`: элемент для отображения сообщения об ошибках валидации.
   - `_submitBtn`: элемент кнопки подтверждения введенных данных, переход к подтверждению покупки.
  
- Сеттеры oбъекта:
  - `set errors(massages: string[])` - принимает соответствующее сообщение о ошибке валидации и устанавливает его в тектовый элемент ошибки.
  - `set valid(state: boolean)` - сеттер получающий булевое значение для блокировки кнопки отправки формы.

Этот класс предоставляет компонент формы заполнения почты и номера телефона.

### Класс `Success` - для отображения подтверждени заказа и итоговой суммы списания средств.

- Класс является наследником `Component<ISuccess>`.
- Поля класса:
  - `_totalCost`: элемент отображения итоговой суммы списания средств.
  - `_acceptButton`: элемент кнопки подтверждения информации.
  
- Класс наделен единсвенным сеттером для установки приходящей с сервера общей суммы заказа:
  - `set total(total: number)` - принимает число, устанавливает заготовленное текстовое сообщение содержащее сумму покупки.

### Презентеры 

Слой презентера не выделен в отдельный класс и реализован в index.ts. В приложении применен событийно-ориентированный подход. Для генерации событий и установки слушателей на события используется инстант класса EventEmitter, отвечающего за работу с событиями в приложении. При возникновении события выполняется обработчик, в котором реализованы логика приложения и взаимодействие между моделью (данными) и представлением (отображением). В приложении используются следующие события:
   
   Основные события:

   * items:changed - изменение каталога товаров.
   * card:select - нажатие на карточку товара.
   * preview:changed - открытие карточки товара.
   * basket:open - открытие корзины.
   * basket:changed - изменение содержимого корзины.
   * card:add - добавление карточки.
   * card:remove - удаление карточки.
   * formErrorsContact:change - изменение состояния валидации формы контактов.
   * formErrorsPayment:change - изменение состояния валидации формы заказа.
   * payment:open - открытие формы заказа.
   * payment:change - изменение типа оплаты.
   * payments:submit - открытие формы контактов.
   * contacts:change - изменение вводимых данных о телефоне или почте
   * contacts:submit - успешная оплата заказа.
   * success:done - подтверждение успешной покупки.
   * modal:open - открытие модального окна.
   * modal:close - закрытие модального окна.
