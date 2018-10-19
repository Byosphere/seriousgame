import * as React from 'react';
import './rolecreator.css';
import T from 'i18n-react';
import { Role } from 'src/interfaces/Role';
import { loadRoles, saveRoles } from 'src/utils/api';
import { Card, Table, TableRow, TableCell, TableBody, CardHeader, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { Save, Create, Delete, Brightness1 } from '@material-ui/icons';

interface Props { }

interface State {
    roles: Array<Role>
    selectedRole: Role
    saving: boolean
}

class RoleCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            roles: [],
            selectedRole: null,
            saving: false
        };

        loadRoles((roles: Array<Role>) => {
            this.setState({
                roles: roles.filter(el => el != null)
            });
        });
    }

    public select(role: Role) {
        this.setState({ selectedRole: role });
    }

    public handleChange(event: any, name: string) {
        let selectedRole = this.state.selectedRole;
        selectedRole[name] = event.target.value;
        this.setState({
            selectedRole
        });
    }

    public addRole() {
        let roles = this.state.roles;
        let id = 0;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (roles.find(role => { return role.id === id }));

        roles[id] = {
            id: id,
            name: "",
            description: "",
            color: "",
            disabled: false,
            soustitre: "",
            image: ""
        }
        this.setState({ roles: roles.filter(el => el != null) });
    }

    public save() {
        this.setState({ saving: true });
        saveRoles(this.state.roles, (err: any) => {
            console.log(err);
            this.setState({ saving: false });
        });
    }

    public delete(i: number) {
        let roles = this.state.roles;
        roles[i] = null;
        this.setState({
            roles: roles.filter(el => el != null)
        });
    }

    public render() {
        return (
            <div className="role-creator">
                <Card className="list" style={{ gridColumn: '1 / 3', marginRight: '5px' }}>
                    <CardHeader
                        title={T.translate('role.list')}
                        component="h2"
                        action={
                            <div>
                                <IconButton onClick={() => this.save()} disabled={this.state.saving}>
                                    <Save />
                                </IconButton>
                                <IconButton onClick={() => this.addRole()}>
                                    <Create />
                                </IconButton>
                            </div>
                        }
                    />
                    <div className="table-wrapper">
                        <Table>
                            <TableBody>
                                {this.state.roles.map((role, i) => {
                                    return (<TableRow hover key={role.id} onClick={() => { this.select(role) }}>
                                        <TableCell style={{ width: '200px' }} component="th" scope="row">
                                            <TextField
                                                id="name"
                                                label={T.translate('role.name')}
                                                value={role.name}
                                                onChange={evt => this.handleChange(evt, 'name')}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell scope="row">
                                            <TextField
                                                id="soustitre"
                                                label={T.translate('role.soustitre')}
                                                value={role.soustitre}
                                                onChange={evt => this.handleChange(evt, 'soustitre')}
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell scope="row">
                                            <TextField
                                                id="description"
                                                label={T.translate('role.description')}
                                                value={role.description}
                                                onChange={evt => this.handleChange(evt, 'description')}
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell scope="row">
                                            <TextField
                                                id="color"
                                                label={T.translate('role.color')}
                                                value={role.color}
                                                onChange={evt => this.handleChange(evt, 'color')}
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><Brightness1 style={{ color: role.color }} /></InputAdornment>,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell scope="row">
                                            <TextField
                                                id="image"
                                                label={T.translate('role.image')}
                                                value={role.image}
                                                onChange={evt => this.handleChange(evt, 'image')}
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => this.delete(i)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        );
    }
}

export default RoleCreator;