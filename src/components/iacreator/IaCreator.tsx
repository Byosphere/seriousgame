import * as React from 'react';
import './iacreator.css';
import T from 'i18n-react';
import { Card, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { HAUT } from 'src/utils/constants';
import Action from 'src/interfaces/Action';
import Message from 'src/interfaces/Message';
import { Add } from '@material-ui/icons';
import { displayConfirmDialog } from 'src/actions/snackbarActions';

interface State { }

interface Props {
    messages: Array<Message>
    currentAction: Action
    displayConfirmDialog: Function
}

class IaCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public handleChange(evt: any, name: string, message: Message) {
        message[name] = evt.target.value;
        this.forceUpdate();
    }

    public addMessage() {
        this.props.messages.push(new Message('', HAUT, 1, this.props.currentAction.id));
        this.forceUpdate();
    }

    public deleteMessage() {
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('ia.confirmdelete'),
            confirm: () => {
                this.props.messages.splice(this.props.messages.findIndex(message => { return message.action === this.props.currentAction.id }), 1);
                this.forceUpdate();
            }
        });
    }

    public render(): any {

        let message = this.props.currentAction ? this.props.messages.find(message => { return message.action === this.props.currentAction.id }) : null;
        if (message) {
            return (
                <Card className="ia-creator">
                    <h3>{T.translate('ia.message')}</h3>
                    <TextField
                        id="ia-text"
                        label={T.translate('ia.text')}
                        multiline
                        rowsMax="12"
                        rows="12"
                        value={message.text}
                        onChange={(evt) => { this.handleChange(evt, 'text', message) }}
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
                            value={message.position}
                            onChange={evt => { this.handleChange(evt, 'position', message) }}
                        >
                            <FormControlLabel value="haut" control={<Radio color="primary" />} label={T.translate('ia.haut')} />
                            <FormControlLabel value="bas" control={<Radio color="primary" />} label={T.translate('ia.bas')} />
                        </RadioGroup>
                    </FormControl>
                    <Button onClick={() => { this.deleteMessage() }} color="primary">{T.translate('generic.delete')}</Button>
                </Card>
            );
        } else {
            return (
                <Card className="ia-creator empty">
                    <h3>{T.translate('ia.message')}</h3>
                    <Button onClick={() => { this.addMessage() }} variant="fab" color="primary" aria-label="Add">
                        <Add />
                    </Button>
                    <p>{T.translate('ia.add')}</p>
                </Card>
            );
        }


    }
}

function mapStateToProps(state: any) {
    return {
        currentAction: state.story.action
    }
}

export default connect(mapStateToProps, { displayConfirmDialog })(IaCreator);