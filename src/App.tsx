import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import Projects from 'pages/Projects';

export default class App extends React.Component
{
  render()
  {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme( darkBaseTheme )}>
        <Projects />
      </MuiThemeProvider>
    );
  }
}
