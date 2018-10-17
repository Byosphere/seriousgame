import * as React from 'react';
import { Button } from '@material-ui/core';

interface State {
    disabled: boolean
}

class ActionButton extends React.Component<Props, State> implements GameComponent {

    constructor(props: Props) {
        super(props);

        this.state = {
            disabled: false
        }
    }
    public click() {
        this.setState({
            disabled: true
        });
        this.props.sendAction(this.props.component.clickAction);
    }

    render() {
        return (
            <Button variant="contained" disabled={this.state.disabled} onClick={() => { this.click() }}>Envoyer action</Button>
        );
    }
}

export default ActionButton;