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
    }

    public static getParamModel() {
        return {
            "src": "Source de l'image (chaine de caractères)",
            "overflow": "Ajustement de la taille : width | height | stretch | null (chaine de caractères)"
        }
    }

    public setOverflow(): React.CSSProperties {
        let params = this.props.component.params;
        return {
            width: (params.overflow === 'width' || params.overflow === 'stretch') ? "100%" : "",
            height: (params.overflow === 'height' || params.overflow === 'stretch') ? "100%" : "",
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
            <img className={this.props.component.clickAction ? "image-clickable" : "simple-image"} style={this.setOverflow()} onClick={() => this.click()} src={getServerAddr() + this.props.component.params.src} alt="image-clickable" />
        );
    }
}

export default ImageClickable;