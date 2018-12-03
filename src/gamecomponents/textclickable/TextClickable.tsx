import * as React from 'react';
import './textclickable.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    disabled: boolean
}

class TextClickable extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        if (!this.props.component.params || !this.props.component.params.text)
            throw ("Parameter 'text' not found");
    }

    public static getParamModel() {
        return {
            "text": "text (chaine de caractères)",
            "color": "couleur sous cette forme : #FF0000 ou rgba(255,0,0,1)",
            "size": "chaine de caractère du type : 16px",
            "bold": "true | false",
            "italic": "true | false",

        }
    }

    public getStyle(): React.CSSProperties {
        let params = this.props.component.params;
        return {
            color: params.color,
            fontSize: params.size,
            fontWeight: params.bold ? 'bold' : 'normal',
            fontStyle: params.italic ? 'italic' : 'normal'
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
            <div className={this.props.component.clickAction ? "text-clickable" : "simple-text"}>
                <p onClick={() => this.click()} style={this.getStyle()}>{this.props.component.params.text}</p>
            </div>
        );
    }
}

export default TextClickable;