import * as React from 'react';
import { Button } from '@material-ui/core';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    disabled: boolean
}

class ActionButton extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        this.state = {
            disabled: false
        }
        if (!this.props.component.params || !this.props.component.params.text)
            throw ("Parameter 'text' not found");
    }

    public static getParamModel() {
        return {
            "text": "Le texte du bouton (ne doit pas être null)",
            "size": "Small | Big | null",
            "color": "Primary | Default | null"
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
            <Button variant="contained" disabled={this.state.disabled} onClick={() => { this.click() }}>{this.props.component.params.text}</Button>
        );
    }
}

export default ActionButton;