import * as React from 'react';
import { Card } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import './styles.css';

import Task from 'utilities/task';

type TaskCreateEventListener = ( newTask: Task ) => void;

interface Props
{
    onCancel: () => void;
    onTaskCreate: TaskCreateEventListener;
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
            <Card className="new-task">
                <div className="new-task-form">
                    <TextField
                        type="text"
                        floatingLabelText="New Task Name"
                        fullWidth={true}
                        onChange={( e ) => this.onTaskNameChange( e )}
                        defaultValue={this.state.taskName}
                    />
                    <TextField
                        floatingLabelText="New Task Description"
                        multiLine={true}
                        rows={6}
                        rowsMax={6}
                        fullWidth={true}
                        onChange={( e ) => this.onTaskDescriptionChange( e )}
                        defaultValue={this.state.taskDescription}
                    />
                </div>
                <FlatButton label="Cancel" onClick={( e ) => this.onCancel( e )} />
                <FlatButton label="Create Task" onClick={( e ) => this.onTaskCreate( e )} disabled={!this.state.taskName} />
            </Card>
        );
    }

    private onTaskNameChange( e: React.FormEvent<{}> )
    {
        this.setState( {
            taskName: ( e.currentTarget as HTMLInputElement ).value
        } );
    }

    private onTaskDescriptionChange( e: React.FormEvent<{}> )
    {
        this.setState( {
            taskDescription: ( e.currentTarget as HTMLTextAreaElement ).value
        } );
    }

    private onCancel( e: React.SyntheticEvent<{}> )
    {
        e.preventDefault();

        this.props.onCancel();
    }

    private onTaskCreate( e: React.SyntheticEvent<{}> )
    {
        let newTask = new Task( this.state.taskName, this.state.taskDescription );
        this.props.onTaskCreate( newTask );
    }
}