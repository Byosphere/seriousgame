import * as React from 'react';

interface State {
    disabled: boolean
}

class ImageClickable extends React.Component<Props, State> implements GameComponent {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (<div>Image Clickable</div>);
    }
}

export default ImageClickable;