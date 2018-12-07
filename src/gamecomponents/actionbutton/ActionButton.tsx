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
            "size": "small | large | medium (ou null) | fill",
            "textColor": "Couleur du texte : #FF0000 ou rgba(0,0,0,1) (blanc par défaut)",
            "backColor": "Couleur du fond : #FF0000 ou rgba(0,0,0,1) (orange par défaut)",
            "variant": "contained | outlined | null"
        }
    }

    public getSize(): any {
        let size = this.props.component.params.size;
        if (!size || size === "fill") return "medium";
        return size;
    }

    public getStyle(): React.CSSProperties {
        let params = this.props.component.params;
        return {
            width: params.size === "fill" ? "100%" : "",
            height: params.size === "fill" ? "100%" : "",
            color: params.textColor,
            backgroundColor: params.backColor
        };
    }

    public click() {
        this.setState({
            disabled: true
        });
        this.props.sendAction(this.props.component.clickAction);
    }

    render() {
        return (
            <Button
                color="primary"
                style={this.getStyle()}
                size={this.getSize()}
                variant={this.props.component.params.variant}
                disabled={this.state.disabled}
                onClick={() => { this.click() }}>
                {this.props.component.params.text}
            </Button>
        );
    }
}

export default ActionButton;