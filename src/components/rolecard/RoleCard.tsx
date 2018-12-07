import * as React from 'react';
import './rolecard.css';
import { Card, CardContent } from '@material-ui/core';
import Role from 'src/interfaces/Role';
import T from 'i18n-react';
import { Person } from '@material-ui/icons';
import { getServerAddr } from 'src/utils/api';

interface Props {
    onClick?: Function
    role: Role
    editor?: boolean
}

interface State { }

class RoleCard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <Card style={{ background: this.props.role.color }} onClick={(event: any) => { if (!this.props.editor) this.props.onClick(event); }} className={"role-card " + (this.props.role.disabled ? " disabled" : "") + " " + this.props.role.theme} >
                <div className="card-avatar">
                    <div>
                        {(this.props.role.image && this.props.role.image !== "images/") && <img src={getServerAddr() + this.props.role.image} alt={this.props.role.name} />}
                        {(this.props.role.image === "images/" ) && <Person />}
                    </div>
                </div>
                <CardContent>
                    <span className="titraille">{T.translate('role.surtitre')}</span>
                    <h2>{this.props.role.name}</h2>
                    <span className="titraille">{this.props.role.soustitre}</span>
                    <p className="description" dangerouslySetInnerHTML={{ __html: this.props.role.description }}></p>
                </CardContent>
            </Card>
        );
    }
}

export default RoleCard;