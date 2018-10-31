import * as React from 'react';
import './componentcreator.css';
import T from 'i18n-react';
import Page from 'src/interfaces/Page';
import { List, ListItem, ListItemText, Button, ListItemSecondaryAction, IconButton, Checkbox, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, OutlinedInput, TextField, DialogActions } from '@material-ui/core';
import { COMPONENTS_LIST } from 'src/utils/constants';
import Component from 'src/interfaces/Component';
import { Delete, Edit, Help } from '@material-ui/icons';
import { connect } from 'react-redux';
import Action from 'src/interfaces/Action';
import { displayConfirmDialog } from 'src/actions/snackbarActions';

interface Props {
    page: Page
    selectedAction: Action
    actions: Array<Action>
    displayConfirmDialog: Function
}

interface State {
    open: boolean
    selectedComponent: Component
    index: number
    stringParams: string
    paramsError: string
}

class ComponentCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
            selectedComponent: null,
            index: -1,
            stringParams: '',
            paramsError: ''
        }
    }

    public deleteComponent(i: number) {
        let component = this.props.page.components[i];
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('interface.page.deletecomponent') + ' ' + component.name + ' ?',
            confirm: () => {
                this.props.page.components.splice(i, 1);
                this.forceUpdate();
            }
        });
    }

    public newComponent() {
        let newComponent = null;
        if (this.props.page.components.length) {
            newComponent = new Component(this.props.page.components[this.props.page.components.length - 1].id + 1);
        } else {
            newComponent = new Component(1);
        }

        this.setState({
            selectedComponent: newComponent,
            open: true,
            stringParams: newComponent.getStringParams()
        });
    }

    public editComponent(i: number) {
        let selectedComponent = this.props.page.components[i].copy();
        this.setState({
            selectedComponent,
            index: i,
            open: true,
            stringParams: selectedComponent.getStringParams()
        });
    }

    public isChecked(cmp: Component) {
        if (this.props.selectedAction) {
            return Boolean(cmp.actionToDisplay.find(actionId => { return actionId === this.props.selectedAction.id }));
        } else {
            return false;
        }
    }

    public checkComponent(event: any, cmp: Component) {
        let actionId = this.props.selectedAction.id;
        if (this.isChecked(cmp)) {
            cmp.actionToDisplay.forEach((id, i) => {
                if (actionId === id) {
                    cmp.actionToDisplay.splice(i, 1);
                }
            });
        } else {
            cmp.actionToDisplay.push(actionId);
        }
        this.forceUpdate();
    }

    public onCancel() {
        this.setState({ selectedComponent: null, index: -1, open: false, stringParams: '', paramsError: '' });
    }

    public onClose() {
        let selectedComponent = this.state.selectedComponent;
        if (selectedComponent.setStringParams(this.state.stringParams)) {
            if (this.state.index >= 0) {
                this.props.page.components[this.state.index] = selectedComponent;
            } else {
                this.props.page.components.push(selectedComponent);
            }
            this.setState({ selectedComponent: null, index: -1, open: false, stringParams: '', paramsError: '' });
        } else {
            this.setState({ paramsError: T.translate('invalid.params').toString() });
        }
    }

    public handleChange(event: any, name: string) {
        let selectedComponent = this.state.selectedComponent;
        selectedComponent[name] = event.target.value;
        this.setState({ selectedComponent });
    }

    public showHelp(): void {
        // TODO
    }

    public handleParams(event: any) {
        this.setState({ stringParams: event.target.value });
    }

    public render() {
        return (
            <div className="component-creator">
                <List dense className="components-list">
                    {this.props.page.components.map((cmp: Component, i: number) => {
                        return (
                            <ListItem key={i} button onClick={event => { this.checkComponent(event, cmp) }}>
                                <Checkbox
                                    checked={this.isChecked(cmp)}
                                    value="checked"
                                    color="primary"
                                />
                                <ListItemText primary={cmp.name} secondary={'cols: ' + cmp.cols + ' - rows: ' + cmp.rows} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => { this.editComponent(i) }} aria-label="Delete">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => { this.deleteComponent(i) }} aria-label="Delete">
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
                <div className="component-buttons">
                    <Button size="small" color="primary" onClick={() => this.newComponent()}>{T.translate('interface.page.addcomponent')}</Button>
                </div>
                {this.state.selectedComponent && <Dialog open={this.state.open} onClose={() => { this.onCancel() }}>
                    <DialogTitle id="component-creator-modal">{T.translate('interface.page.modalcomponent.title') + ' ' + this.state.selectedComponent.name}</DialogTitle>
                    <Button onClick={() => this.showHelp()} mini variant="fab" color="primary" aria-label="Help" className="cmp-modal-help">
                        <Help />
                    </Button>
                    <DialogContent>
                        <FormControl style={{ marginTop: "10px" }} variant="outlined" fullWidth>
                            <InputLabel id="label-comptype" htmlFor="component-type">{T.translate('interface.page.modalcomponent.name')}</InputLabel>
                            <Select
                                fullWidth
                                value={this.state.selectedComponent.name}
                                onChange={event => { this.handleChange(event, 'name') }}
                                input={
                                    <OutlinedInput
                                        fullWidth
                                        labelWidth={145}
                                        name="name"
                                        id="outlined-name"
                                    />
                                } >
                                {COMPONENTS_LIST.map((cmpName, i) => {
                                    return (
                                        <MenuItem key={i} value={cmpName}>{cmpName}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <div>
                            <TextField
                                id="outlined-posX"
                                label={T.translate('interface.page.modalcomponent.posx')}
                                value={this.state.selectedComponent.cols}
                                onChange={event => this.handleChange(event, 'cols')}
                                margin="normal"
                                variant="outlined"
                                style={{ marginRight: '5px' }}
                            />
                            <TextField
                                id="outlined-posY"
                                label={T.translate('interface.page.modalcomponent.posy')}
                                value={this.state.selectedComponent.rows}
                                onChange={event => this.handleChange(event, 'rows')}
                                margin="normal"
                                variant="outlined"
                                style={{ marginLeft: '5px' }}
                            />
                        </div>
                        <FormControl style={{ marginTop: "10px" }} variant="outlined" fullWidth>
                            <InputLabel id="label-comptype" htmlFor="component-type">{T.translate('interface.page.modalcomponent.clickaction')}</InputLabel>
                            <Select
                                fullWidth
                                value={this.state.selectedComponent.clickAction}
                                onChange={event => { this.handleChange(event, 'clickAction') }}
                                input={
                                    <OutlinedInput
                                        fullWidth
                                        labelWidth={100}
                                        name="clickAction"
                                        id="outlined-clickAction"
                                    />
                                } >
                                {this.props.actions.map((action, i) => {
                                    return (
                                        <MenuItem key={i} value={action.id}>{action.name}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            id="outlined-multiline-params"
                            fullWidth
                            error={Boolean(this.state.paramsError)}
                            helperText={this.state.paramsError}
                            label={T.translate('interface.page.modalcomponent.params')}
                            multiline
                            rows="8"
                            rowsMax="10"
                            value={this.state.stringParams}
                            onChange={event => this.handleParams(event)}
                            margin="normal"
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.onCancel()} >
                            {T.translate('generic.cancel')}
                        </Button>
                        <Button onClick={() => this.onClose()} color="primary" autoFocus>
                            {T.translate('generic.validate')}
                        </Button>
                    </DialogActions>
                </Dialog >}
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        selectedAction: state.story.action,
        actions: state.story.story.actions
    }
}

export default connect(mapStateToProps, { displayConfirmDialog })(ComponentCreator);