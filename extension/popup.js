let syncEnabled = localStorage.getItem("syncEnabled") === "true"; 

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("toggleSync");

  
  updateButtonState(button);

  document.getElementById("toggleSync").addEventListener("click", () => {
    syncEnabled = !syncEnabled;

    
    localStorage.setItem("syncEnabled", syncEnabled);

    
    updateButtonState(button);

    if (syncEnabled) {
      injectContentScript();
    } else {
      sendMessageToTab("stopSync");
    }
  });
});


function updateButtonState(button) {
  if (syncEnabled) {
    button.textContent = "Stop Sync";
    button.classList.add("stop");
  } else {
    button.textContent = "Start Sync";
    button.classList.remove("stop");
  }
}

function injectContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      },
      () => {
        sendMessageToTab("startSync");
      }
    );
  });
}

function sendMessageToTab(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action });
  });
}
