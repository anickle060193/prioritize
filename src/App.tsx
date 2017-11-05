import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import './App.css';

import TaskQueue from 'components/TaskQueue';

export default class App extends React.Component
{
    render()
    {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme( darkBaseTheme )}>
                <TaskQueue />
            </MuiThemeProvider>
        );
    }
}
