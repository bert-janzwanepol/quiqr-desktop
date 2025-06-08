import React          from 'react';
import Box            from '@mui/material/Box';
import Button         from '@mui/material/Button';

class ToolbarButton extends React.Component {

  render(){
    const { title, action, icon, active } = this.props;
    let UseIcon = icon;

    return (
      <Box p={0.5}>
        <Button
          onClick={action}
          className="toolbar-button"
          sx={{
            '& .MuiButton-startIcon': {
              flexDirection: 'column',
            },
            textTransform: 'none',
            margin: 0,
            padding: 0,
            color: active ? '#757575' : 'inherit',
          }}
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

