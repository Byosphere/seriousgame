import { HAUT, BAS } from 'src/utils/constants';
import T from 'i18n-react';

interface Message {
    text: string
    position: string
    force: number
    action: string
    clickAction?: string
    errorMessage: string
}

class Message {

    constructor(text?: string, position?: string, force?: number, action?: string, clickAction?: string) {
        this.text = text || '';
        this.position = position || HAUT;
        this.force = force || 1;
        this.action = action || null;
        this.clickAction = clickAction || '';
        this.errorMessage = '';
    }

    static fromData(data: MessageData): Message {
        let { text, position, force, action, clickAction } = data;
        return new this(text, position, force, action, clickAction);
    }

    public equalsTo(message: Message): boolean {
        let isEqual = true;
        isEqual = this.text === message.text
            && this.position === message.position
            && this.force === message.force
            && this.action === message.action
            && this.clickAction === message.clickAction;
        return isEqual;
    }

    public isValid(): any {
        let isValid = true;
        isValid = this.text !== ''
            && (this.position === HAUT || this.position === BAS);

        if (!isValid) this.errorMessage = T.translate('invalid.message').toString();
        return isValid;
    }

    public toJsonData(): MessageData {
        return {
            text: this.text,
            position: this.position,
            force: this.force,
            action: this.action,
            clickAction: this.clickAction
        }
    }

    public duplicate(): Message {
        return new Message(this.text, this.position, this.force, this.action, this.clickAction);
    }
}

export default Message;