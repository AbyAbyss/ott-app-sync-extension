chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("BG: ON MESSAGE");
  if (request.action === "startSync") {
    console.log("Start Sync triggered");
  } else if (request.action === "stopSync") {
    console.log("Stop Sync triggered");
  }

  sendResponse({ status: "received" });
});
