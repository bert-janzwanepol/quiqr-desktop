import React from 'react';

import Grid            from '@mui/material/Grid';
import Box            from '@mui/material/Box';
// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';

const useStyles = theme => ({
  iconButton: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
});

class TopToolbarRight extends React.Component {

  render(){
    return (
      <Grid container spacing={3}>
        <Grid item xs>
          <Box display="flex" flexDirection="row" border={0} alignItems="center">
            {this.props.itemsLeft.map((item, index)=>{
              return item;
            })}
          </Box>

        </Grid>
        <Grid item xs>
          <Box display="flex" justifyContent="center" flexDirection="row" border={0} alignItems="center" >
            {this.props.itemsCenter.map((item, index)=>{
              return item;
            })}
          </Box>
        </Grid>
        <Grid item xs>
          <Box display="flex" justifyContent="flex-end" flexDirection="row" width={1} border={0} alignItems="center" >
            {this.props.itemsRight.map((item, index)=>{
              return item;
            })}
          </Box>
        </Grid>
      </Grid>
    );
  }
}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(TopToolbarRight);
export default TopToolbarRight;
