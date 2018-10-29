import * as React from 'react';
import './componentcreator.css';
import T from 'i18n-react';
import Page from 'src/interfaces/Page';
import { List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Button, ListItemSecondaryAction, IconButton, TextField, Input } from '@material-ui/core';
import { COMPONENTS_LIST } from 'src/utils/constants';
import Component from 'src/interfaces/Component';
import { Delete } from '@material-ui/icons';

interface Props {
    page: Page
}

interface State {
    selectedComponent: Component
}

class ComponentCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedComponent: props.page.components.length ? props.page.components[0] : null
        }
    }

    public selectComponent(i: number, cmp: Component) {
        this.setState({ selectedComponent: cmp });
    }

    public deleteComponent(i: number): any {
        let component = this.props.page.components[i];
        this.props.page.components.splice(i, 1);
        if (component.id === this.state.selectedComponent.id) {
            this.setState({ selectedComponent: null });
        } else {
            this.forceUpdate();
        }
    }

    public handleChange(event: any, name: string) {
        //throw new Error("Method not implemented.");
    }

    public render() {
        return (
            <div className="component-creator">
                <List dense className="components-list">
                    {this.props.page.components.map((cmp: Component, i: number) => {
                        return (
                            <ListItem key={i} selected={this.state.selectedComponent && this.state.selectedComponent.id === cmp.id} onClick={() => { this.selectComponent(i, cmp) }} button>
                                <ListItemText primary={cmp.name} secondary={'cols: ' + cmp.cols + ' - rows: ' + cmp.rows} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => { this.deleteComponent(i) }} aria-label="Delete">
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
                <div className="component-element">
                    {this.state.selectedComponent && <div>
                        <FormControl>
                            <InputLabel htmlFor="component-type">{T.translate('interface.comptype')}</InputLabel>
                            <Select
                                value={this.state.selectedComponent.name}
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
                        </FormControl>
                    </div>}
                </div>
                <div className="component-buttons">
                    <Button size="small" color="primary" style={{ marginRight: "5px" }}>{T.translate('interface.page.addcomponent')}</Button>
                </div>
            </div>
        );
    }
}

export default ComponentCreator;