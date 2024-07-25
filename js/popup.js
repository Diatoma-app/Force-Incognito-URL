//////////////////////////////////////////////////////////////////
////////////////////// Internationalization //////////////////////
//////////////////////////////////////////////////////////////////
window.onload = function() {

  // Internationalization
  document.getElementById("mainTitle").innerHTML = chrome.i18n.getMessage("mainTitle");
  document.getElementById("syncedURLsTitle").innerHTML = chrome.i18n.getMessage("syncedURLsTitle");
  document.getElementById("managedURLsTitle").innerHTML = chrome.i18n.getMessage("managedURLsTitle");
  document.getElementById("settingsTitle").innerHTML = chrome.i18n.getMessage("settingsTitle");
}
//////////////////////////////////////////////////////////////////
//////////// Selecting Document Object Model elements ////////////
//////////////////////////////////////////////////////////////////
// Name
const inputAdd_Name = document.querySelector("#inputAdd_Name");
// URL
const inputAdd_URL = document.querySelector("#inputAdd_URL");
// Synced HTML Name
const syncedHTMLNames = document.querySelector("#syncedHTMLNames");
// Synced HTML URLs 
const syncedHTMLURLs = document.querySelector("#syncedHTMLURLs");
// Synced HTML Settings
const syncedHTMLSettings = document.querySelector("#syncedHTMLSettings");
// Synced HTML Name
const managedHTMLNames = document.querySelector("#managedHTMLNames");
// Synced HTML URLs 
const managedHTMLURLs = document.querySelector("#managedHTMLURLs");
// Synced HTML Settings
const managedHTMLSettings = document.querySelector("#managedHTMLSettings");
// Managed URLs
const managedURLsOutput = document.querySelector("#outputManagedURLs");
// Submit button
const submitButton = document.querySelector("#submitInput");
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
//   "settings" : {
//       "value" : {
//           "managedby" : "myCompany",
//           "enableEditMode" : "false",
//           "width" : "1280",
//           "height" : "800",
//           "language" : "English"
//       }
//   },
//   "url_list" : [
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

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////Managed URLs/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// Update managed configuration if the value is updated
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'managed')
    readManagedJSON();
});

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
        let htmlSettings = `<p>Managed by : ${managedManagedby}</p>`;
        console.log(`Managed by : `+ managedManagedby);
        htmlSettings += `<p>Edit mode enabled : ${managedEnableEditMode}</p>`;
        console.log(`Edit mode enabled : `+ managedEnableEditMode);
        htmlSettings += `<p>Native resolution : ${managedWidth} x ${managedHeight}</p>`;
        console.log(`Native resolution : `+ managedWidth +`x`+managedHeight);
        htmlSettings += `<p>Language : ${managedLanguage}</p>`;
        console.log(`Language : `+ managedLanguage);
        
        // Display the HTML Settings in the target element
        managedHTMLSettings.innerHTML = htmlSettings;
      
        let htmlNames = "<p>Name : </p>";
        let htmlURLs = "<p>URL : </p>";
            
        // Display url_list items
        for (let i = 0; i < managedURL_List.length; i++) {
          let item = managedURL_List[i];

          // Create HTML markup for the item
          htmlNames += `<p>` + item.name + `</p>`;
          console.log(`Name : `+ item.name);
          htmlURLs += `<p>` + item.url + `</p>`;
          console.log(`URL : `+ item.url);
        }
        // Display the HTML Names & URLs in the target element
        managedHTMLNames.innerHTML = htmlNames;
        managedHTMLURLs.innerHTML = htmlURLs;
        
        // Toggle syncedURL div visibility based on managedEnableEditMode value
        const divSyncedURLs = document.getElementById('syncedURLs');
        if (managedEnableEditMode === 'false') {
          // Hide syncedURLs div
          divSyncedURLs.style.display = 'none';
        } else if (managedEnableEditMode === 'true') {
          // Show syncedURLs div
          divSyncedURLs.style.display = 'block';
        } else {
          console.warn(`Unexpected value for managedEnableEditMode: ${managedEnableEditMode}`);
          // Consider providing a default behavior or handling differently
        }

        //////////////// For test ////////////////
        //htmlString += "<p>My JSON : </p>";
        //htmlString += JSON.stringify(readManagedConfiguration);
        //////////////// For test ////////////////
        
        // Display the HTML string in the target element
        //managedURLsOutput.innerHTML = htmlString;

        //////////////// For test ////////////////
        //syncedURLsOutput.innerHTML = JSON.stringify(readManagedConfiguration);
        //////////////// For test ////////////////
      } else {
        console.log('No JSON data found in Chrome Storage Managed');
        console.log(readManagedConfiguration);
        document.getElementById('managedURLs').style.display = 'none';
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
      let htmlSettings = `<p>Theme : ${syncedTheme}</p>`;
      console.log(`Theme : `+ syncedTheme);
      htmlSettings += `<p>Native resolution : ${syncedWidth} x ${syncedHeight}</p>`;
      console.log(`Native resolution : `+ syncedWidth +`x`+syncedHeight);
      htmlSettings += `<p>Language : ${syncedLanguage}</p>`;
      console.log(`Language : `+ syncedLanguage);
      syncedHTMLSettings.innerHTML = htmlSettings;
      
      let htmlNames = "<p>Name : </p>";
      let htmlURLs = "<p>URL : </p>";
      

      // Display url_list items
      for (let i = 0; i < syncedURL_List.length; i++) {
        let item = syncedURL_List[i];

        // Create HTML markup for the item
        htmlNames += `<p>` + item.name + `</p>`;
        console.log(`Name : `+ item.name);
        htmlURLs += `<p>` + item.url + `</p>`;
        console.log(`URL : `+ item.url);
        
        

        // Add a button for deleting the item
        //htmlString += "<button class='delete-url-button' data-item-index='" + i + "'>Supprimer</button>";
      }
      syncedHTMLNames.innerHTML = htmlNames;
      syncedHTMLURLs.innerHTML = htmlURLs;
      
      //////////////// For test ////////////////
      //htmlString += "<p>My JSON : </p>";
      //htmlString += JSON.stringify(readSyncedConfiguration);
      //////////////// For test ////////////////
      
      // Display the HTML string in the target element
      
      
      

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
              console.log('JSON data updated in Chrome storage');

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
// function resetInput() {
//   inputAdd_Name.value = "";
//   inputAdd_URL.value = "";
// }
// Adding event listener to submitButton
//submitButton.addEventListener("click", () => {
  //addNewURL();
  //resetInput();
//});

// // Adding event listener to resetButton
// resetButton.addEventListener("click", () => {
//   resetResultHTML();
//   resetInput();
// });

// Initialize document
document.addEventListener("DOMContentLoaded", function () {
  readManagedJSON();
  readSyncedJSON();
//  getDomain();
});
