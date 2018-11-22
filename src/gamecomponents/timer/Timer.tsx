import * as React from 'react';
import './timer.css';
import { GameComponent, GameProps } from 'src/interfaces/GameComponent';

interface State {
    time: number
    seconds: number
    minutes: number
}

class Timer extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        if (!this.props.component.params || !this.props.component.params.duration)
            throw ("Parameter 'duration' not found");

        this.state = {
            time: this.props.component.params.duration,
            seconds: this.props.component.params.duration % 60,
            minutes: Math.floor(this.props.component.params.duration / 60)
        }
    }

    public componentDidMount() {

        let interval = setInterval(() => {

            if (this.state.time === 0) {
                clearInterval(interval);
                this.props.sendAction(this.props.component.clickAction);
            } else {
                let time = this.state.time - 1;
                this.setState({
                    time,
                    seconds: time % 60,
                    minutes: Math.floor(time / 60)
                });
            }
        }, 1000);
    }

    public static getParamModel() {
        return {
            "duration": "Durée du timer en secondes",
            "size": "Taille du texte du timer (en px)",
            "hidden": "true | false (montrer le timer ou non)"
        }
    }

    public onComplete() {
        this.props.sendAction(this.props.component.clickAction);
    }

    render() {
        return (
            <div className="game-timer">
                {!this.props.component.params.hidden && <p style={{ fontSize: this.props.component.params.size + "px" }}>
                    {this.state.minutes < 10 && "0"}{this.state.minutes} : {this.state.seconds < 10 && "0"}{this.state.seconds}
                </p>}
            </div>
        );
    }

}

export default Timer;