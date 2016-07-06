import React from 'react';
import ReactDOM from "react-dom";
import Conversation from "./conversation";

export default class RoomShowView {
  constructor(){
    let conversation_container = document.getElementById("conversation_container")
    const dataset = conversation_container.dataset
    ReactDOM.render(<Conversation nickname={dataset.nickname} roomname={dataset.room} />, conversation_container)
  }
}
