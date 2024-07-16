import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter, IEvents } from "./base/events";


interface IPage { 
	basketCounter: number
	catalog: HTMLElement[]
	locked: boolean
}

export class Page extends Component<IPage> {
	
	protected _catalog: HTMLElement
	protected _basketBtn: HTMLButtonElement
	protected _basketCounter: HTMLElement
	protected _wrapper: HTMLElement

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container)
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container)
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container)
		this._basketBtn = ensureElement<HTMLButtonElement>('.header__basket', container)
		this._catalog = ensureElement<HTMLElement>('.gallery', container)
		this._basketBtn.addEventListener('click', () => {
			events.emit('basket:open')
		})
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, value)
	}

	set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value)
	}
}

