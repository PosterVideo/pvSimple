// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import Canvas2D from './pvPro/Canvas2D';
import Encoder from './pvPro/Encoder';

const { dialog } = require('electron').remote;

function ready(){

	var div = document.createElement('div');
	var canvas = document.createElement('canvas');
	canvas.style.width = '300px';
	canvas.style.height = '300px';
	var canvas2D = new Canvas2D(canvas, 1080, 1080);

	div.appendChild(canvas);
	document.body.appendChild(div);

	function render(){
		canvas2D.update();
		canvas2D.draw();
	}

	function rAF(){
		window.requestAnimationFrame(rAF);
		render();
	}
	// window.requestAnimationFrame(rAF);

	var i = 100;

	function getFile(){
		var newArr = dialog.showOpenDialog({
	      properties: ['openFile'],
	      filters: [
	        {
	          name: 'Music', extensions: ['m4a', 'mp3', 'wav']
	        }
	      ]
	    });

    	if (newArr){
    		return newArr[0];
    	}else{
    		return undefined;
    	}
	}
    

	var video = document.createElement('video');
	video.style.width = '40vmin';
	video.style.height = '40vmin';
	video.autoplay = true;
	video.volume = 0.5;
	video.controls = true;
	

	var link = document.createElement('a');
	link.innerHTML = 'Download';
	link.download = 'PosterVideo.mp4';

    function record(){
    	div.appendChild(video);
    	div.appendChild(link);

    	div.removeChild(video);
    	div.removeChild(link);

    	var encoder = new Encoder({
	      music: getFile(),
	      done: done
	    });

    	function done(bufferData){
    		var url = encoder.getURL(bufferData);

    		console.log(url);
    		
    		video.src = url;
    		link.href = url;

    		div.appendChild(video);
    		div.appendChild(link);
    	}

    	var iii = 0;
    	function repeat(){
    		
			var close = false;

			if (iii > 100){
				close = true;
			}
			iii++;

			render();
			
			var base64 = canvas2D.getBase64();
			encoder.addBuffer({ buffer: new Buffer(base64, 'base64'), close: close, next: next });
		}

		function next(){
	      process.nextTick(repeat);
	    }


    	canvas2D.reset();
    	process.nextTick(repeat);
    }

    var button = document.createElement('button');
    button.innerHTML = 'record';
    button.addEventListener('click', () => {
    	record();
    }, false);
    div.appendChild(button);







    



}


window.addEventListener('DOMContentLoaded', ready, false);