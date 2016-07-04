import {Socket} from "phoenix"

export default class RoomShowView {
  constructor(){
    const conversationWrapper = document.getElementById("conversation")

    this.nickname = conversationWrapper.dataset.nickname
    this.room = conversationWrapper.dataset.room
    this.socket = new Socket("/socket", {params: {nickname: this.nickname}})
    this.socket.connect()
    this.channel = this.socket.channel(`room:${this.room}`, {})
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }
}
