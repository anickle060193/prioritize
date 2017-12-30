import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';

import ProjectDialog from 'components/ProjectDialog';
import ProjectRow from 'components/ProjectRow';

import db, { Project } from 'db/prioritize';
import Settings from 'utils/settings';

import './styles.css';

interface Props { }

interface State
{
  projects: Project[];
  creatingProject: boolean;
  horizontal: boolean;
}

export default class HomePage extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      projects: [],
      creatingProject: false,
      horizontal: Settings.projectHorizontal
    };
  }

  async componentWillMount()
  {
    await this.updateProjects();
  }

  render()
  {
    let appBarMenu = (
      <IconMenu
        iconButtonElement={
          <IconButton>
            <FontIcon color="white" className="material-icons">more_vert</FontIcon>
          </IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          leftIcon={
            <FontIcon className="material-icons">add</FontIcon>
          }
          onClick={this.onStartProjectCreate}
        >
          New Project
        </MenuItem>
        <Divider />
        {
          !this.state.horizontal &&
          <MenuItem
            leftIcon={<FontIcon className="material-icons">swap_horiz</FontIcon>}
            onClick={() => this.setHorizontal( true )}
          >
            Horizontal
          </MenuItem>
        }
        {
          this.state.horizontal &&
          <MenuItem
            leftIcon={<FontIcon className="material-icons">swap_vert</FontIcon>}
            onClick={() => this.setHorizontal( false )}
          >
            Vertical
          </MenuItem>
        }
      </IconMenu>
    );

    return (
      <div className={this.state.horizontal ? 'horizontal' : 'vertical'}>
        <AppBar
          title="Prioritize"
          showMenuIconButton={false}
          iconElementRight={appBarMenu}
        />

        <div className="projects">
          {this.state.projects.map( ( project ) =>
            (
              <ProjectRow
                key={project.id}
                project={project}
                onProjectEdit={( newProjectName ) => this.onProjectEdit( project, newProjectName )}
                onProjectDelete={() => this.onProjectDelete( project )}
                horizontal={this.state.horizontal}
              />
            ) )}

          <ProjectDialog
            open={this.state.creatingProject}
            projectName=""
            onCancel={this.onProjectCreateCancel}
            onSubmit={this.onProjectCreate}
            submitLabel="Create Project"
            title="New Project"
          />

        </div>
      </div>
    );
  }

  private setHorizontal( horizontal: boolean )
  {
    Settings.projectHorizontal = horizontal;
    this.setState( { horizontal: horizontal } );
  }

  private async updateProjects()
  {
    let projects = await db.projects.toArray();
    await Promise.all( projects.map( project => project.load() ) );
    this.setState( { projects: projects } );
  }

  private onProjectCreateCancel = () =>
  {
    this.setState( { creatingProject: false } );
  }

  private onStartProjectCreate = () =>
  {
    this.setState( {
      creatingProject: true
    } );
  }

  private onProjectCreate = async ( projectName: string ) =>
  {
    let project = new Project( projectName, '' );
    await project.save();
    await this.updateProjects();
    this.setState( { creatingProject: false } );
  }

  private onProjectEdit = async ( project: Project, newProjectName: string ) =>
  {
    project.name = newProjectName;
    await project.save();
    await this.updateProjects();
  }

  private onProjectDelete = async ( project: Project ) =>
  {
    await db.projects.delete( project.id );
    await this.updateProjects();
  }
}
