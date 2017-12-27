import * as React from 'react';
import * as $ from 'jquery';
import * as Materialize from 'materialize-css';

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
      editingTaskDescription: this.props.task.description,
    };
  }

  componentDidMount()
  {
    this.initialize();
  }

  componentDidUpdate()
  {
    this.initialize();
  }

  render()
  {
    if( this.state.editing )
    {
      return (
        <div className="card task-card">
          <div className="card-content">
            <div className="input-field">
              <label>Task name</label>
              <input
                type="text"
                className="text-name-input"
                autoFocus={true}
                defaultValue={this.state.editingTaskName}
                onChange={this.onEditingTaskNameChange}
                onMouseDown={preventDragging}
                onKeyDown={preventDragging}
              />
            </div>
            <div className="input-field">
              <label>Task Description</label>
              <textarea
                className="materialize-textarea"
                defaultValue={this.state.editingTaskDescription}
                onChange={this.onEditingTaskDescriptionChange}
                onMouseDown={preventDragging}
                onKeyDown={preventDragging}
              />
            </div>
          </div>
          <div className="card-action">
            {
              !this.props.isNew &&
              <a
                href="#"
                onClick={this.onDeleteClick}
                onMouseDown={preventDragging}
                onKeyDown={preventDragging}
              >
                Delete
              </a>
            }
            <a
              href="#"
              onClick={this.onCancel}
              onMouseDown={preventDragging}
              onKeyDown={preventDragging}
            >
              Cancel
            </a>
            <a
              href="#"
              className={!this.state.editingTaskName ? 'disabled' : ''}
              onClick={this.onTaskSave}
              onMouseDown={preventDragging}
              onKeyDown={preventDragging}
            >
              {this.props.saveTaskText}
            </a>
          </div>
        </div>
      );
    }
    else
    {
      return (
        <div className="task-card card">
          <div className="card-content">
            <span className="card-title">{this.props.task.name}</span>
            {
              !this.props.isNew &&
              (
                <div className="task-dropdown-menu">
                  <a
                    href="#"
                    className="waves-effect icon-button"
                    data-dropdown="inactive"
                    data-alignment="right"
                    data-activates={`menu-${this.props.task.id}`}
                    data-stoppropagation={true}
                    onMouseDown={preventDragging}
                    onKeyDown={preventDragging}
                  >
                    <span className="material-icons">more_vert</span>
                  </a>
                  <ul id={`menu-${this.props.task.id}`} className="dropdown-content">
                    <li><a href="#" onClick={this.onEditClick}>Edit</a></li>
                    <li><a href="#" onClick={this.onDeleteClick}>Delete</a></li>
                  </ul>
                </div>
              )
            }
            <p>
              {this.props.task.description}
            </p>
          </div>
        </div >
      );
    }
  }

  private initialize()
  {
    $( '[data-dropdown="inactive"]' ).attr( 'data-dropdown', 'active' ).dropdown();
    Materialize.updateTextFields();
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
    if( editingTaskName )
    {
      let task = new Task( editingTaskName, editingTaskDescription, this.props.task.id );
      if( this.props.onTaskSave( task ) )
      {
        this.setState( { editing: false } );
      }
    }
  }
}
