import React, {PropTypes} from 'react';
import Chat from "./chat";
import VideoCall from "./video_call";

export default class Conversation extends React.Component {
  render(){
    return (
      <div id="conversation">
        <VideoCall/>
        <Chat/>
      </div>
    );
  }
}
