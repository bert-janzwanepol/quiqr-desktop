import * as React           from 'react';
import service              from '../../../services/service';
import TextField            from '@mui/material/TextField';
import Button               from '@mui/material/Button';
import Box                  from '@mui/material/Box';
import Dialog               from '@mui/material/Dialog';
import DialogActions        from '@mui/material/DialogActions';
import DialogContent        from '@mui/material/DialogContent';
import DialogContentText    from '@mui/material/DialogContentText';
import DialogTitle          from '@mui/material/DialogTitle';


class RenameDialog extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      execButtonsDisabled: false,
      errorTextSiteName: "",
      busy: false,
      cancelText: "cancel",
      siteconf: {}
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.siteconf.key !== this.props.siteconf.key){
      let siteconf = Object.assign({}, this.props.siteconf);
      //this.validateSiteName(siteconf.name);
      this.setState({siteconf: siteconf, execButtonsDisabled: true});
    }
  }

  renderFailure(){
    return (
      <div>
        Something went wrong.
      </div>
    )
  }
  validateSiteName(newName){
    let errorTextSiteName = "";
    let execButtonsDisabled = false;

    if(this.props.localsites && this.props.localsites.includes(newName)){
      errorTextSiteName = "Name is already used."
      execButtonsDisabled = true;
    }
    this.setState({
      execButtonsDisabled: execButtonsDisabled,
      errorTextSiteName: errorTextSiteName
    });
  }

  handleNameChange(e){
    this.validateSiteName(e.target.value);

    let siteconf = this.state.siteconf;

    siteconf.name = e.target.value
    this.setState({ siteconf: siteconf });
  }

  saveSiteConf(){
    service.api.saveSiteConf(this.state.siteconf.key, this.state.siteconf).then(()=>{
      this.props.onSavedClick();
    });
  }

  renderBody(){
    return (
      <Box>
        <TextField
          id="standard-full-width"
          label="Site Name"
          fullWidth
          value={this.state.siteconf.name}
          onChange={(e)=>{this.handleNameChange(e)}}
          error={(this.state.errorTextSiteName===""?false:true)}
          helperText={this.state.errorTextSiteName}
          />

      </Box>
    )
  }

  render(){

    let { open, siteconf } = this.props;
    let failure = this.state.failure;

    const actions = [
      <Button
        key={"menuAction1"+siteconf.name}
        onClick={()=>{
        this.setState({
          open: false
        },()=>{
          this.props.onCancelClick();
        });
      }}>
        {this.state.cancelText}
      </Button>,

      <Button
        key={"menuAction2"+siteconf.name}
        disabled={this.state.execButtonsDisabled} onClick={()=>this.saveSiteConf()} >
        SAVE
      </Button>,
    ];

    return (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"sm"} >

        <DialogTitle id="alert-dialog-title">{"Edit site name: "+siteconf.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { failure? this.renderFailure() : this.renderBody() }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}
export default RenameDialog
