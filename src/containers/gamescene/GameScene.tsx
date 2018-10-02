import * as React from 'react';
import './gamescene.css';

interface Props {

}

interface State {

}

class GameScene extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div className="game">

            </div>
        );
    }
}

export default GameScene;