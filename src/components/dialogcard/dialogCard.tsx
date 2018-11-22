import * as React from 'react';
import './dialogcard.css';
import { Card, CardContent, Avatar, IconButton, CardActions, Button } from '@material-ui/core';
import { getServerAddr } from 'src/utils/api';
import { Close } from '@material-ui/icons';

interface Props {
    position: string
    imageIa: string
    onClose: Function
    textMessage: string
    buttonText?: string
}

interface State { }

class DialogCard extends React.Component<Props, State> {

    public render() {
        return (
            <Card className={"ia-modal " + this.props.position}>
                <CardContent>
                    <Avatar alt="IA" src={getServerAddr() + this.props.imageIa} />
                    <IconButton onClick={() => { this.props.onClose() }}>
                        <Close />
                    </IconButton>
                    <p>{this.props.textMessage}</p>
                </CardContent>
                {this.props.buttonText && <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button size="small">{this.props.buttonText}</Button>
                </CardActions>}
            </Card>
        );
    }
}

export default DialogCard;