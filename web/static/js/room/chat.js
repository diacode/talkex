import React, { PropTypes } from 'react';
import { Socket } from 'phoenix';

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

    /* This event will be triggered when we connect to the channel and it will
     * return a payload with the all the people connected to the same channel */
    this.channel.on('presence_state', payload => {
      console.log('presence_state', payload);
      this.setState({ presence: payload });
    });

    // This event will be triggered everytime someone joins or leaves the channel
    this.channel.on('presence_diff', payload => {
      console.log('presence_diff', payload);

      let currentPresence = Object.assign({}, this.state.presence);

      // Handling joins
      for (let key of Object.keys(payload.joins)) {
        if (currentPresence[key]) {
          currentPresence[key].metas.push(payload.joins[key].metas[0]);
        }else {
          currentPresence[key] = payload.joins[key];
        }
      }

      // Handling leaves
      for (let key of Object.keys(payload.leaves)) {
        if (currentPresence[key].metas.length == 1) {
          delete currentPresence[key];
        }else {
          const refIndex = currentPresence[key].metas.findIndex((element, index) => {
            return element.phx_ref == payload.leaves[key].metas[0].phx_ref;
          });

          currentPresence[key].metas.splice(refIndex, 1);
        }
      }

      console.log('PRESENCE UPDATED', currentPresence);
      this.setState({ presence: currentPresence });
    });

    this.channel.on('new_msg', ::this._handleReceivedMessage);

    this.channel.join()
      .receive('ok', resp => {
        console.log('Joined successfully', resp);
        this.setState({ connected: true });
      })
      .receive('error', resp => { console.log('Unable to join', resp); });
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
