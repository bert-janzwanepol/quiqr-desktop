import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { snackMessageService } from './../services/ui-service';

class SnackbarManager extends React.Component{

  componentDidMount(){
    snackMessageService.registerListener(this);
  }

  componentWillUnmount(){
    snackMessageService.unregisterListener(this);
  }

  render(){
    let snackMessage = snackMessageService.getCurrentSnackMessage();
    let previousSnackMessage = snackMessageService.getPreviousSnackMessage();
    let snackbar = undefined;

    if(snackMessage){

      if(snackMessage.action){
        snackbar = (
          <Snackbar
            key="snack-message"
            open={ true }
            anchorOrigin={{vertical:"bottom", horizontal: "left" }}
            action={ snackMessage.action }
            autoHideDuration={ snackMessage.autoHideDuration }
            message={snackMessage.message}
          />
        );

      }
      else{
        snackbar = (
          <Snackbar
            key="snack-message"
            open={ true }
            onClose={()=>{ snackMessageService.reportSnackDismiss() }}
            anchorOrigin={{vertical:"bottom", horizontal: "left" }}
            autoHideDuration={ snackMessage.autoHideDuration }
          >
            <Alert
              elevation={6} variant="filled"
              onClose={ ()=>{ snackMessageService.reportSnackDismiss() }}
              severity={snackMessage.severity}>
              {snackMessage.message}
            </Alert>
          </Snackbar>
        );

      }
    }
    else{
      snackbar = (
        <Snackbar
          key="snack-message"
          open={ false }
          action={ previousSnackMessage?previousSnackMessage.action:'' }
          message={ previousSnackMessage?previousSnackMessage.message:'' }
        />
      );
    }

    return <React.Fragment>
      {snackbar}
    </React.Fragment>;
  }
}
export default SnackbarManager;
