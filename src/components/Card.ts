import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IProduct } from "../types";

interface ICardActions { 
    onClick: (event: MouseEvent) => void; 
} 
export interface ICard{ 
    title: string; 
	description: string
	image: string; 
	category: string; 
	price: number; 
	button: HTMLButtonElement; 
    index: number;
} 

export class Card extends Component<ICard> {
    _title: HTMLElement
    _category?: HTMLElement
    _price: HTMLElement
    _index?: HTMLElement
    _description?: HTMLElement
    _image?: HTMLImageElement
    _button?: HTMLButtonElement

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container)
		this._category = container.querySelector('.card__category')
        this._price = ensureElement<HTMLElement>('.card__price', container)
        this._image = container.querySelector('.card__image')
        this._index = container.querySelector('.basket__item-index')
        this._description = container.querySelector('.card__text')
        this._button = container.querySelector('.card__button')
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set price(value: number | null) {
        value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, `${value.toString()} синапсов`);
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const modificatorMap: { [key: string]: string } = {
                'софт-скил': 'soft',
                'другое': 'other',
                'хард-скил': 'hard',
                'дополнительное': 'additional',
                'кнопка': 'button'
            };
            this._category.classList.add(`card__category_${modificatorMap[value]}`);
        } else {
            console.warn('Element .card__category in Card, not found. This is expected if the current card template does not include this element.');
        }
	}

    set description (value: string) {
        this.setText(this._description, value)
    }

    set index(value: number) {
        this.setText(this._index, value)
    }


    isButtonDisabled(id: string, itemsId: string[], price: number | null): void {
        if (price === null || itemsId.includes(id)) {
            this.setDisabled(this._button, true)
        } else {
            this.setDisabled(this._button, false)
        }
    }

        
}
   

