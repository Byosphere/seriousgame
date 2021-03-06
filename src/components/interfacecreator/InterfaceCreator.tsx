import * as React from 'react';
import './interfacecreator.css';
import T from 'i18n-react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, FormControlLabel, Switch, IconButton, Dialog, DialogTitle, List, ListItem, ListItemText, Input } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { ORANGE, ACTION_FINALE } from 'src/utils/constants';
import IaCreator from '../iacreator/IaCreator';
import PageCreator from '../pagecreator/PageCreator';
import Interface from 'src/interfaces/Interface';
import Role from 'src/interfaces/Role';
import Action from 'src/interfaces/Action';

interface Props {
    interface: Interface
    roles: Array<Role>
    selectedRoles: Array<number>
    update: Function
    currentAction: Action
}
interface State {
    roleDialogOpen: boolean
}

class InterfaceCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            roleDialogOpen: false
        }
    }

    public handleChange(event: any, name: string, check?: boolean) {
        if (check) this.props.interface[name] = event.target.checked;
        else this.props.interface[name] = event.target.value;
        this.forceUpdate();
    }

    public handleClose() {
        this.setState({ roleDialogOpen: false });
    }

    public handleSelectRole(roleId: number) {
        this.props.interface.roleId = roleId;
        this.setState({ roleDialogOpen: false });
        this.props.update();
    }

    public isDisabled(roleId: number): boolean {
        if (roleId === this.props.interface.roleId) return false;
        return this.props.selectedRoles.indexOf(roleId) >= 0;
    }

    public render() {

        let selectedRole = this.props.roles.find((role) => { return role && this.props.interface.roleId === role.id });
        let contentStyle = this.props.interface.displayIa ? { gridTemplateColumns: '1fr 250px' } : { gridTemplateColumns: '1fr' };
        let roles: Array<Role> = [];
        this.props.selectedRoles.forEach((roleId, i) => {
            if (roleId !== this.props.interface.roleId) {
                if (roleId) {
                    roles.push(this.props.roles.find(role => { return role.id === roleId }));
                }
            }
        });

        return (
            <div className="interface-creator">
                <AppBar position="static" style={{ backgroundColor: "#424242", boxShadow: 'none', maxHeight: " 60px" }}>
                    <Toolbar variant="dense">
                        <h3 style={{ margin: "6px" }}>
                            {T.translate('generic.interfaceof')} {selectedRole ? selectedRole.name : '?????'}
                            <IconButton style={{ color: ORANGE }} aria-label="Edit" onClick={() => { this.setState({ roleDialogOpen: true }) }}>
                                <Edit />
                            </IconButton>
                        </h3>
                        <label>{T.translate('interface.cols')} : </label>
                        <Input
                            inputProps={{ min: "1" }}
                            type="number"
                            value={this.props.interface.cols}
                            style={{ color: "white", width: "2em", margin: "0 20px 0 5px" }}
                            onChange={event => { this.handleChange(event, 'cols') }}
                        />
                        <label>{T.translate('interface.rows')} : </label>
                        <Input
                            inputProps={{ min: "1" }}
                            type="number"
                            value={this.props.interface.rows}
                            style={{ color: "white", width: "2em", margin: "0 20px 0 5px" }}
                            onChange={event => { this.handleChange(event, 'rows') }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.interface.displayIa}
                                    value="displayIa"
                                    color="primary"
                                    onChange={(evt) => { this.handleChange(evt, "displayIa", true) }}
                                />
                            }
                            classes={{ label: "white" }}
                            label={T.translate('ia.activate')}
                        />
                    </Toolbar>
                </AppBar>
                {(this.props.currentAction && this.props.currentAction.id !== ACTION_FINALE) && <div className="interface-creator-content" style={contentStyle}>
                    {this.props.interface.displayIa && <IaCreator messages={this.props.interface.messages} />}
                    <PageCreator pages={this.props.interface.pages} hasIa={this.props.interface.displayIa} roles={roles} />
                </div>}
                {(this.props.currentAction && this.props.currentAction.id === ACTION_FINALE) && <div className="interface-creator-empty">
                    <span style={{ marginTop: "-20px" }}>{T.translate('generic.finished')}</span>
                </div>}
                <Dialog onClose={() => { this.handleClose() }} aria-labelledby="select-role-dialog" open={this.state.roleDialogOpen}>
                    <DialogTitle id="select-role-dialog">{T.translate('role.choose')}</DialogTitle>
                    <div>
                        <List>
                            {this.props.roles.map(role => (
                                <ListItem disabled={this.isDisabled(role.id)} selected={role.id === this.props.interface.roleId} button onClick={() => this.handleSelectRole(role.id)} key={role.id}>
                                    <ListItemText primary={role.name} secondary={role.soustitre} />
                                </ListItem>
                            ))}
                            <ListItem button onClick={() => this.handleSelectRole(null)}>
                                <ListItemText className="remove-red" primary={T.translate('role.none')} />
                            </ListItem>
                        </List>
                    </div>
                </Dialog>
            </div>
        );
    }
}
function mapStateToProps(state: any) {
    return {
        currentAction: state.story.action
    }
}

export default connect(mapStateToProps, {})(InterfaceCreator);