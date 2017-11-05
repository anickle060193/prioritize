import * as React from 'react';

import './styles.css';

import Task from 'components/Task';

export default class TaskQueue extends React.Component
{
    render()
    {
        return (
            <div className="task-queue">
                <Task new={true}/>
            </div>
        );
    }
}