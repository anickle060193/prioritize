import * as React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import './styles.css';

import Task from 'utilities/task';

interface Props
{
    task: Task;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
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
            <div
                ref={( ref ) => this.props.provided.innerRef( ref )}
                style={this.props.provided.draggableStyle}
                {...this.props.provided.dragHandleProps}
                className="task"
            >
                <Card className="task-card">
                    <CardHeader title={this.props.task.name} />
                    <CardText>
                        {this.props.task.description}
                    </CardText>
                </Card>
            </div>
        );
    }
}