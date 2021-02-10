window.addEventListener('load', event => {
    const canvas = document.getElementById('tetris-canvas');
    const tetris = new ClassicTetris(canvas);
    document.getElementById('start-stop-btn').addEventListener('click', event => {
      //const startLevel = document.getElementById('level-input').value;
      const startLevel = 5;
      tetris.setStartLevel(startLevel);
      tetris.togglePlayPause();
    });
    document.getElementById('quit-btn').addEventListener('click', event => {
      tetris.quit();
    });
  });