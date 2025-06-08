import React          from 'react';
import service        from './../../services/service';
import Typography     from '@mui/material/Typography';
import TextField      from '@mui/material/TextField';

// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';

const useStyles = theme => ({

  container:{
    padding: '20px',
    height: '100%'
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textfield: {
    margin: theme.spacing(1),
  },


});

class PrefsAdvanced extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      prefs : {}
    };
  }

  setStringPrefToState(prefKey, value){
    if(value[prefKey]){
      this.setState({[prefKey]: value[prefKey] });
    }
    else{
      this.setState({[prefKey]: "" });
    }
  }

  componentDidMount(){
    service.api.readConfKey('prefs').then((value)=>{
      this.setState({prefs: value });

      this.setStringPrefToState('systemGitBinPath',value)
      this.setStringPrefToState('openAiApiKey',value)
      this.setStringPrefToState('customOpenInCommand',value)
    });
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={ this.props.classes.container }>
        <Typography variant="h4">Advanced Preferences</Typography>

        <div className={classes.root}>
          <TextField
            id="openInCommand"
            label="Custom open-in-command"
            helperText='Command to open directory in. E.g. alacritty --title "%SITE_NAME" --working-directory "%SITE_PATH"'
            variant="outlined"
            className={classes.textfield}
            value={this.state.customOpenInCommand}
            onChange={(e)=>{
              this.setState({customOpenInCommand: e.target.value });
              service.api.saveConfPrefKey("customOpenInCommand",e.target.value);
            }}
          />

        </div>

        <div className={classes.root}>
          <TextField
            id="openAiApiKey"
            label="openAiApikey"
            helperText='Enter API key to enable AI services. Translate texts, create meta summaries, etc..'
            variant="outlined"
            className={classes.textfield}
            value={this.state.openAiApiKey}
            onChange={(e)=>{
              this.setState({openAiApiKey: e.target.value });
              service.api.saveConfPrefKey("openAiApiKey",e.target.value);
            }}
          />

        </div>


        <div className={classes.root}>
          <TextField
            id="gitBinary"
            label="Path to git binary"
            helperText='providing a path to a installed version of git enables the real git sync target'
            variant="outlined"
            className={classes.textfield}
            value={this.state.systemGitBinPath}
            onChange={(e)=>{
              this.setState({systemGitBinPath: e.target.value });
              service.api.saveConfPrefKey("systemGitBinPath",e.target.value);
            }}
          />

        </div>

      </div>
    );
  }

}

// TODO: Temporarily disabled withStyles - convert to sx prop
export default PrefsAdvanced;
