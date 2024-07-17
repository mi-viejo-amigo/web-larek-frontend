import { Component } from "../base/Component"
import { IFormErrors} from "../../types"
import { ensureElement } from "../../utils/utils" 
import { IEvents } from "../base/events" 

interface IForm extends IFormErrors {
    errors: string[]
    valid: boolean
}

export  class Form<T> extends Component<IForm> {

    protected _submitBtn: HTMLButtonElement
    protected _errorsElement: HTMLSpanElement

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container)
        this._submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', container)
        this._errorsElement = ensureElement<HTMLSpanElement>('.form__errors', container)
        // Listeners
        this.container.addEventListener('input', (e: Event)=> {
            const target = e.target as HTMLInputElement
            const field = target.name as keyof T
            const value = target.value
            this.onInputChange(field, value)
        })

        this.container.addEventListener('submit', (e: Event)=> {
            e.preventDefault()
            this.events.emit(`${this.container.name}:submit`)
        })

    }
    
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
        // Возможные события
        // order.address:change
        // contacts.phone:change
        // contacts.email:change
    }

    set errors(massages: string[]) {
        this.setText(this._errorsElement, massages.join('\n'))
    }

    set valid(state: boolean) {
        this.setDisabled(this._submitBtn, !state)
    }

    render(state: IForm) {
        const {valid, errors} = state;
        super.render({valid, errors});
        // Object.assign(this, inputs);
        return this.container;
    }
}