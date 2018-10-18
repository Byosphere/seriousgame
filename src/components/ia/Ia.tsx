import * as React from 'react';
import './ia.css';
import { Card, IconButton, Avatar, Badge, Typography, CardContent, CardHeader, Icon } from '@material-ui/core';
import { Close, Textsms } from '@material-ui/icons';
import AvatarImage from '../../images/avatar.jpg';

interface State {
    displayMessage: boolean
    vu: boolean
}

interface Props {
    messages: Array<Message>
    lastAction: string
}

class Ia extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            displayMessage: false,
            vu: false
        }
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.props.lastAction !== prevProps.lastAction) {
            this.setState({
                vu: false
            });
        }
    }

    public getCurrentMessage(messages: Array<Message>, lastAction: string): Message {
        let currentMessage = null;
        if (!messages) return null;
        if (this.props.lastAction) {
            currentMessage = messages.find((m: Message) => {
                return m.action === lastAction;
            });
        } else {
            currentMessage = messages.find((m: Message) => {
                return !m.action;
            });
        }
        return currentMessage;
    }

    public displayCardModal(currentMessage: Message): any {
        if (this.state.displayMessage) {
            return (
                <Card className={"ia-modal " + currentMessage.position}>
                    <CardContent>
                        <Avatar alt="IA" src={AvatarImage} />
                        <IconButton onClick={() => { this.setState({ displayMessage: false }) }}>
                            <Close />
                        </IconButton>
                        <Typography component="p">
                            {currentMessage.text}
                        </Typography>
                    </CardContent>
                </Card>
            );
        }
    }

    public displayIaAvatar(displayMessage: boolean, currentMessage: Message, vu: boolean) {
        if (currentMessage && currentMessage.force && !vu) {
            if (displayMessage) {
                return (
                    <Badge badgeContent={1} color="secondary">
                        <Avatar alt="IA" >
                            <Textsms />
                        </Avatar>
                    </Badge>
                );
            } else {
                return (
                    <Badge badgeContent={1} color="secondary">
                        <Avatar alt="IA" src={AvatarImage} />
                    </Badge>
                );
            }
        } else {
            if (displayMessage) {
                return (
                    <Avatar alt="IA" >
                        <Textsms />
                    </Avatar>
                );
            } else {
                return (
                    <Avatar alt="IA" src={AvatarImage} />
                );
            }
        }
    }

    public render() {

        let currentMessage = this.getCurrentMessage(this.props.messages, this.props.lastAction);

        return (
            <div>
                <IconButton onClick={() => { if (currentMessage) { this.setState({ displayMessage: !this.state.displayMessage, vu: true }) } }}>
                    {this.displayIaAvatar(this.state.displayMessage, currentMessage, this.state.vu)}
                </IconButton>
                {this.displayCardModal(currentMessage)}
            </div>
        );
    }
}

export default Ia;