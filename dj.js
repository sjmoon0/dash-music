'use strict';

const { spawn } = require('child_process');
const say = require('say');
const buttons = require('./buttons.js');
const DJ3000 = require('./DJ3000.js');
const mm = require('music-metadata');
const wtf = require('wtf_wikipedia');
const invalidArtists = ['various','various artists','unknown','unknown artist']

module.exports.playSong = (songName, buttonPressed) => {
	let song = getSongFile(songName, buttonPressed);
	getSongMetadata(song)
		.then(songMeta => {
			let { artist, title } = songMeta.common;
			console.log(`Next song up is ${title} by ${artist}`);
			if(invalidArtists.indexOf(artist.toLowerCase())<0){
				wtf.fetch(artist)
					.then(wiki => {
						let summaryParagraphs = wiki.sections(0).text().split('\n\n');
						let paragraphToRead = summaryParagraphs[getRandomInt(0,summaryParagraphs.length)];
						paragraphToRead = replaceAll(paragraphToRead,'"','');
						say.speak(`Next song up is ${title} by ${artist}. ${paragraphToRead}`, null, 1, e => {
							if(e){
								say.speak('something went wrong, chap');
								console.log(e);
							}
							let songProcess = spawn('omxplayer',[song]);
							songProcess.on('exit', code => {
								console.log('Song done playing');
								say.speak(DJ3000.banter[getRandomInt(0,DJ3000.banter.length)]);
							});
						});
					}).catch(err => console.log('Wikipedia fetch error:',err));
			}else{
				console.log('No wiki data')
				say.speak(`Next song up is ${title} by ${artist}`, null, 1, e => {
					if(e){
						say.speak('something went wrong, chap');
						console.log(e);
					}
					let songProcess = spawn('omxplayer',[song]);
					songProcess.on('exit', code => {
						console.log('Song done playing');
						say.speak(DJ3000.banter[getRandomInt(0,DJ3000.banter.length)]);
					});
				});
			}
			
		})
		.catch(err => console.log('Metadata fetch error:',err));
}

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
 
function replaceAll(str, term, replacement) {
  return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

function getSongFile(songName, buttonPressed){
	let rand_file = `${buttonPressed}${songName}`;
    rand_file = rand_file.replace("'","\'");
    return rand_file;
}

function getSongMetadata(songFile){
	return  mm.parseFile(songFile);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
} 

say.speak('Hello. I am the DJ 3000. Press your dash button to hear some music.');
