import * as React from 'react';
import './popinia.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';
import DialogCard from 'src/components/dialogcard/dialogCard';
import { connect } from 'react-redux';

interface State { }

class PopinIa extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        if (!this.props.component.params || !this.props.component.params.text)
            throw ("Parameter 'text' not found");
    }

    public static getParamModel() {
        return {
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
                imageIa={this.props.params.imageIa}
                onClose={() => { this.onClose() }}
                textMessage={this.props.component.params.text}
                buttonText={this.props.component.params.buttonText}
            />
        );
    }

}

function mapStateToProps(state: any) {
    return {
        params: state.connector.params
    }
}

export default connect(mapStateToProps, {})(PopinIa);