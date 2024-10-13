const SOCKET_SERVER = "ws://localhost:8080"
class WebSocketConnection {
  constructor(url, reconnectInterval = 5000) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.socket = null;
    this.sessionId = this.generateSessionId();
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.addEventListener("close", () => {
      console.log("WebSocket connection lost, attempting to reconnect...");
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      message.sessionId = this.sessionId;
      this.socket.send(JSON.stringify(message));
    }
  }

  setMessageListener(callback) {
    this.socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.sessionId !== this.sessionId) {
        callback(data);
      }
    });
  }

  generateSessionId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
}

class VideoSync {
  constructor(appName) {
    this.appName = appName;
    this.video = null;
    this.syncing = false;
    this.ignoreNextEvent = false;
  }

  initializeVideo() {
    const videoSelector = setInterval(() => {
      this.video = this.getVideoByAppName();
      if (this.video) {
        clearInterval(videoSelector);
        console.log("Video element initialized:", this.video);
        this.attachVideoListeners();
      }
    }, 1000);
  }

  getVideoByAppName() {
    switch (this.appName) {
      case "netflix":
      case "youtube":
        return document.querySelector("video");
      case "primevideo": {
        const allVideos = document.querySelectorAll("video");
        return allVideos ? allVideos[allVideos.length - 1] : null;
      }
      default:
        return null;
    }
  }

  attachVideoListeners() {
    if (this.video) {
      this.video.addEventListener("pause", () => {
        if (this.syncing && !this.ignoreNextEvent) {
          window.syncSocket.sendMessage({
            app: this.appName,
            action: "pause",
            time: this.video.currentTime,
          });
        }
        this.ignoreNextEvent = false;
      });

      this.video.addEventListener("play", () => {
        if (this.syncing && !this.ignoreNextEvent) {
          window.syncSocket.sendMessage({
            app: this.appName,
            action: "play",
            time: this.video.currentTime,
          });
        }
        this.ignoreNextEvent = false;
      });

      this.video.addEventListener("seeked", () => {
        if (this.syncing && !this.ignoreNextEvent) {
          window.syncSocket.sendMessage({
            app: this.appName,
            action: "seek",
            time: this.video.currentTime,
          });
        }
        this.ignoreNextEvent = false;
      });

      window.syncSocket.setMessageListener((data) => {
        if (this.syncing && data.app === this.appName) {
          this.ignoreNextEvent = true;

          switch (data.action) {
            case "pause":
              this.video.pause();
              this.video.currentTime = data.time;
              break;
            case "play":
              this.video.play();
              this.video.currentTime = data.time;
              break;
            case "seek":
              this.video.currentTime = data.time;
              break;
          }
        }
      });
    }
  }

  startSync() {
    this.syncing = true;
    localStorage.setItem("syncing", "true");
    this.initializeVideo();
    console.log("Syncing started");
  }

  stopSync() {
    this.syncing = false;
    localStorage.setItem("syncing", "false");
    console.log("Syncing stopped");
  }
}

(() => {
  if (window.hasRun) {
    console.log("Sync script already running.");
    return;
  }
  window.hasRun = true;

  const url = SOCKET_SERVER;
  window.syncSocket = new WebSocketConnection(url);

  let videoSync = null;

  chrome.runtime.onMessage.addListener((request) => {
    if (!videoSync) {
      const appName = getAppName();
      videoSync = new VideoSync(appName);
    }

    if (request.action === "startSync") {
      videoSync.startSync();
    } else if (request.action === "stopSync") {
      videoSync.stopSync();
    }
  });

  function getAppName() {
    if (window.location.href.includes("netflix.com")) {
      return "netflix";
    } else if (window.location.href.includes("youtube.com")) {
      return "youtube";
    } else if (window.location.href.includes("primevideo.com")) {
      return "primevideo";
    }
    return null;
  }

  if (localStorage.getItem("syncing") === "true") {
    const appName = getAppName();
    if (appName) {
      videoSync = new VideoSync(appName);
      videoSync.startSync();
    }
  }
})();
