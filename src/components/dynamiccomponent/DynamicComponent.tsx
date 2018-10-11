import * as React from 'react';
import ImageClickable from '../imageclickable/ImageClickable';

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
    }

    public render() {
        switch (this.props.component.name) {
            case 'ImageClickable':
                return (<ImageClickable component={this.props.component} lastAction={this.props.lastAction} />);

            case '':
                return (<div></div>);

            case '':
                return (<div></div>);

            case '':
                return (<div></div>);

            default:
                throw ("Le composant " + this.props.component.name + " n'existe pas.");
        }

    }
}

export default DynamicComponent;