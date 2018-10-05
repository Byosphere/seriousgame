import * as React from 'react';
import './gamescene.css';
import { ORANGE } from '../../utils/constants';
import T from 'i18n-react';
import { GridLoader } from 'halogenium';
import { startGame } from '../../utils/api';
import { Story } from '../../interfaces/Story';

interface Props {

}

interface State {
    gameReady: boolean
    story: Story
}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            gameReady: false,
            story: null
        };

        startGame((story: Story) => {
            this.setState({
                gameReady: true,
                story: story
            });
        });
    }

    public render() {
        if (this.state.gameReady) {
            return (
                <div className="game">

                </div>
            );
        } else {
            return (
                <div>
                    <GridLoader className="loader" color={ORANGE} size="50px" />
                    <p className="sub-loader">{T.translate('loader.playerswait')}</p>
                </div>
            );
        }

    }
}

export default GameScene;