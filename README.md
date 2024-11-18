# Keeping it clean 🧹💼

This plugin removes all free tier labels, warnings, and enterprise upgrade reminders from the Mattermost free edition web interface. It was created to support a clean, self-hosted experience free from branding or ads tied to the original platform.

Initially, the idea was to allow custom user CSS via a plugin settings text box. However, this was discarded out of respect for the Mattermost team, as they've since implemented this feature in the enterprise edition.

To clarify, this plugin is not intended to undermine Mattermost's work. The paid editions are vital to the platform's continued development and the talented team behind it. If you can, consider supporting them. Instead, this plugin provides an alternative for those who cannot purchase a paid edition or are restricted by legal or branding requirements.

Feel free to raise issues for any areas you think the plugin should address but currently doesn't.

Here is a non-exhaustive showcase of some of the changes made by the plugin:

## Usage 🚀

- [Use this link to download the latest version.](https://github.com/dy0gu/mattermost-plugin-freemium/releases/latest/download/freemium.tar.gz)

- Enable [custom plugin uploads](https://docs.mattermost.com/configure/plugins-configuration-settings.html#upload-plugin) in your configuration.

- Install and enable the plugin using the admin console.

## Compatibility 📀

The plugin has been tested with the following versions:

- **9.11.x**
- **10.x**

Note that it should work with versions earlier than **9.11.0**, though this was the one where the new branding changes were introduced.

Any new version is also likely compatible out of the box and will be incrementally supported while attempting to maintaining fixes for earlier releases.

## Development 🛠️

See below for setting up a local workspace to work on the plugin, this section is targeted at developers.

- ### Requirements 📋

  - Go ([version](api/go.mod#L3))
  - Node ([version](web/package.json#L5))
  - Python ([version](.python-version))

- ### Getting Started 🏁

  - Clone this repository.

  - Refer to each folder for instructions on that particular module.

    - [api](api/README.md)
    - [web](web/README.md)

- ### Tools 🧰

  - Pre-commit hooks to run project formatting and linting:

    ```shell
    # Needs the dependencies off all modules installed to run correctly!
    pip install lefthook
    lefthook install

    # When using pre-commit hooks, git commands will fail if any files are checked with errors.
    # These files must be added to the staging area and commited again after being updated.
    ```
