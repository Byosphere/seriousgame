import * as React from 'react';
import './ia.css';
import { Card, IconButton, Avatar, Badge, CardContent } from '@material-ui/core';
import { Close, Textsms } from '@material-ui/icons';
import AvatarImage from '../../images/avatar.jpg';
import Message from 'src/interfaces/Message';
import { sendAction } from 'src/utils/api';

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

    public handleClick(currentMessage: Message) {
        if (!currentMessage) return;

        this.setState({ displayMessage: !this.state.displayMessage, vu: true });
        if(currentMessage.clickAction) {
            sendAction(currentMessage.clickAction);
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
                        <p>{currentMessage.text}</p>
                    </CardContent>
                </Card>
            );
        }
    }

    public displayIaAvatar(displayMessage: boolean, currentMessage: Message, vu: boolean) {
        if (currentMessage && currentMessage.force && !vu) {
            if (displayMessage) {
                return (
                    <Badge badgeContent={1} color="default">
                        <Avatar alt="IA" >
                            <Textsms />
                        </Avatar>
                    </Badge>
                );
            } else {
                return (
                    <Badge className='badge' badgeContent={1} color="default">
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
                <IconButton onClick={() => { this.handleClick(currentMessage) }}>
                    {this.displayIaAvatar(this.state.displayMessage, currentMessage, this.state.vu)}
                </IconButton>
                {this.displayCardModal(currentMessage)}
            </div>
        );
    }
}

export default Ia;