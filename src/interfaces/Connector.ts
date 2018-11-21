import { INSTRUCTOR, PLAYER, SERVER_WAIT } from 'src/utils/constants';
import { Parameters } from 'src/interfaces/Parameters';
import { masterConnect, playerConnect } from 'src/utils/api';
import T from 'i18n-react';

interface Connector {
    addr: string
    type: string
    port: number
    save?: boolean
    playerName?: string
    password?: string
    params?: Parameters
}

class Connector {

    constructor(addr: string, type: string, port: number, save?: boolean, playerName?: string, password?: string, params?: Parameters) {
        this.addr = addr;
        this.type = type;
        this.port = port;
        this.save = save || false;
        this.playerName = playerName || '';
        this.password = password || '';
        this.params = params || null;
    }

    public getFullAddress(): string {
        return "http://" + this.addr + ":" + this.port;
    }

    public storeConnector() {
        localStorage.setItem('server', JSON.stringify({
            addr: this.addr,
            type: this.type,
            port: this.port,
            save: this.save,
            playerName: this.playerName,
            password: this.password,
            params: this.params
        }));
    }

    public static retrieveConnector(): Connector {
        if (!localStorage.getItem('server')) return null;
        let { addr, type, port, save, playerName, password, params } = JSON.parse(localStorage.getItem('server'));
        return new Connector(addr, type, port, save, playerName, password, params);
    }

    public validate(): any {
        if (this.addr === '') return { addr: T.translate('invalid.addr').toString() };
        if (!this.port || this.port < 0) return { port: T.translate('invalid.port').toString() };
        if (this.type === INSTRUCTOR && this.password === '') return { password: T.translate('invalid.password').toString() };
        if (this.type === PLAYER && this.playerName === '') return { name: T.translate('invalid.name').toString() };
        return null;
    }

    public connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            let response: any = null;
            let timer = 0;
            if (this.type === INSTRUCTOR) {
                masterConnect(this.getFullAddress(), this.password, (resp: any) => { response = resp });
            } else if (this.type === PLAYER) {
                playerConnect(this.getFullAddress(), this.playerName, (resp: any) => { response = resp });
            } else {
                throw ('Unkown type :' + this.type);
            }
            let interval = setInterval(() => {
                if (response) {
                    if (this.save) this.storeConnector();
                    resolve(response);
                    clearInterval(interval);
                } else if (timer === SERVER_WAIT) {
                    localStorage.removeItem('server');
                    reject('server.timeout');
                    clearInterval(interval);
                }
                timer += 100;
            }, 100)

        });
    }
}

export default Connector;