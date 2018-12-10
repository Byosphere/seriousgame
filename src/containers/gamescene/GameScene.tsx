import * as React from 'react';
import { connect } from 'react-redux';
import './gamescene.css';
import Loader from '../../components/loader/Loader';
import { startGame, playPause, listenDynamicActions, getServerAddr, resetPlayers, onPlayerReset } from '../../utils/api';
import { Card, CardHeader, Avatar } from '@material-ui/core';
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
import T from 'i18n-react';

interface Props {
    changeServer: Function
    imageFolder: string
    domain: string
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
    gridSize: number
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
            displayIa: false,
            gridSize: 0
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

            let pageToDisplayIndex = this.state.interface.pages.findIndex(page => { return page.actionToDisplay.indexOf(actionId) > -1 });
            if (pageToDisplayIndex > -1 && this.state.currentPage !== pageToDisplayIndex) {
                this.setState({
                    lastActionId: actionId,
                    currentPage: pageToDisplayIndex
                });
                this.displayGrid();
            } else {
                this.setState({ lastActionId: actionId });
            }
        });
    }

    public displayGrid() {

        let currentPage = this.state.interface.pages[this.state.currentPage];
        let cols = (currentPage && currentPage.cols) ? currentPage.cols : this.state.interface.cols;
        let rows = (currentPage && currentPage.rows) ? currentPage.rows : this.state.interface.rows;
        let bg = (currentPage && currentPage.background && currentPage.background !== this.props.imageFolder) ? "url('" + getServerAddr() + currentPage.background + "')" : '';
        let gridSize = cols * rows;

        this.setState({
            gridStyle: {
                gridTemplateColumns: gridConvertToCss(cols),
                gridTemplateRows: gridConvertToCss(rows),
                backgroundImage: bg
            },
            displayIa: this.state.interface.displayIa,
            gridSize
        });
    }

    public quitGame() {
        resetPlayers();
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

    public displayDebugGrid(size: number) {
        var elems = [];
        for (let i = 0; i < size; i++) {
            elems.push(<div key={i} className="debug-elem"></div>);
        }
        return elems;
    }

    public render() {

        let isLastAction: boolean = null;
        if (this.state.story) isLastAction = this.state.story.actions[this.state.story.actions.length - 1].id === this.state.lastActionId;

        if (!this.state.role) {
            return <RoleSelect changeServer={() => { this.props.changeServer() }} selectRole={(role: Role) => this.setState({ role })} />;
        } else if (isLastAction) {
            return (<Loader buttonAction={() => { this.quitGame() }} button="loader.quit" textKey="loader.endgame" text={this.state.story.actions[this.state.story.actions.length - 1].description} />);
        } else if (this.state.gameReady) {
            return (
                <div className="game">
                    <Card className={"gamecard-header " + this.state.role.theme} style={{ backgroundColor: this.state.role.color }}>
                        <CardHeader
                            avatar={<Avatar alt="logo" src={logo} />}
                            title={this.props.domain}
                            subheader={T.translate('appname')}
                        />
                        <div className="game-titles">
                            <h1 className={"app-title " + this.state.role.theme} style={{ margin: "6px 0 0 0" }}>{this.state.story.name} - {this.state.role.name}</h1>
                            <h2 className={"app-subtitle " + this.state.role.theme} style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>{this.state.role.soustitre}</h2>
                        </div>
                        {this.state.displayIa && <Ia lastAction={this.state.lastActionId} messages={this.state.interface.messages} />}
                    </Card>
                    {this.state.paused && <PauseOverlay />}
                    <div className="game-grid" style={this.state.gridStyle}>
                        {this.state.interface && this.state.interface.pages[this.state.currentPage] && this.state.interface.pages[this.state.currentPage].components.map((cmp, i) => {
                            return (<DynamicComponent key={i} lastAction={this.state.lastActionId} component={cmp} style={positionConvertToCss(cmp.cols, cmp.rows)} />);
                        })}
                    </div>
                    {this.state.interface.pages[this.state.currentPage].debug && <div className="debug-grid" style={this.state.gridStyle}>
                        {this.displayDebugGrid(this.state.gridSize)}
                    </div>}
                </div>
            );
        } else {
            return (<Loader textKey="loader.playerswait" />);
        }
    }
}

function mapStateToProps(state: any) {
    return {
        imageFolder: state.connector.params.imageFolder,
        domain: state.connector.params.domain
    }
}

export default connect(mapStateToProps, {})(GameScene);