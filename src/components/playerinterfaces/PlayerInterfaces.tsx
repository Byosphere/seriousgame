import * as React from 'react';
import './playerinterfaces.css';
import T from 'i18n-react';
import { Card, Tabs, Tab, AppBar, Toolbar, FormControlLabel, Switch, InputBase } from '@material-ui/core';
import { Story } from 'src/interfaces/Story';

interface Props {
    story: Story
}

interface State {
    tab: number
    currentPlayer: string
}

class PlayerInterfaces extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            tab: 0,
            currentPlayer: T.translate('player.player').toString() + ' ' + 1
        }
    }

    public handleChange(value: number) {
        this.setState({ tab: value, currentPlayer: T.translate('player.player').toString() + ' ' + (value + 1) });
    }

    public getTabs(): Array<String> {
        let tabs = [];
        for (let index = 0; index < this.props.story.nbPlayers; index++) {
            tabs.push(T.translate('player.player').toString() + ' ' + (index + 1));
        }
        return tabs;
    }

    public render() {
        return (
            <Card className="player-interfaces">
                <Tabs
                    onChange={(event, value) => { this.handleChange(value) }}
                    value={this.state.tab}
                    indicatorColor="primary"
                    textColor="primary">
                    {this.getTabs().map((t) => {
                        return (<Tab label={t} />);
                    })}
                </Tabs>
                <AppBar position="static" style={{ backgroundColor: "#424242", boxShadow: 'none' }}>
                    <Toolbar variant="dense">
                        <h3>Interface {this.state.currentPlayer}</h3>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={true}
                                    color="primary"
                                />
                            }
                            classes={{ label: "white" }}
                            label={T.translate('ia.activate')}
                        />
                    </Toolbar>
                </AppBar>
            </Card>
        );
    }
}

export default PlayerInterfaces;