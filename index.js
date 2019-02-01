'use strict';

const dash_button = require('node-dash-button');
const util = require('util');
const { spawn } = require('child_process');
const say = require('say')

/*
File that exports JavaScript object literal in the form:
{
	redbull: '00:11:22:33:44:55',
	redbullPath: 'path/to/flashdrive0/,
	cheezit: 'aa:bb:cc:dd:ee:ff'	
	cheezitPath: 'path/to/flashdrive1/
}
*/
const buttons = require('./buttons.js');

const dash = dash_button([buttons.redbull,buttons.cheezit],null,null,'all');

function getSongs(usb_path){
	return new Promise(function(resolve,reject){
		let ls = spawn('ls',[usb_path]);
		ls.stdout.on('data', data => {
		  resolve(String(data).trim().split("\n"));
		});
		ls.stderr.on('data', err => {
		  reject(String(err));
		});
	});
}

function checkOMXPlayerRunning(){
	return new Promise(function(resolve,reject){
		let omxdetect = spawn('pgrep',['omxplayer']);
		omxdetect.stdout.on('data', data =>{
			if(String(data).trim().length>0){
				resolve("Song playing...");
			}
			else{
				resolve("Now Playing: ");
			}
		});
		omxdetect.on('close', code => {
			if(code===0){
				resolve("Song playing...");
			}else if(code===1){
				resolve("Now Playing: ");
			}
		});
		omxdetect.stderr.on('data', err =>{
			console.log(err);
			reject(err);
		});
	});
}

dash.on("detected",function(dash_id){
	let usb_path = "";
	if(dash_id === buttons.redbull){
	  console.log("redbull");
	  usb_path = buttons.redbullPath;
	}else if(dash_id === buttons[1]){
	  console.log("cheezit");
	  usb_path = buttons.cheezitPath;
	}
	let promise1 = getSongs(usb_path);
	let promise2 = checkOMXPlayerRunning();
	Promise.all([promise1,promise2]).then(values => {
		if(values[1] === "Now Playing: "){
			//let song = getRandomFile(values[0]);
			let songName = getRandomSongName(values[0]);
			console.log("Trying to play: "+songName);    
			say.speak(`Next song up is ${songName}`,null,1, (e) => {
				if(e){
					say.speak('something went wrong, chap');
					console.log(e);
				}
				console.log("Playing: "+songName); 
				let song = getSongFile(songName)		
				spawn('omxplayer',[song]);
			});
			//say.stop();
		}else if(values[1] === "Song playing..."){
			console.log("Song already playing!")
		}
	})
	.catch(err => {
		console.log("Error:"+err);
	});
});

function getRandomSongName(songs){
	return songs[getRandomInt(0,songs.length)];
}

function getSongFile(songName){
	//let result = songs[getRandomInt(0,songs.length)];
	let rand_file = `${buttons.redbullPath}${songName}`;
    rand_file = rand_file.replace("'","\'");
    return rand_file;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
} 



