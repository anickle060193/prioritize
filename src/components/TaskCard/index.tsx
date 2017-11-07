import * as React from 'react';
import Card, { CardHeader, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

import './styles.css';

import Task from 'utilities/task';

export interface Props
{
    task: Task;
    saveTaskText: string;
    initialEditing?: boolean;
    onTaskSave: ( task: Task ) => boolean;
    onTaskEditCancel?: () => void;
}

interface State
{
    editing: boolean;
    editingTaskName: string;
    editingTaskDescription: string;
}

function preventDragging( e: React.SyntheticEvent<{}> )
{
    e.stopPropagation();
}

export default class TaskCard extends React.Component<Props, State>
{
    constructor( props: Props )
    {
        super( props );

        this.state = {
            editing: !!this.props.initialEditing,
            editingTaskName: this.props.task.name,
            editingTaskDescription: this.props.task.description
        };
    }

    render()
    {
        if( this.state.editing )
        {
            return (
                <Card className="task-card">
                    <div className="task-card-edit-form" onMouseDown={preventDragging}>
                        <TextField
                            type="text"
                            floatingLabelText="Task Name"
                            fullWidth={true}
                            onChange={( e ) => this.onEditingTaskNameChange( e )}
                            defaultValue={this.state.editingTaskName}
                        />
                        <TextField
                            floatingLabelText="Task Description"
                            multiLine={true}
                            rows={6}
                            rowsMax={6}
                            fullWidth={true}
                            onChange={( e ) => this.onEditingTaskDescriptionChange( e )}
                            defaultValue={this.state.editingTaskDescription}
                        />
                    </div>
                    <CardActions>
                        <FlatButton
                            label="Cancel"
                            onClick={( e ) => this.onCancel( e )}
                            onMouseDown={preventDragging}
                        />
                        <FlatButton
                            label={this.props.saveTaskText}
                            onClick={( e ) => this.onTaskSave( e )}
                            onMouseDown={preventDragging}
                            disabled={!this.state.editingTaskName}
                        />
                    </CardActions>
                </Card>
            );
        }
        else
        {
            return (
                <Card className="task-card">
                    <CardHeader title={this.props.task.name}>
                        <div className="task-card-edit">
                            <IconButton
                                iconClassName="material-icons"
                                onClick={( e ) => this.onEditClick( e )}
                                onMouseDown={preventDragging}
                            >
                                edit
                            </IconButton>
                        </div>
                    </CardHeader>
                    <CardText style={{ height: '100%' }}>
                        {this.props.task.description}
                    </CardText>
                </Card>
            );
        }
    }

    private onEditClick( e: React.SyntheticEvent<{}> )
    {
        this.setState( { editing: true } );
    }

    private onEditingTaskNameChange( e: React.FormEvent<{}> )
    {
        this.setState( {
            editingTaskName: ( e.currentTarget as HTMLInputElement ).value
        } );
    }

    private onEditingTaskDescriptionChange( e: React.FormEvent<{}> )
    {
        this.setState( {
            editingTaskDescription: ( e.currentTarget as HTMLTextAreaElement ).value
        } );
    }

    private onCancel( e: React.SyntheticEvent<{}> )
    {
        if( this.props.onTaskEditCancel )
        {
            this.props.onTaskEditCancel();
        }
        this.setState( { editing: false } );
    }

    private onTaskSave( e: React.SyntheticEvent<{}> )
    {
        let { editingTaskName, editingTaskDescription } = this.state;
        let task = new Task( editingTaskName, editingTaskDescription, this.props.task.id );
        if( this.props.onTaskSave( task ) )
        {
            this.setState( { editing: false } );
        }
    }
}