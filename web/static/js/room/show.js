import {Socket} from "phoenix"

export default class RoomShowView {
  constructor(){
    const conversationWrapper = document.getElementById("conversation")

    this.nickname = conversationWrapper.dataset.nickname
    this.room = conversationWrapper.dataset.room
    this.socket = new Socket("/socket", {params: {nickname: this.nickname}})
    this.socket.connect()
    this.channel = this.socket.channel(`room:${this.room}`, {})

    /* This event will be triggered when we connect to the channel and it will
     * return a payload with the all the people connected to the same channel */ 
    this.channel.on("presence_state", payload => {
      console.log("presence_state", payload)
    })

    // This event will be triggered everytime someone joins or leaves the channel
    this.channel.on("presence_diff", payload => {
      console.log("presence_diff", payload)
    })

    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })
  }
}
