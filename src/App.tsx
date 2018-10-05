import * as React from 'react';
import './style/App.css';
import MasterBoard from './containers/masterboard/MasterBoard';
import GameScene from './containers/gamescene/GameScene';
import RoleSelect from './containers/roleselect/RoleSelect';
import { gameConnect, onDisconnect } from './utils/api';
import { INSTRUCTOR, PLAYER, ORANGE } from './utils/constants';
import { GridLoader } from 'halogenium';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import T from 'i18n-react';

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
		gameConnect((err: any, resp: any) => {
			if (resp.type == INSTRUCTOR) {
				localStorage.setItem('gameparams', resp.params);
				this.setState({
					instructorInterface: true,
					loading: false
				});

			} else if (resp.type == PLAYER) {
				localStorage.setItem('gameparams', resp.params);
				this.setState({
					playerInterface: true,
					loading: false,
					playerId: resp.id
				});

			} else {
				//TODO error message
				console.log(err);
			}
			this.checkDisconnect(this.state.playerId);
		});

	}

	public checkDisconnect(playerId: number) {
		onDisconnect(this.state.playerId, () => {
			this.setState({ disconnected: true });
		});
	}

	public render() {

		if (this.state.loading) {
			return (
				<HashRouter>
					<div className="app">
						<div>
							<GridLoader className="loader" color={ORANGE} size="50px" />
							<p className="sub-loader">{T.translate('loader.serverwait')}</p>
						</div>
					</div>
				</HashRouter >
			);
		} else if (this.state.disconnected) {
			return (
				<HashRouter>
					<div className="app">
						<div>
							<p className="sub-loader">{T.translate('loader.disconnected')}</p>
						</div>
					</div>
				</HashRouter >
			);
		} else {
			return (
				<HashRouter>
					<div className="app">
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
