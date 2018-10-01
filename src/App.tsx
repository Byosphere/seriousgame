import * as React from 'react';
import './style/App.css';
import Instructor from './containers/instructor/Instructor';
import Player from './containers/player/Player';
import { gameConnect } from './utils/api';
import { INSTRUCTOR, PLAYER, ORANGE } from './utils/constants';
import { GridLoader } from 'halogenium';

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
			<div className="app">
				{this.state.loading && <GridLoader className="loader" color={ORANGE} size="50px" />}
				{this.state.instructorInterface && <Instructor />}
				{this.state.playerInterface && <Player />}
			</div>
		);
	}
}

export default App;
