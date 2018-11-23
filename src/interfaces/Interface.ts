import Page from './Page';
import Message from './Message';
import { isBoolean } from 'util';
import Action from './Action';
import T from 'i18n-react';
import Role from './Role';

interface Interface {
    roleId: number
    pages: Array<Page>
    _cols: number
    _rows: number
    displayIa: boolean
    messages: Array<Message>
    errorMessage: string
}

class Interface {

    constructor(roleId?: number, pages?: Array<Page>, cols?: number, rows?: number, displayIa?: boolean, messages?: Array<Message>) {
        this.roleId = roleId || null;
        this.pages = pages || [];
        this.cols = cols || 1;
        this.rows = rows || 1;
        this.displayIa = displayIa || true;
        this.messages = messages || [];
        this.errorMessage = '';
    }

    public get cols(): any {
        return this._cols;
    }

    public set cols(n: any) {
        this._cols = parseInt(n);
    }

    public get rows(): any {
        return this._rows;
    }

    public set rows(n: any) {
        this._rows = parseInt(n);
    }

    public duplicate(): Interface {

        let pages: Array<Page> = [];
        this.pages.forEach(page => {
            pages.push(page.duplicate());
        });
        let messages: Array<Message> = [];
        this.messages.forEach(message => {
            messages.push(message.duplicate());
        });


        return new Interface(this.roleId, pages, this.cols, this.rows, this.displayIa, messages);
    }

    public isValid(roles: Array<Role>, actions: Array<Action>, index: number): boolean {
        let isValid = true;

        isValid = roles.findIndex(role => { return role.id === this.roleId }) > -1
            && isBoolean(this.displayIa)
            && this.cols > 0
            && this.rows > 0;

        if (!isValid) {
            this.errorMessage = T.translate('invalid.interface', { interfaceId: index + 1 }).toString();
            return isValid;
        }

        this.messages.forEach((message, i) => {
            if (!message.isValid()) {
                isValid = false;
                this.errorMessage = message.errorMessage + roles.find(role => { return role.id === this.roleId }).name + ".";
            }
        });
        if (!isValid) return isValid;

        this.pages.forEach((page, i) => {
            if (!page.isValid(actions, index)) {
                isValid = false;
                this.errorMessage = page.errorMessage;
            }
        });

        return isValid;
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

    public equalsTo(int: Interface): boolean {
        let isEqual = true;
        isEqual = this.roleId === int.roleId
            && this.displayIa === int.displayIa
            && this.cols === int.cols
            && this.rows === int.rows;

        this.messages.forEach((message, i) => {
            if (!message.equalsTo(int.messages[i])) {
                isEqual = false;
            }
        });

        this.pages.forEach((page, i) => {
            if (!page.equalsTo(int.pages[i])) {
                isEqual = false;
            }
        });

        return isEqual;
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