import * as React from 'react';
import { Button } from '@material-ui/core';
import './quizzbutton.css';
import QuizzDialog from '../quizzdialog/QuizzDialog';

interface State {
    disabled: boolean
    open: boolean
}

class QuizzButton extends React.Component<Props, State> implements GameComponent {

    constructor(props: Props) {
        super(props);

        this.state = {
            disabled: false,
            open: false
        }
        this.showQuizz = this.showQuizz.bind(this);
    }

    public showQuizz() {
        this.setState({
            open: !this.state.open
        });
    }

    public onClose() {
        this.setState({ open: false, disabled: true });
        if (this.props.component.clickAction) {
            this.props.sendAction(this.props.component.clickAction);
        }
    }

    render() {
        return (
            <div>
                <Button variant="contained" disabled={this.state.disabled} onClick={() => { this.showQuizz() }}>Envoyer action</Button>
                <QuizzDialog onClose={() => { this.onClose() }} open={this.state.open} question={this.props.component.params.question} answers={this.props.component.params.answers} />
            </div>
        );
    }
}

export default QuizzButton;