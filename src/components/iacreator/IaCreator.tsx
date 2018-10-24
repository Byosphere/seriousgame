import * as React from 'react';
import './iacreator.css';
import T from 'i18n-react';
import { Card } from '@material-ui/core';

interface State {

}

interface Props {
    messages: Array<Message>
}

class IaCreator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <Card className="ia-creator">
                <h3>{T.translate('ia.message')}</h3>
                
            </Card>
        );
    }
}

export default IaCreator;