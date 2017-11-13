import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { DragDropContext, DragStart, DropResult, Droppable, DroppableProvided, Draggable } from 'react-beautiful-dnd';

import './styles.css';

import NewTaskCard from 'components/NewTaskCard';
import DraggableTaskCard from 'components/DraggableTaskCard';

import db, { Task, Project } from 'db/prioritize';

interface Props
{
}

interface State
{
    creating: boolean;
    tasks: Task[];
}

export default class TaskQueue extends React.Component<Props, State>
{
    private project: Project;

    constructor( props: Props )
    {
        super( props );

        this.state = {
            creating: false,
            tasks: [ ]
        };
    }

    async componentWillMount()
    {
        let project = await db.projects.where( 'name' ).equals( 'Tasks' ).first();
        if( project )
        {
            await project.load();
        }
        else
        {
            project = new Project( 'Tasks', 'This is a default project.' );
        }
        this.project = project;

        this.setState( {
            tasks: this.project.tasks,
            creating: this.project.tasks.length === 0
        } );
    }

    render()
    {
        return (
            <div className="task-queue">
                {
                    this.state.creating ?
                        <NewTaskCard
                            onCancel={() => this.onTaskCreateCancel()}
                            onTaskCreate={( newTask ) => this.onTaskCreate( newTask )}
                        />
                    : null
                }

                <DragDropContext
                    onDragStart={( dragStart ) => this.onDragStart( dragStart )}
                    onDragEnd={( result ) => this.onDragEnd( result )}
                >
                    <Droppable droppableId="task_queue" direction="horizontal">
                        {
                            ( dropProvided, dropSnapshot ) =>
                            (
                                <div className="task-queue-wrapper">
                                    {this.renderList( dropProvided )}
                                </div>
                            )
                        }
                    </Droppable>
                </DragDropContext>

                <FloatingActionButton
                    className="new-task-button"
                    onClick={() => this.setState( { creating: true } )}
                    onTouchTap={() => this.setState( { creating: true } )}
                >
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>
            </div>
        );
    }

    private renderList( dropProvided: DroppableProvided )
    {
        return (
            <div className="task-queue-container">
                <div className="task-queue-drop-zone" ref={dropProvided.innerRef}>
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
            </div>
        );
    }

    private onTaskCreateCancel()
    {
        this.setState( { creating: false } );
    }

    private async onTaskCreate( newTask: Task )
    {
        this.project.tasks.splice( 0, 0, newTask );
        await this.project.save();
        this.setState( {
            tasks: this.project.tasks,
            creating: false
        } );
    }

    private onTaskSave( task: Task, taskIndex: number )
    {
        if( task.name )
        {
            this.project.tasks[ taskIndex ] = task;
            this.project.save().then( () =>
            {
                this.setState( { tasks: this.project.tasks } );
            } );

            return true;
        }
        else
        {
            return false;
        }
    }

    private async onTaskDelete( task: Task, taskIndex: number )
    {
        this.project.tasks.splice( taskIndex, 1 );
        await this.project.save();
        this.setState( {
            tasks: this.project.tasks,
            creating: this.project.tasks.length === 0
        } );
    }

    private onDragStart( dragStart: DragStart )
    {
        // Intentionally left blank
    }

    private onDragEnd( result: DropResult )
    {
        if( !result.destination )
        {
            return;
        }

        this.reorderTasks( result.source.index, result.destination.index );
    }

    private async reorderTasks( startIndex: number, endIndex: number )
    {
        let [ removed ] = this.project.tasks.splice( startIndex, 1 );
        this.project.tasks.splice( endIndex, 0, removed );
        await this.project.save();
        this.setState( { tasks: this.project.tasks } );
    }
}