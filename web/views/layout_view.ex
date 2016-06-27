defmodule Talkex.LayoutView do
  use Talkex.Web, :view

  def action_name(conn) do
    Phoenix.Controller.action_name(conn)
  end

  def controller_name(conn) do
    [_, controller] = Module.split(Phoenix.Controller.controller_module(conn))
    to_string(controller) |> String.replace("Controller", "") |> String.downcase
  end  
end
