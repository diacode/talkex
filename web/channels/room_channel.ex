defmodule Talkex.RoomChannel do
  use Phoenix.Channel

  def join("room:" <> room_name, _message, socket) do
    {:ok, socket}
  end
end
