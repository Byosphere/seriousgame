import * as React from 'react';
import './style/App.css';
import MasterBoard from './containers/masterboard/MasterBoard';
import GameScene from './containers/gamescene/GameScene';
import { PLAYER, CONNECT, DISCONNECTED, INSTRUCTOR } from './utils/constants';
import Loader from './components/loader/Loader';
import Frame from './components/frame/Frame';
import ServerConnect from './containers/serverconnect/ServerConnect';
import Connector from './interfaces/Connector';
import { onDisconnect } from './utils/api';

interface Props {
	store: any
}
interface State {
	connector: Connector
	status: string
}

class App extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		let connector = Connector.retrieveConnector();
		this.state = {
			connector,
			status: CONNECT
		}
	}

	public onConnected(connector: Connector) {
		this.setState({ status: connector.type, connector });
		onDisconnect((err: any) => {
			this.setState({ status: CONNECT, connector: null })
		});
	}

	public render() {

		switch (this.state.status) {

			case CONNECT:
				return (
					<div className="app">
						{/* {window && window["process"] && window["process"].type && <Frame />} */}
						<ServerConnect
							onConnected={(connector: Connector) => { this.onConnected(connector) }}
							connector={this.state.connector}
						/>
					</div>
				);

			case INSTRUCTOR:
				return (
					<div className="app">
						<MasterBoard changeServer={() => { this.setState({ status: CONNECT, connector: null }) }} />
					</div>
				);

			case PLAYER:
				return (
					<div className="app">
						<GameScene changeServer={() => { this.setState({ status: CONNECT, connector: null }) }} />
					</div>
				);
			default:
				return (
					<div className="app">
						<Loader textKey="loader.serverwait" />
					</div>
				);
		}
	}
}

export default App;
