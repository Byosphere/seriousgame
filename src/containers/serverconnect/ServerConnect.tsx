import * as React from 'react';
import './serverconnect.css';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import T from 'i18n-react';
import { gameConnect } from 'src/utils/api';
import { SERVER_WAIT } from 'src/utils/constants';

interface Props {
    onConnect: Function
}

interface State {
    addr: string
    port: number
    errorMessage: string
}

class ServerConnect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addr: '',
            port: 0,
            errorMessage: ''
        }
    }

    public tryConnect() {
        if (this.state.addr === '' || this.state.port < 0) {
            this.setState({ errorMessage: T.translate('invalid.server').toString() });
        } else {
            let response: any = null;
            let timer = 0;
            gameConnect("http://" + this.state.addr, this.state.port, (resp: any) => {
                response = resp;
            });
            let interval = setInterval(() => {
                if (response) {
                    localStorage.setItem('server', JSON.stringify({ addr: this.state.addr, port: this.state.port }));
                    this.props.onConnect(response.type, response.id);
                    clearInterval(interval);
                } else if (timer === SERVER_WAIT) {
                    this.setState({ errorMessage: T.translate('invalid.server').toString() });
                    clearInterval(interval);
                }
                timer += 100;
            }, 100);
        }
    }

    public render() {
        return (
            <div className="server-connect">
                <div className="game-header">
                    <h1>{T.translate('appname')}</h1>
                </div>
                <div className="server-join">
                    <div className="inner">
                        <h2>{T.translate('server.join')}</h2>
                        <div className="server-textfields">
                            <TextField
                                id="outlined-url"
                                variant="outlined"
                                value={this.state.addr}
                                onChange={(evt: any) => { this.setState({ addr: evt.target.value }) }}
                                label={T.translate('generic.serveraddr')}
                                margin="normal"
                                error={Boolean(this.state.errorMessage)}
                                helperText={this.state.errorMessage}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                                }}
                            />
                            <TextField
                                id="outlined-port"
                                label={T.translate('generic.port')}
                                value={this.state.port}
                                onChange={(evt: any) => { this.setState({ port: parseInt(evt.target.value) }) }}
                                type="number"
                                error={Boolean(this.state.errorMessage)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                style={{ marginLeft: "10px", maxWidth: "110px" }}
                                variant="outlined"
                            />
                        </div>
                        <Button onClick={() => this.tryConnect()} variant="outlined" color="primary">
                            {T.translate('server.connect')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServerConnect;