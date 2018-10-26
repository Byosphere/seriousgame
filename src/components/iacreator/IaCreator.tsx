import * as React from 'react';
import './iacreator.css';
import T from 'i18n-react';
import { Card, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { connect } from 'react-redux';
import { HAUT } from 'src/utils/constants';
import Action from 'src/interfaces/Action';
import Message from 'src/interfaces/Message';

interface State {
    currentMessage: Message
}

interface Props {
    messages: Array<Message>
    currentAction: Action
}

class IaCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            currentMessage: new Message()
        }
    }

    handleChange(evt: any, name: string): any {
        let cm = this.state.currentMessage;
        cm[name] = evt.target.value;
        this.setState({
            currentMessage: cm
        });
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        let message = null;
        if (props.currentAction) {
            if (props.currentAction.id !== state.currentMessage.action) {
                message = props.messages.find((message: Message) => { return props.currentAction.id === message.action })
            }
        } else {
            message = props.messages.find((message: Message) => { return !message.action })
        }

        if (!message) {
            message = { text: '', position: HAUT, force: 1, action: props.currentAction ? props.currentAction.id : null }
        }

        return {
            currentMessage: message
        };
    }

    public render() {

        return (
            <Card className="ia-creator">
                <h3>{T.translate('ia.message')}</h3>
                <TextField
                    id="ia-text"
                    label={T.translate('ia.text')}
                    multiline
                    rowsMax="12"
                    rows="12"
                    value={this.state.currentMessage.text}
                    onChange={(evt) => { this.handleChange(evt, 'text') }}
                    margin="normal"
                    variant="outlined"
                    style={{ marginLeft: "23px" }}
                />
                <FormControl style={{ margin: "5px 0 0 23px" }} component="fieldset">
                    <FormLabel component="legend">{T.translate('ia.position')}</FormLabel>
                    <RadioGroup
                        style={{ flexDirection: "row" }}
                        aria-label="position"
                        name="position"
                        value={this.state.currentMessage.position}
                        onChange={evt => { this.handleChange(evt, 'position') }}
                    >
                        <FormControlLabel value="haut" control={<Radio color="primary" />} label={T.translate('ia.haut')} />
                        <FormControlLabel value="bas" control={<Radio color="primary" />} label={T.translate('ia.bas')} />
                    </RadioGroup>
                </FormControl>
            </Card>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        currentAction: state.story.action
    }
}

export default connect(mapStateToProps, {})(IaCreator);