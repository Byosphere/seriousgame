import * as React from 'react';
import './playerinterfaces.css';
import T from 'i18n-react';
import { Card, Tabs, Tab, AppBar, Toolbar, FormControlLabel, Switch, InputBase } from '@material-ui/core';
import { Story } from 'src/interfaces/Story';
import InterfaceCreator from '../interfacecreator/InterfaceCreator';
import { Role } from 'src/interfaces/Role';

interface Props {
    story: Story
    roles: Array<Role>
}

interface State {
    tab: number
}

class PlayerInterfaces extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            tab: 0,
        }
    }

    public createInterface(): Interface {
        return {
            roleId: null,
            cols: 1,
            rows: 1,
            pages: [],
            displayIa: true
        }
    }

    public handleChange(value: number) {
        this.setState({ tab: value });
    }

    public getTabs(): Array<String> {
        let tabs = [];
        for (let index = 0; index < this.props.story.nbPlayers; index++) {
            tabs.push(T.translate('player.player').toString() + ' ' + (index + 1));
        }
        return tabs;
    }

    public render() {

        if(!this.props.story.interfaces[this.state.tab]) {
            this.props.story.interfaces[this.state.tab] = this.createInterface();
        }

        return (
            <Card className="player-interfaces">
                <Tabs
                    onChange={(event, value) => { this.handleChange(value) }}
                    value={this.state.tab}
                    indicatorColor="primary"
                    textColor="primary">
                    {this.getTabs().map((t, i) => {
                        return (<Tab key={i} label={t} />);
                    })}
                </Tabs>
                <InterfaceCreator interface={this.props.story.interfaces[this.state.tab]} roles={this.props.roles} />
            </Card>
        );
    }
}

export default PlayerInterfaces;