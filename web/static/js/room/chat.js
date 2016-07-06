import React, {PropTypes} from 'react';
import {Socket} from "phoenix"

export default class Chat extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      history: [],
      presence: []
    }

    this.connectToSocket(props.nickname)
    this.joinChannel(props.roomname)
  }

  connectToSocket(identity){
    this.socket = new Socket("/socket", {params: {nickname: identity}})
    this.socket.connect()
  }

  joinChannel(roomname){
    this.channel = this.socket.channel(`room:${roomname}`, {})

    /* This event will be triggered when we connect to the channel and it will
     * return a payload with the all the people connected to the same channel */
    this.channel.on("presence_state", payload => {
      this.setState({presence: Object.keys(payload)})
    })

    // This event will be triggered everytime someone joins or leaves the channel
    this.channel.on("presence_diff", payload => {
      const currentPresence = new Set(this.state.presence)
      const joins = new Set(Object.keys(payload.joins))
      const leaves = new Set(Object.keys(payload.leaves))
      const union = new Set([...currentPresence, ...joins])
      const difference = new Set([...union].filter(x => !leaves.has(x)))
      this.setState({presence: Array.from(difference)})
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }

  _handleFormSubmit(e){
    e.preventDefault()
    alert("FORM SUBMITTED")
  }

  _renderPresence(){
    const nodes = this.state.presence.map((user, i) => {
      const key = `connected_user_${user}`

      return (
        <li key={key}>
          <span className="status online"></span>
          <span>{user}</span>
        </li>
      );
    });

    return (
      <ul>{nodes}</ul>
    );
  }

  _renderHistory(){
    const nodes = this.state.history.map((message, i) => {
      return (
        <div className="message">
          <div className="meta">
            <div className="sender">Fulano</div>
            <div className="timestamp">21:00</div>
          </div>
          <div className="content">
            Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
          </div>
        </div>
      );
    });

    return (
      <div id="history">{nodes}</div>
    );
  }

  render(){
    return (
      <div id="chat">
        <div id="presence">
          <h3>People connected</h3>
          {this._renderPresence()}
        </div>

        {this._renderHistory()}

        <form onSubmit={this._handleFormSubmit}>
          <input type="text" name="message[content]" />
        </form>
      </div>
    );
  }
}
