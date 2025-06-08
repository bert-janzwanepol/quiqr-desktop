import React          from 'react';
import Box            from '@mui/material/Box';
import Button         from '@mui/material/Button';
// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';

const useStyles = theme => ({
  button: {
    '& .MuiButton-label': {
      flexDirection: 'column',
    },

    textTransform: 'none',
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    //color: '#212121',
  },
  buttonActive: {
    '& .MuiButton-label': {
      flexDirection: 'column',
    },
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    color: '#757575',
    textTransform: 'none',
  },

  icon: {
    //color: '#212121',
  },
  iconActive: {
    color: '#757575',
  },
});

class ToolbarButton extends React.Component {

  render(){
    const { classes, title, action, icon, active } = this.props;
    let UseIcon = icon;


    return (
      <Box p={0.5}>
        <Button
          onClick={action}
          className={(active ? classes.buttonActive : classes.button) + " toolbar-button"}
          startIcon={<UseIcon style={{padding:0}} />}>
          {title}
        </Button>
      </Box>
    );
  }
}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(ToolbarButton);
export default ToolbarButton;

