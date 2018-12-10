import * as React from 'react';
import './roleselect.css';
import T from 'i18n-react';
import { selectRole, getPlayerStory, updateRole } from '../../utils/api';
import Loader from '../../components/loader/Loader';
import Story from 'src/interfaces/Story';
import Role from 'src/interfaces/Role';
import RoleCard from 'src/components/rolecard/RoleCard';

interface Props {
    selectRole: Function
    changeServer: Function
}
interface State {
    roles: Array<Role>
    role: Role
    selectable: boolean,
    story: Story,
}

class RoleSelect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            story: null,
            role: null,
            roles: [],
            selectable: true
        }

        getPlayerStory((err: any, response: any) => {
            this.setState({
                roles: response.roles,
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

    public handleSelect(evt: any, role: Role) {
        if (!this.state.selectable) return;

        let roles = this.state.roles

        if (role && !role.disabled) {
            role.disabled = true;
            this.setState({
                roles: roles,
                selectable: false
            });
            selectRole(role.id, (err: any, response: boolean) => {
                if (response) {
                    // le role a été choisi on attend que tous les joueurs soient prets
                    this.props.selectRole(this.state.roles.find((r) => { return r.id === role.id }));
                } else {
                    // le role ne peut etre choisi
                }
            });
        }
    }

    public render() {

        if (!this.state.story) {
            return (
                <Loader button="server.change" buttonAction={() => { this.props.changeServer() }} textKey="loader.gamemasterwait" />
            );
        } else if (this.state.roles.length && this.state.story) {

            return (
                <div className="player">
                    <h1>{T.translate('player.titleselect')}</h1>
                    <div className="role-cards">
                        {this.state.roles.map((role, i) => {
                            return (
                                <RoleCard key={i} onClick={(event: any) => { this.handleSelect(event, role) }} role={role} />
                            );
                        })}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default RoleSelect;