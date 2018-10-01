import * as React from 'react';
import './player.css';
import { Card, CardHeader } from '@material-ui/core';
import T from 'i18n-react';
import * as Roles from '../../data/roles.json';
import { selectRole } from '../../utils/api';

interface Props {

}
interface State {
    roles: Array<Role>
}

interface Role {
    id: number,
    name: string,
    description: string,
    disabled: Boolean
}

class Player extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            roles: Roles.roles
        }
        this.handleSelect = this.handleSelect.bind(this);
    }

    public handleSelect(evt: any) {
        let roles = this.state.roles
        let role = roles.find((el) => {
            return el.id === parseInt(evt.target.dataset.id);
        });

        if (role) {
            role.disabled = true;

            this.setState({
                roles: roles
            });
            selectRole(parseInt(evt.target.dataset.id), (err: any, response: boolean) => {
                if (response) {
                    // le role a été choisi
                    role.disabled = false;
                    
                } else {
                    // le role ne peut etre choisi
                }
            });
        } else {
            //TODO error message
        }

    }

    public render() {
        let cpt = 1;
        return (
            <div className="player">
                <h1>{T.translate('player.titleselect')}</h1>
                {this.state.roles.map(role => {
                    return (
                        <Card data-id={role.id} key={role.id} onClick={this.handleSelect} className={"card-" + cpt++ + (this.state.roles.length > 3 ? "" : " large") + (role.disabled ? " disabled" : "")}>
                            <CardHeader
                                title={role.name}
                                subheader={role.description}
                            />
                        </Card>
                    );
                })}
            </div>
        );
    }
}

export default Player;