import React from 'react';
import Webcam from 'react-webcam';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Link } from 'react-router-dom';
import {
  Alert,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RecordRTC from 'recordrtc';
import DetectRTC from "detectrtc";

import * as videoActions from  '../../actions/videoActions';
import * as deviceActions from  '../../actions/deviceSettings';
import AudioMeter from "../../components/audio-meter/index";

import './styles.css';
import RecordCtl from "../../components/record-ctl/index";
import apiConfig from '../../constants/api';
import { captureUserMedia } from '../../utils/appUtils';

const styles={ 
  floatingLabelStyle: {
    color: "#258df2",
  },
}
const resolutionSize = {
  1: [],
  2: [1920, 1080],
  3: [1280, 720],
  4: [640, 480]
}
const title = {
  "cruise": "Cruise Staff",
  "audio": "Audio Technician",
  "light-technician": "Lighting Technician",
  "vocalist": "Vocalist",
  "dancer": "Dancer",
  "actor": "Actor",
  "aerialist": "Aerialist",
  "solo-musician": "Solo Musician",
  "music-group-leader": "Musical Group Leader",
  "video-technician": "Video Technician",
  "youth-staff": "Youth Staff"
}
class LiveInterview extends React.Component {
  constructor() {
    super();

    this.state = {
      config: true,
      currentQuestion: 0,
      isStopped: false,
      isPlaying: false,
      alertOpen: false,
      errors: [],
      waitingTime: [30, 120],
      remainingTime: [30, 120],
      timePos: 0,

      src: null,
      recordVideo: null,
      uploadSuccess: null,
      uploading: false,
      settings: [],

    };

  }

  componentWillMount() {
    let __this = this, detectError = [];
    let { deviceSettings } = this.props;
    DetectRTC.load(function() {
      // console.log(DetectRTC);

      if (!DetectRTC.hasWebcam)
      {
        __this.setState({ config: false, alertOpen: true })
        detectError.push("Video Camera isn't connected. Check your camera.");
      }else if (!DetectRTC.isWebsiteHasWebcamPermissions)
      {
        __this.setState({ config: false, alertOpen: true })
        detectError.push("Your website doesn't have camera permission."); 
      }
      if (!DetectRTC.hasMicrophone)
      {
        __this.setState({ config: false, alertOpen: true });
        detectError.push("Microphone isn't connected. Check your microphone.");
      }
      else if (!DetectRTC.isWebsiteHasMicrophonePermissions)
      {
        __this.setState({ config: false, alertOpen: true })
        detectError.push("Your website doesn't have microphone permission."); 
      }
      __this.setState({ errors: detectError });
      __this.setState({ 
          resolution: deviceSettings.resolution,
          frameRate: deviceSettings.frameRate,
          bitRate: deviceSettings.bitRate
        }, function(){
          __this.requestUserMedia();
        })
    });
    const { pageId } = this.props.match.params;
    console.log('---- pageId: ', pageId, this.props)
    let position_type = this.props.talentInfo.value 
      ? this.props.talentInfo.value.talent_position_sub_type.talent_position_type 
      : pageId
    console.log('==== position_type: ', position_type)
    this.props.videoActions.getVideoQuestionsActions(
      position_type, 
      'live'
    );
    this.props.videoActions.getVideoSettingsActions();
  }

  componentDidMount() {
    this.countDown();
  }

  componentWillReceiveProps(nextProps) {
    let { videoSettings } = nextProps;
    let wait = [], remain = [];
    if (videoSettings['value']['video_interview_prep_countdown'])
      wait[0] = remain[0] = videoSettings['value']['video_interview_prep_countdown'];
    else
      wait[0] = remain[0] = 0;
    if (videoSettings['value']['video_interview_response_time'])
      wait[1] = remain[1] = videoSettings['value']['video_interview_response_time'];
    else
      wait[1] = remain[1] = 0;
    this.setState(
      { 
        waitingTime: wait, 
        remainingTime: remain,
      });
  }

  countDown = () => {
    const { isStopped } = this.state;
    const __this = this;
    if (!isStopped)
    {
      setTimeout(function () {
        const { remainingTime, timePos } = __this.state;
        let isStopped1 = __this.state.isStopped;
        if (!isStopped1)
        {
          if (remainingTime[timePos] === 0) {
            if (timePos === 0) {
              const newRemaining = [];
              newRemaining[0] = remainingTime[0];
              newRemaining[1] = remainingTime[1] - 1;
              __this.videoRecordStart();
              __this.setState({ timePos: 1, isStopped: false, isPlaying: true, remainingTime: newRemaining });
            } else {
              __this.setState({ isStopped: true });
              __this.videoRecordStop();
            }
          } else {
            const newRemaining = [];
            newRemaining[0] = remainingTime[0];
            newRemaining[1] = remainingTime[1];
            newRemaining[timePos]= remainingTime[timePos] - 1;
            __this.setState({remainingTime: newRemaining});
          }
          __this.countDown();
        }
      }, 1000)
    }
  }

  requestUserMedia() {
    const { resolution, frameRate } = this.state;
    let options = {mandatory: {}};
    if (resolution !== 1 ){
      options['mandatory']['minWidth'] = resolutionSize[resolution][0];
      options['mandatory']['minHeight'] = resolutionSize[resolution][1];
    }
    if (frameRate !== 0){
      options['mandatory']['minFrameRate'] = frameRate;
    }
    captureUserMedia(options, (stream) => {
      try {
        this.setState({ src: stream });
      }
      catch(error) {
        this.setState({ src: window.URL.createObjectURL(stream) });
      }
    });
  }

  onStopRecord = () => {
    const { remainingTime } = this.state;
    remainingTime[0] = remainingTime[1] = 0;
    this.setState({isStopped: true, isPlaying: false});
    this.videoRecordStop();
  };

  onStartRecord = () => {
    const { remainingTime } = this.state;
    remainingTime[0] = 0;
    this.setState({
        isStopped: false, 
        isPlaying: true, 
        timePos: 1, 
        remainingTime: remainingTime}, 
      function() {
        this.countDown();
        this.videoRecordStart();
      });
  };

  videoRecordStart = () => {
    let mimeType = "video/webm\;codecs=h264";
    let __this = this;
    if(this.isMimeTypeSupported('video/mpeg')) {
      mimeType = 'video/mpeg';
    }
    const { resolution, frameRate, bitRate } = this.state;
    let options = {mandatory: {}};
    let rtcOptions = {
      checkForInactiveTracks: false,
      disableLogs: false,
      getNativeBlob: false,
      ignoreMutedMedia: false,
      mimeType: mimeType,
      type: "video"
    }
    if (resolution !== 1 ){
      options['mandatory']['minWidth'] = resolutionSize[resolution][0];
      options['mandatory']['minHeight'] = resolutionSize[resolution][1];
    }
    if (frameRate !== 0){
      options['mandatory']['minFrameRate'] = frameRate;
    }
    if (bitRate !== 0)
      rtcOptions['videoBitsPerSecond'] = bitRate;
    captureUserMedia(options, (stream) => {
      // console.log(__this.state);
      __this.setState({recordVideo: RecordRTC(stream, rtcOptions)}, function() {
        __this.state.recordVideo.startRecording();
      })
    });
  }

  videoRecordStop = () => {
    let __this = this;
    if (this.state.recordVideo)
    {
      this.state.recordVideo.stopRecording(() => {
        let name = "video_interview_" +  Math.floor(Math.random()*90000) + 10000 + ".mp4";
        let file = new File([this.state.recordVideo.blob], name, {type: "video/mp4", lastModified: Date.now()});
        __this.handleUploadInterviewVideos(file);
      });
    }
  }

  isMimeTypeSupported = (mimeType) => {
    if(DetectRTC.browser.name === 'Edge' || 
      DetectRTC.browser.name === 'Safari' || 
      typeof MediaRecorder === 'undefined') {
        return false;
    }
    if(typeof MediaRecorder.isTypeSupported !== 'function') {
        return true;
    }

    return MediaRecorder.isTypeSupported(mimeType);
  }

  onNextQuestion = () => {
    const { remainingTime, waitingTime } = this.state;
    remainingTime[0] = waitingTime[0];
    remainingTime[1] = waitingTime[1];
    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
      isStopped: false,
      isPlaying: false,
      timePos: 0
    }, function() {
      this.countDown();
    });
  };

  onBack = () => {
    const { remainingTime, waitingTime } = this.state;
    remainingTime[0] = waitingTime[0];
    remainingTime[1] = waitingTime[1];
    this.setState({
      currentQuestion: 0,
      isStopped: false,
      isPlaying: false,
      timePos: 0
    }, function() {
      this.countDown();
    });
  };

  handleAlertClose = () => {
    this.setState({alertOpen: false});
  }

  handleAlertRefresh = () => {
    window.location.reload();
  }

  handleUploadInterviewVideos = (file) => {
    // Upload video files
    const {user_id} = this.props.auth.access;
    const signAPI = `${apiConfig.url}/talent_video/upload/${user_id}/interview/policy/`
    const completeAPI = `${apiConfig.url}/talent_video/upload/${user_id}/interview/complete/`
    this.setState({ uploading: true });
    this.uploadToS3(signAPI, completeAPI, file)
  }

  uploadToS3 = (signAPI, completeAPI, file) => {
    const params = {
      objectName: file.name,
      contentType: file.type
    }
    
    fetch(signAPI, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(response => response.json())
    .then(response => {
      if(response.error) {
        // console.log('error: ', response.error)
        this.onError(file)
      }
      else {
        if (response.signedUrl){
          // console.log('success: ', response, response.signedUrl)
          this.uploadFile(response.signedUrl, completeAPI, response.fileID, file)
        } else {
          // console.log('error: ', response)
          this.onError(file)
        }
      }
    })
    .catch(error => {
      // console.log('error: ', error)
      this.onError(file)
    })
  }

  onError = (file) => {
    // console.log('==== Error: ', file)
    this.setState({uploading: false});
  }

  onFinish = (completeAPI, fileID, file, response) => {
    let __this = this;
    let params = {
      fileID: fileID, 
      fileSize: file.size,
      fileType: file.type,
    }
    let url_parse = response.url.split("?");
    let s3_url = url_parse[0];
    __this.setState({ uploading: false, src: s3_url });
    fetch(completeAPI, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    }).then(response => response.json())
    .then(response => {
      if(response.error) {
        // console.log('error: ', response.error)
      }
      else {
        
      }
    })
    .catch(error => {
      this.setState({uploading: false});
      // console.log('error: ', error)
    })
  }

  uploadFile = (s3PutUrl, completeAPI, fileID, file) => {
    // Get signedUrl 
    // var that = this;
    fetch(s3PutUrl, {
      method: 'put',
      // contentType: file.type,
      headers: {
        'x-amz-acl': 'public-read',
        'Content-Type': file.type,
      },
      body: file
    })
    .then(response => {
      if(response.error) {
        // console.log('=== uploadFile: error: ', response.error)
        this.onError(fileID, file)
      }
      else {
        // console.log('== uploadFile: success: ', response)
        this.onFinish(completeAPI, fileID, file, response)
      }
    })
    .catch(error => {
      // console.log('== uploadFile: error: ', error)
      this.onError(fileID, file)
    })
  }

  showSpinner = (b) => {
    return b ? (<div className="spinner">
                  <div className="loading_text">
                    <div className="loading"></div>
                    Uploading - Please Wait
                  </div>
                </div>) : null;
  }

  render () {
    const { pageId } = this.props.match.params;
    const { 
      config, 
      errors, 
      currentQuestion, 
      isStopped,
      isPlaying,
      waitingTime, 
      remainingTime,
      timePos,
      uploading,

    } = this.state;
    const { videoQuestions } = this.props;
    let question = "";
    const actions = [
      <FlatButton
        label="Refresh"
        primary={true}
        onClick={this.handleAlertRefresh}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleAlertClose}
      />,
    ];
    if (videoQuestions && videoQuestions.value && videoQuestions.value.length > 0)
      question = videoQuestions.value[currentQuestion]['content'];
    return config ? (<div className="video-practice">
        {this.showSpinner(uploading)}
        <div className="video-interview-header">
          <h3>
            <span className="pull-left">Question {currentQuestion + 1} of 5</span>
            <span className="pull-right">Video Interview ({title[pageId] && title[pageId]})</span>
          </h3>
          <h5 className="text-center">Live!</h5>
        </div>

        {videoQuestions && videoQuestions.isFetched &&
        <React.Fragment>
          <div className="row">
            <div className="col-sm-12 question-box">
                <p className="question-header text-center">{question}</p>
            </div>
          </div>
          <div className="video-box flex-column">
            <div className="row video-status">
              <div className="col-sm-6">
                <p>Prep Countdown: <b>{remainingTime[0]} second(s)</b></p>
              </div>
              <div className="col-sm-6">
                <p>Response Time: <b>{remainingTime[1]} second(s)</b></p>
              </div>
            </div>
            <div className="row video-webcam"> 
              <div className="audio-box">
                <AudioMeter/>
              </div>
              <Webcam height="420" width="100%"/>
              <div className="video-progress">
                <RecordCtl
                  remaining={remainingTime[timePos]}
                  total={waitingTime[timePos]}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
        }
        <div className="col-md-12 livebuttons-wrapper">
          { (!isPlaying && !isStopped && (
              <RaisedButton
                label={'Start Recording'}
                className="btn-start-start"
                onClick={this.onStartRecord}
                secondary={true}
              />
            ))
          }
          {
            ((isPlaying && !isStopped) && (
              <RaisedButton
                label={'Stop Recording'}
                className="btn-start-stop"
                onClick={this.onStopRecord}
              />
            ))
          }
          {isStopped &&
            (<React.Fragment>
              {currentQuestion < 3 &&
                <RaisedButton
                  label="Next Question"
                  className="btnn-video-buttons btn-vpb"
                  style={styles.raisedButton}
                  primary={true}
                  onClick={this.onNextQuestion}
                /> }
              {currentQuestion === 3 &&
                <RaisedButton
                  label="Final Question"
                  className="btnn-video-buttons btn-vpb"
                  style={styles.raisedButton}
                  primary={true}
                  onClick={this.onNextQuestion}
                />}
              {currentQuestion === 4 && 
                <Link to="/edit-profile">
                  <RaisedButton
                    label="Back to My Cruise Staff Audition Videos"
                    className="btnn-video-buttons btn-vpb"
                    primary={true}
                    style={styles.raisedButton}
                  />
                </Link>
              }
            </React.Fragment>)
          }
        </div>
        <div className="interview-status">
          { !isPlaying && !isStopped && (<span>Begin Your Response</span>) }
          { isStopped && currentQuestion < 4 && (<span>Response Completed.  Thank you.</span>)}
          { isStopped && currentQuestion === 4 && (<span>That’s it!  You’re all done. <br/>Thank you for your responses.</span>)}
        </div>
      </div>) : (<div className="video-black">
        <Dialog
          title="Error"
          actions={actions}
          modal={false}
          open={this.state.alertOpen}
          onRequestClose={this.handleAlertClose}
        >
          <Alert color="danger">Error</Alert>
          {
            errors.map((error, index) => {
              return (<p key={index}>{error}</p>);
            })
          }
        </Dialog>
      </div>)
  }
}

function mapStateToProps(state) {
  const { auth, videoQuestions, videoSettings, deviceSettings, getTalentInfo } = state;
  return {
    auth: auth,
    videoQuestions: videoQuestions,
    videoSettings: videoSettings,
    deviceSettings: deviceSettings,
    talentInfo: getTalentInfo
  }
}

function mapDispatchToProps(dispatch) {
  return {
    videoActions: bindActionCreators(videoActions, dispatch),
    deviceActions: bindActionCreators(deviceActions, dispatch),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveInterview);