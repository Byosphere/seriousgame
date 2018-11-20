import * as React from 'react';
import './style/App.css';
import MasterBoard from './containers/masterboard/MasterBoard';
import GameScene from './containers/gamescene/GameScene';
import T from 'i18n-react';
import { onDisconnect, masterConnect, playerConnect } from './utils/api';
import { PLAYER, CONNECT, DISCONNECTED, INSTRUCTOR, SERVER_WAIT } from './utils/constants';
import Loader from './components/loader/Loader';
import Frame from './components/frame/Frame';
import ServerConnect from './containers/serverconnect/ServerConnect';
import { Button } from '@material-ui/core';
import { setParams } from './actions/paramsActions';
import { connect } from 'react-redux';

interface Props {
	store: any
	setParams: Function
}
interface State {
	playerId: number
	status: string
}

class App extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);

		if (localStorage.getItem('server')) {
			this.state = {
				playerId: -1,
				status: ''
			}
			this.tryConnnect();
		} else {
			this.state = {
				playerId: -1,
				status: CONNECT
			}
		}
	}

	public tryConnnect() {
		let server = JSON.parse(localStorage.getItem('server'));
		let response: any = null;
		let timer = 0;
		if (server.type === INSTRUCTOR) {
			masterConnect("http://" + server.addr, server.port, server.password, (resp: any) => {
				response = resp;
			});
			let interval = setInterval(() => {
				if (response && response.success) {
					this.onConnect(INSTRUCTOR, -1, response.params);
					clearInterval(interval);
				} else if (response && !response.success) {
					this.onConnect(CONNECT, -1, response.params);
					clearInterval(interval);
				} else if (timer === SERVER_WAIT) {
					this.setState({ status: CONNECT });
					localStorage.removeItem('server');
					clearInterval(interval);
				}
				timer += 100;
			}, 100);
		} else {
			this.state = {
				playerId: -1,
				status: CONNECT
			}
		}
	}

	public onConnect(status: string, playerId: number, params: any) {
		this.props.setParams(params);
		switch (status) {
			case INSTRUCTOR:
				this.setState({ status, playerId: -1 });
				break;

			case PLAYER:
				this.setState({ status, playerId: playerId });
				break;

			default:
				this.setState({ status, playerId: -1 });
		}


		onDisconnect((err: any) => {
			this.setState({ status: DISCONNECTED });
		});
	}

	public render() {

		switch (this.state.status) {

			case CONNECT:
				return (
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<ServerConnect onConnect={(status: string, playerId: number, params: any) => { this.onConnect(status, playerId, params) }} />
					</div>
				);
			case DISCONNECTED:
				return (
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<Loader button="loader.reconnect" buttonAction={() => { this.setState({ status: CONNECT }) }} textKey="loader.disconnected" />
					</div>
				);

			case INSTRUCTOR:
				return (
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<MasterBoard changeServer={() => { this.setState({ status: CONNECT }) }} />
					</div>
				);

			case PLAYER:
				return (
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<GameScene location='' />
					</div>
				);
			default:
				return (
					<div className="app">
						{window && window["process"] && window["process"].type && <Frame />}
						<Loader textKey="loader.serverwait" />
					</div>
				);
		}
	}
}

export default connect(null, { setParams })(App);
