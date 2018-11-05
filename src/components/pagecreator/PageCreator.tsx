import * as React from 'react';
import './pagecreator.css';
import T from 'i18n-react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField, Button, FormControl, FormControlLabel, Radio, MenuItem, IconButton, Menu } from '@material-ui/core';
import { ExpandMore, MoreVert, LibraryAdd } from '@material-ui/icons';
import Action from 'src/interfaces/Action';
import { connect } from 'react-redux';
import Page from 'src/interfaces/Page';
import Component from 'src/interfaces/Component';
import { displayConfirmDialog, displaySnackbar } from 'src/actions/snackbarActions';
import ComponentCreator from '../componentcreator/ComponentCreator';

interface Props {
    pages: Array<Page>
    selectedAction: Action
    displayConfirmDialog: Function
    displaySnackbar: Function
    hasIa: boolean
}

interface State {
    selectedPage: number
    selectedComponent: Array<Component>
    menuEl: Array<any>
}

class PageCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPage: 0,
            selectedComponent: [],
            menuEl: []
        }
    }

    public onChangeRadio(evt: any, index: number) {
        let currentAction = this.props.selectedAction.id;
        let currentPage = this.props.pages[index];

        if (currentPage.actionToDisplay.indexOf(currentAction) === -1) {
            this.props.pages.forEach(page => {
                let i = page.actionToDisplay.indexOf(currentAction);
                if (i > -1) page.actionToDisplay.splice(i, 1);
            });
            currentPage.actionToDisplay.push(currentAction);
        } else {
            currentPage.actionToDisplay.splice(currentPage.actionToDisplay.indexOf(currentAction), 1);
        }
        this.forceUpdate();
    }

    public addPage() {
        let id: number = 0;
        if (this.props.pages.length) {
            id = this.props.pages[this.props.pages.length - 1].id + 1;
        }
        this.props.pages.push(new Page(id));
        this.forceUpdate();
        this.props.displaySnackbar(T.translate('interface.page.pageadded'));
    }

    public deletePage(event: any, i: number) {
        setTimeout(() => {
            let menuEl = this.state.menuEl;
            menuEl[i] = null;
            this.setState({ menuEl });
        }, 2);
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

    public openMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = event.currentTarget;
        this.setState({ menuEl });
    }

    public closeMenu(event: any, id: number) {
        event.stopPropagation();
        let menuEl = this.state.menuEl;
        menuEl[id] = null;
        this.setState({ menuEl });
    }

    public duplicatePage(event: any, i: number) {
        this.closeMenu(event, i);
        let page = this.props.pages[i].copy();
        page.id = this.props.pages[this.props.pages.length - 1].id + 1;
        this.props.pages.push(page);
        this.forceUpdate();
    }

    public onChange(event: any, name: string, page: Page) {
        page[name] = event.target.value;
        this.forceUpdate();
    }

    public render() {
        return (
            <div className="page-creator">
                {this.props.pages.map((page, i) => {
                    let selected = Boolean(this.props.selectedAction && this.props.pages[i].actionToDisplay.length && this.props.pages[i].actionToDisplay.indexOf(this.props.selectedAction.id) > -1);
                    return (
                        <ExpansionPanel key={i} className={selected ? 'on' : 'off'}>
                            <ExpansionPanelSummary style={{ paddingLeft: '0' }} className="panel-summary" expandIcon={<ExpandMore />}>
                                <div>
                                    <IconButton aria-owns={this.state.menuEl ? 'menu' + i : null} onClick={event => { this.openMenu(event, i) }} aria-label="More" aria-haspopup="true">
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        id={"menu" + i}
                                        anchorEl={this.state.menuEl[i]}
                                        open={Boolean(this.state.menuEl[i])}
                                        onClose={event => { this.closeMenu(event, i); }}
                                    >
                                        <MenuItem onClick={event => { this.duplicatePage(event, i) }}>{T.translate('generic.duplicate')}</MenuItem>
                                        <MenuItem onClick={event => { this.deletePage(event, i) }}>{T.translate('generic.delete')}</MenuItem>
                                    </Menu>
                                    <Typography style={{ display: 'inline-block', marginLeft: '5px' }}>{T.translate('generic.page') + ' ' + (i + 1)}</Typography>
                                </div>
                                <FormControl onClick={evt => evt.stopPropagation()} component="fieldset">
                                    <FormControlLabel
                                        value={i.toString()}
                                        control={<Radio onClick={evt => { this.onChangeRadio(evt, i) }} checked={selected} name="page-action" color="primary" />}
                                        label={T.translate('interface.action')}
                                        labelPlacement="end"
                                    /></FormControl>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                                <p style={{ fontSize: "0.9rem", marginTop: "0", opacity: 0.7 }}>
                                    {T.translate('interface.page.informations')}
                                </p>
                                <div>
                                    <TextField
                                        id="cols-number"
                                        label={T.translate('interface.cols')}
                                        value={page.cols}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{ min: "0" }}
                                        margin="normal"
                                        onChange={event => { this.onChange(event, 'cols', page) }}
                                    />
                                    <TextField
                                        id="rows-number"
                                        label={T.translate('interface.rows')}
                                        value={page.rows}
                                        type="number"
                                        inputProps={{ min: "0" }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        onChange={event => { this.onChange(event, 'rows', page) }}
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
                                    onChange={event => { this.onChange(event, 'background', page) }}
                                />
                                <div className="components-wrapper">
                                    <fieldset>
                                        <legend>{T.translate('interface.components')}</legend>
                                        <ComponentCreator page={page} />
                                    </fieldset>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
                <div className={this.props.hasIa ? "float-button withIa" : "float-button"}>
                    <Button onClick={() => { this.addPage() }} variant="fab" color="primary"><LibraryAdd /></Button>
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

export default connect(mapStateToProps, { displayConfirmDialog, displaySnackbar })(PageCreator);