import * as React from 'react';
import './roleselect.css';
import { Card, CardHeader } from '@material-ui/core';
import T from 'i18n-react';
import { Role } from '../../interfaces/Role';
import { selectRole, getStory } from '../../utils/api';
import { Redirect } from 'react-router';
import { Story } from '../../interfaces/Story';
import { ORANGE } from '../../utils/constants';
import { GridLoader } from 'halogenium';

interface Props {

}
interface State {
    roles: Array<Role>
    selectable: boolean,
    redirect: boolean,
    story: Story,
    loaderText: string
}

class RoleSelect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            story: null,
            roles: [],
            selectable: true,
            redirect: false,
            loaderText: 'loader.gamemasterwait'
        }

        getStory((err: any, response: any) => {
            this.setState({
                roles: response.roles.filter((el: any) => el != null),
                story: response.story
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
            selectRole(role.id, (err: any, response: boolean) => {
                if (response) {
                    // le role a été choisi on attend que tous les joueurs soient prets
                    this.setState({ redirect: true });
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
            return (<Redirect to='gamescene' />);
        } else if (!this.state.story) {
            return (
                <div>
                    <GridLoader className="loader" color={ORANGE} size="50px" />
                    <p className="sub-loader">{T.translate(this.state.loaderText)}</p>
                </div>
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