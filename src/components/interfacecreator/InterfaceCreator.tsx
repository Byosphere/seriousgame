import * as React from 'react';
import './interfacecreator.css';
import T from 'i18n-react';
import { AppBar, Toolbar, FormControlLabel, Switch, IconButton, Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { Role } from 'src/interfaces/Role';
import { Edit } from '@material-ui/icons';
import { ORANGE } from 'src/utils/constants';

interface Props {
    interface: Interface
    roles: Array<Role>
    selectedRoles: Array<number>
    update: Function
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

    public handleChange(event: any, name: string) {
        this.props.interface[name] = event.target.checked;
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

        return (
            <div className="interface-creator">
                <AppBar position="static" style={{ backgroundColor: "#424242", boxShadow: 'none' }}>
                    <Toolbar variant="dense">
                        <h3 style={{ margin: "6px" }}>
                            {T.translate('generic.interfaceof')} {selectedRole ? selectedRole.name : '?????'}
                            <IconButton style={{ color: ORANGE }} aria-label="Edit" onClick={() => { this.setState({ roleDialogOpen: true }) }}>
                                <Edit />
                            </IconButton>
                        </h3>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.interface.displayIa}
                                    value="displayIa"
                                    color="primary"
                                    onChange={(evt) => { this.handleChange(evt, "displayIa") }}
                                />
                            }
                            classes={{ label: "white" }}
                            label={T.translate('ia.activate')}
                        />
                    </Toolbar>
                </AppBar>
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

export default InterfaceCreator;