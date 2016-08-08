defmodule Talkex.MessageTest do
  use Talkex.ModelCase

  alias Talkex.Message

  @valid_attrs %{author: "some content", content: "some content", room: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Message.changeset(%Message{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Message.changeset(%Message{}, @invalid_attrs)
    refute changeset.valid?
  end
end
