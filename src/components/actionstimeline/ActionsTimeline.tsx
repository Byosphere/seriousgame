import * as React from 'react';
import './actionstimeline.css';
import T from 'i18n-react';
import { Card, Stepper, StepLabel, StepButton, Step, StepContent, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { ACTION_INITIAL } from 'src/utils/constants';

interface Props {
    actions: Array<Action>
    status?: number
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

        this.props.actions.unshift({ id: ACTION_INITIAL, name: T.translate('action.initial').toString() });
    }

    public handleStep(index: number) {
        if (index !== this.state.step) {
            this.setState({ step: index });
        }

    }

    public handleChange(arg0: string): any {
        //throw new Error("Method not implemented.");
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
                                            onChange={() => { this.handleChange('name') }}
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
                                            onChange={() => { this.handleChange('description') }}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                        <FormControlLabel
                                            style={{ margin: "5px 0" }}
                                            control={
                                                <Checkbox
                                                    checked={action.master}
                                                    onChange={this.handleChange('master')}
                                                    value="checkmaster"
                                                    color="primary"
                                                />
                                            }
                                            label={T.translate('action.master')}
                                        />
                                    </div>
                                </StepContent>}
                            </Step>
                        );
                    })}
                    <Button color="primary">Ajouter une action</Button>
                </Stepper>
            </Card>
        );
    }
}

export default ActionsTimeline;