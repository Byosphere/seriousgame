import * as React from 'react';
import './timeline.css';
import T from 'i18n-react';
import { Card, CardHeader, Stepper, Step, StepLabel } from '@material-ui/core';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';
import { Person, PersonPin } from '@material-ui/icons';

interface Props {
    story: Story
    status: number
}

interface State {
    steps: Array<Action>
}

class Timeline extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let init = [
            new Action(null, T.translate('instructor.roleselect').toString())
        ];

        this.state = {
            steps: init.concat(this.props.story.actions)
        }
    }

    public render() {
        return (
            <Card className="timeline">
                <CardHeader
                    title={T.translate('instructor.gametitle') + this.props.story.name}
                    component="h2"
                />
                <Stepper activeStep={this.props.status} alternativeLabel>
                    {this.state.steps.map((action, i) => {
                        return (
                            <Step key={action.id}>
                                <StepLabel icon={i ? i : (<PersonPin className="person-pin" />)}>{action.name}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Card>
        );
    }
}

export default Timeline;