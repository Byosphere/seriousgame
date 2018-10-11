import * as React from 'react';
import './masterboard.css';
import { AppBar, Tooltip, Toolbar, Typography, IconButton } from '@material-ui/core';
import { PauseCircleOutline, PlayCircleOutline, Cached } from '@material-ui/icons';
import T from 'i18n-react';
import { onPlayerUpdate, loadStories, startStory, setPlayPause, sendAction } from '../../utils/api';
import { Player } from '../../interfaces/Player';
import { Story } from '../../interfaces/Story';
import PlayerList from '../../components/playerlist/PlayerList';
import StoryList from '../../components/storylist/StoryList';
import Timeline from '../../components/timeline/Timeline';
import ActionsDashboard from '../../components/actionsdashboard/ActionDashboard';

interface Props { }
interface State {
	players: Array<Player>
	stories: Array<Story>
	selectedStory: Story,
	togglePause: boolean
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
			togglePause: false
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
					selectedStory: null
				});
			}
		});

		loadStories((err: any, stories: Array<Story>) => {
			this.setState({
				stories: stories
			});
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

	public render() {

		return (
			<div className="masterboard">
				<AppBar position="static" color="primary" className={this.state.togglePause ? "pause" : "play"}>
					<Toolbar>
						<Typography variant="title" component="h1" color="inherit" className="app-title">
							{T.translate('instructor.title')}
						</Typography>
						{(this.state.togglePause && this.state.selectedStory) && <Tooltip title={T.translate('instructor.play')}>
							<IconButton onClick={() => { this.togglePause() }} color="inherit"><PlayCircleOutline /></IconButton>
						</Tooltip>}
						{(!this.state.togglePause && this.state.selectedStory) && <Tooltip title={T.translate('instructor.pause')}>
							<IconButton onClick={() => { this.togglePause() }} color="inherit"><PauseCircleOutline /></IconButton>
						</Tooltip>}
						{this.state.selectedStory && <Tooltip title={T.translate('instructor.restart')}>
							<IconButton color="inherit"><Cached /></IconButton>
						</Tooltip>}
					</Toolbar>
				</AppBar>
				<div className="content">
					<PlayerList players={this.state.players} />
					{!this.state.selectedStory && <StoryList stories={this.state.stories} nbPlayers={this.state.players.length} startStory={this.startStory} />}
					{this.state.selectedStory && <Timeline story={this.state.selectedStory} status={1} />}
					{this.state.selectedStory && <ActionsDashboard story={this.state.selectedStory} sendAction={this.sendAction} />}
				</div>
			</div >
		);
	}
}

export default MasterBoard;