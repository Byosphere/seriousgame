import * as React from 'react';
import './ia.css';
import { Card, IconButton, Avatar, Badge, CardContent } from '@material-ui/core';
import { Close, Textsms } from '@material-ui/icons';
import Message from 'src/interfaces/Message';
import { sendAction, getServerAddr } from 'src/utils/api';
import { connect } from 'react-redux';
import DialogCard from '../dialogcard/dialogCard';
import { Parameters } from 'src/interfaces/Parameters';

interface State {
    displayMessage: boolean
    vu: boolean
}

interface Props {
    messages: Array<Message>
    lastAction: string
    params: Parameters
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
    }

    public handleClose(currentMessage: Message) {
        this.setState({ displayMessage: false })
        if (currentMessage.clickAction) {
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

    public getCurrentMessage(): Message {
        if (!this.props.messages || !this.props.messages.length) return null;
        return this.props.messages.find((m: Message) => {
            return m.action === this.props.lastAction;
        });
    }

    public displayCardModal(currentMessage: Message): any {
        if (this.state.displayMessage && currentMessage) {
            return (
                <DialogCard
                    position={currentMessage.position}
                    imageIa={this.props.params.imageIa}
                    onClose={() => this.handleClose(currentMessage)}
                    textMessage={currentMessage.text}
                />
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
                        <Avatar alt="IA" src={getServerAddr() + this.props.params.imageIa} />
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
                    <Avatar alt="IA" src={getServerAddr() + this.props.params.imageIa} />
                );
            }
        }
    }

    public render() {

        let currentMessage = this.getCurrentMessage();

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

function mapStateToProps(state: any) {
    return {
        params: state.connector.params
    }
}

export default connect(mapStateToProps, {})(Ia);