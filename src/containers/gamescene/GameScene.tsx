import * as React from 'react';
import './gamescene.css';
import Loader from '../../components/loader/Loader';
import T from 'i18n-react';
import { startGame, playPause, listenDynamicActions } from '../../utils/api';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { gridConvertToCss, positionConvertToCss } from '../../utils/tools';
import { Story } from '../../interfaces/Story';
import PauseOverlay from '../../components/pauseoverlay/PauseOverlay';
import DynamicComponent from '../../components/dynamiccomponent/DynamicComponent';
import { STORY_TEST } from '../../utils/constants';
import Ia from '../../components/ia/Ia';

interface Props {
    location: any
}

interface State {
    gameReady: boolean
    story: Story
    paused: boolean
    currentPage: number
    roleId: number
    interface: Interface
    gridStyle: any
    displayIa: boolean
    lastActionId: string
}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // Vrai state : 
        this.state = {
            roleId: parseInt(props.location.state),
            gameReady: false,
            story: null,
            paused: false,
            currentPage: 0,
            interface: null,
            gridStyle: {},
            lastActionId: null,
            displayIa: false
        };

        // State de test
        // this.state = {
        //     roleId: 1,
        //     gameReady: true,
        //     story: STORY_TEST,
        //     paused: false,
        //     currentPage: 0,
        //     interface: STORY_TEST.interfaces.find((el: Interface) => { return el.roleId === 1 }),
        //     gridStyle: {
        //         gridTemplateColumns: '1fr 1ft 1fr 1fr 1fr',
        //         gridTemplateRows: '1fr 1ft 1fr 1fr 1fr'
        //     },
        //     displayIa: true,
        //     lastActionId: "action1"
        // }

        startGame((story: Story) => {
            this.setState({
                gameReady: true,
                story: story,
                interface: story.interfaces.find((el: Interface) => { return el.roleId === this.state.roleId }),
                currentPage: 0,
            });
            this.displayGrid();
        });

        playPause((action: boolean) => {
            this.setState({
                paused: action
            });
        });

        listenDynamicActions((actionId: string) => {
            this.setState({
                lastActionId: actionId
            });
        });
    }

    public displayGrid() {
        let cols = this.state.interface.pages[this.state.currentPage].cols || this.state.interface.cols;
        let rows = this.state.interface.pages[this.state.currentPage].rows || this.state.interface.rows;

        this.setState({
            gridStyle: {
                gridTemplateColumns: gridConvertToCss(cols),
                gridTemplateRows: gridConvertToCss(rows),
            },
            displayIa: this.state.interface.displayIa
        });
    }

    public render() {
        if (this.state.gameReady) {
            return (
                <div className="game">
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography variant="title" component="h1" color="inherit" className="app-title">
                                {this.state.story.name}
                            </Typography>
                            {this.state.displayIa && <Ia lastAction={this.state.lastActionId} messages={this.state.interface.messages} />}
                        </Toolbar>
                    </AppBar>
                    {this.state.paused && <PauseOverlay />}
                    <div className="game-grid" style={this.state.gridStyle}>
                        {this.state.interface && this.state.interface.pages[this.state.currentPage].components.map((cmp) => {
                            return (<DynamicComponent key={cmp.name} lastAction={this.state.lastActionId} component={cmp} style={positionConvertToCss(cmp.cols, cmp.rows)} />);
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <Loader textKey="loader.playerswait" />
            );
        }

    }
}

export default GameScene;