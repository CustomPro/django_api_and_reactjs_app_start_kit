import React, {Component} from 'react';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Panel from 'components/general/panel';
import ColumnButton from 'components/shiptalent/buttons/columnButton';
import * as talentActions from 'actions/talentActions';
import { styles } from 'styles';
import Spacer from "components/general/spacer";


class TalentVideoGreetingsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getInfoFromProps(props) {
    const {talentInfo} = props

  }
  componentWillMount() {
    this.props.talentActions.getAllPositionTypes()
  }

  renderPositionButtons() {
    const { classes, allPositionTypes } = this.props
    let items = []
    // if (allPositionTypes && allPositionTypes.length > 0) {
    //   for(let i = 0; i < allPositionTypes.length; i +=2) {
    //     let title = `My ${allPositionTypes[i].name} Audition Videos`
    //     let subTitle = 'in progress'
    //     let link = '#'
    //
    //     items.push(<Grid item lg={3} md={2} sm={0} xs={0} />)
    //     items.push(
    //       <Grid item lg={3} md={4} sm={6} xs={12}
    //             className={classes.talentProfileGuideButtonItem}>
    //         <Link to={link}>
    //           <Button variant="contained" color={'primary'} fullWidth={true}
    //                   className={classes.talentProfileGuideButton}>
    //             <Typography className={classes.talentProfileGuideButtonTitle}>{title}</Typography>
    //             {subTitle && (<Typography className={classes.talentProfileGuideButtonSubTitle}>{subTitle}</Typography>)}
    //           </Button>
    //         </Link>
    //       </Grid>
    //     )
    //
    //     if (allPositionTypes[i + 1]) {
    //       title = `My ${allPositionTypes[i + 1].name} Audition Videos`
    //       subTitle = 'in progress'
    //       link = '#'
    //
    //       items.push(
    //         <Grid item lg={3} md={4} sm={6} xs={12}
    //               className={classes.talentProfileGuideButtonItem}>
    //           <Link to={link}>
    //             <Button variant="contained" color={'primary'} fullWidth={true}
    //                     className={classes.talentProfileGuideButton}>
    //               <Typography className={classes.talentProfileGuideButtonTitle}>{title}</Typography>
    //               {subTitle && (<Typography className={classes.talentProfileGuideButtonSubTitle}>{subTitle}</Typography>)}
    //             </Button>
    //           </Link>
    //         </Grid>
    //       )
    //     } else {
    //       items.push(<Grid item lg={3} md={4} sm={6} xs={12}/>)
    //     }
    //     items.push(<Grid item lg={3} md={2} sm={0} xs={0} />)
    //   }
    //   return items
    // }

    return (<div/>)

  }

  renderContents() {
    const { classes, contentTitle, allPositionTypes } = this.props

    return (
      <Panel title={contentTitle}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <ColumnButton
            link = {'/#'}
            color="primary"
            itemClass = {classes.talentProfileGuideButtonItem}
            buttonClass = {classes.talentProfileGuideButton}
            title = {"INSTRUCTIONS"}
            titleClass = {classes.talentProfileGuideButtonTitle}
            size = {12}
            fullWidth = {false}
          />
          <ColumnButton
            link = {'/#'}
            color="primary"
            itemClass = {classes.talentProfileGuideButtonItem}
            buttonClass = {classes.talentProfileGuideButton}
            title = {"Sample Videos"}
            titleClass = {classes.talentProfileGuideButtonTitle}
            size = {12}
            fullWidth = {false}
          />
        </Grid>

        <Grid container spacing={16} justify="center" alignItems="center">
          { this.renderPositionButtons(allPositionTypes) }
        </Grid>

        <Spacer size={40}/>

        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item xs={10}/>
          <Typography gutterBottom variant='Subheading'>
            <b>{"NOTE: "}</b>
            {` You will see your uploaded Video Greeting and Introduction in your Profile imediately. However, before casting directors can see the uploaded Video Greeting and Introduction in your Profile, it must be reviewed and approved by ShipTalent.com.
            (usually within 24 hours)`}
          </Typography>
        </Grid>

      </Panel>
    )
  }

  render() {
    return (
      <div>
        {this.state.notification && <Alert color="info">{this.state.notification}</Alert>}
        {this.renderContents()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { allPositionTypes } = state;
  return {
    allPositionTypes: allPositionTypes.value,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    talentActions: bindActionCreators(talentActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TalentVideoGreetingsForm));
