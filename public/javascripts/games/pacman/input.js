class InputHandler {
  constructor(player) {
    document.addEventListener('keydown', event => {
      // alert(event.keyCode);
      switch (event.keyCode) {
        case 37:
          player.updateDir(1);
          break;
        case 38:
          player.updateDir(0);
          break;
        case 39:
          player.updateDir(3);
          break;
        case 40:
          player.updateDir(2);
          break;
        default:
          break;
      }
    });
  }
}
