import * as React from 'react';
import Card, { CardHeader, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import './styles.css';

import { Task } from 'db/prioritize';

export interface Props
{
    task: Task;
    saveTaskText: string;
    isNew?: boolean;
    onTaskSave: ( task: Task ) => boolean;
    onTaskEditCancel?: () => void;
    onTaskDelete?: () => void;
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
            editing: !!this.props.isNew,
            editingTaskName: this.props.task.name,
            editingTaskDescription: this.props.task.description
        };
    }

    render()
    {
        if( this.state.editing )
        {
            return (
                <div className="task-card">
                    <Card style={{ position: 'relative' }}>
                        {
                            ( this.props.isNew || !this.props.onTaskDelete ) ? null :
                                <IconMenu
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                    iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                                    onMouseDown={preventDragging}
                                    onKeyDown={preventDragging}
                                >
                                    <MenuItem primaryText="Delete" onClick={( e ) => this.onDeleteClick( e )} />
                                </IconMenu>
                        }
                        <div
                            className="task-card-edit-form"
                            onMouseDown={preventDragging}
                            onKeyDown={preventDragging}
                        >
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
                                onKeyDown={preventDragging}
                            />
                            <FlatButton
                                label={this.props.saveTaskText}
                                onClick={( e ) => this.onTaskSave( e )}
                                onMouseDown={preventDragging}
                                disabled={!this.state.editingTaskName}
                                onKeyDown={preventDragging}
                            />
                        </CardActions>
                    </Card>
                </div>
            );
        }
        else
        {
            return (
                <div className="task-card">
                    <Card className="task-card-card">
                        <CardHeader title={this.props.task.name}>
                            <div className="task-card-edit-button">
                                <IconButton
                                    iconClassName="material-icons"
                                    onClick={( e ) => this.onEditClick( e )}
                                    onMouseDown={preventDragging}
                                    onKeyDown={preventDragging}
                                >
                                    edit
                                </IconButton>
                            </div>
                        </CardHeader>
                        <CardText>
                            {this.props.task.description}
                        </CardText>
                    </Card>
                </div>
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

    private onDeleteClick( e: React.SyntheticEvent<{}> )
    {
        if( this.props.onTaskDelete )
        {
            this.props.onTaskDelete();
        }
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