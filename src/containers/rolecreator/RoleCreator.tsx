import * as React from 'react';
import './rolecreator.css';
import T from 'i18n-react';
import { saveRoles } from 'src/utils/api';
import { Card, Table, TableRow, TableCell, TableBody, CardHeader, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { Save, Delete, Brightness1, PersonAdd } from '@material-ui/icons';
import { connect } from 'react-redux';
import { displaySnackbar } from 'src/actions/snackbarActions';
import Role from 'src/interfaces/Role';

interface Props {
    roles: Array<Role>
    displaySnackbar: Function
}

interface State {
    saving: boolean
}

class RoleCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            saving: false
        };
    }

    public handleChange(event: any, index: number, name: string) {
        this.props.roles[index][name] = event.target.value;
        this.forceUpdate();
    }

    public addRole() {
        let id = 0;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (this.props.roles.find(role => { return role.id === id }));
        this.props.roles.push(new Role(id, ''));
        this.forceUpdate();
    }

    public save() {
        this.setState({ saving: true });
        let rolesData: Array<RoleData> = [];
        this.props.roles.forEach(role => {
            rolesData.push(role.toJsonData());
        });
        saveRoles(rolesData, (err: any) => {
            this.props.displaySnackbar(T.translate('role.saved').toString());
            this.setState({ saving: false });
        });
    }

    public delete(i: number) {
        this.props.roles.splice(i, 1);
        this.forceUpdate();
    }

    public render() {
        return (
            <div className="role-creator">
                <Card className="list" style={{ gridColumn: '1 / 3' }}>
                    <CardHeader
                        title={T.translate('role.list')}
                        component="h2"
                        action={
                            <div>
                                <IconButton onClick={() => this.save()} disabled={this.state.saving}>
                                    <Save />
                                </IconButton>
                                <IconButton onClick={() => this.addRole()}>
                                    <PersonAdd />
                                </IconButton>
                            </div>
                        }
                    />
                    <div className="table-wrapper">
                        {!this.props.roles.length && <p className="no-role">{T.translate('role.no-role')}</p>}
                        <Table>
                            <TableBody>
                                {this.props.roles.map((role, i) => {
                                    return (<TableRow hover key={role.id}>
                                        <TableCell style={{ width: '200px' }} component="th" scope="row">
                                            <TextField
                                                id="name"
                                                label={T.translate('role.name')}
                                                value={role.name}
                                                onChange={evt => this.handleChange(evt, i, 'name')}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell scope="row">
                                            <TextField
                                                id="soustitre"
                                                label={T.translate('role.soustitre')}
                                                value={role.soustitre}
                                                onChange={evt => this.handleChange(evt, i, 'soustitre')}
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
                                                onChange={evt => this.handleChange(evt, i, 'description')}
                                                margin="normal"
                                                variant="outlined"
                                                fullWidth
                                                multiline
                                            />
                                        </TableCell>
                                        <TableCell scope="row" className="colors">
                                            <TextField
                                                id="color"
                                                label={T.translate('role.color')}
                                                value={role.color}
                                                onChange={evt => this.handleChange(evt, i, 'color')}
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
                                                onChange={evt => this.handleChange(evt, i, 'image')}
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

export default connect(null, { displaySnackbar })(RoleCreator);