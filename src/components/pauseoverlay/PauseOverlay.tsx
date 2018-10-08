import * as React from 'react';
import './pauseoverlay.css';
import { Pause } from '@material-ui/icons';

class PauseOverlay extends React.Component {

    public render() {
        return (
            <div className="pause-overlay">
                <Pause />
            </div>
        );
    }
}

export default PauseOverlay;