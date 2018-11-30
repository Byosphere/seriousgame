import * as React from 'react';
import './masterboard.css';
import { AppBar, Tooltip, Toolbar, IconButton, Tabs, Tab } from '@material-ui/core';
import { PauseCircleOutline, PlayCircleOutline, Stop, PowerSettingsNew } from '@material-ui/icons';
import T from 'i18n-react';
import { onPlayerUpdate, loadStories, loadPlayers, startStory, setPlayPause, sendAction, listenDynamicActions, startGame, loadRoles, ejectPlayer } from '../../utils/api';
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
import Player from 'src/interfaces/Player';
import { ACTION_INITIAL } from 'src/utils/constants';
import logo from 'src/logo.png';

interface Props {
	openSnackbar: boolean
	snackbarMessage: string
	hideSnackbar: Function
	displaySnackbar: Function
	openConfirmDialog: boolean
	confirmDialogInfo: ConfirmMessage
	closeConfirmDialog: Function
	changeServer: Function
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
	confirmQuit: boolean
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
			roles: null,
			confirmQuit: false
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
			this.setState({ stories });
		});

		loadRoles((roles: Array<Role>) => {
			this.setState({ roles });
		});

		loadPlayers((players: Array<Player>) => {
			this.setState({ players });
		});

		listenDynamicActions((actionId: string, playerName: string) => {
			if (this.state.selectedStory) {
				let actions = this.state.selectedStory.actions;
				let step = actions.findIndex((a: Action) => { return a.id === actionId });
				this.setState({
					status: step + 1 // pour passer la selection de role
				});
				if (playerName) {
					let player = this.state.players.find(player => { return player.name === playerName });
					let role = this.state.roles.find(role => { return role.id === player.roleId });
					this.props.displaySnackbar(T.translate('player.action', { playerName, roleName: role.name }));
				}
			}
		});

		startGame((story: Story) => {
			this.setState({
				gameStarted: true,
				status: 1
			});
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

	public toggleStop() {
		if (!this.state.selectedStory) return;
		this.state.players.forEach(player => {
			ejectPlayer(player.id);
		});
	}
	public toggleRestart() {
		if (!this.state.selectedStory) return;
		sendAction(ACTION_INITIAL);
		this.setState({ status: 1 });
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
						<div style={{ display: "flex", alignItems: "center" }}>
							<img src={logo} style={{ marginRight: "20px" }} alt="logo" />
							<h1>{T.translate('appshort')}</h1>
						</div>
						{!this.state.selectedStory && <div style={{ display: "flex", alignItems: "center" }}>
							<Tabs indicatorColor="secondary" value={this.state.tabValue} onChange={(event, value) => { this.handleChange(value) }}>
								<Tab label={T.translate('instructor.title')} />
								<Tab label={T.translate('instructor.storycreator')} disabled={this.state.selectedStory !== null} />
								<Tab label={T.translate('instructor.rolecreator')} disabled={this.state.selectedStory !== null} />
							</Tabs>
							<Tooltip title={T.translate('instructor.quit')}>
								<IconButton style={{ marginRight: "-18px", marginLeft: "10px" }} onClick={() => { this.setState({ confirmQuit: true }) }} color="inherit"><PowerSettingsNew /></IconButton>
							</Tooltip>
						</div>}
						{this.state.selectedStory && <div>
							{this.state.togglePause && <Tooltip title={T.translate('instructor.play')}>
								<IconButton onClick={() => { this.togglePause() }} color="inherit"><PlayCircleOutline /></IconButton>
							</Tooltip>}
							{!this.state.togglePause && <Tooltip title={T.translate('instructor.pause')}>
								<IconButton onClick={() => { this.togglePause() }} color="inherit"><PauseCircleOutline /></IconButton>
							</Tooltip>}
							{<Tooltip title={T.translate('instructor.stop')}>
								<IconButton onClick={() => { this.toggleStop() }} color="inherit"><Stop /></IconButton>
							</Tooltip>}
						</div>}
					</Toolbar>
				</AppBar>
				{this.state.tabValue === 0 && <div className="content">
					<PlayerList players={this.state.players} roles={this.state.roles} />
					{!this.state.selectedStory && <StoryList stories={this.state.stories} nbPlayers={this.state.players.length} startStory={this.startStory} />}
					{this.state.selectedStory && <Timeline story={this.state.selectedStory} status={this.state.status} sendAction={(actionId: string) => { this.sendAction(actionId) }} />}
					{/* {this.state.selectedStory && this.state.gameStarted && <ActionsDashboard story={this.state.selectedStory} sendAction={sendAction} />} */}
				</div>}
				{this.state.tabValue === 1 && <StoryCreator stories={this.state.stories} roles={this.state.roles} />}
				{this.state.tabValue === 2 && <RoleCreator stories={this.state.stories} roles={this.state.roles} />}
				<MasterSnackbar open={this.props.openSnackbar} message={this.props.snackbarMessage} onClose={() => { this.snackbarClose() }} />
				<ConfirmDialog open={this.props.openConfirmDialog} message={this.props.confirmDialogInfo} onClose={() => { this.props.closeConfirmDialog() }} />
				<ConfirmDialog open={this.state.confirmQuit} message={{ title: T.translate('instructor.titlequit').toString(), content: T.translate('instructor.confirmquit').toString(), confirm: () => { this.props.changeServer() } }} onClose={() => { this.setState({ confirmQuit: false }) }} />
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