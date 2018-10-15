import React, {Component} from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Panel from '../../components/panel';
import Spacer from "../../components/spacer";
import * as talentActions from  '../../actions/talentActions';
import styles from '../../styles';

class LastWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: props.talentInfo && (props.talentInfo.sex === 'm') ?
        "Male" : "Female"
    }
  }

  getInfoFromProps(props) {
    const { talentInfo } = props
    if (talentInfo) {
      this.setState({
        gender: talentInfo.sex === 'm' ? "Male" : "Female"
      })
    }
  }

  componentWillMount() {
    console.log('==== auth: ', this.props)
    this.props.talentActions.getTalentInfo(this.props.auth.user_id)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.getInfoFromProps(nextProps)
    })
  }

  handleClickGenderButton = (type, val) =>  {
    this.setState({ [type]: val});
  }

  handleClickNextButton = () => {

  }

  handleNextResponse = (response, isFailed) => {
    console.log('==== response: ', response, isFailed)
  }

  renderButtons() {
    const { classes } = this.props;
    return (
      <Panel title={"Build My Profile Wizard"}>

        <Typography align="center" component="h3" variant="h3" gutterBottom>
          {"Great."}
        </Typography>
        <Typography align="center" component="h3" variant="h3" gutterBottom>
          {"Now that we know what you do, "}
          <br/>
          {"let's get some more information."}
        </Typography>
        <br/>
        <Grid container spacing={40}>
          <Grid item xs />
            <Grid item xs={8} md={4} sm>
              <Link to='/contact-info'>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.selectedButton}
                  fullWidth={false}
                  onClick={() => this.handleClickGenderButton()}
                >
                  <Typography className={classes.selectedButtonTitle}>
                    {"Go to My Contact Info"}
                  </Typography>
                </Button>
              </Link>
            </Grid>
          <Grid item xs />

          <Grid item xs={12}>
            <Grid container justify="center" direction="column" alignItems="center" spacing={24}>
              <Grid item xl={6} md={8} xs={12}>
                <Paper elevation={1} className={classes.paperDescription}>
                  <Grid container direction="column" alignItems="center"  spacing={24}>
                    <Grid item xs={12}>
                      <Typography variant="title" align="center" colorTextPrimary>
                        {"From here, the wizard takes Talent through each section:"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align="center" variant="body1">
                        {"My Contact Info → My Nationality → My Languages → My Height, Weight & Age Range → My Medical →My Headline & Bio → My Resume → My Pictures → My Videos"}
                        <br/>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} sm />
            </Grid>
          </Grid>
        </Grid>

      </Panel>
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={"contact-info-view-container"}>
        {this.renderButtons()}
        <Row>
          <Col xs="4" md="4" className="pt-3 pt-md-3 profile-back-button-group-col">
            <Link to="/profile-wizard/select-position-sub-type">
              <RaisedButton label="Back" primary={true}/>
            </Link>
          </Col>
          <Col xs="4" md="4" className="pt-4 pt-md-4"> </Col>
          <Col xs="4" md="4" className="pt-3 pt-md-3 profile-save-button-group-col">
            <Link to="/profile-wizard/select-position-type">
              <RaisedButton
                label="Back to Primary Position (demo link only)"
                primary={true}
                onClick={() => this.handleClickNextButton()} />
            </Link>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { auth, talentInfo } = state;
  return {
    auth: auth.access,
    talentInfo: talentInfo.value,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    talentActions: bindActionCreators(talentActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LastWizard));