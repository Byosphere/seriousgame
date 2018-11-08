import * as React from 'react';
import './imageclickable.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    disabled: boolean
}

class ImageClickable extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        if (!this.props.component.params || !this.props.component.params.src)
            throw ("Parameter 'src' not found");

        if (!this.props.component.params || !this.props.component.params.name)
            throw ("Parameter 'name' not found");
    }

    public static getParamModel() {
        return {
            "src": "Source de l'image (chaine de caractères)",
            "name": "Nom de l'image (chaine de caractères)"
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
            <div className="image-clickable">
                <img onClick={() => this.click()} src={this.props.component.params.src} alt={this.props.component.params.name} />
            </div>
        );
    }
}

export default ImageClickable;