import * as React from 'react';
import './serverconnect.css';
import { TextField, InputAdornment, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem } from '@material-ui/core';
import T from 'i18n-react';
import { masterConnect, playerConnect } from 'src/utils/api';
import { SERVER_WAIT, PLAYER, INSTRUCTOR, ORANGE } from 'src/utils/constants';

interface Props {
    onConnect: Function
}

interface State {
    addr: string
    port: number
    errorMessage: string
    wrongConnect: string
    password: string
    type: string
    disabled: boolean
}

class ServerConnect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addr: '',
            port: 0,
            errorMessage: '',
            wrongConnect: '',
            type: PLAYER,
            password: '',
            disabled: false
        }
    }

    public tryConnect() {
        this.setState({ errorMessage: '', wrongConnect: '', disabled: true });
        if (this.state.addr === '' || this.state.port < 0) {
            this.setState({ errorMessage: T.translate('invalid.server').toString(), disabled: false });
        } else if (this.state.type === INSTRUCTOR && this.state.password === '') {
            this.setState({ wrongConnect: T.translate('invalid.password').toString(), disabled: false });
        } else {
            let response: any = null;
            let timer = 0;
            switch (this.state.type) {
                case INSTRUCTOR:
                    masterConnect("http://" + this.state.addr, this.state.port, this.state.password, (resp: any) => { response = resp });
                    break;

                case PLAYER:
                    playerConnect("http://" + this.state.addr, this.state.port, (resp: any) => { response = resp });
                    break;

                default:
                    break;
            }
            let interval = setInterval(() => {
                if (response) {
                    localStorage.setItem('server', JSON.stringify({ addr: this.state.addr, port: this.state.port, type: this.state.type, password: this.state.password }));
                    this.checkConnect(response);
                    clearInterval(interval);
                } else if (timer === SERVER_WAIT) {
                    this.setState({ errorMessage: T.translate('invalid.server').toString(), disabled: false });
                    clearInterval(interval);
                }
                timer += 100;
            }, 100);
        }
    }

    public checkConnect(response: any) {
        if (response.success) {
            this.setState({ disabled: false });
            this.props.onConnect(INSTRUCTOR, -1);
        } else if (response.id >= 0) {
            this.setState({ disabled: false });
            this.props.onConnect(PLAYER, response.id);
        } else {
            this.setState({ wrongConnect: T.translate('invalid.password').toString(), disabled: false });
        }
    }

    public render() {
        return (
            <div className="server-connect" style={{ background: ORANGE }}>
                <div className="game-header">
                    <h1>{T.translate('appname')}</h1>
                </div>
                <div className="server-join">
                    <div className="inner">
                        <h2>{T.translate('server.join')}</h2>
                        <div>
                            <TextField
                                id="outlined-url"
                                variant="outlined"
                                value={this.state.addr}
                                disabled={this.state.disabled}
                                onChange={(evt: any) => { this.setState({ addr: evt.target.value }) }}
                                label={T.translate('generic.serveraddr')}
                                margin="normal"
                                error={Boolean(this.state.errorMessage)}
                                helperText={this.state.errorMessage}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                                }}
                                style={{ width: "calc(100% - 120px)" }}
                            />
                            <TextField
                                id="outlined-port"
                                label={T.translate('generic.port')}
                                value={this.state.port}
                                disabled={this.state.disabled}
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
                        <div>
                            <FormControl style={{ width: this.state.type !== INSTRUCTOR ? "100%" : "calc(50% - 5px)", marginRight: "10px" }} fullWidth={this.state.type !== INSTRUCTOR} variant="outlined">
                                <InputLabel htmlFor="outlined-permission">{T.translate('server.permission').toString()}</InputLabel>
                                <Select
                                    fullWidth={this.state.type !== INSTRUCTOR}
                                    value={this.state.type}
                                    onChange={(evt: any) => { this.setState({ type: evt.target.value }) }}
                                    disabled={this.state.disabled}
                                    input={
                                        <OutlinedInput
                                            labelWidth={80}
                                            name={T.translate('server.permission').toString()}
                                            id="outlined-permission"
                                            fullWidth={this.state.type !== INSTRUCTOR}
                                        />
                                    }
                                >
                                    <MenuItem value={PLAYER}>{T.translate('player.player')}</MenuItem>
                                    <MenuItem value={INSTRUCTOR}>{T.translate('instructor.master')}</MenuItem>
                                </Select>
                            </FormControl>
                            {this.state.type === INSTRUCTOR && <TextField
                                id="instructor-password"
                                label={T.translate('server.password')}
                                type="password"
                                value={this.state.password}
                                disabled={this.state.disabled}
                                onChange={(evt: any) => { this.setState({ password: evt.target.value }) }}
                                autoComplete="current-password"
                                style={{ width: "calc(50% - 5px)" }}
                                variant="outlined"
                                error={Boolean(this.state.wrongConnect)}
                                helperText={this.state.wrongConnect}
                            />}
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