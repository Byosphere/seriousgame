import * as React from 'react';
import './player.css';
import { Card, CardHeader } from '@material-ui/core';
import T from 'i18n-react';
import { Role } from '../../interfaces/Role';
import { selectRole, getRoles } from '../../utils/api';

interface Props {

}
interface State {
    roles: Array<Role>
    selectable: boolean
}

class Player extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            roles: [],
            selectable: true
        }

        getRoles((err: any, roles: Array<Role>) => {
            this.setState({
                roles: roles
            });
        });

        this.handleSelect = this.handleSelect.bind(this);
    }

    public handleSelect(evt: any) {
        if (!this.state.selectable) return;
        this.setState({ selectable: false });

        let roles = this.state.roles
        let role = roles[evt.target.dataset.index];

        if (role) {
            role.disabled = true;

            this.setState({
                roles: roles
            });
            selectRole(parseInt(evt.target.dataset.index), (err: any, response: boolean) => {
                if (response) {
                    // le role a été choisi

                } else {
                    // le role ne peut etre choisi
                }
            });
        } else {
            //TODO error message
        }

    }

    public render() {
        let cpt = 0;
        return (
            <div className="player">
                <h1>{T.translate('player.titleselect')}</h1>
                {this.state.roles.map(role => {
                    return (
                        <Card data-index={cpt} key={role.id} onClick={this.handleSelect} className={"card-" + cpt++ + (this.state.roles.length > 3 ? "" : " large") + (role.disabled ? " disabled" : "")}>
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