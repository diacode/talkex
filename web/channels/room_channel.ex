defmodule Talkex.RoomChannel do
  use Phoenix.Channel
  alias Talkex.Presence

  def join("room:" <> _room_name, _message, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.nickname, %{
      online_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end
end
