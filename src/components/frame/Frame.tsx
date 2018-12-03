import * as React from 'react';
import './frame.css';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import T from 'i18n-react';
import logo from 'src/logo.png';

interface Props { }
interface State { }

class Frame extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }


    public closeApp() {
        window.close();
    }

    public render() {
        return (
            <div className="frame">
                <img src={logo} alt="logo" style={{ marginLeft: "10px", height:"100%" }} />
                <h1 className="app-title">{T.translate('appname')}</h1>
                <IconButton onClick={() => { this.closeApp() }} color="secondary" aria-label="Close">
                    <Close />
                </IconButton>
            </div>
        );
    }
}

export default Frame;