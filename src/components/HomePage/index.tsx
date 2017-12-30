import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import ProjectDialog from 'components/ProjectDialog';
import ProjectRow from 'components/ProjectRow';

import db, { Project } from 'db/prioritize';

import './styles.css';

interface Props { }

interface State
{
  projects: Project[];
  creatingProject: boolean;
}

export default class HomePage extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      projects: [],
      creatingProject: false
    };
  }

  async componentWillMount()
  {
    await this.updateProjects();
  }

  render()
  {
    return (
      <div>
        {this.state.projects.map( ( project ) =>
          (
            <ProjectRow
              key={project.id}
              project={project}
              onProjectEdit={( newProjectName ) => this.onProjectEdit( project, newProjectName )}
              onProjectDelete={() => this.onProjectDelete( project )}
            />
          ) )}

        <FloatingActionButton
          className="new-project-button"
          onClick={this.onStartProjectCreate}
        >
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>

        <ProjectDialog
          open={this.state.creatingProject}
          projectName=""
          onCancel={this.onProjectCreateCancel}
          onSubmit={this.onProjectCreate}
          submitLabel="Create Project"
          title="New Project"
        />

      </div>
    );
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
