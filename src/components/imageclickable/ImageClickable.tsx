import * as React from 'react';
import GameComponent from '../gamecomponent/GameComponent';

interface Props {
    component: Component
    lastAction: string
}

interface State {

}

class ImageClickable extends GameComponent {

    constructor(props: Props) {
        super(props);
    }

    render() {
        if(this.canRenderComponent()) {
            return (<div>Image Clickable</div>);
        } else {
            return null;
        }
    }
}

export default ImageClickable;