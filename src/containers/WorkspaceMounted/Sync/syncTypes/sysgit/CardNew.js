import * as React          from 'react';
import Box                 from '@mui/material/Box';
import Paper               from '@mui/material/Paper';
import Typography          from '@mui/material/Typography';
import GitHubIcon          from '@mui/icons-material/GitHub';

class CardNew extends React.Component{

  render(){
    return (
      <Paper
        onClick={()=>{
          this.props.handleClick();
        }}
        elevation={5}
      >
        <Box display="flex" alignItems="center" justifyContent="center" height={63}>
          <GitHubIcon fontSize="large" />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" >
          <Typography variant="h5">Git Target</Typography>
        </Box>
        <Box display="flex" textAlign="center">
          <Typography variant="p">Sync with git server using system git binary</Typography>
        </Box>


      </Paper>
    )
  }

}

export default CardNew;


