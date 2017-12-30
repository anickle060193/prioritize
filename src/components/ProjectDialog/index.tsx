import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import { red500, white } from 'material-ui/styles/colors';

const INVALID_PROJECT_NAME = /^\s*$/;

interface Props
{
  open: boolean;
  projectName: string;
  onCancel: () => void;
  onSubmit: ( projectName: string ) => void;
  onDelete?: () => void;
  title: string;
  submitLabel: string;
}

interface State
{
  projectName: string;
}

export default class ProjectDialog extends React.PureComponent<Props, State>
{
  constructor( props: Props )
  {
    super( props );

    this.state = {
      projectName: this.props.projectName
    };
  }

  componentWillReceiveProps( nextProps: Props )
  {
    if( nextProps.projectName !== this.props.projectName )
    {
      this.setState( { projectName: nextProps.projectName } );
    }
  }

  render()
  {
    let actions = [
      (
        <FlatButton
          key="cancel"
          label="Cancel"
          primary={true}
          onClick={this.onCancel}
        />
      ),
      (
        <FlatButton
          key="submit"
          label={this.props.submitLabel}
          primary={true}
          onClick={this.onSubmit}
          disabled={!!this.state.projectName.match( INVALID_PROJECT_NAME )}
        />
      )
    ];

    if( this.props.onDelete )
    {
      actions.splice( 0, 0, (
        <FlatButton
          key="delete"
          label="Delete"
          labelPosition="after"
          primary={false}
          backgroundColor={red500}
          hoverColor={red500}
          labelStyle={{ color: white }}
          icon={<FontIcon className="material-icons" color={white}>delete</FontIcon>}
          onClick={this.onDelete}
        />
      ) );
    }

    return (
      <Dialog
        title={this.props.title}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.onCancel}
      >
        <TextField
          type="text"
          floatingLabelText="Project Name"
          fullWidth={true}
          onChange={this.onProjectNameChange}
          defaultValue={this.state.projectName}
          autoFocus={true}
        />
      </Dialog>
    );
  }

  private onDelete = () =>
  {
    if( this.props.onDelete )
    {
      this.props.onDelete();
    }
  }

  private onCancel = () =>
  {
    this.props.onCancel();
  }

  private onProjectNameChange = ( e: React.FormEvent<HTMLInputElement> ) =>
  {
    this.setState( { projectName: e.currentTarget.value } );
  }

  private onSubmit = () =>
  {
    this.props.onSubmit( this.state.projectName );
  }
}
