import React from 'react';
import ListItem                from '@mui/material/ListItem';
import ListItemText            from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemAvatar          from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import service              from '../../../services/service';

// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';

const useStyles = theme => ({
  avatarNoFavicon: {
    backgroundColor: red[500],
  }
});


class SiteListItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      favicon: ""
    }
    this._ismounted = false;
  }

  componentDidMount(){
    this._ismounted = true;
    this.getFavicon();
  }

  componentWillUnmount(){
    this._ismounted = false;
  }

  getFavicon(){
      if(this.props.site.etalage && this.props.site.etalage.favicons && this.props.site.etalage.favicons.length > 0){
        service.api.getThumbnailForPath(this.props.site.key, 'source', this.props.site.etalage.favicons[0]).then((img)=>{
        this._ismounted && this.setState({favicon:img});
        })
      }
      else{
        this._ismounted && this.setState({favicon:""});
      }
  }

  componentDidUpdate(preProps){
    if(this._ismounted && preProps.site.key !== this.props.site.key){
      this.getFavicon();
    }
  }

  render(){
    const { classes } = this.props;

    let siteAvatar = ( <Avatar aria-label="recipe"  variant="rounded" className={classes.avatarNoFavicon}>
      {this.props.site.name.charAt(0)}
    </Avatar>
    )

    if(this.state.favicon !== ""){
      siteAvatar = <Avatar aria-label="recipe" variant="rounded" src={this.state.favicon} />
    }
    return (

      <React.Fragment>
        <ListItem
          id={"list-siteselectable-"+this.props.site.name}
          key={"sitelistitem-"+this.props.site.key}
          onClick={ this.props.siteClick }
          button={true}>

          <ListItemAvatar>
            {siteAvatar}
          </ListItemAvatar>

          <ListItemText primary={this.props.site.name} />
          {(this.props.site.remote?null:
          <ListItemSecondaryAction>
            {
              this.props.itemMenuButton
            }
          </ListItemSecondaryAction>
          )}

        </ListItem>
        {this.props.itemMenuItems}
      </React.Fragment>
    );
  }

}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(SiteListItem);
export default SiteListItem;


