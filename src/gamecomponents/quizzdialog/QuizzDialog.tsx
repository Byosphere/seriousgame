import * as React from 'react';
import './quizzdialog.css';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Slide, List, ListItem, ListItemIcon, ListItemText, DialogActions, Button } from '@material-ui/core';
import { LooksOne, LooksTwo, Looks3, Looks4, Looks5, Looks6, Lens } from '@material-ui/icons';
import T from 'i18n-react';
import { GameProps, GameComponent } from 'src/interfaces/GameComponent';

interface State {
    open: boolean
    displayText: string
    finished: boolean
    visible: boolean
}

class QuizzDialog extends React.Component<GameProps, State> implements GameComponent {

    constructor(props: GameProps) {
        super(props);

        this.state = {
            open: false,
            displayText: "",
            finished: false,
            visible: true
        }
        if (!this.props.component.params || !this.props.component.params.answers)
            throw ("Parameter 'answer' not found");

        if (!this.props.component.params || !this.props.component.params.question)
            throw ("Parameter 'question' not found");
    }

    public transition(props: any) {
        return <Slide direction="down" {...props} />
    }

    public static getParamModel() {
        return {
            "question": "Question du quizz (chaine de caractères)",
            "answers": [
                {
                    "label": "Intitulé de la propositon (chaine de caractères)",
                    "correct": "false | true (boolean)",
                    "details": "Message d'explication après clic (chaine de caractères)"
                }
            ]
        };
    }

    public checkResponse(i: number) {

        if (this.props.component.params.answers[i].details) {
            this.setState({
                finished: this.props.component.params.answers[i].correct,
                displayText: this.props.component.params.answers[i].details,
                open: true
            });
            this.props.component.params.answers[i].checked = true;
        } else if (this.props.component.params.answers[i].correct) {
            this.onClose();
        }
    }

    public getIcon(i: number): JSX.Element {
        switch (i) {
            case 0:
                return (<LooksOne />);
            case 1:
                return (<LooksTwo />);
            case 2:
                return (<Looks3 />);
            case 3:
                return (<Looks4 />);
            case 4:
                return (<Looks5 />);
            case 5:
                return (<Looks6 />);
            default:
                return (<Lens />);
        }
    }

    public closePop() {
        this.setState({ open: false, finished: false });
        if (this.state.finished) this.onClose();

    }

    public onClose() {
        this.setState({ visible: false });
        if (this.props.component.clickAction) {
            this.props.sendAction(this.props.component.clickAction);
        }
    }

    render() {

        if (!this.state.visible) return null;

        return (
            <Dialog TransitionComponent={this.transition} aria-labelledby="quizz-dialog" open={this.state.visible}>
                <DialogTitle>{T.translate('quizztitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.component.params.question}
                    </DialogContentText>
                    <List component="nav" className="quizz-list">
                        {this.props.component.params.answers.map((answer: Answer, i: number) => {
                            let classes = answer.checked ? 'checked ' : '';
                            classes += answer.correct ? 'v' : 'f'

                            return (<ListItem disabled={answer.checked} className={classes} key={i} button onClick={() => { this.checkResponse(i) }}>
                                <ListItemIcon>
                                    {this.getIcon(i)}
                                </ListItemIcon>
                                <ListItemText primary={answer.label} />
                            </ListItem>);
                        })}
                    </List>
                </DialogContent>
                <Dialog open={this.state.open}>
                    <DialogContent>
                        {this.state.displayText}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.closePop() }} color="primary" autoFocus>ok</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        );
    }
}

export default QuizzDialog;