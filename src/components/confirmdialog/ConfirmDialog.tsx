import * as React from 'react';
import T from 'i18n-react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Slide } from '@material-ui/core';
import { ConfirmMessage } from 'src/interfaces/ConfirmMessage';

interface Props {
    open: boolean
    message: ConfirmMessage
    onClose: any
}

interface State { }

class ConfirmDialog extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public Transition(state: State) {
        return <Slide direction="up" {...state} />;
    }

    public confirm() {
        this.props.message.confirm();
        this.props.onClose();
    }

    public render() {
        if (!this.props.message) return null;
        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={this.Transition}
                onClose={this.props.onClose}
                aria-labelledby="alert-confirm-dialog"
                aria-describedby="Confirm dialog"
            >
                <DialogTitle>
                    {this.props.message.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.props.message.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        {T.translate('generic.no')}
                    </Button>
                    <Button onClick={() => { this.confirm() }} color="primary">
                        {T.translate('generic.yes')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ConfirmDialog;