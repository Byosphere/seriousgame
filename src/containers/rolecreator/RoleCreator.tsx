import * as React from 'react';
import './rolecreator.css';
import T from 'i18n-react';
import { saveRoles } from 'src/utils/api';
import { Card, CardHeader, TextField, IconButton, InputAdornment, List, ListItem, ListItemText, ListItemSecondaryAction, Menu, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Chip, Tooltip } from '@material-ui/core';
import { Save, Brightness1, PersonAdd, MoreVert, PlaylistAdd } from '@material-ui/icons';
import { connect } from 'react-redux';
import { displaySnackbar, displayConfirmDialog } from 'src/actions/snackbarActions';
import Role from 'src/interfaces/Role';
import Story from 'src/interfaces/Story';
import RoleCard from 'src/components/rolecard/RoleCard';
import { DARK, LIGHT } from 'src/utils/constants';

interface Props {
    roles: Array<Role>
    displaySnackbar: Function
    stories: Array<Story>
    displayConfirmDialog: Function
}

interface State {
    saving: boolean
    menuEl: Array<any>
    selectedRole: Role
}

class RoleCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            saving: false,
            menuEl: [],
            selectedRole: this.props.roles[0]
        };
    }

    public handleChange(event: any, name: string) {
        this.state.selectedRole[name] = event.target.value;
        this.forceUpdate();
    }

    public addRole() {
        let id = 0;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (this.props.roles.find(role => { return role.id === id }));
        this.props.roles.push(new Role(id, T.translate('role.new').toString()));
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

    public deleteRole(event: any, i: number): any {
        setTimeout(() => {
            let menuEl = this.state.menuEl;
            menuEl[i] = null;
            this.setState({ menuEl });
        }, 2);
        event.stopPropagation();
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('role.deletewarning'),
            confirm: () => {
                this.props.roles.splice(i, 1);
                this.save();
            }
        });
    }
    public duplicateRole(event: any, role: Role): any {
        let id = 0;
        do {
            id = Math.floor(Math.random() * 100000);
        } while (this.props.roles.find(role => { return role.id === id }));
        let duplicate = role.copy(id);
        this.props.roles.push(duplicate);
        this.selectRole(duplicate);
    }

    public closeMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = null;
        this.setState({ menuEl });
    }

    public openMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = event.currentTarget;
        this.setState({ menuEl });
    }

    public selectRole(role: Role): any {
        this.setState({ selectedRole: role });
    }

    public render() {

        let selectedRoleId = this.state.selectedRole.id
        let stories: Array<Story> = [];
        this.props.stories.forEach(story => {
            let int = story.interfaces.find(int => { return int.roleId === selectedRoleId });
            if (int) stories.push(story);
        });

        return (
            <div className="role-creator">
                <Card className="role-list">
                    <CardHeader
                        title={T.translate('role.list')}
                        component="h2"
                        action={
                            <div>
                                <Tooltip title={T.translate('role.save')}>
                                    <IconButton onClick={() => this.save()} disabled={this.state.saving}>
                                        <Save />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={T.translate('role.create')}>
                                    <IconButton onClick={() => this.addRole()}>
                                        <PersonAdd />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }
                    />
                    <List dense>
                        {this.props.roles.length === 0 && <ListItem style={{ opacity: 0.5 }}>
                            <ListItemText primary={T.translate('role.norole')} />
                        </ListItem>}
                        {this.props.roles.map((role, i) => {
                            if (role) return (
                                <ListItem onClick={() => { this.selectRole(role) }} selected={this.state.selectedRole && this.state.selectedRole.id === role.id} button key={i}>
                                    <ListItemText primary={role.name} />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-owns={this.state.menuEl ? 'menu ' + role.name : null} onClick={event => { this.openMenu(event, i) }} aria-label="More" aria-haspopup="true">
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                        <Menu
                                            id={"menu " + role.name}
                                            anchorEl={this.state.menuEl[i]}
                                            open={Boolean(this.state.menuEl[i])}
                                            onClose={event => { this.closeMenu(event, i) }}
                                        >
                                            <MenuItem onClick={event => { this.duplicateRole(event, role) }}>{T.translate('generic.duplicate')}</MenuItem>
                                            <MenuItem onClick={event => { this.deleteRole(event, i) }}>{T.translate('generic.delete')}</MenuItem>
                                        </Menu>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                            else return null;
                        })}
                    </List>
                </Card>
                <Card className="role-editor" style={{ padding: "24px" }}>
                    <h2 style={{ paddingBottom: "10px" }}>{T.translate('role.edit', { name: this.state.selectedRole.name })}</h2>
                    {stories.map((story, i) => {
                        return (
                            <Chip
                                key={i}
                                icon={<PlaylistAdd />}
                                label={story.name}
                                color="primary"
                                style={{ margin: "2px" }}
                            />
                        );
                    })}
                    <TextField
                        id="name"
                        label={T.translate('role.name')}
                        value={this.state.selectedRole.name}
                        onChange={evt => this.handleChange(evt, 'name')}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        id="soustitre"
                        label={T.translate('role.soustitre')}
                        value={this.state.selectedRole.soustitre}
                        onChange={evt => this.handleChange(evt, 'soustitre')}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        id="description"
                        label={T.translate('role.description')}
                        value={this.state.selectedRole.description}
                        onChange={evt => this.handleChange(evt, 'description')}
                        margin="normal"
                        variant="outlined"
                        helperText={T.translate('role.helper.desc')}
                        fullWidth
                        multiline
                    />
                    <TextField
                        id="color"
                        label={T.translate('role.color')}
                        value={this.state.selectedRole.color}
                        onChange={evt => this.handleChange(evt, 'color')}
                        margin="normal"
                        variant="outlined"
                        helperText={T.translate('role.helper.color')}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Brightness1 style={{ color: this.state.selectedRole.color }} /></InputAdornment>,
                        }}
                    />
                    <FormControl style={{ margin: "16px 0 8px 0" }} fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-theme">{T.translate('role.theme')}</InputLabel>
                        <Select
                            value={this.state.selectedRole.theme}
                            onChange={evt => this.handleChange(evt, 'theme')}
                            input={
                                <OutlinedInput
                                    labelWidth={130}
                                    name="age"
                                    id="outlined-theme"
                                    fullWidth
                                />
                            }
                        >
                            <MenuItem value={DARK}>{T.translate('generic.dark')}</MenuItem>
                            <MenuItem value={LIGHT}>{T.translate('generic.light')}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="image"
                        label={T.translate('role.image')}
                        value={this.state.selectedRole.image}
                        onChange={evt => this.handleChange(evt, 'image')}
                        margin="normal"
                        variant="outlined"
                        helperText={T.translate('role.helper.img')}
                        fullWidth
                    />
                </Card>
                <div className="role-render">
                    <RoleCard editor role={this.state.selectedRole} />
                </div>
            </div>
        );
    }
}


export default connect(null, { displaySnackbar, displayConfirmDialog })(RoleCreator);