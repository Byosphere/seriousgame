import * as React from 'react';
import './pagecreator.css';
import T from 'i18n-react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, TextField, Button, FormControl, FormControlLabel, Radio, List, ListItem, ListItemIcon, ListItemText, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { COMPONENTS_LIST } from 'src/utils/constants';
import Action from 'src/interfaces/Action';
import { connect } from 'react-redux';
import Page from 'src/interfaces/Page';

interface Props {
    pages: Array<Page>
    selectedAction: Action
}

interface State {
    selectedPage: number
    selectedComponent: Array<Component>
}

class PageCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPage: 0,
            selectedComponent: []
        }
    }

    public onChangeRadio(evt: any, index: number) {
        if(this.props.selectedAction) {
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

    handleChange(event: any, arg1: string): any {
        // TODO
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
                        <ExpansionPanel key={i} className={this.state.selectedPage === i ? 'on' : 'off'}>
                            <ExpansionPanelSummary className="panel-summary" expandIcon={<ExpandMore />}>
                                <Typography>{T.translate('generic.page') + ' ' + (i + 1)}</Typography>
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
                                <div className="page-buttons">
                                    <Button color="primary" variant="outlined" size="small" style={{ marginRight: "5px" }}>Dupliquer</Button>
                                    <Button color="primary" variant="outlined" size="small">Supprimer</Button>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        selectedAction: state.story.action
    }
}

export default connect(mapStateToProps, {})(PageCreator);