import * as React from 'react';
import './componentcreator.css';
import T from 'i18n-react';
import Page from 'src/interfaces/Page';
import { List, ListItem, ListItemText, Button, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, OutlinedInput, TextField, DialogActions, FormHelperText, Switch } from '@material-ui/core';
import { DYNAMIC_COMPONENTS, PLACEMENT } from 'src/utils/constants';
import Component from 'src/interfaces/Component';
import { Delete, Edit, Help, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import { connect } from 'react-redux';
import Action from 'src/interfaces/Action';
import { displayConfirmDialog } from 'src/actions/snackbarActions';
import { syntaxHighlight, getSelectableActions } from 'src/utils/tools';

interface Props {
    page: Page
    currentAction: Action
    actions: Array<Action>
    displayConfirmDialog: Function
}

interface State {
    open: boolean
    selectedComponent: Component
    index: number
    stringParams: string
    paramsError: string
    typeError: string
    help: string
}

class ComponentCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
            selectedComponent: null,
            index: -1,
            stringParams: '',
            paramsError: '',
            typeError: '',
            help: ''
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
        let newId = 1;
        if (this.props.page.components.length) {
            while (this.props.page.components.find(cmp => { return cmp.id === newId })) {
                newId++;
            }
            newComponent = new Component(newId, "");
        } else {
            newComponent = new Component(1, "");
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
        if (this.props.currentAction) {
            return Boolean(cmp.actionToDisplay.find(actionId => { return actionId === this.props.currentAction.id }));
        } else {
            return false;
        }
    }

    public moveUp(i: number) {
        let components = this.props.page.components;
        if (i > 0) {
            let prevComp = components[i - 1];
            components[i - 1] = components[i];
            components[i] = prevComp;
            this.forceUpdate();
        }
    }

    public moveDown(i: number) {
        let components = this.props.page.components;
        if (i < (components.length - 1)) {
            let nextComp = components[i + 1];
            components[i + 1] = components[i];
            components[i] = nextComp;
            this.forceUpdate();
        }
    }

    public checkComponent(cmp: Component) {
        let actionId = this.props.currentAction.id;
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
        if (!selectedComponent.setStringParams(this.state.stringParams)) {
            this.setState({ paramsError: T.translate('invalid.params').toString() });
            return;
        }

        if (!selectedComponent.type) {
            this.setState({ typeError: T.translate('invalid.type').toString() });
            return;
        }

        if (this.state.index >= 0) {
            this.props.page.components[this.state.index] = selectedComponent;
        } else {
            this.props.page.components.push(selectedComponent);
        }
        this.setState({ selectedComponent: null, index: -1, open: false, stringParams: '', paramsError: '', typeError: '' });
    }

    public handleChange(event: any, name: string) {
        let selectedComponent = this.state.selectedComponent;
        selectedComponent[name] = event.target.value;
        this.setState({ selectedComponent });
    }

    public showHelp(type: string): void {
        this.setState({
            help: JSON.stringify(DYNAMIC_COMPONENTS[type].getParamModel(), undefined, 4)
        });
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
                            <ListItem key={i} button>
                                <div className="move-component">
                                    <KeyboardArrowUp className={i === 0 ? "comp-arrow-disabled" : "comp-arrow"} onClick={() => this.moveUp(i)} />
                                    <KeyboardArrowDown className={i === this.props.page.components.length - 1 ? "comp-arrow-disabled" : "comp-arrow"} onClick={() => this.moveDown(i)} />
                                </div>
                                <Switch
                                    checked={this.isChecked(cmp)}
                                    value="checked"
                                    color="primary"
                                    onClick={() => { this.checkComponent(cmp) }}
                                />
                                <ListItemText primary={cmp.name} secondary={'Type : ' + T.translate('gamecomponent.' + cmp.type) + ' | colonnes : ' + cmp.cols + ' - lignes : ' + cmp.rows} />
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
                    <Button disabled={!this.state.selectedComponent.type} onClick={() => this.showHelp(this.state.selectedComponent.type)} mini variant="fab" color="primary" aria-label="Help" className="cmp-modal-help">
                        <Help />
                    </Button>
                    <Dialog open={Boolean(this.state.help)} onClose={() => { this.setState({ help: '' }) }}>
                        <DialogTitle>{T.translate('interface.page.modalcomponent.help', { type: this.state.selectedComponent.type })}</DialogTitle>
                        <DialogContent>
                            <pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(this.state.help) }} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.setState({ help: '' })} >
                                {T.translate('generic.cancel')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <DialogContent>
                        <TextField
                            id="outlined-name"
                            style={{ marginTop: "10px" }}
                            label="Name"
                            fullWidth
                            value={this.state.selectedComponent.name}
                            onChange={event => { this.handleChange(event, 'name') }}
                            variant="outlined"
                        />
                        <FormControl style={{ marginTop: "20px" }} variant="outlined" fullWidth>
                            <InputLabel id="label-comptype" htmlFor="component-type">{T.translate('interface.page.modalcomponent.name')}</InputLabel>
                            <Select
                                fullWidth
                                error={Boolean(this.state.typeError)}
                                value={this.state.selectedComponent.type}
                                onChange={event => { this.handleChange(event, 'type') }}
                                input={
                                    <OutlinedInput
                                        fullWidth
                                        labelWidth={145}
                                        name="type"
                                        id="outlined-type"
                                    />
                                } >
                                {Object.keys(DYNAMIC_COMPONENTS).map((cmpType, i) => {
                                    return (
                                        <MenuItem key={i} value={cmpType}>{T.translate('gamecomponent.' + cmpType)}</MenuItem>
                                    );
                                })}
                            </Select>
                            {Boolean(this.state.typeError) && <FormHelperText style={{ color: "#f44336", marginBottom: "10px" }}>{this.state.typeError}</FormHelperText>}
                        </FormControl>
                        <div className="component-input-inline">
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
                            <FormControl className="placement" variant="outlined">
                                <InputLabel id="label-place" htmlFor="component-place">{T.translate('interface.page.modalcomponent.place')}</InputLabel>
                                <Select
                                    displayEmpty
                                    value={this.state.selectedComponent.position}
                                    onChange={event => { this.handleChange(event, 'position') }}
                                    input={
                                        <OutlinedInput
                                            labelWidth={80}
                                            name="position"
                                            id="component-place"
                                        />
                                    } >
                                    {PLACEMENT.map((p, i) => {
                                        return (
                                            <MenuItem key={i} value={p}>{T.translate('generic.placement.' + p)}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                        <FormControl style={{ marginTop: "10px" }} variant="outlined" fullWidth>
                            <InputLabel shrink id="label-step" htmlFor="outlined-clickAction">{T.translate('interface.page.modalcomponent.clickaction')}</InputLabel>
                            <Select
                                fullWidth
                                displayEmpty
                                value={this.state.selectedComponent.clickAction}
                                onChange={event => { this.handleChange(event, 'clickAction') }}
                                input={
                                    <OutlinedInput
                                        fullWidth
                                        notched
                                        labelWidth={95}
                                        name="clickAction"
                                        id="outlined-clickAction"
                                    />
                                } >
                                <MenuItem value=''><i style={{ opacity: 0.5 }}>{T.translate('action.none')}</i></MenuItem>
                                {getSelectableActions(this.props.actions, this.props.currentAction).map((action, i) => {
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
        currentAction: state.story.action,
        actions: state.story.story.actions
    }
}

export default connect(mapStateToProps, { displayConfirmDialog })(ComponentCreator);