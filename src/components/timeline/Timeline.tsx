import * as React from 'react';
import './timeline.css';
import T from 'i18n-react';
import { Card, CardHeader, Stepper, Step, StepLabel, StepContent, Button } from '@material-ui/core';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';
import { Person, PersonPin } from '@material-ui/icons';
import { ROLE_SELECT } from 'src/utils/constants';

interface Props {
    story: Story
    status: number
    sendAction: Function
}

interface State {
    steps: Array<Action>
}

class Timeline extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let init = [
            new Action(ROLE_SELECT, T.translate('instructor.roleselect').toString())
        ];

        this.state = {
            steps: init.concat(this.props.story.actions)
        }
    }

    public componentDidUpdate() {
        document.getElementById(this.state.steps[this.props.status].id).scrollIntoView({behavior: 'smooth'});
    }

    public getNext(i: number): Action {
        return this.state.steps[i + 1];
    }

    public render() {

        return (
            <Card className="timeline">
                <CardHeader
                    title={T.translate('instructor.gametitle') + this.props.story.name}
                    component="h2"
                />
                <Stepper orientation="vertical" activeStep={this.props.status} style={{ maxHeight: "calc(100% - 64px)", overflow: "auto" }}>
                    {this.state.steps.map((action, i) => {
                        let nextAction = this.getNext(i);
                        return (
                            <Step key={action.id} id={action.id}>
                                <StepLabel icon={i ? i : (<PersonPin className="person-pin" />)}>{action.name}</StepLabel>
                                <StepContent>
                                    {action.id === ROLE_SELECT && <p>
                                        {T.translate("instructor.player.no-role")}
                                    </p>}
                                    {action.description && <p>{action.description}</p>}
                                    {(nextAction && nextAction.master) && <div>
                                        <Button
                                            onClick={() => { this.props.sendAction(nextAction.id) }}
                                            variant="contained"
                                            color="primary">
                                            {T.translate('action.next') + nextAction.name}
                                        </Button>
                                    </div>}
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
            </Card>
        );
    }
}

export default Timeline;