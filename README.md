# Force Incognito URL Chrome extension

## What is doing this extension

This extension is built in order to implement more complex business logic for opening specifics URLs in Incognito mode but can be used by an end user.

## Deployment of the extension

In order to be used on a customer domain, the extension need to be publish on the customer domain using the Chrome Webstore. 
(https://support.google.com/chrome/a/answer/2714278?hl=en)[Support article]

Once the extension is published to the customer domain, it can be pushed through the admin console to the users. 
Extension require a managed configuration in order to work

## Extension configuration

The extension can use a managed configuration JSON file.

### Settings section

*enableEditMode* (boolean) - Enable or not the capability to an end-user to add other URLs.

## Configuration example

Here is a configuration example available in extension package (resource/managed_configuration_example.json).

{
    "settings" : {
        "Value" : {
            "managedby" : "myCompany",
            "enableEditMode" : "true",
            "width" : "1280",
            "height" : "800",
            "language" : "EN"
        }
    },
    "url_list" : {
        "Value" : [
            {
                "name" : "Wikipedia",
                "url" : "wikipedia.org"
            },
            {
                "name" : "Wikipedia",
                "url" : "wikipedia.com"
            }
        ]
    }
}
