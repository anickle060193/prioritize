import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { DragDropContext, DragStart, DropResult, Droppable, DroppableProvided, Draggable } from 'react-beautiful-dnd';

import './styles.css';

import NewTaskCard from 'components/NewTaskCard';
import DraggableTaskCard from 'components/DraggableTaskCard';

import { Task, Project } from 'db/prioritize';

interface Props
{
  project: Project;
}

interface State
{
  creating: boolean;
  tasks: Task[];
}

export default class ProjectRow extends React.Component<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      creating: this.props.project.tasks.length === 0,
      tasks: this.props.project.tasks
    };
  }

  render()
  {
    return (
      <div className="task-queue">
        {
          this.state.creating &&
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

        <FloatingActionButton
          className="new-task-button"
          onClick={this.onStartTaskCreate}
          onTouchTap={this.onStartTaskCreate}
        >
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>
      </div>
    );
  }

  private renderList( dropProvided: DroppableProvided )
  {
    return (
      <div className="task-queue-container" ref={dropProvided.innerRef}>
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

  private onStartTaskCreate = () =>
  {
    this.setState( { creating: true } );
  }

  private onTaskCreateCancel = () =>
  {
    this.setState( { creating: false } );
  }

  private onTaskCreate = async ( newTask: Task ) =>
  {
    this.props.project.tasks.splice( 0, 0, newTask );
    await this.props.project.save();
    this.setState( {
      tasks: this.props.project.tasks,
      creating: false
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
      creating: this.props.project.tasks.length === 0
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
