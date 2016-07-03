// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import RoomShowView from "./room/show";

class App{
  constructor(){
    this.initializers = {
      room:{
        show: function(){ new RoomShowView(); }
      }
    };

    const body = document.getElementsByTagName('body')[0]
    const controller = body.dataset.controller
    const action =  body.dataset.action
    const initializer = this.initializers[controller] && this.initializers[controller][action]

    if (typeof initializer === "function") initializer()
  }
}

(function(){
    new App();
})();
