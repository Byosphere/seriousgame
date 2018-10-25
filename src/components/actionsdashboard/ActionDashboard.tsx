import * as React from 'react';
import './actionsdashboard.css';
import T from 'i18n-react';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';
import { gridConvertToCss } from '../../utils/tools';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';

interface Props {
    story: Story
    sendAction: Function
}

interface State {
    masterActions: Array<Action>
    gridStyle: any
}

class ActionsDashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let masterActions = this.props.story.actions.filter((a: Action) => { return a.master });
        let gridSize = gridConvertToCss(Math.ceil(Math.sqrt(masterActions.length)));
        this.state = {
            masterActions: masterActions,
            gridStyle: {
                gridTemplateColumns: gridSize,
                gridTemplateRows: gridSize,
            }
        }
    }

    public sendAction(evt: any, actionId: string) {
        evt.currentTarget.disabled = true;
        this.props.sendAction(actionId);
    }

    public render() {
        return (
            <Card className="actions-dashboard">
                <CardHeader
                    title={T.translate('instructor.actionstitle')}
                    component="h2"
                />
                <CardContent className="action-grid" style={this.state.gridStyle}>
                    {this.state.masterActions.map((action) => {
                        return (
                            <div className="master-action" key={action.id}>
                                <h3>{action.name}</h3>
                                <p>{action.description}</p>
                                <Button onClick={(evt) => { this.sendAction(evt, action.id) }} variant="outlined" color="primary">Envoyer</Button>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        );
    }
}

export default ActionsDashboard;