defmodule Talkex.RoomController do
  use Talkex.Web, :controller

  def create(conn, params) do
    roomname = params["room"]["roomname"]

    conn
    |> put_session(:nickname, params["room"]["nickname"])
    |> redirect to: "/rooms/#{roomname}"
  end

  def show(conn, params) do
    conn
    |> assign(:nickname, get_session(conn, :nickname))
    |> assign(:room, params["id"])
    |> render "show.html"
  end

  def ui(conn, _params) do
    conn
    |> render "ui.html"
  end
end
