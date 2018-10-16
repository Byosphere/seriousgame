import * as React from 'react';
import T from 'i18n-react';
import { ORANGE } from '../../utils/constants';
import { GridLoader } from 'halogenium';
import './loader.css';
import { Button } from '@material-ui/core';

interface Props {
    textKey: string
    color?: string
    button?: string
    buttonAction?: Function
}
interface State { }

class Loader extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div>
                <GridLoader className="loader" color={this.props.color || ORANGE} size="50px" />
                <p className="sub-loader">{T.translate(this.props.textKey)}</p>
                {this.props.button && <div className="load-button"><Button variant="contained" onClick={() => { this.props.buttonAction() }} color="primary" >{T.translate(this.props.button)}</Button></div>}
            </div>
        );
    }
}

export default Loader;