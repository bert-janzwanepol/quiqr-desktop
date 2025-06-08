import * as React           from 'react';
// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';
import Button               from '@mui/material/Button';
import Box                  from '@mui/material/Box';
import MuiDialogTitle       from '@mui/material/DialogTitle';
import Typography           from '@mui/material/Typography';
import Dialog               from '@mui/material/Dialog';
import DialogActions        from '@mui/material/DialogActions';
import DialogContent        from '@mui/material/DialogContent';
import DialogContentText    from '@mui/material/DialogContentText';
import LinearProgress       from '@mui/material/LinearProgress';

const useStyles = theme => ({

  root: {
    margin: 0,
  },
  serverFormLogo: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3),
  },
});

class SyncBusyDialog extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      infoTxt: "."
    }
  }

  componentDidMount(){
    window.require('electron').ipcRenderer.on('updateProgress',(event, infoTxt, percent)=>{
      this.setState({infoTxt: infoTxt});
    });
  }

  render(){
    let { open, classes } = this.props;

    return (
      <Dialog
        open={open||false}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm" >

        <MuiDialogTitle disableTypography className={classes.root}>
          <Box className={classes.serverFormLogo}>
          {this.props.icon}
          </Box>

          <Typography variant="h6">{this.props.serverTitle || ""}</Typography>
        </MuiDialogTitle>

        <DialogContent>
          <LinearProgress />
          <br/>
          <DialogContentText id="alert-dialog-description">
            {this.state.infoTxt}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.onClose}>
            {"cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(SyncBusyDialog);
export default SyncBusyDialog;
