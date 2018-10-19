import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store.jsx';
import registerServiceWorker from './utils/registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ORANGE } from './utils/constants';
import { getNavigatorLanguage } from './utils/tools';
import T from 'i18n-react';

const lang = getNavigatorLanguage();

T.setTexts(require('./languages/' + lang + '.json'));

const store = configureStore();
const theme = createMuiTheme({
	palette: {
		primary: {
			main: ORANGE,
			contrastText: '#FFF'
		},
		secondary: {
			main: "#FFF"
		}
	}
});

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Provider store={store}>
			<App store={store} />
		</Provider>
	</MuiThemeProvider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
