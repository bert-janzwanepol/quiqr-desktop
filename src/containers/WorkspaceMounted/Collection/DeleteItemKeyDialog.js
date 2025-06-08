import * as React        from 'react';
import Button            from '@mui/material/Button';
import DialogTitle       from '@mui/material/DialogTitle';
import Dialog            from '@mui/material/Dialog';
import DialogActions     from '@mui/material/DialogActions';
import DialogContent     from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Spinner           from './../../../components/Spinner'

class DeleteItemKeyDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value:'',
      valid: null
    }
  }

  handleClose(){
    if(this.props.handleClose && !this.props.busy)
      this.props.handleClose();
  }

  handleConfirm(){
    if(this.props.handleConfirm)
      this.props.handleConfirm(this.state.value);
  }

  render(){
    let { busy, itemLabel } = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        modal={true}
        open={true}
        onClose={this.handleClose}
      >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.state.valid? undefined :
            <p>Do you really want to delete <b>"{itemLabel}"</b>?</p>}

            { busy ? <Spinner /> : undefined }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={busy} onClick={this.handleClose.bind(this)} color="primary">Cancel</Button>
          <Button disabled={busy} onClick={this.handleConfirm.bind(this)} color="primary">Delete</Button>
        </DialogActions>


      </Dialog>
    );
  }
}

export default DeleteItemKeyDialog
