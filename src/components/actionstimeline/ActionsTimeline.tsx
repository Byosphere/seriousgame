import * as React from 'react';
import './actionstimeline.css';
import T from 'i18n-react';
import { Card, Stepper, StepLabel, Step, StepContent, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { ACTION_INITIAL } from 'src/utils/constants';
import { connect } from 'react-redux';
import { selectCurrentAction } from 'src/actions/storyActions';
import Action from 'src/interfaces/Action';

interface Props {
    actions: Array<Action>
    status?: number
    selectCurrentAction: Function
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
    }

    public handleStep(index: number) {
        if (index !== this.state.step) {
            this.setState({ step: index });
            if (index === 0) {
                this.props.selectCurrentAction(null);
            } else {
                this.props.selectCurrentAction(this.props.actions[index]);
            }

        }
    }

    public handleChange(event: any, name: string): any {
        if (name === 'master') this.props.actions[this.state.step][name] = event.target.checked;
        else this.props.actions[this.state.step][name] = event.target.value;
        this.forceUpdate();
    }

    public addAction(): any {
        let id = 'action';
        if (this.props.actions.length === 1) {
            id = 'action1';
        } else {
            id += parseInt(this.props.actions[this.props.actions.length - 1].id.substring(6)) + 1;
        }
        this.props.actions.push(new Action(id, T.translate('action.defaultname').toString()));
        this.handleStep(this.props.actions.length - 1);
    }

    public deleteAction(index: number) {
        this.props.actions.splice(index, 1);
        this.handleStep(index - 1);
    }

    public render() {
        return (
            <Card className="actions-timeline">
                <h3>Liste des actions</h3>
                <Stepper className="stepper" activeStep={this.state.step} nonLinear orientation="vertical">
                    {this.props.actions.map((action, i) => {
                        return (
                            <Step style={{ cursor: "pointer" }} onClick={() => { this.handleStep(i) }} key={i}>
                                <StepLabel>{action.name}</StepLabel>
                                {action.id !== ACTION_INITIAL && <StepContent>
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
                <Button color="primary" onClick={() => { this.addAction() }}>{T.translate('action.add')}</Button>
            </Card>
        );
    }

}

export default connect(null, { selectCurrentAction })(ActionsTimeline);