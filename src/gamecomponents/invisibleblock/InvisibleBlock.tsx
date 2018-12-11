import * as React from 'react';
import './invisibleblock.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    disabled: boolean
}

class InvisibleBlock extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

    }

    public static getParamModel() {
        return {
            "border": "montre les bordures du block invisible (pour debug)"
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
            <div onClick={() => this.click()} style={{ border: this.props.component.params.border ? "1px dashed green" : "" }} className={this.props.component.clickAction ? "invisible-block" : "invisible"}></div>
        );
    }
}

export default InvisibleBlock;