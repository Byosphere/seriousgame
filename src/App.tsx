import * as React from 'react';
import './style/App.css';
import MasterBoard from './containers/masterboard/MasterBoard';
import GameScene from './containers/gamescene/GameScene';
import RoleSelect from './containers/roleselect/RoleSelect';
import { gameConnect, onDisconnect } from './utils/api';
import { INSTRUCTOR, PLAYER } from './utils/constants';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loader from './components/loader/Loader';
import Frame from './components/frame/Frame';
import ServerConnect from './containers/serverconnect/ServerConnect';

interface Props { store: any }
interface State {
	instructorInterface: boolean,
	playerInterface: boolean,
	loading: boolean
	disconnected: boolean
	playerId: number
}

class App extends React.Component<Props, State> {


	constructor(props: Props) {
		super(props);

		this.state = {
			instructorInterface: false,
			playerInterface: false,
			loading: true,
			disconnected: false,
			playerId: -1
		}
	}

	public onConnect(status: string, playerId: number) {
		if (status === INSTRUCTOR) {
			this.setState({
				instructorInterface: true,
				loading: false
			});
		} else if (status === PLAYER) {
			this.setState({
				playerInterface: true,
				loading: false,
				playerId: playerId
			});
		} else {
			console.log(status);
		}
		onDisconnect((err: any) => {
			this.setState({
				disconnected: true
			});
		});
	}

	public render() {

		if (this.state.loading) {
			return (
				<HashRouter>
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<ServerConnect onConnect={(status: string, playerId: number) => { this.onConnect(status, playerId) }} />
					</div>
				</HashRouter >
			);
		} else if (this.state.disconnected) {
			return (
				<HashRouter>
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<Loader textKey="loader.disconnected" />
					</div>
				</HashRouter >
			);
		} else {
			return (
				<HashRouter>
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<Switch>
							<Route exact path='/masterboard' component={MasterBoard} />
							<Route exact path='/roleselect' component={RoleSelect} />
							<Route exact path='/gamescene' component={GameScene} />
							{this.state.instructorInterface && <Redirect to="/masterboard" />}
							{this.state.playerInterface && <Redirect to="/roleselect" />}
						</Switch>
					</div>
				</HashRouter>
			);
		}
	}
}

export default App;
