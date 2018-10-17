import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Slide, List, ListItem, ListItemIcon, ListItemText, Divider, DialogActions, Button } from '@material-ui/core';
import { LooksOne, LooksTwo, Looks3, Looks4, Looks5, Looks6, Lens } from '@material-ui/icons';
import T from 'i18n-react';

interface Props {
    onClose: Function
    open: boolean
    question: string
    answers: Array<Answer>
}

interface State {
    open: boolean
    displayText: string
    finished: boolean
}

class QuizzDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false,
            displayText: "",
            finished: false
        }
    }

    public transition(props: Props) {
        return <Slide direction="down" {...props} />
    }

    public checkResponse(i: number) {

        if (this.props.answers[i].details) {
            this.setState({
                finished: this.props.answers[i].correct,
                displayText: this.props.answers[i].details,
                open: true
            });
            this.props.answers[i].checked = true;
        } else if (this.props.answers[i].correct) {
            this.props.onClose();
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
        if (this.state.finished) this.props.onClose();

    }

    render() {

        return (
            <Dialog TransitionComponent={this.transition} aria-labelledby="quizz-dialog" open={this.props.open}>
                <DialogTitle>{T.translate('quizztitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.question}
                    </DialogContentText>
                    <List component="nav" className="quizz-list">
                        {this.props.answers.map((answer, i) => {
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