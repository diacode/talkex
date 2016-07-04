defmodule Talkex.Presence do
  use Phoenix.Presence, otp_app: :talkex,
                        pubsub_server: Talkex.PubSub
end
