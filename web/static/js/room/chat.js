import React, { PropTypes } from 'react';
import { Socket, Presence } from 'phoenix';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      presence: {},
      connected: false,
    };

    this.connectToSocket(props.nickname);
    this.joinChannel(props.roomname);
  }

  connectToSocket(identity) {
    this.socket = new Socket('/socket', { params: { nickname: identity } });
    this.socket.connect();
  }

  joinChannel(roomname) {
    this.channel = this.socket.channel(`room:${roomname}`, {});
    this.setupChannelEvents()
    this.channel.join()
      .receive('ok', resp => {
        console.log('Joined successfully', resp);
        this.setState({ connected: true });
      })
      .receive('error', resp => {
        console.log('Unable to join', resp);
      });
  }

  setupChannelEvents(){
    /* This event will be triggered when we connect to the channel and it will
     * return a payload with the all the people connected to the same channel
     * except me. */
    this.channel.on('presence_state', initialPresence => {
      console.log('presence_state', initialPresence);
      const syncedPresence = Presence.syncState(this.state.presence, initialPresence);
      this.setState({ presence: syncedPresence });
    });

    /* This event will be triggered everytime someone joins or leaves the
     * channel. Changing the status from online to away or viceversa will
     * trigger a presence_diff event on the channel with a join and a leave.
     * When the current user join the channel this event will be triggered
     * right after `presence_state` to notify myself and the rest of users in
     * the room that I've just joined.
     */
    this.channel.on('presence_diff', diff => {
      console.log('presence_diff', diff);
      const oldPresence = this.state.presence;
      const syncedPresence = Presence.syncDiff(oldPresence, diff);
      this.setState({ presence: syncedPresence });
    });

    this.channel.on('new_msg', ::this._handleReceivedMessage);
  }

  _handleReceivedMessage(payload) {
    let history = this.state.history;
    history.push(payload);
    this.setState({ history: history });
    this.historyDiv.scrollTop = this.historyDiv.scrollHeight;
  }

  _handleKeyPress(e) {
    if (e.charCode == 13) {
      e.preventDefault();
      const message = this.myMessageInput.value;

      if (message != '') {
        this.channel.push('new_msg', { body: message });
        this.myMessageInput.value = '';
      }
    }
  }

  _handleOnlineStatusChange(e) {
    e.preventDefault();
    this.channel.push('new_status', { status: e.target.value });
  }

  _renderPresence() {
    const presence = this.state.presence;
    const connectedPeople = Object.keys(presence).map(key => {
      let item = presence[key];
      item.nickname = key;
      return item;
    });

    const nodes = connectedPeople.map((user, i) => {
      const key = `connected_user_${user.nickname}`;
      const status = user.metas[0].status;

      return (
        <li key={key}>
          <span className={`status ${status}`}></span>
          <span>{user.nickname}</span>
        </li>
      );
    });

    return (
      <ul>{nodes}</ul>
    );
  }

  _renderOnlineStatusControl() {
    return (
      <div id="online_status_control">
        Current status:
        <select onChange={::this._handleOnlineStatusChange}>
          <option value="online">online</option>
          <option value="away">away</option>
        </select>
      </div>
    );
  }

  _renderHistory() {
    const nodes = this.state.history.map((message, idx) => {
      const key = `msg_${idx}`;

      return (
        <div className="message" key={key}>
          <div className="meta">
            <div className="sender">{message.author}</div>
            <div className="sent_at">{message.sent_at}</div>
          </div>
          <div className="content">
            {message.body}
          </div>
        </div>
      );
    });

    return (
      <div ref={(ref) => this.historyDiv = ref} id="history">{nodes}</div>
    );
  }

  render() {
    return (
      <div id="chat">
        <div id="presence">
          <h3>People connected</h3>
          {this._renderPresence()}
          {this._renderOnlineStatusControl()}
        </div>

        {this._renderHistory()}

        <form>
          <textarea ref={(ref) => this.myMessageInput = ref} type="text"
            disabled={!this.state.connected} placeholder="Type your message here"
            onKeyPress={::this._handleKeyPress}>
          </textarea>
        </form>
      </div>
    );
  }
}
