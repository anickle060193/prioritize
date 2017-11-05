import * as React from 'react';
import * as Bootstrap from 'react-bootstrap';

import './styles.css';

interface Props
{
    new: boolean;
}

export default class Task extends React.Component<Props>
{
    constructor( props: Props )
    {
        super( props );

    }

    render()
    {
        if( this.props.new )
        {
            return (
                <Bootstrap.Panel className="task">
                    <Bootstrap.FormControl type="text" placeholder="Task Name" />
                </Bootstrap.Panel>
            );
        }
        else
        {
            return (
                <Bootstrap.Panel className="task" />
            );
        }
    }
}