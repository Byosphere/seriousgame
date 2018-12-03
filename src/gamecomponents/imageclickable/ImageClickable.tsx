import * as React from 'react';
import './imageclickable.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';
import { getServerAddr } from 'src/utils/api';

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
            "name": "Nom de l'image (chaine de caractères)",
            "overflow": "Ajustement de la taille : width | height | null (chaine de caractères)"
        }
    }

    public setOverflow(): React.CSSProperties {
        return {
            width: this.props.component.params.overflow === 'width' ? "100%" : "",
            height: this.props.component.params.overflow === 'height' ? "100%" : "",
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
            <img className={this.props.component.clickAction ? "image-clickable" : "simple-image" } style={this.setOverflow()} onClick={() => this.click()} src={getServerAddr() + this.props.component.params.src} alt={this.props.component.params.name} />
        );
    }
}

export default ImageClickable;