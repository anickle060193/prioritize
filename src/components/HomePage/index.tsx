import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import ProjectDialog from 'components/ProjectDialog';
import ProjectRow from 'components/ProjectRow';

import db, { Project } from 'db/prioritize';

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
      horizontal: true
    };
  }

  async componentWillMount()
  {
    await this.updateProjects();
  }

  render()
  {
    let orientationIconButton = null;
    if( this.state.horizontal )
    {
      orientationIconButton = (
        <IconButton
          onClick={this.toggleOrientation}
          tooltip="Vertical"
        >
          <FontIcon className="material-icons">swap_vert</FontIcon>
        </IconButton>
      );
    }
    else
    {
      orientationIconButton = (
        <IconButton
          onClick={this.toggleOrientation}
          tooltip="Horizontal"
        >
          <FontIcon className="material-icons">swap_horiz</FontIcon>
        </IconButton>
      );
    }

    return (
      <div className={this.state.horizontal ? 'horizontal' : 'vertical'}>
        <AppBar
          title="Prioritize"
          showMenuIconButton={false}
          iconElementRight={orientationIconButton}
        />

        <FloatingActionButton
          className="new-project-button"
          onClick={this.onStartProjectCreate}
        >
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>

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

  private toggleOrientation = () =>
  {
    this.setState( ( prevState: State ) =>
    {
      return { horizontal: !prevState.horizontal };
    } );
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
