import * as React from 'react';
import './actionstimeline.css';
import T from 'i18n-react';
import { Card, CardHeader, Stepper, Step, StepLabel } from '@material-ui/core';
import { Story } from '../../interfaces/Story';

interface Props {
    actions: Array<Action>
    status?: number
}

interface State {
    steps: Array<Action>
}

class ActionsTimeline extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            steps: null
        }
    }

    public render() {
        return (
            <Card className="actions-timeline">
                {/* <Stepper activeStep={this.props.status} alternativeLabel>
                    {this.state.steps.map(action => {
                        return (
                            <Step key={action.id}>
                                <StepLabel>{action.name}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper> */}
            </Card>
        );
    }
}

export default ActionsTimeline;