import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { DragDropContext, DragStart, DropResult, Droppable, DroppableProvided, Draggable } from 'react-beautiful-dnd';

import './styles.css';

import NewTaskCard from 'components/NewTaskCard';
import DraggableTaskCard from 'components/DraggableTaskCard';

import Task from 'utilities/task';

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
    constructor( props: Props )
    {
        super( props );

        let tasks = Task.getTasks();

        this.state = {
            creating: tasks.length === 0,
            tasks: tasks
        };

        this.onStorageChange = this.onStorageChange.bind( this );
    }

    componentWillMount()
    {
        window.addEventListener( 'storage', this.onStorageChange );
    }

    componentWillUnmount()
    {
        window.removeEventListener( 'storage', this.onStorageChange );
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

    private onStorageChange( e: StorageEvent )
    {
        this.setState( {
            tasks: Task.getTasks()
        } );
    }

    private onTaskCreateCancel()
    {
        this.setState( { creating: false } );
    }

    private onTaskCreate( newTask: Task )
    {
        newTask.save();
        this.setState( ( prevState, props ) =>
        {
            let tasks = prevState.tasks;
            tasks.splice( 0, 0, newTask );
            return {
                tasks: tasks,
                creating: false
            };
        } );
    }

    private onTaskSave( task: Task, taskIndex: number )
    {
        task.save();
        this.setState( ( prevState: State, props ) =>
        {
            let tasks = prevState.tasks;
            tasks[ taskIndex ] = task;
            return { tasks };
        } );
        return true;
    }

    private onTaskDelete( task: Task, taskIndex: number )
    {
        task.delete();
        this.setState( ( prevState: State, props ) =>
        {
            let tasks = prevState.tasks;
            tasks.splice( taskIndex, 1 );
            return { tasks };
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
        Task.saveTasks( this.state.tasks );
    }

    private reorderTasks( startIndex: number, endIndex: number )
    {
        let tasks = this.state.tasks;
        let [ removed ] = tasks.splice( startIndex, 1 );
        tasks.splice( endIndex, 0, removed );
        this.setState( { tasks } );
    }
}