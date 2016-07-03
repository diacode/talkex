import {Socket} from "phoenix"

export default class RoomShowView {
  constructor(){
    this.room = document.getElementById("conversation").dataset.room
    this.socket = new Socket("/socket")
    this.socket.connect()
    this.channel = this.socket.channel(`room:${this.room}`, {})
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }
}
