import * as React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import './styles.css';

import TaskCard from 'components/TaskCard';

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

export default class DraggableTaskCard extends React.Component<Props, State>
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
                className="draggable-task-card"
            >
                <TaskCard task={this.props.task} />
            </div>
        );
    }
}