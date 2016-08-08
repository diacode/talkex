defmodule Talkex.Message do
  use Talkex.Web, :model

  @derive {Poison.Encoder, only: [:room, :author, :content, :inserted_at]}

  schema "messages" do
    field :room, :string
    field :author, :string
    field :content, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:room, :author, :content])
    |> validate_required([:room, :author, :content])
  end
end
