import * as React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import './styles.css';

import Task from 'utilities/task';

interface Props
{
    task: Task;
}

interface State
{
}

export default class TaskCard extends React.Component<Props, State>
{
    constructor( props: Props )
    {
        super( props );
    }

    render()
    {
        return (
            <Card className="task-card">
                <CardHeader title={this.props.task.name} />
                <CardText>
                    {this.props.task.description}
                </CardText>
            </Card>
        );
    }
}