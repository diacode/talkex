use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or you later on).
config :talkex, Talkex.Endpoint,
  secret_key_base: "gceBbgs5JXrRXuDTYFEYxdRviuIs1zNFfuMsPBf7ZBbfRT0XgN3DI2IliVmWO/8i"

# Configure your database
config :talkex, Talkex.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "talkex_prod",
  pool_size: 20
