import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import './index.css';

injectTapEventPlugin();

ReactDOM.render(
    <App />,
    document.getElementById( 'root' ) as HTMLElement
);

registerServiceWorker();
