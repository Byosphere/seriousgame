import * as React from 'react';
import { Card, CardHeader, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { Person, Delete } from '@material-ui/icons';
import T from 'i18n-react';
import './playerlist.css';
import { ejectPlayer } from 'src/utils/api';

interface State {

}

interface Props {
    players: Array<Player>
}

class playerList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public getPlayerStatus(player: Player): string {
        // TODO
        return '';
    }

    public removePlayer(playerId: number): void {
        ejectPlayer(playerId);
    }

    public render() {
        return (
            <Card className="players-list">
                <CardHeader
                    title={T.translate('instructor.list')}
                    component="h2"
                />
                <List>
                    {!this.props.players.length && <ListItem >
                        <ListItemText primary={T.translate('instructor.player.no-player')} className="no-player" />
                    </ListItem>}
                    {this.props.players.map(player => {
                        return (
                            <ListItem key={player.id}>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText
                                    primary={player.name} />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => this.removePlayer(player.id)} color="primary" aria-label="Delete">
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </Card>
        );
    }
}

export default playerList;