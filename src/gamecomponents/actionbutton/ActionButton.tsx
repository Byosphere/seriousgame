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
            "text": "Le texte du bouton (chaine de caractères non null)",
            "size": "small | large | medium (ou null)",
            "color": "primary | default | null",
            "variant": "contained | outlined | null"
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
            <Button color={this.props.component.params.color} size={this.props.component.params.size} variant={this.props.component.params.variant} disabled={this.state.disabled} onClick={() => { this.click() }}>{this.props.component.params.text}</Button>
        );
    }
}

export default ActionButton;