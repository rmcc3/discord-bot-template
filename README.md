# Discord Bot Template with TypeScript

This is a template built using TypeScript and the discord.js v14.14 library. The bot provides a starting point for developers and supports multiple Discord servers (guilds) reliably.

## Features

- Extensible architecture for adding new commands and features from your users
- Support for multiple Discord servers (guilds)
- Permission system for commands based on user roles and permissions
- Integration with MongoDB for data persistence (optional)
- Dynamic loading of commands and events from internal and external sources
- Slash command support

## Prerequisites

- Node.js (version 16 or higher)
- npm (Node Package Manager)
- TypeScript v5.0.0 or higher
- MongoDB (optional, if using database features)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/discord-bot.git
    ```

2. Navigate to the project directory:

    ```bash
   cd discord-bot
    ```
   
3. Install the dependencies:

    ```bash
    npm install
    ```
   
4. Create a `.env` file in the root of the project and add the following environment variables:

    ```env
    DISCORD_BOT_TOKEN=your_discord_bot_token
    MONGODB_URI=your_mongodb_connection_string
    MAX_RESTARTS=max_times_to_restart_bot_on_crash
    ```
   
    Replace the placeholders with your own values.

**Note:** The `MONGODB_URI` and `MAX_RESTARTS` environment variables are optional. If you don't want to use MongoDB, you can remove the `MONGODB_URI` variable from the `.env` file. The `MAX_RESTARTS` variable is used to specify the maximum number of times the bot should restart on crash. If you don't want the bot to restart automatically, you can remove this variable as well. Disabling database features will prevent commands and extensions that rely on the database from loading.
   
5. Build the project:

    ```bash
    npm run build
    ```
   
6. Start the bot:

    ```bash
    npm start
    ```
   
## Configuration

The bots configuration is stored in the `src/config.ts` file. You can modify the following options:

* `token`: Your Discord bot token (loaded from the `.env` file)
* `mongo_uri`: The MongoDB connection URL (loaded from the `.env` file, optional)
* `crash_handler.max_restarts`: The maximum number of times the bot should restart on crash (loaded from the `.env` file, optional)

## Project Structure

* `dist/`: Output directory for compiled JavaScript files
* `extensions/`: Directory for external extensions
    * `extension-name/`: Each extension has its own directory 
      * `commands/`: Extension-specific command files 
      * `events/`: Extension-specific event files 
    * `extension.json`: Extension metadata file
* `src/`: Contains the TypeScript source code
    * `@types/`: Custom type definitions
    * `commands/`: Built-in command files 
    * `events/`: Built-in event files 
    * `utils/`: Utility functions and classes
* `config.ts`: Bot configuration
* `database.ts`: Database connection and setup
* `extensionLoader.ts`: Loads commands and events from internal and external sources
* `index.ts`: Entry point of the bot

## Creating Extensions

To create a new extension, follow these steps:

1. Create a new directory for your extension in the `extensions/` directory.
2. Inside your extension directory, create an `extension.json` file with the following structure:

    ```json
    {
        "author": "Author Name",
        "name": "Extension Name",
        "version": "1.0",
        "github": "GitHub Repository URL",
        "description": "A brief description of the extension"
    }
    ```
   **Note:** Extension metadata is not currently used by the bot, but it may be used in the future for an extension manager. However, it is a required file to load the extension. All fields are current placeholders and can be modified to your liking.

3. Create `commands/` and `events/` directories inside your extension directory to store command and event files, respectively.
4. Implement your commands and events in separate files within the respective directories. Follow the existing command and event file structure and naming conventions.
5. The bot will automatically load your extension's commands and events on startup.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the CC BY-SA 4.0 license. See the [LICENSE](LICENSE) file for details.