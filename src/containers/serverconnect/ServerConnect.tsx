import * as React from 'react';
import './serverconnect.css';
import { TextField, InputAdornment, Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core';
import T from 'i18n-react';
import { PLAYER, INSTRUCTOR, ORANGE } from 'src/utils/constants';
import Connector from 'src/interfaces/Connector';
import Loader from 'src/components/loader/Loader';
import { setConnector } from 'src/actions/connectorActions';
import { connect } from 'react-redux';

interface Props {
    onConnected: Function
    connector: Connector
    setConnector: Function
}

interface State {
    addr: string
    port: number
    errorMessages: any
    password: string
    type: string
    disabled: boolean
    checked: boolean
    name: string
    connected: boolean
}

class ServerConnect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            addr: '',
            port: 0,
            errorMessages: {},
            type: PLAYER,
            password: '',
            disabled: false,
            checked: false,
            name: '',
            connected: Boolean(this.props.connector)
        }

    }

    public componentDidMount() {
        if (this.props.connector) this.tryConnect();
    }

    public tryConnect() {
        this.setState({ errorMessages: [], disabled: true });
        let co: Connector = this.state.connected ? this.props.connector : new Connector(this.state.addr, this.state.type, this.state.port, this.state.checked, this.state.name, this.state.password);
        let errors = co.validate();
        if (errors) {
            this.setState({ errorMessages: errors, disabled: false });
        } else {
            co.connect().then(
                resolve => {
                    if (resolve.success || resolve.playerId >= 0) {
                        this.setState({ disabled: false, connected: true });
                        co.params = resolve.params;
                        this.props.setConnector(co);
                        this.props.onConnected(co);
                    } else {
                        let errors: string[] = [];
                        errors['password'] = T.translate('invalid.password').toString();
                        localStorage.removeItem('server');
                        this.setState({ errorMessages: errors, disabled: false, connected: false, type: co.type });
                    }
                },
                reject => {
                    let errors: string[] = [];
                    errors['addr'] = reject;
                    this.setState({ errorMessages: errors, disabled: false });
                }
            );
        }
    }

    public render() {

        if (this.state.connected) return (<Loader textKey="loader.serverwait" />);

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
                                error={Boolean(this.state.errorMessages['addr'])}
                                helperText={this.state.errorMessages['addr']}
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
                                error={Boolean(this.state.errorMessages['port'])}
                                helperText={this.state.errorMessages['port']}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                style={{ marginLeft: "10px", maxWidth: "110px" }}
                                variant="outlined"
                            />
                        </div>
                        <div>
                            <FormControl style={{ width: "calc(50% - 5px)", marginRight: "10px" }} fullWidth={this.state.type !== INSTRUCTOR} variant="outlined">
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
                                error={Boolean(this.state.errorMessages['password'])}
                                helperText={this.state.errorMessages['password']}
                            />}
                            {this.state.type === PLAYER && <TextField
                                id="player-name"
                                label={T.translate('server.pname')}
                                type="text"
                                value={this.state.name}
                                disabled={this.state.disabled}
                                onChange={(evt: any) => { this.setState({ name: evt.target.value }) }}
                                style={{ width: "calc(50% - 5px)" }}
                                variant="outlined"
                                error={Boolean(this.state.errorMessages['name'])}
                                helperText={this.state.errorMessages['name']}
                            />}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                            <Button onClick={() => this.tryConnect()} variant="outlined" color="primary">
                                {T.translate('server.connect')}
                            </Button>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checked}
                                        onChange={(evt: any) => { this.setState({ checked: evt.target.checked }) }}
                                        value="checked"
                                        color="primary"
                                        style={{ paddingRight: "5px" }}
                                    />
                                }
                                label={T.translate('server.save')}
                                style={{ marginLeft: "20px" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, { setConnector })(ServerConnect);