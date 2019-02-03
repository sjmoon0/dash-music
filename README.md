# dash-music
Music player built from a Raspberry Pi computer and Amazon Dash button

[Video instructions](https://youtu.be/CQ_QoXGEc54)

## Dependencies: 
- nodejs
- omxplayer
- festival

## Setup:
- Connect speakers to Raspberry pi
- Place all songs in the root directory of your USB flash drive
- Connect USB flash drive to Raspberry Pi and make note of the path (Should be /media/user/NAME_OF_DRIVE)
- Log in to Raspberry Pi
- Update Raspbian
- Install Dependencies
- Setup dash button via the Amazon mobile app
- Log in to your home router
- View MAC addresses via the router GUI, press the Amazon Dash button and make note of the MAC address that displays then disappears
- Clone this repository
- Update the MAC address & Drive Path in index.js
## Run
After cloning repo and installing package, from the project root directory, run this command: 
```
sudo node index.js
```
