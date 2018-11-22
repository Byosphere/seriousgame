import * as React from 'react';
import './popinia.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';
import DialogCard from 'src/components/dialogcard/dialogCard';
import { BAS, HAUT } from 'src/utils/constants';

interface State {}

class PopinIa extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        if (!this.props.component.params || !this.props.component.params.position)
            throw ("Parameter 'position' not found");

        if (!this.props.component.params || !this.props.component.params.avatar)
            throw ("Parameter 'avatar' not found");

        if (!this.props.component.params || !this.props.component.params.text)
            throw ("Parameter 'text' not found");
    }

    public static getParamModel() {
        return {
            "position": HAUT + " | " + BAS,
            "avatar": "source de l'image de l'avatar de dialog (chaine de caractères)",
            "text": "Texte du message",
            "buttonText": "Texte du bouton pour valider le message (facultatif)"
        }
    }

    public onClose(): any {
        this.props.sendAction(this.props.component.clickAction);
    }

    render() {
        return (
            <DialogCard
                position={this.props.component.params.position}
                imageIa={this.props.component.params.avatar}
                onClose={() => { this.onClose() }}
                textMessage={this.props.component.params.text}
                buttonText={this.props.component.params.buttonText}
            />
        );
    }

}

export default PopinIa;