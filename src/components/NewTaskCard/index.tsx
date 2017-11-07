import * as React from 'react';

import TaskCard from 'components/TaskCard';

import Task from 'utilities/task';

interface Props
{
    onCancel: () => void;
    onTaskCreate: ( newTask: Task ) => void;
}

interface State
{
    taskName: string;
    taskDescription: string;
}

export default class NewTaskCard extends React.Component<Props, State>
{
    constructor( props: Props )
    {
        super( props );

        this.state = {
            taskName: '',
            taskDescription: ''
        };
    }

    render()
    {
        return (
            <TaskCard
                isNew={true}
                saveTaskText="Create"
                task={new Task( '', '', '' )}
                onTaskEditCancel={() => this.props.onCancel()}
                onTaskSave={( newTask ) => this.onTaskCreate( newTask )}
            />
        );
    }

    private onTaskCreate( newTask: Task )
    {
        this.props.onTaskCreate( newTask );
        return true;
    }
}