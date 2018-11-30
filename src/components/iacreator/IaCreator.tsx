import * as React from 'react';
import './iacreator.css';
import T from 'i18n-react';
import { Card, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Select, OutlinedInput, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import { HAUT } from 'src/utils/constants';
import Action from 'src/interfaces/Action';
import Message from 'src/interfaces/Message';
import { Add, Delete } from '@material-ui/icons';
import { displayConfirmDialog } from 'src/actions/snackbarActions';

interface State { }

interface Props {
    messages: Array<Message>
    currentAction: Action
    displayConfirmDialog: Function
    actions: Array<Action>
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
                    <p style={{ fontSize: "0.9rem", margin: "15px 0 0 0", opacity: 0.7 }}>
                        {T.translate('ia.informations')}
                    </p>
                    <TextField
                        id="ia-text"
                        label={T.translate('ia.text')}
                        multiline
                        rowsMax="8"
                        rows="8"
                        value={message.text}
                        onChange={(evt) => { this.handleChange(evt, 'text', message) }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                    <FormControl style={{ marginTop: "10px" }} variant="outlined" fullWidth>
                        <Select
                            fullWidth
                            value={message.clickAction}
                            onChange={event => { this.handleChange(event, 'clickAction', message) }}
                            displayEmpty
                            input={
                                <OutlinedInput
                                    fullWidth
                                    labelWidth={0}
                                    name="clickAction"
                                    id="outlined-action"
                                />
                            } >
                            <MenuItem value=''><i style={{ opacity: 0.5 }}>{T.translate('action.none')}</i></MenuItem>
                            {this.props.actions.map((action, i) => {
                                return (
                                    <MenuItem key={i} value={action.id}>{action.name}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Tooltip placement="left" title={T.translate('generic.delete')}>
                        <IconButton className="ia-delete" onClick={() => { this.deleteMessage() }} color="primary" aria-label="Delete">
                            <Delete />
                        </IconButton>
                    </Tooltip>
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
        currentAction: state.story.action,
        actions: state.story.story.actions
    }
}

export default connect(mapStateToProps, { displayConfirmDialog })(IaCreator);