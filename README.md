# Video Sync WebSocket Extension

This project allows two users to synchronize video playback across different devices using a Chrome extension and a WebSocket server. It supports multiple streaming platforms such as Netflix, YouTube, and Prime Video. When one user plays, pauses, or seeks the video, the same action is mirrored on the other user's device.

## Features

- **Sync video playback**: Automatically sync play, pause, and seek events between two or more browsers.
- **Supports multiple streaming services**: Netflix, YouTube, and Prime Video are supported.
- **WebSocket-based real-time communication**: Uses a WebSocket server to broadcast video control events in real-time.
- **Chrome extension interface**: Provides an easy-to-use popup to start and stop the synchronization.

## Folder Structure

```plaintext
|   package-lock.json
|   package.json
|   server.js
|
+---extension
|       background.js
|       content.js
|       manifest.json
|       popup.html
|       popup.js
```

### Files Overview

- **`server.js`**: WebSocket server that handles connections and broadcasts messages between clients.
- **`package.json`**: Contains dependencies and setup for the server.
- **`extension`**:
  - **`manifest.json`**: Chrome extension configuration and permissions.
  - **`popup.html`**: Popup interface that allows users to start/stop syncing.
  - **`popup.js`**: Controls the behavior of the popup and communicates with the content script.
  - **`content.js`**: The core logic that syncs the video controls (play, pause, seek) with the WebSocket server.
  - **`background.js`**: Handles background tasks for the Chrome extension.

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system to run the WebSocket server.
- **Google Chrome**: Required to load and run the Chrome extension.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Navigate to the root folder (where `package.json` is located) and run the following command to install dependencies:
   ```bash
   npm install
   ```

3. **Start the WebSocket Server**:
   Run the following command to start the WebSocket server on port 8080:
   ```bash
   node server.js
   ```
   The server will listen for WebSocket connections and broadcast video events between clients.

## Chrome Extension Setup

1. **Load the Extension**:
   - Open Google Chrome.
   - Go to `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `extension` folder from this project.

2. **Using the Extension**:
   - Once the extension is loaded, a small icon will appear in the browser's toolbar.
   - Open a supported streaming platform (Netflix, YouTube, or Prime Video).
   - Click on the extension icon and press **Start Sync** to begin synchronizing video playback with other users connected to the WebSocket server.

## Usage

### Video Sync Behavior

- **Start Sync**: Click the button to enable syncing. This will inject the content script into the current tab and start syncing video events (play, pause, seek) with the WebSocket server.
- **Stop Sync**: Clicking this button will stop syncing the video and remove the event listeners.
- **Real-time Sync**: Once syncing is enabled, any action you perform (play, pause, seek) will be mirrored to all other browsers connected to the WebSocket server.

## Example Usage

1. **User 1**:
   - Opens Netflix in a browser.
   - Clicks **Start Sync** in the extension popup.
   - Plays a video.
   
2. **User 2**:
   - Opens Netflix in another browser or device.
   - Clicks **Start Sync** in the extension popup.
   - The video will start playing automatically in sync with User 1's video.

Any play, pause, or seek actions performed by either user will be reflected on the other user’s screen.

## Supported Platforms

- **Netflix**
- **YouTube**
- **Prime Video**

More platforms can be added by modifying the logic in `content.js` to recognize and handle video elements from additional streaming services.

## Customization

- **Adding More Platforms**:
  - Modify the `getVideoByAppName()` function in `content.js` to support more platforms.
  - Implement the necessary event handling logic to sync videos from other platforms.

- **WebSocket Server Customization**:
  - The WebSocket server is simple and designed for real-time message broadcasting. You can extend this by adding authentication, message persistence, or more complex broadcast rules.

## Troubleshooting

- **Extension not working**: Ensure the WebSocket server is running and you’ve clicked **Start Sync** in the popup.
- **Sync is slow or not working properly**: Check network stability. Ensure both users are connected to the same WebSocket server and that the server is reachable.

## License

This project is licensed under the MIT License.