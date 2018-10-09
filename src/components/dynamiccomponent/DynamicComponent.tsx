import * as React from 'react';

interface Props {
    componentName: string
    style: any
}

interface State {

}

class DynamicComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        switch (this.props.componentName) {
            case 'ImageClickable':
                return (<div className={this.props.componentName} style={this.props.style}>Component à créer</div>);

            case '':
                return (<div></div>);

            case '':
                return (<div></div>);

            case '':
                return (<div></div>);

            default:
                throw ("Le composant " + this.props.componentName + " n'existe pas.");
        }

    }
}

export default DynamicComponent;