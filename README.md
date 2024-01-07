# OpenBekenIOT Web App

This repo publishes a simple javascript webb app to

https://openbekeniot.github.io/webapp/

The code is in the gh-pages branch!


The web app is initiated by a very simple webpage on the device at http://(IP)/app

The address the device redirects to defaults to this repo, but there is a configuration on the dveice, so you can host locally on your LAN for more security, or even from the device itself (via the device filesystem if present).

The app root page loads startup.js, which then loads VueJS and a SFC myComponent.vue, which is the guts of the web app.  Each page of the app is a separate SFC vuejs control.

Features include OTA, device filesystem management, device configuration, logging, etc.

# How to develop the OBK Web App?

For developing web app, you might want to run it locally and not from github

1. Get Visual Studio Code
2. Get our repository - checkout gh-pages branch
3. Open Folder in Visual Studio Code - our repository
4. Right click on code and "Open with live server"
5. On OBK device (or OBK simulator), change Web App URL to your device IP + port from Visual Studio Code - for example: http://192.168.0.118:5500/
6. Then your OBK device will access your local web app server instead of the one from github. Then you can easily develop and test code changes quickly.


# How to host Web App with Docker?

See guide: [Hosting OpenBeken Webapp Locally with Docker on Various Operating Systems](https://www.elektroda.com/rtvforum/topic4022819.html)
