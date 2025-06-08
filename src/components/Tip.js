import React from 'react';
import InfoIcon   from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip    from '@mui/material/Tooltip';

class Tip extends React.Component {
  render(){
    return (
      <span style={{display:'inline-block', position:'relative', cursor: 'default'}}>
        <Tooltip title={this.props.markdown}>
          <span>
            <IconButton aria-label="info" disabled={true} size="large">
              <InfoIcon />
            </IconButton>
          </span>
        </Tooltip>
      </span>
    );
  }
}

export default Tip;
