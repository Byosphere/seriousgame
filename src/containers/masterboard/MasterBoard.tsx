import * as React from 'react';
import './masterboard.css';
import { AppBar, Toolbar, Typography, Card, List, ListItemText, ListItemSecondaryAction, ListItem, ListItemIcon, CardHeader, Divider, Paper, Table, TableHead, TableCell, TableRow, TableBody, Button, IconButton } from '@material-ui/core';
import { Person, Delete } from '@material-ui/icons';
import T from 'i18n-react';
import { onPlayerUpdate, loadStories, startStory } from '../../utils/api';
import { Player } from '../../interfaces/Player';
import { Story } from '../../interfaces/Story';

interface Props {

}
interface State {
	players: Array<Player>
	stories: Array<Story>
	selectedStory: Story
}

class MasterBoard extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			players: [],
			stories: [],
			selectedStory: { id: 1, name: "test" } //null
		}
		onPlayerUpdate((err: any, response: Array<Player>) => {
			if (!err) {
				this.setState({
					players: response.filter(el => el != null)
				});
			} else {
				//TODO error message
				console.log(err);
			}

		});

		loadStories((err: any, stories: Array<Story>) => {
			this.setState({
				stories: stories
			});
		});
	}

	public removePlayer(id: number) {
		console.log(id);
	}

	public startStory(story: Story) {
		startStory(story.id);

		this.setState({ selectedStory: story });
	}

	public getPlayerStatus(player: Player): string {
		let status: string = '';
		if (!this.state.selectedStory) {
			status = T.translate('instructor.player.waitingstory').toString();
		} else if (player.roleId === -1) {
			status = T.translate('instructor.player.no-role').toString();
		} else if (player.roleId > -1) {
			status = T.translate('instructor.player.role') + player.roleId.toString();
		}
		return status;
	}

	public render() {

		return (
			<div className="masterboard">
				<AppBar position="static" color="primary">
					<Toolbar>
						<Typography variant="title" color="inherit">
							{T.translate('instructor.title')}
						</Typography>
					</Toolbar>
				</AppBar>
				<div className="content">
					<Card className="connected-list">
						<CardHeader
							title={T.translate('instructor.list')}
						/>
						<Divider />
						<List>
							{!this.state.players.length && <ListItem >
								<ListItemText primary={T.translate('instructor.player.no-player')} className="no-player" />
							</ListItem>}
							{this.state.players.map(player => {
								return (
									<ListItem key={player.id}>
										<ListItemIcon>
											<Person />
										</ListItemIcon>
										<ListItemText
											primary={player.name}
											secondary={this.getPlayerStatus(player)} />
										<ListItemSecondaryAction>
											<IconButton onClick={() => this.removePlayer(player.id)} color="secondary" aria-label="Delete">
												<Delete />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>);
							})}
						</List>
					</Card>
					{!this.state.selectedStory && <Paper className="table-paper">
						<Typography variant="title" className="title">
							{T.translate('instructor.tabletitle')}
						</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>{T.translate('story.name')}</TableCell>
									<TableCell>{T.translate('story.description')}</TableCell>
									<TableCell numeric>{T.translate('story.nbplayers')}</TableCell>
									<TableCell>{T.translate('story.action')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.stories.filter(el => el != null).map(story => {
									return (
										<TableRow key={story.id}>
											<TableCell component="th" scope="row">
												{story.name}
											</TableCell>
											<TableCell>{story.description}</TableCell>
											<TableCell className={this.state.players.length !== story.nbPlayers ? 'red' : 'green'} numeric>{this.state.players.length} / {story.nbPlayers}</TableCell>
											<TableCell><Button onClick={() => this.startStory(story)} disabled={this.state.players.length !== story.nbPlayers} color="primary">{T.translate('story.launch')}</Button></TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Paper>}
					{this.state.selectedStory && <Paper className="table-paper">
						<Typography variant="title" className="title">
							{T.translate('instructor.tabletitle')}
						</Typography>
					</Paper>}
				</div>
			</div >
		);
	}
}

export default MasterBoard;