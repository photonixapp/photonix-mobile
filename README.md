# Photonix Mobile App

This is the code for generating React Native apps for Android and iOS devices. We use [Expo](https://expo.io/) to make it easier to develop and make builds. If you quickly want to get set up for development you should download the [Expo client](https://expo.io/tools#client) on your device. You can then run the follow command and a QR code will then be shown which you can scan with Expo Client on your device.

    yarn start

If you have virtual devices/simulators for Android or iOS on your computer, you can run once of the following to launch on those.

    yarn android
    yarn ios


## What's in the app?

This app should be considered a client which is connected to an installation of [Photonix Server](https://github.com/damianmoore/photonix). Without an internet connection to a server, the app is currently next to useless. The main reason for creating this app was to give people quick access to their photo libraries from their phone or mobile device. Next, we intend to offer the option of detecting new photos when they are taken on the device and automatically uploading.
