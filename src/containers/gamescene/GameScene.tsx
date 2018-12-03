import * as React from 'react';
import './gamescene.css';
import Loader from '../../components/loader/Loader';
import { startGame, playPause, listenDynamicActions, getServerAddr, resetPlayer, onPlayerReset } from '../../utils/api';
import { AppBar, Toolbar } from '@material-ui/core';
import { gridConvertToCss, positionConvertToCss } from '../../utils/tools';
import PauseOverlay from '../../components/pauseoverlay/PauseOverlay';
import DynamicComponent from '../../components/dynamiccomponent/DynamicComponent';
import Ia from '../../components/ia/Ia';
import Story from 'src/interfaces/Story';
import Interface from 'src/interfaces/Interface';
import { ACTION_INITIAL } from 'src/utils/constants';
import Role from 'src/interfaces/Role';
import RoleSelect from '../roleselect/RoleSelect';
import logo from 'src/logo.png';

interface Props {
    changeServer: Function
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
}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            role: null,
            gameReady: false,
            story: null,
            paused: false,
            currentPage: 0,
            interface: null,
            gridStyle: {},
            lastActionId: null,
            displayIa: false
        };

        startGame((story: Story) => {
            this.setState({
                gameReady: true,
                story: story,
                interface: story.interfaces.find((el: Interface) => { return el.roleId === this.state.role.id }),
                currentPage: 0,
                lastActionId: ACTION_INITIAL
            });
            this.displayGrid();
        });

        playPause((action: boolean) => {
            this.setState({
                paused: action
            });
        });

        onPlayerReset(() => {
            if (this.state.role) {
                this.setState({
                    role: null,
                    gameReady: false,
                    story: null,
                    paused: false,
                    currentPage: 0,
                    interface: null,
                    gridStyle: {},
                    lastActionId: null,
                    displayIa: false
                });
            }
        });

        listenDynamicActions((actionId: string) => {
            let nextPage = this.state.interface.pages[this.state.currentPage + 1];
            if (nextPage && nextPage.actionToDisplay.indexOf(actionId) > -1) {
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
    }

    public displayGrid() {

        let currentPage = this.state.interface.pages[this.state.currentPage];
        let cols = (currentPage && currentPage.cols) ? currentPage.cols : this.state.interface.cols;
        let rows = (currentPage && currentPage.rows) ? currentPage.rows : this.state.interface.rows;
        let bg = (currentPage && currentPage.background) ? "url('" + getServerAddr() + currentPage.background + "')" : '';

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
        resetPlayer();
        this.setState({
            role: null,
            gameReady: false,
            story: null,
            paused: false,
            currentPage: 0,
            interface: null,
            gridStyle: {},
            lastActionId: null,
            displayIa: false
        });
    }

    public render() {

        let isLastAction: boolean = null;
        if (this.state.story) isLastAction = this.state.story.actions[this.state.story.actions.length - 1].id === this.state.lastActionId;

        if (!this.state.role) {
            return <RoleSelect changeServer={() => { this.quitGame() }} selectRole={(role: Role) => this.setState({ role })} />;
        } else if (isLastAction) {
            return (<Loader buttonAction={() => { this.quitGame() }} button="loader.quit" textKey="loader.endgame" />);
        } else if (this.state.gameReady) {
            return (
                <div className="game">
                    <AppBar position="static" style={{ backgroundColor: this.state.role.color }}>
                        <Toolbar>
                            <img src={logo} alt="logo" style={{ marginRight: "20px" }} />
                            <h1 className={"app-title " + this.state.role.theme}>
                                {this.state.story.name} - {this.state.role.name}
                            </h1>
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