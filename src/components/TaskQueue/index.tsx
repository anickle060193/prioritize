import * as React from 'react';
//import FloatingActionButton from 'material-ui/FloatingActionButton';
//import FontIcon from 'material-ui/FontIcon';
import { DragDropContext, DragStart, DropResult, Droppable, DroppableProvided, Draggable } from 'react-beautiful-dnd';

import './styles.css';

//import NewTaskCard from 'components/NewTaskCard';
import TaskCard from 'components/TaskCard';

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
    }

    componentWillMount()
    {
        window.addEventListener( 'storage', ( e ) => this.onStorageChange( e ) );
    }

    render()
    {
        return (
            <DragDropContext
                onDragStart={( dragStart ) => this.onDragStart( dragStart )}
                onDragEnd={( result ) => this.onDragEnd( result )}
            >
                <Droppable droppableId="task_queue" direction="horizontal">
                    {
                        ( dropProvided, dropSnapshot ) =>
                        (
                            <div className="wrapper">
                                {this.renderList( dropProvided )}
                            </div>
                        )
                    }
                </Droppable>
            </DragDropContext>
        );
    }

    private renderList( dropProvided: DroppableProvided )
    {
        return (
            <div className="container">
                <div className="drop-zone" ref={dropProvided.innerRef}>
                    {
                        this.state.tasks.map( ( task ) =>
                        (
                            <Draggable key={task.id} draggableId={task.id}>
                                {
                                    ( dragProvided, dragSnapshot ) =>
                                    (
                                        <div>
                                            <TaskCard task={task} provided={dragProvided} snapshot={dragSnapshot} />
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

    componentWillUnmount()
    {
        window.removeEventListener( 'storage' );
    }

    private onStorageChange( e: StorageEvent )
    {
        this.setState( {
            tasks: Task.getTasks()
        } );
    }

    /*
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
    */

    private onDragStart( dragStart: DragStart )
    {

    }

    private onDragEnd( result: DropResult )
    {
        if( !result.destination )
        {
            return;
        }

        this.reorderTasks( result.source.index, result.destination.index );
    }

    private reorderTasks( startIndex: number, endIndex: number )
    {
        let tasks = this.state.tasks;
        let [ removed ] = tasks.splice( startIndex, 1 );
        tasks.splice( endIndex, 0, removed );
        this.setState( { tasks } );
    }
}