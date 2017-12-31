import * as React from 'react';
import Card, { CardHeader, CardText, CardActions } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
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
  deleting: boolean;
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
      editingTaskDescription: this.props.task.description,
      deleting: false
    };
  }

  render()
  {
    let deleteConfirmation = (
      <Dialog
        modal={false}
        open={this.state.deleting}
        onRequestClose={this.onDeleteCancel}
        actions={[
          <FlatButton
            key="yes"
            label="Yes"
            style={{ backgroundColor: '#ff3d3d', color: 'white' }}
            onClick={this.onDeleteConfirmation}
          />,
          <FlatButton key="no" label="No" onClick={this.onDeleteCancel} />
        ]}
      >
        Delete "{this.props.task.name}" task?
      </Dialog>
    );

    if( this.state.editing )
    {
      return (
        <div className="task-card editing">
          <Card className="task-card-card">
            <div
              className="task-card-edit-form"
              onMouseDown={preventDragging}
              onKeyDown={preventDragging}
            >
              <TextField
                type="text"
                floatingLabelText="Task Name"
                fullWidth={true}
                onChange={this.onEditingTaskNameChange}
                defaultValue={this.state.editingTaskName}
              />
              <TextField
                floatingLabelText="Task Description"
                multiLine={true}
                rows={6}
                rowsMax={6}
                fullWidth={true}
                onChange={this.onEditingTaskDescriptionChange}
                defaultValue={this.state.editingTaskDescription}
              />
            </div>
            <CardActions>
              {
                !this.props.isNew &&
                <FlatButton
                  label="Delete"
                  style={{ backgroundColor: '#ff3d3d', color: 'white' }}
                  onClick={this.onDeleteClick}
                  onMouseDown={preventDragging}
                  onKeyDown={preventDragging}
                />
              }
              <FlatButton
                label="Cancel"
                onClick={this.onCancel}
                onMouseDown={preventDragging}
                onKeyDown={preventDragging}
              />
              <FlatButton
                label={this.props.saveTaskText}
                onClick={this.onTaskSave}
                onMouseDown={preventDragging}
                disabled={!this.state.editingTaskName}
                onKeyDown={preventDragging}
              />
            </CardActions>
          </Card>
          {deleteConfirmation}
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
                {
                  !this.props.isNew &&
                  <IconMenu
                    style={{ position: 'absolute', top: 0, right: 0 }}
                    iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                    onMouseDown={preventDragging}
                    onKeyDown={preventDragging}
                  >
                    <MenuItem primaryText="Edit" onClick={this.onEditClick} />
                    <MenuItem primaryText="Delete" onClick={this.onDeleteClick} />
                  </IconMenu>
                }
              </div>
            </CardHeader>
            <CardText>
              {this.props.task.description}
            </CardText>
          </Card>
          {deleteConfirmation}
        </div>
      );
    }
  }

  private onEditClick = () =>
  {
    this.setState( { editing: true } );
  }

  private onEditingTaskNameChange = ( e: React.FormEvent<HTMLInputElement> ) =>
  {
    this.setState( {
      editingTaskName: e.currentTarget.value
    } );
  }

  private onEditingTaskDescriptionChange = ( e: React.FormEvent<HTMLTextAreaElement> ) =>
  {
    this.setState( {
      editingTaskDescription: e.currentTarget.value
    } );
  }

  private onDeleteClick = () =>
  {
    this.setState( { deleting: true } );
  }

  private onDeleteCancel = () =>
  {
    this.setState( { deleting: false } );
  }

  private onDeleteConfirmation = () =>
  {
    if( this.props.onTaskDelete )
    {
      this.props.onTaskDelete();
    }
  }

  private onCancel = () =>
  {
    if( this.props.onTaskEditCancel )
    {
      this.props.onTaskEditCancel();
    }
    this.setState( { editing: false } );
  }

  private onTaskSave = () =>
  {
    let { editingTaskName, editingTaskDescription } = this.state;
    let task = new Task( editingTaskName, editingTaskDescription, this.props.task.id );
    if( this.props.onTaskSave( task ) )
    {
      this.setState( { editing: false } );
    }
  }
}
