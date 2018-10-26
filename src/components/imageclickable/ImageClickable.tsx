import * as React from 'react';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    disabled: boolean
}

class ImageClickable extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);
    }

    render() {
        return (<div>Image Clickable</div>);
    }
}

export default ImageClickable;