import * as React from 'react';
import './roleselect.css';
import { Card, CardHeader } from '@material-ui/core';
import T from 'i18n-react';
import { Role } from '../../interfaces/Role';
import { selectRole, getPlayerStory, updateRole } from '../../utils/api';
import { Redirect } from 'react-router';
import { Story } from '../../interfaces/Story';
import Loader from '../../components/loader/Loader';

interface Props {

}
interface State {
    roles: Array<Role>
    role: Role
    selectable: boolean,
    redirect: boolean,
    story: Story,
}

class RoleSelect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            story: null,
            role: null,
            roles: [],
            selectable: true,
            redirect: false
        }

        getPlayerStory((err: any, response: any) => {
            this.setState({
                roles: response.roles.filter((el: any) => el != null),
                story: response.story
            });
        });

        updateRole((err: any, role: Role) => {
            let roles = this.state.roles;

            this.state.roles.forEach((r, i) => {
                if (r.id === role.id) {
                    roles[i] = role;
                }
            });
            this.setState({ roles: roles });
        });

        this.handleSelect = this.handleSelect.bind(this);
    }

    public handleSelect(evt: any) {
        if (!this.state.selectable) return;

        let roles = this.state.roles
        let role = roles[evt.target.dataset.index];

        if (role && !role.disabled) {
            role.disabled = true;
            this.setState({
                roles: roles,
                selectable: false
            });
            selectRole(role.id, (err: any, response: boolean) => {
                if (response) {
                    // le role a été choisi on attend que tous les joueurs soient prets
                    this.setState({
                        role: this.state.roles.find((r) => { return r.id === role.id }),
                        redirect: true
                    });
                } else {
                    // le role ne peut etre choisi
                }
            });
        } else {
            //TODO error message
        }
    }

    public render() {

        if (this.state.redirect) {
            return (<Redirect to={{ pathname: "gamescene", state: this.state.role }} />);
        } else if (!this.state.story) {
            return (
                <Loader textKey="loader.gamemasterwait" />
            );
        } else {

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
}

export default RoleSelect;