/////////////////////////////////////// USE ////////////////////////////////////////
/*
add the following to your
 <script type="text/javascript" src="sound.js"/>
 
to play audio files call the following (make sure you define the play length of the audio file in milliseconds):

			playbackgroundmusic('dubstep1','wav' , '3400' , '1'); and stopbackgroundmusic() to stop it
			playsound('three','wav','3001' , '1');    sound will stop automatically at end of the file

*/


// DEFINE GLOBAL VARIABLES
var volume = 1; // default if not already set
var backgroundmusicLoopName; // used for interval clearing
var backgroundmusicLoop = true;
var backgroundmusicSoundfile;
var backgroundmusicTime = 3000;
var backgroundmusicVolume = 1;
var maxsoundchannels = 16;
var soundChannel = [];
 soundChannel[0] = false;



///create the sound channels
// create background music channel
var div = document.createElement("audio");
div.id = "backgroundmusic";
div.autoplay = true;
document.body.appendChild(div); //document.getElementById("main").appendChild(div);


//create non-looping sound channels
var soundChannelcount = 0;
while(soundChannelcount!= maxsoundchannels)
{
	soundChannelcount++;
	soundChannel[soundChannelcount] = true; // channel is available
	var div = document.createElement("audio");
	div.id = "soundchannel" + soundChannelcount;
	div.autoplay = true;
	document.body.appendChild(div);	
}





///////////////////////////////////////////////////////////////////////////////////////////////// LOOPING BACKGROUND MUSIC START
//////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function playbackgroundmusic(soundfile,filetype, time, volume) { // time = length of sound file
	// stop previous background music
	stopbackgroundmusic(); 
	// set background music parameters
	backgroundmusicLoop = true;
 backgroundmusicSoundfile = soundfile;
 backgroundmusicTime = time;
 backgroundmusicVolume = volume;
 loopbackgroundmusic(); // starts music loop
}
function loopbackgroundmusic() {
	document.getElementById("backgroundmusic").src = backgroundmusicSoundfile + ".wav";
	var backgroundmusic =  document.getElementById("backgroundmusic"); backgroundmusic.volume = 1;
	if(backgroundmusicLoop) { backgroundmusicLoopName = setTimeout( loopbackgroundmusic , backgroundmusicTime );}
}

function stopbackgroundmusic() {
	backgroundmusicLoop = false;
	var backgroundmusic =  document.getElementById("backgroundmusic"); backgroundmusic.volume = 0;
	clearTimeout(backgroundmusicLoopName);
}
///////////////////////////////////////////////////////////////////////////////////////////////// LOOPING BACKGROUND MUSIC END









//////////////////////////////////////////////////////////////////////////////////////////////// MULTI CHANNEL NONLOOPING AUDIO START
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function playsound(soundfile,filetype, time , volume){ // time = length of sound file
	// get first empty sound channel
	var soundchannel = 0; // null channel
	var soundchannelname = "soundchannel1";
	var soundchannelsearch = true;
	var count = 0;

	while(soundchannelsearch && count < maxsoundchannels && soundchannel < 1 )
	{
		count++; 
		if(soundChannel[count] == true) // if sound channel is available
		{ 
			soundChannel[count] = false; // fill sound channel
			soundchannel = count;
			//console.log(soundchannel);
			soundchannelsearch = false; // end search
		}
	}	
	if(soundchannel > 0) 
	{	
	soundchannelname = "soundchannel" + soundchannel;
	}

	//play sound in available channel
document.getElementById(soundchannelname).src= soundfile + "." + filetype;
var soundchannelone =  document.getElementById(soundchannelname); soundchannelone.volume = volume;
setTimeout( clearsoundchannel , time, soundchannel ); // clear sound from channel
}

function clearsoundchannel( soundchannel)
{
	soundChannel[soundchannel] = true;
//console.log("clearing sound channel " + soundchannel);
}

//////////////////////////////////////////////////////////////////////////////////////////////// MULTI CHANNEL NONLOOPING AUDIO END