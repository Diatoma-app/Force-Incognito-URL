//////////////////////////////////////////////////////////////////
////////////////////// Internationalization //////////////////////
//////////////////////////////////////////////////////////////////
window.onload = function() {

  // Internationalization
  document.getElementById("mainTitle").innerHTML = chrome.i18n.getMessage("mainTitle");
  document.getElementById("syncedURLsTitle").innerHTML = chrome.i18n.getMessage("syncedURLsTitle");
  document.getElementById("managedURLsTitle").innerHTML = chrome.i18n.getMessage("managedURLsTitle");
  document.getElementById("themeButtonLabel").innerHTML = chrome.i18n.getMessage("themeButtonLabel");
  //document.getElementById("settingsTitle").innerHTML = chrome.i18n.getMessage("settingsTitle");
}
//////////////////////////////////////////////////////////////////
//////////// Selecting Document Object Model elements ////////////
//////////////////////////////////////////////////////////////////
// Managed by
const managed_by = document.querySelector("#managed_by");
// Name
const inputAdd_Name = document.querySelector("#inputAdd_Name");
// URL
const inputAdd_URL = document.querySelector("#inputAdd_URL");
// Width
const inputWidth = document.querySelector("#inputWidth");
// Height
const inputHeight = document.querySelector("#inputHeight");
// Synced URLs
const syncedURLsOutput = document.querySelector("#outputSyncURLs");
// Managed URLs
const managedURLsOutput = document.querySelector("#outputManagedURLs");
// Submit button
const submitButton = document.querySelector("#submitInput");
// Submit button
const submit_native_resolutionButton = document.querySelector("#submit_native_resolutionInput");
// Reset button
const resetButton = document.querySelector("#resetInput");
// Current URL
const getCurrentURL = document.querySelector("#outputGetURL");

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

// Managed JSON
// const readManagedConfiguration = {
// {
//   "settings" : {
//       "Value" : {
//           "managedby" : "myCompany",
//           "enableEditMode" : "true",
//           "nativeResolution" : "1920x1080",
//           "language" : "English"
//       }
//   },
//   "url_list" : {
// "Value" : [
//       {
//           "name" : "Wikipedia",
//           "url" : "wikipedia.org"
//       },
//       {
//           "name" : "Wikipedia",
//           "url" : "wikipedia.com"
//       }
//   ]
// }
// }

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////Managed URLs/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function readManagedJSON() {

  // Read managed configuration
  chrome.storage.managed.get(
    function(readManagedConfiguration) {
      if (readManagedConfiguration && Object.keys(readManagedConfiguration).length > 0) {
        
        // Display current extension configuration
        console.log('JSON data found in Chrome Storage Managed');
        console.log(readManagedConfiguration);

        const managedManagedby = readManagedConfiguration.settings.managedby;
        const managedEnableEditMode = readManagedConfiguration.settings.enableEditMode;
        const managedHeight = readManagedConfiguration.settings.height;
        const managedWidth = readManagedConfiguration.settings.width;
        const managedLanguage = readManagedConfiguration.settings.language;
        const managedURL_List = readManagedConfiguration.url_list;

        // Display settings category
        let htmlString = `<p>Managed by : ${managedManagedby}</p>`;
        console.log(`Managed by : `+ managedManagedby);
        htmlString += `<p>Edit mode enabled : ${managedEnableEditMode}</p>`;
        console.log(`Edit mode enabled : `+ managedEnableEditMode);
        htmlString += `<p>Native resolution : ${managedWidth} x ${managedHeight}</p>`;
        console.log(`Native resolution : `+ managedWidth +`x`+managedHeight);
        htmlString += `<p>Language : ${managedLanguage}</p>`;
        console.log(`Language : `+ managedLanguage);
        htmlString += `<p>----------------------------------------------</p>`;
        htmlString += `<p>Company URLs : </p>`;    
            
        // Display url_list items
        for (let i = 0; i < managedURL_List.length; i++) {
          let item = managedURL_List[i];

          // Create HTML markup for the item
          htmlString += `<p>Name : ` + item.name + `</p>`;
          console.log(`Name : `+ item.name);
          htmlString += `<p>URL : ` + item.url + `</p>`;
          console.log(`URL : `+ item.url);
        }
        
        //////////////// For test ////////////////
        //htmlString += `<p>My JSON : </p>`;
        //htmlString += `<p>${JSON.stringify(readManagedConfiguration, null, 2)}</p>`;
        //////////////// For test ////////////////
        
        // Display the HTML string in the target element
        managedURLsOutput.innerHTML = htmlString;
        managed_by.innerHTML = 'This extension is managed by '+ managedManagedby + '.';

        // Toggle syncedURL div visibility based on managedEnableEditMode value
        const divSyncedURLs = document.getElementById('syncedURLs');
        const divadd_area = document.getElementById('add_area');
        if (managedEnableEditMode === 'false') {
          // Hide syncedURLs div
          divSyncedURLs.style.display = 'none';
          divadd_area.style.display = 'none';
        } else if (managedEnableEditMode === 'true') {
          // Show syncedURLs div
          divSyncedURLs.style.display = 'block';
          divadd_area.style.display = 'block';
        } else {
          console.warn(`Unexpected value for managedEnableEditMode: ${managedEnableEditMode}`);
          // Consider providing a default behavior or handling differently
        }

        //////////////// For test ////////////////
        //syncedURLsOutput.innerHTML = JSON.stringify(readManagedConfiguration);
        //////////////// For test ////////////////
      } else {
        console.log('No JSON data found in Chrome Storage Managed');
        console.log(readManagedConfiguration);
        document.getElementById('managed_urls').style.display = 'none';
        document.getElementById('managed_by').style.display = 'none';
      }
    }
  );
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Synced URLs/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function loadSyncedJSON() {
  const jsonData = jsonSyncedURLs;
  // Check if chrome.storage.sync is not empty
  chrome.storage.sync.get(
    'jsonData', 
    function(existingData) {
    if (existingData && Object.keys(existingData).length > 0) {
      console.log('Existing JSON data found in Chrome Storage Sync:');
      console.log(existingData.jsonData);
    } else {
      // Store the provided JSON data in chrome.storage.sync
      chrome.storage.sync.set({ jsonData: jsonData }, function() {
        console.log('JSON data loaded into Chrome Storage Sync:');
        console.log(jsonData);
      });
    }
  });
}

function readSyncedJSON() {

  // Read synced configuration
  chrome.storage.sync.get(
    'jsonData',
    function(readSyncedConfiguration) {

      // Display current extension configuration
      console.log('JSON data into Chrome Storage Sync');
      console.log(readSyncedConfiguration.jsonData);

      const syncedTheme = readSyncedConfiguration.jsonData.settings.value.theme;
      const syncedHeight = readSyncedConfiguration.jsonData.settings.value.height;
      const syncedWidth = readSyncedConfiguration.jsonData.settings.value.width;
      const syncedLanguage = readSyncedConfiguration.jsonData.settings.value.language;
      const syncedURL_List = readSyncedConfiguration.jsonData.url_list;

      // Display settings category
      let htmlString = `<p>Theme : ${syncedTheme}</p>`;
      console.log(`Theme : `+ syncedTheme);
      htmlString += `<p>Native resolution : ${syncedWidth} x ${syncedHeight}</p>`;
      console.log(`Native resolution : `+ syncedWidth +`x`+syncedHeight);
      htmlString += `<p>Language : ${syncedLanguage}</p>`;
      console.log(`Language : `+ syncedLanguage);
      htmlString += `<p>----------------------------------------------</p>`;
      htmlString += `<p>My URLs : </p>`;
          
      // Display url_list items
      for (let i = 0; i < syncedURL_List.length; i++) {
        let item = syncedURL_List[i];

        // Create HTML markup for the item
        htmlString += `<p>Name : ` + item.name + `</p>`;
        console.log(`Name : `+ item.name);
        htmlString += `<p>URL : ` + item.url + `</p>`;
        console.log(`URL : `+ item.url);

        // Add a button for deleting the item
        htmlString += `<button class='delete-url-button' data-item-index='` + i + `'>Supprimer</button>`;
      }
      
      //////////////// For test ////////////////
      //htmlString += "<p>My JSON : </p>";
      //htmlString += JSON.stringify(readSyncedConfiguration);
      //////////////// For test ////////////////
      
      // Display the HTML string in the target element
      syncedURLsOutput.innerHTML = htmlString;

      //////////////// For test ////////////////
      //syncedURLsOutput.innerHTML = JSON.stringify(readSyncedConfiguration);
      //////////////// For test ////////////////

      // Function to handle delete button clicks
      const deleteUrlButtons = document.querySelectorAll('.delete-url-button');
      deleteUrlButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Get index from data-item-index attribute
          const itemIndex = parseInt(this.dataset.itemIndex);

          // Remove the item from url_list using splice
          syncedURL_List.splice(itemIndex, 1);

          // Save the modified jsonData to Chrome storage and refresh the display
          chrome.storage.sync.set({ jsonData: readSyncedConfiguration.jsonData }, function() {
            console.log('JSON data updated in Chrome Storage Sync');
            readSyncedJSON(); // Reload and refresh updated data
          });
        });
      });
    }
  );
}

// Update native resolution
function updateNativeResolution() {
  const inputWidthValue = inputWidth.value.trim();
  const inputHeightValue = inputHeight.value.trim();

  if (!inputWidthValue || !inputHeightValue) {
    alert('Please enter values for both width and height.');
    return;
  }

  const isWidthValid = !isNaN(inputWidthValue) && parseInt(inputWidthValue) === parseFloat(inputWidthValue);
  const isHeightValid = !isNaN(inputHeightValue) && parseInt(inputHeightValue) === parseFloat(inputHeightValue);

  if (!isWidthValid || !isHeightValid) {
    alert('Width and height must be valid whole numbers.');
    return;
  }

  // Read synced Native Resolution
  chrome.storage.sync.get(
    'jsonData',
    function (readNativeResolution) {
      // Get jsonData object
      const jsonData = readNativeResolution.jsonData;

      // Extract current width and height (optional)
      const currentWidth = jsonData.settings.value.width;
      const currentHeight = jsonData.settings.value.height;
      console.log(`Current Width: ${currentWidth}, Current Height: ${currentHeight}`);

      // Create a newNativeResolution object
      const newNativeResolution = {
        width: inputWidthValue,
        height: inputHeightValue
      };
      console.log(newNativeResolution);

      // Update jsonData with newNativeResolution
      jsonData.settings.value.width = newNativeResolution.width;
      jsonData.settings.value.height = newNativeResolution.height;

      // Save the updated jsonData to Chrome storage sync
      chrome.storage.sync.set({ jsonData }, function () {
        console.log('jsonData updated in Chrome Storage Sync');

        // Clear the input fields
        resetInput();

        // Reload the displayed data to reflect the new item
        // Re-read and refresh updated data
        readSyncedJSON();
      });
    }
  );
}

// Add new URL
function addNewURL() {
  // Read synced configuration
  chrome.storage.sync.get(
    'jsonData',
    function(readSyncedConfiguration) {
      // Get the user-provided item name and URL from input fields
      const itemName = inputAdd_Name.value;
      const itemURL = inputAdd_URL.value.toLowerCase();

      // Check if both input fields are not empty
      if (itemName && itemURL) {
        // Check if both inputAdd_Name and inputAdd_URL contain special characters
        const specialCharsRegex = /[ `~!@#$%^&*()_+\-=\[\]{};'"\\|,<>\/?]+/;
        const hasSpecialCharsInName = specialCharsRegex.test(itemName);
        const hasSpecialCharsInURL = specialCharsRegex.test(itemURL);

        // Check if either item contains special characters or if either item already exists
        if (!hasSpecialCharsInName && !hasSpecialCharsInURL) {
          const existingItemByName = readSyncedConfiguration.jsonData.url_list.find(item => item.name.toLowerCase() === itemName.toLowerCase());
          const existingItemByURL = readSyncedConfiguration.jsonData.url_list.find(item => item.url === itemURL);

          if (!existingItemByName && !existingItemByURL) {
            // Create a new item object if neither item contains special characters and neither item exists
            const newItem = {
              name: itemName,
              url: itemURL
            };

            // Add the new item to the url_list array in jsonData
            readSyncedConfiguration.jsonData.url_list.push(newItem);

            // Save the modified jsonData back to Chrome storage
            chrome.storage.sync.set({ jsonData: readSyncedConfiguration.jsonData }, function() {
              console.log('JSON data updated in Chrome storage with new URL');

              // Clear the input fields
              resetInput();

              // Reload the displayed data to reflect the new item
              // Re-read and refresh updated data
              readSyncedJSON();
            });
          } else {
            // Display an error message if either item already exists
            let errorMessage = '';
            if (existingItemByName && existingItemByURL) {
              errorMessage += 'This name and URL already exist in the list.\n';
            } else if (existingItemByName) {
              errorMessage += 'This name already exists in the list.\n';
            } else if (existingItemByURL) {
              errorMessage += 'This URL already exists in the list.';
            }
            alert(errorMessage);
          }
        } else {
          // Display an error message if either item contains special characters
          let errorMessage = '';
          if (hasSpecialCharsInName) {
            errorMessage += 'Item name cannot contain special characters.\n';
          }
          if (hasSpecialCharsInURL) {
            errorMessage += 'Item URL cannot contain special characters.';
          }
          alert(errorMessage);
        }
      } else {
        // Display an error message if either field is empty
        alert('Please enter both a name and a URL.');
      }
    }
  );
}

function getDomain() {
  const currentURL = new URL(window.location.href);
  // Supprimer "https://"
  //const domain = currentURL.host;

  //const currentURL = details.url;
  // Extrait le nom d'hôte de l'URL
  const domain = new URL(currentURL).hostname;

  // Supprimer ".com"
  //const domainWithoutCom = domain.replace(".com", "");
  getCurrentURL.innerHTML = domain;

  // Retourner le domaine
  return domain;
}

// Function to clear the input fields
function resetInput() {
  inputAdd_Name.value = "";
  inputAdd_URL.value = "";
  inputWidth.value = "";
  inputHeight.value = "";
}
// Adding event listener to submitButton
submitButton.addEventListener("click", () => {
  addNewURL();
  //resetInput();
});

// Adding event listener to submitButton
submit_native_resolutionButton.addEventListener("click", () => {
  updateNativeResolution();
  //resetInput();
});

// Initialize document
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('appID').textContent = chrome.runtime.id;
  loadSyncedJSON();
//  readStorageAndDisplay();
  readManagedJSON();
  readSyncedJSON();
//  getDomain();
// Listen for policy updates.
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'managed')
    readManagedJSON();
});

// Load the initial policy.
readManagedJSON();
});
