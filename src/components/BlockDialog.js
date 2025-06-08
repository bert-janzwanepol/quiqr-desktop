import * as React from 'react';
import Dialog               from '@mui/material/Dialog';
import DialogContent        from '@mui/material/DialogContent';
import DialogContentText    from '@mui/material/DialogContentText';
import DialogTitle          from '@mui/material/DialogTitle';

export default class BlockDialog extends React.Component{

  render(){

    let { open, children } = this.props;
    let title = "Working..."

    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
      </Dialog>

    );
  }

}
