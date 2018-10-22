import * as React from 'react';
import './masterboard.css';
import { AppBar, Tooltip, Toolbar, Typography, IconButton, Tabs, Tab } from '@material-ui/core';
import { PauseCircleOutline, PlayCircleOutline, Cached } from '@material-ui/icons';
import T from 'i18n-react';
import { onPlayerUpdate, loadStories, startStory, setPlayPause, sendAction, listenDynamicActions, startGame, playerQuit, loadRoles } from '../../utils/api';
import { Player } from '../../interfaces/Player';
import { Story } from '../../interfaces/Story';
import PlayerList from '../../components/playerlist/PlayerList';
import StoryList from '../../components/storylist/StoryList';
import Timeline from '../../components/timeline/Timeline';
import ActionsDashboard from '../../components/actionsdashboard/ActionDashboard';
import StoryCreator from '../storycreator/StoryCreator';
import RoleCreator from '../rolecreator/RoleCreator';
import { Role } from 'src/interfaces/Role';

interface Props { }
interface State {
	players: Array<Player>
	stories: Array<Story>
	selectedStory: Story,
	togglePause: boolean
	status: number
	gameStarted: boolean
	tabValue: number
	roles: Array<Role>
}

/**
 * Class de l'interface du maitre du jeu
 */
class MasterBoard extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		this.state = {
			players: [],
			stories: [],
			selectedStory: null,
			togglePause: false,
			status: 0,
			gameStarted: false,
			tabValue: 0,
			roles: []
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
			if (this.state.selectedStory && this.state.players.length < this.state.selectedStory.nbPlayers) {
				this.setState({
					selectedStory: null,
					status: 0,
					gameStarted: false,
					togglePause: false
				});
			}
		});

		loadStories((err: any, stories: Array<Story>) => {
			this.setState({
				stories: stories
			});
		});

		loadRoles((roles: Array<Role>) => {
			this.setState({
				roles
			});
		})

		listenDynamicActions((actionId: string) => {
			if (this.state.selectedStory) {
				let actions = this.state.selectedStory.actions;
				let step = actions.findIndex((a: Action) => { return a.id === actionId });
				this.setState({
					status: step + 1 // pour passer la selection de role
				})
			}
		});

		startGame((story: Story) => {
			this.setState({
				gameStarted: true
			});
		});

		playerQuit(() => {
			if (!this.state.selectedStory) return;
			this.setState({
				gameStarted: false,
				selectedStory: null,
				status: 0,
				togglePause: false
			})
		});

		this.startStory = this.startStory.bind(this);
	}

	public togglePause() {
		setPlayPause(!this.state.togglePause, (bool: boolean) => {
			this.setState({
				togglePause: bool
			});
		});
	}

	public startStory(story: Story) {
		startStory(story.id);

		this.setState({ selectedStory: story });
	}

	public sendAction(actionId: string) {
		sendAction(actionId);
	}

	public handleChange(value: number) {
		this.setState({ tabValue: value });
	}

	public render() {

		return (
			<div className="masterboard">
				<AppBar position="static" color="primary" className={this.state.togglePause ? "pause" : "play"}>
					<Toolbar>
						<Tabs indicatorColor="secondary" value={this.state.tabValue} onChange={(event, value) => { this.handleChange(value) }}>
							<Tab label={T.translate('instructor.title')} />
							{this.state.stories && <Tab label={T.translate('instructor.storycreator')} disabled={this.state.selectedStory !== null} />}
							{this.state.roles && <Tab label={T.translate('instructor.rolecreator')} disabled={this.state.selectedStory !== null} />}
						</Tabs>
						<div>
							{(this.state.togglePause && this.state.selectedStory) && <Tooltip title={T.translate('instructor.play')}>
								<IconButton onClick={() => { this.togglePause() }} color="inherit"><PlayCircleOutline /></IconButton>
							</Tooltip>}
							{(!this.state.togglePause && this.state.selectedStory) && <Tooltip title={T.translate('instructor.pause')}>
								<IconButton onClick={() => { this.togglePause() }} color="inherit"><PauseCircleOutline /></IconButton>
							</Tooltip>}
							{this.state.selectedStory && <Tooltip title={T.translate('instructor.restart')}>
								<IconButton color="inherit"><Cached /></IconButton>
							</Tooltip>}
						</div>
					</Toolbar>
				</AppBar>
				{this.state.tabValue === 0 && <div className="content">
					<PlayerList players={this.state.players} />
					{!this.state.selectedStory && <StoryList stories={this.state.stories} nbPlayers={this.state.players.length} startStory={this.startStory} />}
					{this.state.selectedStory && <Timeline story={this.state.selectedStory} status={this.state.status} />}
					{this.state.selectedStory && this.state.gameStarted && <ActionsDashboard story={this.state.selectedStory} sendAction={this.sendAction} />}
				</div>}
				{this.state.tabValue === 1 && <StoryCreator stories={this.state.stories} roles={this.state.roles} />}
				{this.state.tabValue === 2 && <RoleCreator />}
			</div >
		);
	}
}

export default MasterBoard;