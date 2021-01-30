window.addEventListener('load', event => {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');

      canvas.width = document.getElementById("p").scrollWidth;
      canvas.height = document.getElementById("p").clientHeight;
      var x = canvas.width / 100;
      var y = canvas.height / 100;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 10;
      ctx.beginPath();
      //ctx.moveTo(0, 0);
      ctx.moveTo(0, 65 * y);
      ctx.lineTo(30 * x, 65 * y);
      ctx.lineTo(70 * x, 5 * y);
      ctx.lineTo(100 * x, 5 * y);
      //ctx.lineTo(100*x, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 65 * y);
      ctx.lineTo(30 * x, 65 * y);
      ctx.lineTo(70 * x, 5 * y);
      ctx.lineTo(100 * x, 5 * y);
      ctx.lineTo(100 * x, 0);

      ctx.fill();


    }
});