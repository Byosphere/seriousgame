import * as React from 'react';
import './timeline.css';
import T from 'i18n-react';
import { Card, CardHeader, Stepper, Step, StepLabel } from '@material-ui/core';
import { Story } from '../../interfaces/Story';

interface Props {
    story: Story
    status: number
}

interface State {
    activeStep: number
    steps: Array<Action>
}

class Timeline extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            activeStep: 0,
            steps: this.props.story.actions
        }
    }

    public render() {
        return (
            <Card className="timeline">
                <CardHeader
                    title={T.translate('instructor.gametitle') + this.props.story.name}
                    component="h2"
                />
                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {this.state.steps.map(action => {
                        return (
                            <Step key={action.id}>
                                <StepLabel>{action.name}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Card>
        );
    }
}

export default Timeline;