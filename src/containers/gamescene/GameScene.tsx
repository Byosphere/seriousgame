import * as React from 'react';
import './gamescene.css';
import Loader from '../../components/loader/Loader';
import T from 'i18n-react';
import { startGame, playPause } from '../../utils/api';
import { gridConvertToCss, positionConvertToCss } from '../../utils/tools';
import { Story } from '../../interfaces/Story';
import PauseOverlay from '../../components/pauseoverlay/PauseOverlay';
import DynamicComponent from '../../components/dynamiccomponent/DynamicComponent';

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
}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            roleId: parseInt(props.location.state),
            gameReady: false,
            story: null,
            paused: false,
            currentPage: 0,
            interface: null,
            gridStyle: {}
        };

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
    }

    public displayGrid() {
        let cols = this.state.interface.pages[this.state.currentPage].cols || this.state.interface.cols;
        let rows = this.state.interface.pages[this.state.currentPage].rows || this.state.interface.rows;

        this.setState({
            gridStyle: {
                gridTemplateColumns: gridConvertToCss(cols),
                gridTemplateRows: gridConvertToCss(rows),
            }
        });
    }

    public render() {
        if (this.state.gameReady) {
            return (
                <div className="game">
                    {this.state.paused && <PauseOverlay />}
                    <div className="game-grid" style={this.state.gridStyle}>
                        {this.state.interface && this.state.interface.pages[this.state.currentPage].components.map((cmp) => {
                            return (<DynamicComponent componentName={cmp.name} style={positionConvertToCss(cmp.cols, cmp.rows)} />);
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