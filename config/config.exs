# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :talkex,
  ecto_repos: [Talkex.Repo]

# Configures the endpoint
config :talkex, Talkex.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "XUC3ZvQTIkajvtzBXBVw98AqgR9NHdNVys/Uy6/e/w5Lbr89WdsSGXoo3w2pfAVW",
  render_errors: [view: Talkex.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Talkex.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
