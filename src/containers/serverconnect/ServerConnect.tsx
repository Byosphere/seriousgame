import * as React from 'react';
import './serverconnect.css';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import T from 'i18n-react';
import { gameConnect } from 'src/utils/api';

interface Props {
    onConnect: Function
}

interface State {
    menuSelect: string
    addr: string
    port: number
}

class ServerConnect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addr: '',
            port: undefined,
            menuSelect: ''
        }
    }

    public tryConnect() {
        gameConnect("http://" + this.state.addr, this.state.port, (err: any, resp: any) => {
            if (!err) {
                this.props.onConnect(resp.type, resp.id);
            }
        });
    }

    public render() {
        return (
            <div className="server-connect">
                <div className="game-header">
                    <h1>{T.translate('appname')}</h1>
                </div>
                <div className="server-join">
                    <h2>{T.translate('server.join')}</h2>
                    <div className="server-textfields">
                        <TextField
                            id="outlined-url"
                            variant="outlined"
                            value={this.state.addr}
                            onChange={(evt: any) => { this.setState({ addr: evt.target.value }) }}
                            label={T.translate('generic.serveraddr')}
                            margin="normal"
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
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="normal"
                            style={{ marginLeft: "10px" }}
                            variant="outlined"
                        />
                        <Button onClick={() => this.tryConnect()} style={{ marginLeft: "10px" }} variant="outlined" color="primary">
                            {T.translate('server.connect')}
                        </Button>
                    </div>
                </div>
                <div className="server-host">
                    <h2>{T.translate('server.host')}</h2>
                    <p>Coming soon...</p>   
                </div>
            </div>
        );
    }
}

export default ServerConnect;