import * as React from 'react';
import './gamescene.css';
import Loader from '../../components/loader/Loader';
import T from 'i18n-react';
import { startGame, playPause, listenDynamicActions, quitGame } from '../../utils/api';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { gridConvertToCss, positionConvertToCss } from '../../utils/tools';
import { Story } from '../../interfaces/Story';
import PauseOverlay from '../../components/pauseoverlay/PauseOverlay';
import DynamicComponent from '../../components/dynamiccomponent/DynamicComponent';
import { STORY_TEST } from '../../utils/constants';
import Ia from '../../components/ia/Ia';
import { Redirect } from 'react-router-dom';
import { Role } from 'src/interfaces/Role';

interface Props {
    location: any
}

interface State {
    gameReady: boolean
    story: Story
    paused: boolean
    currentPage: number
    role: Role
    interface: Interface
    gridStyle: any
    displayIa: boolean
    lastActionId: string
    redirect: string
}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        // Vrai state : 
        this.state = {
            role: props.location.state,
            gameReady: false,
            story: null,
            paused: false,
            currentPage: 0,
            interface: null,
            gridStyle: {},
            lastActionId: null,
            displayIa: false,
            redirect: ''
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
                interface: story.interfaces.find((el: Interface) => { return el.roleId === this.state.role.id }),
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
            let nextPage = this.state.interface.pages[this.state.currentPage + 1];
            if (nextPage && nextPage.actionToDisplay === actionId) {
                this.setState({
                    lastActionId: actionId,
                    currentPage: this.state.currentPage + 1
                });
            } else {
                this.setState({
                    lastActionId: actionId
                });
            }

        });
        this.quitGame = this.quitGame.bind(this);
    }

    public displayGrid() {
        let currentPage = this.state.interface.pages[this.state.currentPage];
        let cols = currentPage.cols || this.state.interface.cols;
        let rows = currentPage.rows || this.state.interface.rows;
        let bg = '';
        if (currentPage.background) {
            bg = "url('" + currentPage.background + "')";
        }

        this.setState({
            gridStyle: {
                gridTemplateColumns: gridConvertToCss(cols),
                gridTemplateRows: gridConvertToCss(rows),
                backgroundImage: bg
            },
            displayIa: this.state.interface.displayIa
        });
    }

    public quitGame() {
        quitGame(() => {
            this.setState({ redirect: '/' });
        });
    }

    public render() {

        let isLastAction: boolean = null;
        if (this.state.story) isLastAction = this.state.story.actions[this.state.story.actions.length - 1].id === this.state.lastActionId;

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        } else if (isLastAction) {
            return (<Loader buttonAction={this.quitGame} button="loader.quit" textKey="loader.endgame" />);
        } else if (this.state.gameReady) {
            return (
                <div className="game">
                    <AppBar position="static" style={{ backgroundColor: this.state.role.color }}>
                        <Toolbar>
                            <Typography variant="title" component="h1" color="inherit" className="app-title">
                                {this.state.story.name} - {this.state.role.name}
                            </Typography>
                            {this.state.displayIa && <Ia lastAction={this.state.lastActionId} messages={this.state.interface.messages} />}
                        </Toolbar>
                    </AppBar>
                    {this.state.paused && <PauseOverlay />}
                    <div className="game-grid" style={this.state.gridStyle}>
                        {this.state.interface && this.state.interface.pages[this.state.currentPage] && this.state.interface.pages[this.state.currentPage].components.map((cmp, i) => {
                            return (<DynamicComponent key={i} lastAction={this.state.lastActionId} component={cmp} style={positionConvertToCss(cmp.cols, cmp.rows)} />);
                        })}
                    </div>
                </div>
            );
        } else {
            return (<Loader textKey="loader.playerswait" />);
        }
    }
}

export default GameScene;