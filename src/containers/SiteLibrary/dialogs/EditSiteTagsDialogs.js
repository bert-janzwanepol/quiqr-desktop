import * as React           from 'react';
import service              from '../../../services/service';
import Chips                from '../../../components/Chips';
import Button               from '@mui/material/Button';
import Box                  from '@mui/material/Box';
import Dialog               from '@mui/material/Dialog';
import DialogActions        from '@mui/material/DialogActions';
import DialogContent        from '@mui/material/DialogContent';
import DialogContentText    from '@mui/material/DialogContentText';
import DialogTitle          from '@mui/material/DialogTitle';


class EditTagsDialogs extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      execButtonsDisabled: true,
      errorTextSiteName: "",
      busy: false,
      cancelText: "cancel",
      siteconf: {}
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.siteconf.key !== this.props.siteconf.key){
      let siteconf = this.props.siteconf;
      if(!siteconf.tags) siteconf.tags = [];
      this.setState({siteconf: this.props.siteconf, execButtonsDisabled: true});
    }
  }

  renderFailure(){
    return (
      <div>
        Something went wrong.
      </div>
    )
  }

  handlePushItem(val){
    if(val==="") return;
    let siteconf = this.state.siteconf;
    let copy = siteconf.tags.slice(0);
    copy.push(val);
    siteconf.tags = copy
    this.setState({siteconf:siteconf, execButtonsDisabled: false});
  }

  handleSwap(e: Event, {index, otherIndex}: {index: number, otherIndex: number}){
    let siteconf = this.state.siteconf;
    let val = siteconf.tags.slice(0);
    let temp = val[otherIndex];
    val[otherIndex] = val[index];
    val[index] = temp;

    siteconf.tags = val
    this.setState({siteconf:siteconf, execButtonsDisabled: false});
  }

  handleRequestDelete(index: number){
    let siteconf = this.state.siteconf;
    let copy = siteconf.tags.slice(0);
    copy.splice(index,1);
    siteconf.tags = copy
    this.setState({siteconf:siteconf, execButtonsDisabled: false});
  }

  saveSiteConf(){
    service.api.saveSiteConf(this.state.siteconf.key, this.state.siteconf).then(()=>{
      this.props.onSavedClick();
    });
  }

  renderBody(){
    let field = {title: "tags"}
    return (
      <Box>
        <Chips
          items={this.state.siteconf.tags}
          sortable={true}
          fullWidth={true}
          field={field}
          onRequestDelete={this.handleRequestDelete.bind(this)}
          onPushItem={this.handlePushItem.bind(this)}
          onSwap={this.handleSwap.bind(this)}
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

        <DialogTitle id="alert-dialog-title">{"Edit tags of site: "+siteconf.name}</DialogTitle>
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
export default EditTagsDialogs
