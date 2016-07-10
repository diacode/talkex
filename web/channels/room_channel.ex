defmodule Talkex.RoomChannel do
  use Phoenix.Channel
  use Timex
  alias Talkex.Presence

  def join("room:" <> _room_name, _message, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.nickname, %{
      status: "online"
    })
    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{
      body: body,
      author: socket.assigns.nickname,
      sent_at: DateTime.now |> Timex.format("%H:%M", :strftime) |> elem(1)
    }
    
    {:noreply, socket}
  end

  def handle_in("new_status", %{"status" => status}, socket) do
    {:ok, _} = Presence.update(socket, socket.assigns.nickname, %{
      status: status
    })
    {:noreply, socket}
  end
end
