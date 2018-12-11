import React, {Component} from 'react';
import TalentBuildProfileForm from 'components/shiptalent/forms/talentBuildProfileForm';
import VocalistDancerWhoSingsIntroForm from './vocalistDancerWhoSingsIntroForm';


class VocalistDancerWhoSingsIntro extends Component {

  render() {
    const position = this.props.history && this.props.history.location && this.props.history.location.state
      ? this.props.history.location.state.position
      : null;

    const nextLink = {
      pathname: "/talent/video-audition/vocalist-main-intro",
      state: { position: position }
    };

    return (
      <TalentBuildProfileForm
        ContentLayout={VocalistDancerWhoSingsIntroForm}
        formTitle={"My Vocal Audition Videos Instructions"}
        formSubTitle={"(Dancer Who Sings)"}
        nextLink={nextLink}
        nextButtonTitle={"Back to My Vocal Audition Videos Instructions"}
        position={position}
      />
    )
  }
}

export default VocalistDancerWhoSingsIntro;
