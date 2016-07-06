import React, {PropTypes} from 'react';

export default class Chat extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      history: [],
      presence: []
    }
  }

  _handleFormSubmit(e){
    e.preventDefault()
    alert("FORM SUBMITTED")
  }

  _renderPresence(){
    const nodes = this.state.presence.map((user, i) => {
      return (
        <li>
          <span className="status online"></span>
          <span>johndoe</span>
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
