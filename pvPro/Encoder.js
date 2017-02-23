var spawn = require('child_process').spawn;
var Stream = require('stream');

export default class Encoder{

  constructor({ music, done }){

   var args = [];

   args = args.concat([
      
      '-y',

	    '-f', 'image2pipe',
  	  '-i', 'pipe:0',
      
    ]); 

    if (typeof music !== 'undefined'){
      args = args.concat([
        '-i', music,
      ]);
    }

    args = args.concat([

      '-shortest',

      //'-q:v', '1',
      '-c:v', 'libx264', 
      '-c:a', 'aac',
      '-pix_fmt', 'yuv420p', 
      '-crf', '18',
      '-movflags', 'frag_keyframe+empty_moov',
      '-framerate', '60',

      '-f', 'mp4',
      // outputFile,

      'pipe:1'

    ]);


    this.ffmpegProcess  = spawn('ffmpeg', args);

    this.ffmpegProcess.stderr.on('data', (data) => {
      var buff = new Buffer(data);
      console.log(buff.toString('utf8'));
    });

    // this.ffmpegProcess.stderr.on('end', function(data){
    //   // var buff = new Buffer(data);
    //   // console.log(buff.toString('utf8'));
    // });

    this.ffmpegProcess.stderr.pipe(process.stdout);

    this.passThrough = new Stream.PassThrough();
    this.passThrough.pipe(this.ffmpegProcess.stdin);

    var buffers = [];

    if (done){
      this.ffmpegProcess.stdout.on('data', (dataBuffers) => {
        buffers.push(dataBuffers);
      });
      this.ffmpegProcess.stdout.on('end', () => {
        done(Buffer.concat(buffers));
        this.ffmpegProcess.kill();
      });
    }

  }

  //var base64 = self.canvas2D.getBase64();
  //addBuffer({ buffer: new Buffer(base64, 'base64'), close: close, next: processNextTick });
  addBuffer({ buffer, close, next }){
    this.passThrough.write(buffer, () => {

      if (close){
        this.passThrough.end();
      }else{
        if (next){
          next();
        }
      }

    });
  }

  kill(){
    this.ffmpegProcess.kill();
  }

  getURL(bufferData){
    var newBlob = new Blob([bufferData], { type: 'application/octet-binary' });
    var url = window.URL.createObjectURL(newBlob);
    return url;
  }


}