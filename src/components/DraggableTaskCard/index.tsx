import * as React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import TaskCard, { Props as TaskCardProps } from 'components/TaskCard';

interface Props
{
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
}

interface State
{
}

export default class DraggableTaskCard extends React.Component<Props & TaskCardProps, State>
{
    constructor( props: Props & TaskCardProps )
    {
        super( props );
    }

    render()
    {
        let { provided, snapshot, ...taskCardProps } = this.props;
        return (
            <div
                ref={( ref ) => provided.innerRef( ref )}
                style={provided.draggableStyle}
                {...provided.dragHandleProps}
            >
                <TaskCard {...taskCardProps} />
            </div>
        );
    }
}