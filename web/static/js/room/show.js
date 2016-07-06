import React from 'react';
import ReactDOM from 'react-dom';
import Conversation from './conversation';

export default class RoomShowView {
  constructor() {
    let conversationContainer = document.getElementById('conversation_container');
    const dataset = conversationContainer.dataset;
    ReactDOM.render(
      <Conversation nickname={dataset.nickname} roomname={dataset.room} />,
        conversationContainer
    );
  }
}
