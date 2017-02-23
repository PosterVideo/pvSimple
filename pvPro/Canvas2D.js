export default class Canvas2D {

  constructor(canvas, w, h) {
    this.canvas = canvas;
    this.canvas.width = w || 1080;
    this.canvas.height = h || 1080;
    this.ctx = canvas.getContext('2d');

    this.reset();
  }

  reset(){

    this.data = {
      x: 0,
      y: 0
    };

  }

  update(){

    this.data.x += 0.001;
    this.data.y += 0.001;

  }

  draw(){

    this.ctx.fillStyle = `white`;
    this.ctx.fillRect(0, 0, 1080, 1080);
    // this.ctx.stroke();

    this.ctx.fillStyle = `hsla(${ window.parseInt(360 * 1, 10) }, 50%, 50%, 0.3 )`;
    this.ctx.fillRect(0, 0, 1080 * Math.sin(this.data.x), 1080 * Math.cos(this.data.y));

    //this.ctx.stroke();
  }

  getBase64(){
    return this.canvas.toDataURL('image/png', 1.0).replace(/^data:image\/(png|jpg);base64,/, '');
  }

  

}

