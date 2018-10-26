import * as React from 'react';
import './pagecreator.css';
import T from 'i18n-react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField, Button, FormControl, FormControlLabel, Radio, List, ListItem, ListItemIcon, ListItemText, InputLabel, Select, MenuItem, IconButton, Menu } from '@material-ui/core';
import { ExpandMore, Add, MoreVert } from '@material-ui/icons';
import { COMPONENTS_LIST } from 'src/utils/constants';
import Action from 'src/interfaces/Action';
import { connect } from 'react-redux';
import Page from 'src/interfaces/Page';
import Component from 'src/interfaces/Component';
import { displayConfirmDialog } from 'src/actions/snackbarActions';

interface Props {
    pages: Array<Page>
    selectedAction: Action
    displayConfirmDialog: Function
}

interface State {
    selectedPage: number
    selectedComponent: Array<Component>
    menuEl: any
}

class PageCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPage: 0,
            selectedComponent: [],
            menuEl: null
        }
    }

    public onChangeRadio(evt: any, index: number) {
        if (this.props.selectedAction) {
            this.props.pages[index].actionToDisplay = this.props.selectedAction.id;
        } else {
            this.props.pages[index].actionToDisplay = null;
        }

        this.forceUpdate();
    }

    public selectComponent(i: number, cmp: Component) {
        let selectedComponent = this.state.selectedComponent;
        selectedComponent[i] = cmp;
        this.setState({ selectedComponent });
    }

    public addPage() {
        let id: number = 0;
        if (this.props.pages.length) {
            id = this.props.pages[this.props.pages.length - 1].id + 1;
        }
        this.props.pages.push(new Page(id));
        this.forceUpdate();
    }

    handleChange(event: any, arg1: string): any {
        // TODO
    }

    public handleMenuClose() {
        this.setState({ menuEl: null });
    }

    public deletePage(event: any, i: number) {
        setTimeout(() => { this.setState({ menuEl: null }) }, 2);
        event.stopPropagation();
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('interface.page.deletewarning'),
            confirm: () => {
                this.props.pages.splice(i, 1);
                this.forceUpdate();
            }
        });
    }

    public duplicatePage(event: any, i: number) {
        //this.handleMenuClose();
        event.stopPropagation();
    }

    public render() {
        return (
            <div className="page-creator">
                {this.props.pages.map((page, i) => {

                    let selected = false;
                    if (this.props.pages[i].actionToDisplay && this.props.selectedAction && this.props.pages[i].actionToDisplay === this.props.selectedAction.id) {
                        selected = true;
                    }
                    if (!this.props.pages[i].actionToDisplay && !this.props.selectedAction) {
                        selected = true;
                    }

                    return (
                        <ExpansionPanel key={i} className={selected ? 'on' : 'off'}>
                            <ExpansionPanelSummary style={{ paddingLeft: '0' }} className="panel-summary" expandIcon={<ExpandMore />}>
                                <div>
                                    <IconButton aria-owns={this.state.menuEl ? 'menu' + i : null} onClick={event => { event.stopPropagation(); this.setState({ menuEl: event.currentTarget }) }} aria-label="More" aria-haspopup="true">
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        id={"menu" + i}
                                        anchorEl={this.state.menuEl}
                                        open={Boolean(this.state.menuEl)}
                                        onClose={event => { event.stopPropagation(); this.handleMenuClose(); }}
                                    >
                                        <MenuItem onClick={event => { this.duplicatePage(event, i) }}>{T.translate('interface.page.duplicate')}</MenuItem>
                                        <MenuItem onClick={event => { this.deletePage(event, i) }}>{T.translate('interface.page.delete')}</MenuItem>
                                    </Menu>
                                    <Typography style={{ display: 'inline-block', marginLeft: '5px' }}>{T.translate('generic.page') + ' ' + (i + 1)}</Typography>
                                </div>
                                <FormControl component="fieldset">
                                    <FormControlLabel
                                        value={i.toString()}
                                        control={<Radio onChange={evt => { this.onChangeRadio(evt, i) }} checked={selected} name="page-action" color="primary" />}
                                        label={T.translate('interface.action')}
                                        labelPlacement="end"
                                    /></FormControl>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                                <div>
                                    <TextField
                                        id="cols-number"
                                        label={T.translate('interface.cols')}
                                        value={page.cols}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                    <TextField
                                        id="rows-number"
                                        label={T.translate('interface.rows')}
                                        value={page.rows}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        style={{ marginLeft: "10px" }}
                                    />
                                </div>
                                <TextField
                                    id="background"
                                    label={T.translate('interface.background')}
                                    value={page.background}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <div className="components-wrapper">
                                    <fieldset>
                                        <legend>{T.translate('interface.components')}</legend>
                                        <div>
                                            <List dense className="components-list">
                                                {page.components.map((cmp: Component, i: number) => {
                                                    return (
                                                        <ListItem key={i} selected={this.state.selectedComponent[i] && this.state.selectedComponent[i].id === cmp.id} onClick={() => { this.selectComponent(i, cmp) }} button>
                                                            <ListItemText primary={cmp.name} secondary={'cols: ' + cmp.cols + ' - rows: ' + cmp.rows} />
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                            <div className="component-element">
                                                {this.state.selectedComponent[i] && <FormControl>
                                                    <InputLabel htmlFor="component-type">{T.translate('interface.comptype')}</InputLabel>
                                                    <Select
                                                        value={this.state.selectedComponent[i].name}
                                                        onChange={event => { this.handleChange(event, 'name') }}
                                                        inputProps={{
                                                            name: 'component-type',
                                                            id: 'component-type',
                                                        }}
                                                    >
                                                        {COMPONENTS_LIST.map(cmpName => {
                                                            return (
                                                                <MenuItem value={cmpName}>{cmpName}</MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                </FormControl>}
                                            </div>
                                            <div className="component-buttons">
                                                <Button size="small" color="primary" style={{ marginRight: "5px" }}>Nouveau</Button>
                                                <Button size="small" color="primary">Supprimer</Button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
                <div className="float-button">
                    <Button onClick={() => { this.addPage() }} variant="extendedFab" color="primary"><Add style={{ marginRight: "5px" }} /> {T.translate('generic.addpage')}</Button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        selectedAction: state.story.action
    }
}

export default connect(mapStateToProps, { displayConfirmDialog })(PageCreator);