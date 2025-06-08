import React from 'react';

import Box               from '@mui/material/Box';
import Button            from '@mui/material/Button';
import ToggleButton      from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

class ToolbarToggleButtonGroup extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      view: "list"
    }
  }

  render(){
    const { title, optionItems, activeOption } = this.props;
    return (
      <Box display="flex" justifyContent="center" flexDirection="column" border={0} m={0.6} px={1}>
        <ToggleButtonGroup value={activeOption} exclusive size="small">
          {optionItems.map((item, index)=>{
            return (<ToggleButton key={"view"+index} value={item.value} aria-label={item.value}
            onClick={()=>this.props.handleChange(item.value)} >
            {item.icon}
          </ToggleButton>)
          })}
        </ToggleButtonGroup>
        <Button size="small" sx={{ margin: 0, padding: 0 }}>{title}</Button>
      </Box>
    )
  }
}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(ToolbarToggleButtonGroup);
export default ToolbarToggleButtonGroup;

