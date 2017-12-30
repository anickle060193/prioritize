import * as React from 'react';
import
{
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
  DroppableProvided,
  Draggable
} from 'react-beautiful-dnd';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import './styles.css';

import NewTaskCard from 'components/NewTaskCard';
import DraggableTaskCard from 'components/DraggableTaskCard';
import ProjectDialog from 'components/ProjectDialog';

import { Task, Project } from 'db/prioritize';

interface Props
{
  project: Project;
  onProjectEdit: ( projectName: string ) => void;
  onProjectDelete: () => void;
}

interface State
{
  creatingTask: boolean;
  tasks: Task[];
  editingProject: boolean;
}

export default class ProjectRow extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      creatingTask: this.props.project.tasks.length === 0,
      tasks: this.props.project.tasks,
      editingProject: false
    };
  }

  render()
  {
    return (
      <div className="project-row">

        <div className="project-row-header">
          <h1 className="project-name">{this.props.project.name}</h1>

          <IconButton tooltip="Edit Project" onClick={this.onStartProjectEdit}>
            <FontIcon className="material-icons">mode_edit</FontIcon>
          </IconButton>

          <IconButton tooltip="New Task" onClick={this.onStartTaskCreate}>
            <FontIcon className="material-icons">add</FontIcon>
          </IconButton>
        </div>

        <div className="project-tasks">
          {
            this.state.creatingTask &&
            <NewTaskCard
              onCancel={this.onTaskCreateCancel}
              onTaskCreate={this.onTaskCreate}
            />
          }

          <DragDropContext
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          >
            <Droppable droppableId="task_queue" direction="horizontal">
              {
                ( dropProvided, dropSnapshot ) =>
                  (
                    this.renderList( dropProvided )
                  )
              }
            </Droppable>
          </DragDropContext>
        </div>

        <ProjectDialog
          open={this.state.editingProject}
          projectName={this.props.project.name}
          onCancel={this.onProjectEditCancel}
          onSubmit={this.onProjectEdit}
          onDelete={this.onProjectDelete}
          submitLabel="Update Project"
          title="Edit Project"
        />

      </div>
    );
  }

  private renderList( dropProvided: DroppableProvided )
  {
    return (
      <div className="project-tasks-drop-zone" ref={dropProvided.innerRef}>
        {
          this.state.tasks.map( ( task, i ) =>
            (
              <Draggable key={task.id} draggableId={task.id}>
                {
                  ( dragProvided, dragSnapshot ) =>
                    (
                      <div>
                        <DraggableTaskCard
                          task={task}
                          provided={dragProvided}
                          snapshot={dragSnapshot}
                          onTaskSave={( t ) => this.onTaskSave( t, i )}
                          saveTaskText="Save"
                          onTaskDelete={() => this.onTaskDelete( task, i )}
                        />
                        {dragProvided.placeholder}
                      </div>
                    )
                }
              </Draggable>
            ) )
        }
        {dropProvided.placeholder}
      </div>
    );
  }

  private onStartProjectEdit = () =>
  {
    this.setState( { editingProject: true } );
  }

  private onProjectEditCancel = () =>
  {
    this.setState( { editingProject: false } );
  }

  private onProjectEdit = ( projectName: string ) =>
  {
    this.props.onProjectEdit( projectName );
    this.setState( { editingProject: false } );
  }

  private onProjectDelete = () =>
  {
    this.props.onProjectDelete();
    this.setState( { editingProject: false } );
  }

  private onStartTaskCreate = () =>
  {
    this.setState( { creatingTask: true } );
  }

  private onTaskCreateCancel = () =>
  {
    this.setState( { creatingTask: false } );
  }

  private onTaskCreate = async ( newTask: Task ) =>
  {
    this.props.project.tasks.splice( 0, 0, newTask );
    await this.props.project.save();
    this.setState( {
      tasks: this.props.project.tasks,
      creatingTask: false
    } );
  }

  private onTaskSave = ( task: Task, taskIndex: number ) =>
  {
    if( task.name )
    {
      this.props.project.tasks[ taskIndex ] = task;
      this.props.project.save().then( () =>
      {
        this.setState( { tasks: this.props.project.tasks } );
      } );

      return true;
    }
    else
    {
      return false;
    }
  }

  private onTaskDelete = async ( task: Task, taskIndex: number ) =>
  {
    this.props.project.tasks.splice( taskIndex, 1 );
    await this.props.project.save();
    this.setState( {
      tasks: this.props.project.tasks,
      creatingTask: this.props.project.tasks.length === 0
    } );
  }

  private onDragStart = ( dragStart: DragStart ) =>
  {
    // Intentionally left blank
  }

  private onDragEnd = ( result: DropResult ) =>
  {
    if( !result.destination )
    {
      return;
    }

    this.reorderTasks( result.source.index, result.destination.index );
  }

  private async reorderTasks( startIndex: number, endIndex: number )
  {
    let [ removed ] = this.props.project.tasks.splice( startIndex, 1 );
    this.props.project.tasks.splice( endIndex, 0, removed );
    await this.props.project.save();
    this.setState( { tasks: this.props.project.tasks } );
  }
}
