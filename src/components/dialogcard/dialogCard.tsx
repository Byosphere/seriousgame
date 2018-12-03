import * as React from 'react';
import './dialogcard.css';
import { Card, CardContent, Avatar, IconButton, CardActions, Button } from '@material-ui/core';
import { getServerAddr } from 'src/utils/api';
import { Close } from '@material-ui/icons';

interface Props {
    imageIa: string
    onClose: Function
    textMessage: string
    buttonText?: string
    buttonClose?: boolean
}

interface State { }

class DialogCard extends React.Component<Props, State> {

    public render() {
        return (
            <Card raised className="ia-modal">
                <CardContent>
                    {this.props.imageIa && <Avatar alt="IA" src={getServerAddr() + this.props.imageIa} />}
                    {this.props.buttonClose && <IconButton onClick={() => { this.props.onClose() }}>
                        <Close />
                    </IconButton>}
                    <p dangerouslySetInnerHTML={{ __html: this.props.textMessage }}></p>
                </CardContent>
                {this.props.buttonText && <CardActions style={{ justifyContent: "flex-end" }}>
                    <Button onClick={() => { this.props.onClose() }} size="small">{this.props.buttonText}</Button>
                </CardActions>}
            </Card>
        );
    }
}

export default DialogCard;