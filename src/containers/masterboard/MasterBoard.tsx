import * as React from 'react';
import './masterboard.css';
import { AppBar, Tooltip, Toolbar, IconButton, Tabs, Tab } from '@material-ui/core';
import { PauseCircleOutline, PlayCircleOutline, Cached } from '@material-ui/icons';
import T from 'i18n-react';
import { onPlayerUpdate, loadStories, startStory, setPlayPause, sendAction, listenDynamicActions, startGame, playerQuit, loadRoles } from '../../utils/api';
import PlayerList from '../../components/playerlist/PlayerList';
import StoryList from '../../components/storylist/StoryList';
import Timeline from '../../components/timeline/Timeline';
import ActionsDashboard from '../../components/actionsdashboard/ActionDashboard';
import StoryCreator from '../storycreator/StoryCreator';
import RoleCreator from '../rolecreator/RoleCreator';
import Loader from 'src/components/loader/Loader';
import MasterSnackbar from 'src/components/mastersnackbar/MasterSnackbar';
import { connect } from 'react-redux';
import { hideSnackbar, displaySnackbar, closeConfirmDialog } from 'src/actions/snackbarActions';
import Story from 'src/interfaces/Story';
import Action from 'src/interfaces/Action';
import ConfirmDialog from 'src/components/confirmdialog/ConfirmDialog';
import { ConfirmMessage } from 'src/interfaces/ConfirmMessage';
import Role from 'src/interfaces/Role';

interface Props {
	openSnackbar: boolean
	snackbarMessage: string
	hideSnackbar: Function
	displaySnackbar: Function
	openConfirmDialog: boolean
	confirmDialogInfo: ConfirmMessage
	closeConfirmDialog: Function
}
interface State {
	players: Array<Player>
	stories: Array<Story>
	selectedStory: Story
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
			stories: null,
			selectedStory: null,
			togglePause: false,
			status: 0,
			gameStarted: false,
			tabValue: 0,
			roles: null
		}
		onPlayerUpdate((err: any, response: Array<Player>) => {
			if (!err) {
				this.props.displaySnackbar(T.translate('player.update'));
				this.setState({
					players: response.filter(el => el != null)
				});
			} else {
				this.props.displaySnackbar(err);
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

		loadStories((stories: Array<Story>) => {
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
				gameStarted: true,
				status: 1
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

	public snackbarClose() {
		this.props.hideSnackbar();
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

		if (!this.state.stories || !this.state.roles) {
			return (<Loader textKey='generic.loading' />);
		}

		return (
			<div className="masterboard">
				<AppBar position="static" color="primary" className={this.state.togglePause ? "pause" : "play"}>
					<Toolbar>
						<Tabs indicatorColor="secondary" value={this.state.tabValue} onChange={(event, value) => { this.handleChange(value) }}>
							<Tab label={T.translate('instructor.title')} />
							<Tab label={T.translate('instructor.storycreator')} disabled={this.state.selectedStory !== null} />
							<Tab label={T.translate('instructor.rolecreator')} disabled={this.state.selectedStory !== null} />
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
				{this.state.tabValue === 2 && <RoleCreator roles={this.state.roles} />}
				<MasterSnackbar open={this.props.openSnackbar} message={this.props.snackbarMessage} onClose={() => { this.snackbarClose() }} />
				<ConfirmDialog open={this.props.openConfirmDialog} message={this.props.confirmDialogInfo} onClose={() => {this.props.closeConfirmDialog()}} />
			</div >
		);
	}
}
function mapStateToProps(state: any) {
	return {
		snackbarMessage: state.dialog.messageSnackbar,
		openSnackbar: state.dialog.openSnackbar,
		confirmDialogInfo: state.dialog.confirmDialogInfo,
		openConfirmDialog: state.dialog.openConfirmDialog
	}
}

export default connect(mapStateToProps, { hideSnackbar, displaySnackbar, closeConfirmDialog })(MasterBoard);