'use strict';

const dash_button = require('node-dash-button');
const util = require('util');
const { spawn } = require('child_process');

const dash = dash_button(["aa:bb:cc:dd:ee:ff","00:11:22:33:44:55"],null,null,'all');

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
	if(dash_id === "aa:bb:cc:dd:ee:ff"){
	  console.log("redbull");
	  usb_path = '/media/pi/PATRIOT';
	}else if(dash_id === "00:11:22:33:44:55"){
	  console.log("cheezit");
	  usb_path = '/media/pi/PATRIOT';
	}
	let promise1 = getSongs(usb_path);
	let promise2 = checkOMXPlayerRunning();
	Promise.all([promise1,promise2]).then(values => {
		if(values[1] === "Now Playing: "){
			let song = getRandomFile(values[0]);
			spawn('omxplayer',[song]);
		}else if(values[1] === "Song playing..."){
			console.log("Song already playing!")
		}
	})
	.catch(err => {
		console.log("Error:"+err);
	});
});

function getRandomFile(songs){
	let result = songs[getRandomInt(0,songs.length)];
	let rand_file = "/media/pi/PATRIOT/"+result;
    rand_file = rand_file.replace("'","\'");
    console.log("Song played: "+result);
    return rand_file;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
} 
