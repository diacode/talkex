defmodule Talkex.RoomChannel do
  use Phoenix.Channel
  import Ecto.Query
  alias Talkex.Presence
  alias Talkex.Repo
  alias Talkex.Message

  def join("room:" <> _room_name, _message, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    # Presence tracking
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns.nickname, %{
      status: "online"
    })

    # Sending message history to client after joining the room
    room_name = get_room_from_socket(socket)
    messages = Repo.all(
      from m in Message, where: m.room == ^room_name, order_by: m.inserted_at
    )
    push socket, "message_history", %{messages: messages}
    {:noreply, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    changeset = Message.changeset(%Message{}, %{
      content: body,
      author: socket.assigns.nickname,
      room: get_room_from_socket(socket)
    })

    case Repo.insert(changeset) do
      {:ok, message} ->
        broadcast! socket, "new_msg", %{message: message}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error persisting the message"}}, socket}
    end
  end

  def handle_in("new_status", %{"status" => status}, socket) do
    {:ok, _} = Presence.update(socket, socket.assigns.nickname, %{
      status: status
    })
    {:noreply, socket}
  end

  defp get_room_from_socket(socket) do
    String.replace_prefix(socket.topic, "room:", "")
  end
end
