import * as React from 'react';
import './interfacecreator.css';
import T from 'i18n-react';
import { AppBar, Toolbar, FormControlLabel, Switch, IconButton } from '@material-ui/core';
import { Role } from 'src/interfaces/Role';
import { Edit } from '@material-ui/icons';
import { ORANGE } from 'src/utils/constants';

interface Props {
    interface: Interface
    roles: Array<Role>
}
interface State { }

class InterfaceCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public handleChange(event: any, name: string) {
        this.props.interface[name] = event.target.checked;
        this.forceUpdate();
    }

    public render() {

        let selectedRole = this.props.roles.find((role) => { return role && this.props.interface.roleId === role.id });

        return (
            <div className="interface-creator">
                <AppBar position="static" style={{ backgroundColor: "#424242", boxShadow: 'none' }}>
                    <Toolbar variant="dense">
                        <h3 style={{margin: "6px"}}>
                            {T.translate('generic.interfaceof')} {selectedRole ? selectedRole.name : '?????'}
                            <IconButton style={{color: ORANGE}} aria-label="Edit">
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
            </div>
        );
    }
}

export default InterfaceCreator;