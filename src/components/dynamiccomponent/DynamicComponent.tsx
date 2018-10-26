import * as React from 'react';
import ImageClickable from '../imageclickable/ImageClickable';
import ActionButton from '../actionbutton/ActionButton';
import { sendAction } from 'src/utils/api';
import QuizzDialog from '../quizzdialog/QuizzDialog';
import Component from 'src/interfaces/Component';

interface Props {
    component: Component
    style: any
    lastAction: string
}

interface State {
    display: boolean
}

class DynamicComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            display: !Boolean(props.component.actionToDisplay)
        }
    }

    public dispatchAction(actionId: string) {
        if (actionId) sendAction(actionId);
    }

    public canRenderComponent(): boolean {
        let cmpnt = this.props.component;

        if (this.state.display) {
            if (cmpnt.actionToHide && cmpnt.actionToHide === this.props.lastAction) {
                this.setState({ display: false });
                return false;
            } else {
                return true;
            }
        } else {
            if (cmpnt.actionToDisplay && cmpnt.actionToDisplay === this.props.lastAction) {
                this.setState({ display: true });
                return true;
            } else {
                return false;
            }
        }
    }

    public selectComponent() {
        switch (this.props.component.name) {
            case 'ImageClickable':
                return (<ImageClickable component={this.props.component} lastAction={this.props.lastAction} sendAction={this.dispatchAction} />);

            case 'ActionButton':
                return (<ActionButton component={this.props.component} lastAction={this.props.lastAction} sendAction={this.dispatchAction} />);

            case 'Quizz':
                return (<QuizzDialog component={this.props.component} lastAction={this.props.lastAction} sendAction={this.dispatchAction} />);

            case '':
                return (<div></div>);

            default:
                throw ("Le composant " + this.props.component.name + " n'existe pas.");
        }
    }

    public render() {
        if (!this.canRenderComponent()) return null;

        return (
            <div className="component-container" style={this.props.style}>
                {this.selectComponent()}
            </div>
        );
    }
}

export default DynamicComponent;