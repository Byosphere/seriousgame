import * as React from 'react';

interface Props {
    component: Component
    lastAction: string
}

interface State {

}

class ImageClickable extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (<div>Image Clickable</div>);
    }
}

export default ImageClickable;