import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModalData {
    content: HTMLElement
}

export class Modal extends Component<IModalData> {
    protected _content: HTMLElement
    protected _closeButton: HTMLElement

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this._closeButton = ensureElement('.modal__close', container)
        this._content = ensureElement('.modal__content', container)
        //listeners
        this._closeButton.addEventListener('click', this.close.bind(this))
        this.container.addEventListener('click', this.close.bind(this))
        this.container.firstElementChild.addEventListener('click', (event) => event.stopPropagation());
         
    }

    set content(value:HTMLElement) {
        this._content.replaceChildren(value)
    }

    open() {
        this.container.classList.add('modal_active')
        this.events.emit('modal:opened')
    }

    close() {
        this.container.classList.remove('modal_active')
        this.events.emit('modal:closed')
    }

    render(data?: IModalData): HTMLElement {
        super.render(data)
        this.open()
        return this.container
    }
}