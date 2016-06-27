defmodule Talkex.PageController do
  use Talkex.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
