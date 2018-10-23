import * as React from 'react';
import './mastersnackbar.css';
import { Snackbar, Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

interface State {}

interface Props {
    message: string
    open: boolean
    onClose?: Function
}

class MasterSnackbar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

    }

    public handleClose(event: any, reason: any) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
        this.props.onClose();
    }

    public render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.props.open}
                autoHideDuration={5000}
                onClose={(event, reason) => { this.handleClose(event, reason) }}
                message={<span>{this.props.message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={(event) => { this.handleClose(event, null) }}
                    >
                        <Close />
                    </IconButton>,
                ]}
            />
        );
    }
}

export default MasterSnackbar;