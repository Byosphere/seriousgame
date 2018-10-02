import * as React from 'react';
import './style/App.css';
import MasterBoard from './containers/masterboard/MasterBoard';
import GameScene from './containers/gamescene/GameScene';
import RoleSelect from './containers/roleselect/RoleSelect';
import { gameConnect } from './utils/api';
import { INSTRUCTOR, PLAYER, ORANGE } from './utils/constants';
import { GridLoader } from 'halogenium';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';

interface Props { store: any }
interface State {
	instructorInterface: boolean,
	playerInterface: boolean,
	loading: boolean
}

class App extends React.Component<Props, State> {


	constructor(props: Props) {
		super(props);

		this.state = {
			instructorInterface: false,
			playerInterface: false,
			loading: true
		}
		gameConnect((err: any, role: string) => {
			if (role == INSTRUCTOR) {
				this.setState({
					instructorInterface: true,
					loading: false
				});

			} else if (role == PLAYER) {
				this.setState({
					playerInterface: true,
					loading: false
				});
			} else {
				//TODO error message
				console.log(err);
			}
		});
	}

	public render() {

		return (
			<HashRouter>
				<div className="app">
					{this.state.loading && <GridLoader className="loader" color={ORANGE} size="50px" />}
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

export default App;
