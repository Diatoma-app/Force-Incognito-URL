/////////////////////////////////////////////////////////////////////////////
///////////// Event to initialize an extension on installation //////////////
/////////////////////////////////////////////////////////////////////////////
chrome.runtime.onInstalled.addListener(() => {
  loadSyncedJSON();
  readManagedJSON();
});

// Function to get the base URL without the prefix and everything after the slash
function getBaseURL(url) {
  // Remove URL protocols (http, https)
  url = url.replace('http://', '').replace('https://', '');

  // Remove "www." subdomain
  if (url.startsWith('www.')) {
    url = url.replace('www.', '');
  }

  // Remove everything after the first "/"
  const baseURL = url.split('/')[0];

  return baseURL;
}

function readManagedJSON() {

  // Read synced configuration
  chrome.storage.managed.get(
    function(readManagedConfiguration) {
      console.log(readManagedConfiguration);
      if (readManagedConfiguration && Object.keys(readManagedConfiguration).length > 0) {
        // Display current extension configuration
        console.log('JSON data found in Chrome Storage Managed');
        //console.log(readManagedConfiguration);
      } else {
        console.log('No JSON data found in Chrome Storage Managed');
        //console.log(readManagedConfiguration);
      }
    }
  );
}

// Synced JSON
const jsonSyncedURLs = {
  "settings" : {
      "value" : {
          "theme" : "light",
          "width" : "1280",
          "height" : "800",
          "language" : "English"
      }
  },
  "url_list" : [
  ]
}
// Load 1st JSON to chrome.storage
function loadSyncedJSON() {
  const jsonData = jsonSyncedURLs;
  // Check if chrome.storage.sync is not empty
  chrome.storage.sync.get(
    'jsonData',
    function(readSyncedConfiguration) {
      console.log(readSyncedConfiguration);
      if (readSyncedConfiguration && Object.keys(readSyncedConfiguration).length > 0) {
        console.log('Existing JSON data found in Chrome Storage Sync:');
        //console.log(readSyncedConfiguration.jsonData);
      } else {
        // Store the provided JSON data in chrome.storage.sync
        chrome.storage.sync.set({ jsonData: jsonData }, function() {
          console.log('JSON data loaded into Chrome Storage Sync:');
          //console.log(jsonData);
        });
      }
    }
  );
}

// Listen for DOM content loaded events
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
  const browsingURL = getBaseURL(details.url);
  console.log(browsingURL);
  // Synced URLs
  chrome.storage.sync.get('jsonData', function(listenSyncedConfiguration) {
    console.log('JSON data - Chrome Storage Sync');
    console.log(listenSyncedConfiguration.jsonData);
    if (listenSyncedConfiguration.jsonData && listenSyncedConfiguration.jsonData.url_list) {
      // Get the base URL without the prefix and everything after the slash
      const matchingSyncedItem = listenSyncedConfiguration.jsonData.url_list.find(item => item.url === browsingURL);
      console.log('Native Resolution - Chrome Storage Sync');
      const syncedWidth = Number(listenSyncedConfiguration.jsonData.settings.value.width);
      console.log(listenSyncedConfiguration.jsonData.settings.value.width);
      const syncedHeight = Number(listenSyncedConfiguration.jsonData.settings.value.height);
      console.log(listenSyncedConfiguration.jsonData.settings.value.height);

      if (matchingSyncedItem) {
        // Close the current tab
        chrome.tabs.remove(details.tabId, () => {
          // Open the matching URL in incognito mode
          chrome.windows.create({ url: details.url, width: syncedWidth, height: syncedHeight, incognito: true });
        });
      }
    }
  });
  // Managed URLs
  chrome.storage.managed.get(function(listenManagedConfiguration) {
    console.log('JSON data - Chrome Storage Managed');
    console.log(listenManagedConfiguration);
    if (listenManagedConfiguration && listenManagedConfiguration.url_list) {
      // Get the base URL without the prefix and everything after the slash
      const matchingManagedItem = listenManagedConfiguration.url_list.find(item => item.url === browsingURL);

      if (matchingManagedItem) {
        // Close the current tab
        chrome.tabs.remove(details.tabId, () => {
          // Open the matching URL in incognito mode
          chrome.windows.create({ url: details.url, width: 1280, height:800, incognito: true });
        });
      }
    }
  });
});

