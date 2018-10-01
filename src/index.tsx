import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store.jsx';
import registerServiceWorker from './utils/registerServiceWorker';

const store = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<App store={store} />
	</Provider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
