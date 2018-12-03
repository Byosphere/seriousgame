import * as React from 'react';
import './actionstimeline.css';
import T from 'i18n-react';
import { Card, Stepper, StepLabel, Step, StepContent, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { ACTION_INITIAL, ACTION_FINALE } from 'src/utils/constants';
import { connect } from 'react-redux';
import { selectCurrentAction } from 'src/actions/storyActions';
import Action from 'src/interfaces/Action';
import { displayConfirmDialog } from 'src/actions/snackbarActions';

interface Props {
    actions: Array<Action>
    selectCurrentAction: Function
    displayConfirmDialog: Function
}

interface State {
    step: number
}

class ActionsTimeline extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            step: 0
        }
        this.props.selectCurrentAction(this.props.actions[0]);
    }

    public handleStep(index: number) {
        if (index !== this.state.step) {
            this.setState({ step: index });
            this.props.selectCurrentAction(this.props.actions[index]);
        }
    }

    public handleChange(event: any, name: string): any {
        if (name === 'master') this.props.actions[this.state.step][name] = event.target.checked;
        else this.props.actions[this.state.step][name] = event.target.value;
        this.forceUpdate();
    }

    public componentWillReceiveProps() {
        this.setState({ step: 0 });
    }

    public addAction() {
        let id = 1;
        if (this.props.actions.length !== 2) {
            let action: Action = null;
            do {
                id++;
                action = this.props.actions.find(action => {
                    let aid = parseInt(action.id.substring(6));
                    return aid === id;
                });
            } while (action);
        }
        this.props.actions.splice(this.state.step + 1, 0, new Action("action" + id, T.translate('action.defaultname').toString()));
        this.handleStep(this.state.step + 1);
    }

    public deleteAction(index: number) {
        this.props.displayConfirmDialog({
            title: T.translate('generic.warning'),
            content: T.translate('action.confirmdelete'),
            confirm: () => {
                this.props.actions.splice(index, 1);
                this.handleStep(index - 1);
            }
        });
    }

    public render() {

        return (
            <Card className="actions-timeline">
                <h3>{T.translate('action.list')}</h3>
                <p style={{ fontSize: "0.9rem", margin: "15px 1.5em", opacity: 0.7 }}>
                    {T.translate('action.informations')}
                </p>
                <Stepper className="stepper" activeStep={this.state.step} nonLinear orientation="vertical">
                    {this.props.actions.map((action, i) => {
                        return (
                            <Step style={{ cursor: "pointer" }} onClick={() => { this.handleStep(i) }} key={i}>
                                <StepLabel>{action.name}</StepLabel>
                                {(action.id !== ACTION_INITIAL && action.id !== ACTION_FINALE) && <StepContent>
                                    <div>
                                        <TextField
                                            id="action-name"
                                            label={T.translate('action.name')}
                                            value={action.name}
                                            onChange={event => { this.handleChange(event, 'name') }}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                        <TextField
                                            id="action-description"
                                            label={T.translate('action.description')}
                                            multiline
                                            rowsMax="4"
                                            rows="4"
                                            value={action.description}
                                            onChange={event => { this.handleChange(event, 'description') }}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                        <FormControlLabel
                                            style={{ margin: "5px 0" }}
                                            control={
                                                <Checkbox
                                                    checked={action.master}
                                                    onChange={event => { this.handleChange(event, 'master') }}
                                                    value="checkmaster"
                                                    color="primary"
                                                />
                                            }
                                            label={T.translate('action.master')}
                                        />
                                        <Button color="primary" mini onClick={() => { this.deleteAction(i) }}>{T.translate('action.delete')}</Button>
                                    </div>
                                </StepContent>}
                            </Step>
                        );
                    })}
                </Stepper>
                <Button disabled={this.state.step === this.props.actions.length - 1} color="primary" onClick={() => { this.addAction() }}>{T.translate('action.add')}</Button>
            </Card>
        );
    }

}

export default connect(null, { selectCurrentAction, displayConfirmDialog })(ActionsTimeline);