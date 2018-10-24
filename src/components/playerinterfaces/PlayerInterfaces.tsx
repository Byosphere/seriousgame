import * as React from 'react';
import './playerinterfaces.css';
import T from 'i18n-react';
import { Card, Tabs, Tab } from '@material-ui/core';
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
            tab: 0
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

    public getSelectedRoles() {
        let selectedRoles: Array<number> = [];
        this.props.story.interfaces.forEach(i => {
            selectedRoles.push(i.roleId);
        });
        return selectedRoles;
    }

    public update() {
        this.forceUpdate();
    }

    public render() {

        if (!this.props.story.interfaces[this.state.tab]) {
            this.props.story.interfaces[this.state.tab] = this.createInterface();
        }

        return (
            <div className="player-interfaces">
                <Card>
                    <Tabs
                        onChange={(event, value) => { this.handleChange(value) }}
                        value={this.state.tab}
                        indicatorColor="primary"
                        scrollable
                        scrollButtons="auto"
                        textColor="primary">
                        {this.getTabs().map((t, i) => {
                            return (<Tab key={i} label={t} />);
                        })}
                    </Tabs>
                </Card>
                <InterfaceCreator update={() => { this.update() }} selectedRoles={this.getSelectedRoles()} interface={this.props.story.interfaces[this.state.tab]} roles={this.props.roles} />
            </div>
        );
    }
}

export default PlayerInterfaces;