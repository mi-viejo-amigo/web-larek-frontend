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

    protected _toggleModal(state: boolean = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }

    // Обработчик в виде стрелочного метода, чтобы не терять контекст `this`
    protected _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal(); // открываем
        // навешиваем обработчик при открытии
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false); // закрываем
        // правильно удаляем обработчик при закрытии
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data?: IModalData): HTMLElement {
        super.render(data)
        this.open()
        return this.container
    }
}