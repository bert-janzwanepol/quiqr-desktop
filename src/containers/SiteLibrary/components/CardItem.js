import React                 from 'react';
import Card                  from '@mui/material/Card';
import CardActionArea        from '@mui/material/CardActionArea';
import CardHeader            from '@mui/material/CardHeader';
import CardMedia             from '@mui/material/CardMedia';
import Avatar                from '@mui/material/Avatar';
import { red }               from '@mui/material/colors';
import service               from '../../../services/service';
import ScreenShotPlaceholder from '../../../img-assets/screenshot-placeholder.png';

// TODO: Convert to sx prop - temporarily disabled
// import withStyles from '@mui/styles/withStyles';

const useStyles = theme => ({
  root: {
    width: 345,
  },
  content:{
    minHeight: '200',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundColor: "#ccc"
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatarNoFavicon: {
    backgroundColor: red[500],
  }
});


class CardItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      expanded: false,
      screenshot: ScreenShotPlaceholder,
      favicon: ""
    }
    this._ismounted = false;
  }
  componentDidMount(){
    this._ismounted = true;
    this.getScreenshot();
    this.getFavicon();
  }

  componentWillUnmount(){
    this._ismounted = false;
  }

  getScreenshot(){
    if(this.props.site.screenshotURL){
      this._ismounted && this.setState({screenshot:this.props.site.screenshotURL});
    }
    else if(this.props.site.etalage && this.props.site.etalage.screenshots && this.props.site.etalage.screenshots.length > 0){
      service.api.getThumbnailForPath(this.props.site.key, 'source', this.props.site.etalage.screenshots[0]).then((img)=>{
        this._ismounted && this.setState({screenshot:img});
      })
    }
    else {
      this._ismounted && this.setState({screenshot:ScreenShotPlaceholder});
    }
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
      this.getScreenshot();
      this.getFavicon();
    }
  }

  render(){
    const { classes } = this.props;

    let siteAvatar = ( <Avatar aria-label="recipe" variant="rounded" className={classes.avatarNoFavicon}>
      {this.props.site.name.charAt(0)}
    </Avatar>
    )

    if(this.state.favicon !== ""){
      siteAvatar = <Avatar aria-label="recipe" variant="rounded" src={this.state.favicon} />
    }
    return (
      <React.Fragment>
        {this.props.itemMenuItems}
        <Card
          elevation={5}
          className={classes.root}>
            <CardHeader
              avatar={
                siteAvatar
              }
              action={
                this.props.itemMenuButton
              }
              title={<div onClick={this.props.siteClick}>{this.props.site.name}</div>}
              subheader=""
            />
          <CardActionArea>

            <CardMedia onClick={this.props.siteClick}
              className={classes.media}
              image={this.state.screenshot}
              title="Site screenshot"
            />
          </CardActionArea>
        </Card>
      </React.Fragment>
    );
  }

}

// TODO: Temporarily disabled withStyles - convert to sx prop
// export default withStyles(useStyles)(CardItem);
export default CardItem;


