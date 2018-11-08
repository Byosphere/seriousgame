import * as React from 'react';
import { sendAction } from 'src/utils/api';
import Component from 'src/interfaces/Component';
import { DYNAMIC_COMPONENTS, PLACEMENT } from 'src/utils/constants';

interface Props {
    component: Component
    style: any
    lastAction: string
}

interface State {

}

class DynamicComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {}
    }

    public dispatchAction(actionId: string) {
        if (actionId) sendAction(actionId);
    }

    public canRenderComponent(): boolean {
        let cmpnt = this.props.component;
        let currentAction = this.props.lastAction;
        return Boolean(cmpnt.actionToDisplay.find((actionId: string) => { return actionId === currentAction }));
    }

    public selectComponent() {
        let Cmp = DYNAMIC_COMPONENTS[this.props.component.type];
        if (Cmp) {
            return (<Cmp component={this.props.component} lastAction={this.props.lastAction} sendAction={this.dispatchAction} />);
        } else {
            throw ("Le composant " + this.props.component.type + " n'existe pas.");
        }
    }

    public render() {
        if (!this.canRenderComponent()) return null;
        this.props.style.display = "flex";
        this.props.style.overflow = "hidden";
        switch (this.props.component.position) {
            case PLACEMENT[0]:
                this.props.style.alignItems = "center";
                this.props.style.justifyContent = "center";
                break;
            case PLACEMENT[1]:
                this.props.style.alignItems = "flex-start";
                this.props.style.justifyContent = "flex-start";
                break;
            case PLACEMENT[2]:
                this.props.style.alignItems = "flex-start";
                this.props.style.justifyContent = "flex-end";
                break;
            case PLACEMENT[3]:
                this.props.style.alignItems = "flex-end";
                this.props.style.justifyContent = "flex-start";
                break;
            case PLACEMENT[4]:
                this.props.style.alignItems = "flex-end";
                this.props.style.justifyContent = "flex-end";
                break;
            case PLACEMENT[5]:
                this.props.style.alignItems = "flex-start";
                this.props.style.justifyContent = "center";
                break;
            case PLACEMENT[6]:
                this.props.style.alignItems = "flex-end";
                this.props.style.justifyContent = "center";
                break;
        }

        return (
            <div className="component-container" style={this.props.style}>
                {this.selectComponent()}
            </div>
        );
    }
}

export default DynamicComponent;