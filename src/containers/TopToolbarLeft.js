import React from 'react';
import Box from '@mui/material/Box';


class TopToolbarLeft extends React.Component {
  render(){

    return (
      <Box textOverflow="ellipsis" overflow="hidden" fontWeight="fontWeightMedium" border={0} component="div" fontSize="h6.fontSize" m={2} whiteSpace="nowrap">
         {this.props.title}
      </Box>
    );
  }
}

export default TopToolbarLeft;
