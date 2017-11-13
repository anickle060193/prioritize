import * as React from 'react';

import ProjectRow from 'components/ProjectRow';

import db, { Project } from 'db/prioritize';

interface Props
{
}

interface State
{
    project: Project | null;
}

export default class HomePage extends React.Component<Props, State>
{
    constructor( props: Props )
    {
        super( props );

        this.state = {
            project: null
        };
    }

    async componentWillMount()
    {
        let project = await db.projects.where( 'name' ).equals( 'Tasks' ).first();
        if( project )
        {
            await project.load();
        }
        else
        {
            project = new Project( 'Tasks', '' );
        }
        this.setState( { project: project } );
    }

    render()
    {
        if( this.state.project )
        {
            return (
                <ProjectRow project={this.state.project} />
            );
        }
        else
        {
            return (
                <div />
            );
        }
    }
}