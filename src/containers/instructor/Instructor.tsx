import * as React from 'react';
import './instructor.css';
import { AppBar, Toolbar, Typography, Card, List, ListItemText, ListItem, ListItemIcon, CardHeader, Divider } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { ORANGE } from '../../utils/constants';
import T from 'i18n-react';
import { onPlayerUpdate } from '../../utils/api';

interface Props {

}
interface State {
	players: Array<Player>
}

interface Player {
	name: string,
	role: string
}

class Instructor extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			players: []
		}
		onPlayerUpdate((err: any, response: Array<Player>) => {
			if (!err) {
				this.setState({
					players: response
				});
			} else {
				//TODO error message
				console.log(err);
			}

		})
	}

	public render() {
		return (
			<div className="instructor">
				<AppBar position="static" color="primary" classes={{ colorPrimary: ORANGE }}>
					<Toolbar>
						<Typography variant="title" color="inherit">
							{T.translate('instructor.title')}
						</Typography>
					</Toolbar>
				</AppBar>
				<Card className="connected-list">
					<CardHeader
						title={T.translate('instructor.list')}
					/>
					<Divider />
					<List>
						{!this.state.players.length && <ListItem >
							<ListItemText primary={T.translate('instructor.player.no-player')} className="no-player"/>
						</ListItem>}
						{this.state.players.map(player => {
							return (
								<ListItem >
									<ListItemIcon>
										<Person />
									</ListItemIcon>
									<ListItemText
										primary={player.name}
										secondary={player.role ? T.translate('instructor.player.role') + player.role : T.translate('instructor.player.no-role')} />
								</ListItem>);
						})}
					</List>
				</Card>
			</div >
		);
	}
}

export default Instructor;