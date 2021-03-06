import * as React from 'react';
import './playerinterfaces.css';
import T from 'i18n-react';
import { Card, Tabs, Tab, IconButton, Tooltip } from '@material-ui/core';
import { Fullscreen, FullscreenExit } from '@material-ui/icons';
import InterfaceCreator from '../interfacecreator/InterfaceCreator';
import Story from 'src/interfaces/Story';
import Interface from 'src/interfaces/Interface';
import Role from 'src/interfaces/Role';

interface Props {
    story: Story
    roles: Array<Role>
}

interface State {
    tab: number
    fullscreen: boolean
    tooltip: boolean
}

class PlayerInterfaces extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            tab: 0,
            fullscreen: false,
            tooltip: false
        }
    }

    public toggleFullscreen() {
        this.setState({ fullscreen: !this.state.fullscreen, tooltip: false });
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

    static getDerivedStateFromProps(props: Props, state: State) {
        if (props.story.nbPlayers < state.tab) {
            return {
                tab: props.story.nbPlayers - 1
            }
        } else {
            return null;
        }
    }

    public update() {
        this.forceUpdate();
    }

    public render() {

        if (!this.props.story.interfaces[this.state.tab]) {
            this.props.story.interfaces[this.state.tab] = new Interface();
        }

        if (this.state.tab >= this.props.story.nbPlayers) {
            this.setState({ tab: this.props.story.nbPlayers - 1 });
        }

        return (
            <div className="player-interfaces" style={this.state.fullscreen ? { gridRow: "1 / 4", gridColumn: "1 / 4" } : {}}>
                <Card style={{ position: "relative" }}>
                    <Tooltip
                        open={this.state.tooltip}
                        onOpen={() => this.setState({ tooltip: true })}
                        onClose={() => this.setState({ tooltip: false })}
                        title={this.state.fullscreen ? T.translate('generic.shrink') : T.translate('generic.fullscreen')}>

                        <IconButton onClick={() => this.toggleFullscreen()} className="fullscreen-button">
                            {!this.state.fullscreen && <Fullscreen />}
                            {this.state.fullscreen && <FullscreenExit />}
                        </IconButton>
                    </Tooltip>
                    <Tabs
                        style={{ width: "calc(100% - 48px)" }}
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