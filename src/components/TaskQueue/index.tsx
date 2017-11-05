import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';

import './styles.css';

import NewTaskCard from 'components/NewTaskCard';
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
            <div className="task-queue">
                {
                    this.state.creating ?
                        <NewTaskCard
                            onCancel={() => this.onTaskCreateCancel()}
                            onTaskCreate={( newTask ) => this.onTaskCreate( newTask )}
                        />
                    : null
                }

                {
                    this.state.tasks.map( ( task ) =>
                    (
                        <TaskCard key={JSON.stringify( task )} task={task} />
                    ) )
                }

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
}