import Page from './Page';
import Message from './Message';

interface Interface {
    roleId: number
    pages: Array<Page>
    cols: number
    rows: number
    displayIa: boolean
    messages: Array<Message>
}

class Interface {

    constructor(roleId?: number, pages?: Array<Page>, cols?: number, rows?: number, displayIa?: boolean, messages?: Array<Message>) {
        this.roleId = roleId || null;
        this.pages = pages || [];
        this.cols = cols || 1;
        this.rows = rows || 1;
        this.displayIa = displayIa || true;
        this.messages = messages || [];
    }

    public validate(): boolean {
        return false;
        // TODO
    }

    public toJsonData(): InterfaceData {

        let messages: Array<MessageData> = [];
        this.messages.forEach(message => {
            messages.push(message.toJsonData());
        });

        let pages: Array<PageData> = [];
        this.pages.forEach(page => {
            pages.push(page.toJsonData());
        });

        return {
            roleId: this.roleId,
            pages,
            cols: this.cols,
            rows: this.rows,
            displayIa: this.displayIa,
            messages
        }
    }

    static fromData(data: InterfaceData): Interface {
        let { roleId, pages, cols, rows, displayIa, messages } = data;
        let pagesObject: Array<Page> = [];
        let messagesObject: Array<Message> = [];
        if (pages) {
            pages.forEach(p => {
                pagesObject.push(Page.fromData(p));
            });
        }
        if (messages) {
            messages.forEach(m => {
                messagesObject.push(Message.fromData(m));
            });
        }

        return new this(roleId, pagesObject, cols, rows, displayIa, messagesObject);
    }
}

export default Interface;