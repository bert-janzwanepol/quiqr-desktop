import React                 from 'react';
import Typography            from '@mui/material/Typography';
import Select                from '@mui/material/Select';
import Box                   from '@mui/material/Box';
import InputLabel            from '@mui/material/InputLabel';
import MenuItem              from '@mui/material/MenuItem';
import FormControl           from '@mui/material/FormControl';
// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';
import service               from './../../services/service';
import FolderPicker          from '../../components/FolderPicker';

const useStyles = theme => ({

  container:{
    padding: '20px',
    height: '100%'
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '50ch',
  },

});

class PrefsGeneral extends React.Component {

  history: any;

  constructor(props){
    super(props);

    this.state = {
      prefs: {},
      prefsDataFolder: '',
      prefsInterfaceStyle: ''
    };
  }

  componentDidMount(){

    service.api.readConfKey('prefs').then((value)=>{
      this.setState({prefs: value });

      if(value.interfaceStyle){
        this.setState({prefsInterfaceStyle: value.interfaceStyle });
      }
      else{
        this.setState({prefsInterfaceStyle: "quiqr10" });
      }

      if(value.dataFolder){
        this.setState({prefsDataFolder: value.dataFolder });
      }
      else{
        this.setState({prefsDataFolder: "~/Quiqr" });
      }

    });
  }

  handleFolderSelected(folder){
    service.api.saveConfPrefKey("dataFolder",folder);
    this.setState({prefsDataFolder: folder });
  }

  render(){
    const { classes } = this.props;
    return (
      <div className={ this.props.classes.container }>
        <Typography variant="h4">General Preferences</Typography>

        <Box my={2} mx={1}>
          <FolderPicker
            label="Quiqr Data Folder"
            selectedFolder={this.state.prefsDataFolder}
            onFolderSelected={(e)=>{this.handleFolderSelected(e)}} />
        </Box>

        <Box my={2}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Interface Style</InputLabel>
            <Select
              value={this.state.prefsInterfaceStyle}
              onChange={(e)=>{
                service.api.reloadThemeStyle('reloadThemeStyle');
                service.api.saveConfPrefKey("interfaceStyle", e.target.value);
                this.setState({prefsInterfaceStyle: e.target.value });

              }}
              label="Interface Style"
            >
              <MenuItem key={"quiqr10"} value={"quiqr10"}>Light</MenuItem>
              <MenuItem key={"quiqr10-dark"} value={"quiqr10-dark"}>Dark</MenuItem>
            </Select>
          </FormControl>
        </Box>


        {/*
          <div style={{marginTop:"20px"}}>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.showSplashAtStartup}
                onChange={(e)=>{
                  //TODO Save settings
                  if(e.target.checked){
                    service.api.showMenuBar();
                  }
                  else{
                    service.api.hideMenuBar();
                  }
                }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Show Menu Bar"
            labelPlacement="end"
          />
          </div>
          */}


      </div>
    );
  }

}

// TODO: Temporarily disabled withStyles - convert to sx prop
export default PrefsGeneral;
