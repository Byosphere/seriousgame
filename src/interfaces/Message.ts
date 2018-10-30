import { HAUT } from 'src/utils/constants';

interface Message {
    text: string
    position: string
    force: number
    action?: string
}

class Message {

    constructor(text?: string, position?: string, force?: number, action?: string) {
        this.text = text || '';
        this.position = position || HAUT;
        this.force = force || 1;
        this.action = action || null;
    }

    static fromData(data: MessageData): Message {
        let { text, position, force, action } = data;
        return new this(text, position, force, action);
    }

    public equalsTo(message: Message): boolean {
        let isEqual = true;
        isEqual = this.text === message.text
            && this.position === message.position
            && this.force === message.force
            && this.action === message.action;
        return isEqual;
    }

    public toJsonData(): MessageData {
        return {
            text: this.text,
            position: this.position,
            force: this.force,
            action: this.action
        }
    }
}

export default Message;