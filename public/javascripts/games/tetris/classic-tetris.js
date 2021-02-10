'use strict';



//-------------------------------------------------------------------------
// 
// ClassicTetris class
// 
//-------------------------------------------------------------------------
class ClassicTetris {


  //-----------------------------------------------------------------------
  // 
  // piece rotations
  // 
  //-----------------------------------------------------------------------

  static Z_ROT = [
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ]
  ];

  static S_ROT = [
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ]
  ];

  static O_ROT = [
    [
      [1, 1],
      [1, 1]
    ]
  ];

  static L_ROT = [
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ]
  ];

  static J_ROT = [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ];

  static T_ROT = [
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ]
  ];

  static I_ROT = [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]
  ];


  // initial positions
  static Z_INI_POS = [4, 1];
  static S_INI_POS = [4, 1];
  static O_INI_POS = [4, 2];
  static L_INI_POS = [4, 1];
  static J_INI_POS = [4, 1];
  static T_INI_POS = [4, 1];
  static I_INI_POS = [3, 0];

  static Z_BOX = [1, 0, 2, 3]; // x y hei wid
  static S_BOX = [1, 0, 2, 3];
  static O_BOX = [0, 0, 2, 2];
  static L_BOX = [1, 0, 2, 3];
  static J_BOX = [1, 0, 2, 3];
  static T_BOX = [1, 0, 2, 3];
  static I_BOX = [2, 0, 1, 4];


  // piece names
  static Z_PIECE = 'z';
  static S_PIECE = 's';
  static O_PIECE = 'o';
  static L_PIECE = 'l';
  static J_PIECE = 'j';
  static T_PIECE = 't';
  static I_PIECE = 'i';


  // game states
  static STATE_DROP = 0;
  static STATE_BURN = 1;
  static STATE_ARE = 2;
  static STATE_GAME_OVER = 3;
  static STATE_PAUSE = 4;


  // events
  static GAME_START = 'game-start';
  static GAME_OVER = 'game-over';

  static GAME_OVER_START = 'game-over-start';
  static GAME_OVER_END = 'game-over-end';

  static GAME_PAUSE = 'game-pause';
  static GAME_RESUME = 'game-resume';

  static PIECE_MOVE_LEFT = 'piece-move-left';
  static PIECE_MOVE_RIGHT = 'piece-move-right';
  static PIECE_MOVE_DOWN = 'piece-move-down';
  static PIECE_HARD_DROP = 'piece-hard-drop';

  static PIECE_ROTATE_CLOCKWISE = 'piece-rotate-clockwise';
  static PIECE_ROTATE_ANTICLOCKWISE = 'piece-rotate-anticlockwise';

  static PIECE_LOCK = 'piece-lock';
  static NEXT_PIECE = 'next-piece';

  static LEVEL_CHANGE = 'level-change';
  static SCORE_CHANGE = 'score-change';

  static LINE_CLEAR_START = 'line-clear-start';
  static LINE_CLEAR_END = 'line-clear-end';

  static LINE_CLEAR = 'line-clear';

  static oImg = new Image();
  // doard size in terms of squares
  // this is typically 10x20, but we are adding 2 invisible rows
  // at the top to have enough room to spawn all pieces
  static BOARD_WIDTH = 10;
  static BOARD_HEIGHT = 22;


  // constructor needs a canvas
  constructor(canvas, {
    boardWidth = ClassicTetris.BOARD_WIDTH,
    boardHeight = ClassicTetris.BOARD_HEIGHT,

    //canvas.width = document.getElementById("area").scrollWidth;
    //canvas.height = document.getElementById("area").clientHeight;
    //let px = document.getElementById("area").scrollWidth / 100;
    //var py = canvas.height / 100;

    //boardX = 30,
    boardX = 1,
    //boardY = -35,
    //boardY = -55,
    boardY = 0,
    squareSide = 28,
    //squareSide = (document.getElementById("area").scrollWidth / 10),

    scoreX = 330,
    scoreY = 100,
    levelX = 330,
    levelY = 130,
    linesX = 330,
    linesY = 160,
    nextX = 330,
    nextY = 260,
    nextOffsetX = 330,
    nextOffsetY = 280,
    pauseX = 145,
    pauseY = 220,
    /*scoreX = 63*px,
        scoreY = 100,
        levelX = 63*px,
        levelY = 130,
        linesX = 63*px,
        linesY = 160,
        nextX = 63*px,
        nextY = 260,
        nextOffsetX = 63*px,
        nextOffsetY = 280,
        pauseX = square*(BOARD_WIDTH/2), 
        pauseY = 220,*/

    zColor = ['#fe103c', '#f890a7'],
    sColor = ['#66fd00', '#c4fe93'],
    oColor = ['#ffde00', '#fff88a'],
    lColor = ['#ff7308', '#ffca9b'],
    jColor = ['#1801ff', '#5a95ff'],
    tColor = ['#b802fd', '#f591fe'],
    iColor = ['#00e6fe', '#86fefe'],

    //gameOverColor = [ '#fff', '#ddd' ],
    gameOverColor = ['#4a4949', '#ddd'],
    ghostColor = ['#000', '#fff'],

    canvasFont = '17px georgia',
    canvasFontColor = '#fff',

    backgroundColor = '#988c72',
    //backgroundColor = '#000',
    tetrisBackgroundColor = '#949295',
    //tetrisBackgroundColor = '#000',
    borderColor = '#fff',
    //gridColor = '#bfb3a5',
    gridColor = '#fff',

    tapClickMaxDuration = 500,
    tapClickMaxDistance = 10,

    rotateSound = undefined,
    moveSound = undefined,
    setSound = undefined,
    gameOverSound = undefined,
    lineSound = undefined,
    tetrisSound = undefined,
    levelChangeSound = undefined,
    pauseSound = undefined,
    gameTheme = undefined

  } = {}) {
    this.oImg = document.getElementById('i1');
    //this.oImg.src = 'data:image/jpeg;base64,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';
    // game canvas
    let px = document.getElementById("area").clientWidth / 100;
    let py = document.getElementById("area").clientHeight / 100;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.context.lineJoin = 'round';

    this.canvas.width = document.getElementById("area").clientWidth + document.getElementById("wall").clientWidth;

    // board dimensions
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;

    // init board
    this.board = [];
    for (let i = 0; i < this.boardHeight; ++i) {
      const row = [];
      for (let j = 0; j < this.boardWidth; ++j) row.push(7);
      this.board.push(row);
    }

    // render parameters
    this.boardX = boardX;           // board's left
    //this.boardY = boardY;           // board's top
    this.boardY = -20 * px + 1;           // board's top
    //this.squareSide = squareSide;   // width of individual squares
    this.squareSide = px * 10;

    this.canvas.height = squareSide * 17;

    // board's bounding box
    this.boardBorder = [
      -0.5 + this.boardX,
      -0.5 + this.boardY + 2 * this.squareSide,
      0.5 + this.boardX + this.boardWidth * this.squareSide,
      0.5 + this.boardY + this.boardHeight * this.squareSide
    ];

    // HUD stuff coordinates
    this.scoreX = 110 * px//scoreX;             // score coords
    this.scoreY = scoreY;
    this.levelX = 110 * px;             // level coords
    this.levelY = levelY;
    this.linesX = 110 * px;             // lines coords
    this.linesY = linesY;
    this.nextX = 110 * px;               // next text coords
    this.nextY = nextY;
    this.nextOffsetX = 110 * px;   // next piece coords
    this.nextOffsetY = nextOffsetY;
    this.pauseX = 105 * px;             // pause text coords
    this.pauseY = pauseY;

    // canvas font 
    this.canvasFont = canvasFont;
    this.canvasFontColor = canvasFontColor;

    // piece colors
    this.zColor = [...zColor];
    this.sColor = [...sColor];
    this.oColor = [...oColor];
    this.lColor = [...lColor];
    this.jColor = [...jColor];
    this.tColor = [...tColor];
    this.iColor = [...iColor];

    // game over tile colors
    this.gameOverColor = [...gameOverColor];
    this.ghostColor = [...ghostColor];

    this.backgroundColor = backgroundColor;
    this.tetrisBackgroundColor = tetrisBackgroundColor;
    this.borderColor = borderColor;
    this.gridColor = gridColor;

    // max time between pointerdown and pointerup for the game to count it as click
    this.tapClickMaxDuration = tapClickMaxDuration;   // grandpa's tap/click duration!
    // maximum distance between pointer-down and pointer-up coordinates 
    // for the game to count it as a click/tap
    this.tapClickMaxDistance = tapClickMaxDistance;

    // sounds
    this.rotateSound = rotateSound;             // rotation
    this.moveSound = moveSound;                 // move
    this.setSound = setSound;                   // piece lock
    this.gameOverSound = gameOverSound;         // game over
    this.lineSound = lineSound;                 // line burn
    this.tetrisSound = tetrisSound;             // tetris
    this.levelChangeSound = levelChangeSound;   // level increase
    this.pauseSound = pauseSound;               // game paused
    this.gameTheme = gameTheme;                 // theme song

    // pieces
    this.pieces = [
      {
        id: 0,
        name: ClassicTetris.Z_PIECE,
        rot: ClassicTetris.Z_ROT,
        iniPos: ClassicTetris.Z_INI_POS,
        col: this.zColor,
        box: ClassicTetris.Z_BOX
      },
      {
        id: 1,
        name: ClassicTetris.S_PIECE,
        rot: ClassicTetris.S_ROT,
        iniPos: ClassicTetris.S_INI_POS,
        col: this.sColor,
        box: ClassicTetris.S_BOX
      },
      {
        id: 2,
        name: ClassicTetris.O_PIECE,
        rot: ClassicTetris.O_ROT,
        iniPos: ClassicTetris.O_INI_POS,
        col: this.oColor,
        box: ClassicTetris.O_BOX
      },
      {
        id: 3,
        name: ClassicTetris.L_PIECE,
        rot: ClassicTetris.L_ROT,
        iniPos: ClassicTetris.L_INI_POS,
        col: this.lColor,
        box: ClassicTetris.L_BOX
      },
      {
        id: 4,
        name: ClassicTetris.J_PIECE,
        rot: ClassicTetris.J_ROT,
        iniPos: ClassicTetris.J_INI_POS,
        col: this.jColor,
        box: ClassicTetris.J_BOX
      },
      {
        id: 5,
        name: ClassicTetris.T_PIECE,
        rot: ClassicTetris.T_ROT,
        iniPos: ClassicTetris.T_INI_POS,
        col: this.tColor,
        box: ClassicTetris.T_BOX
      },
      {
        id: 6,
        name: ClassicTetris.I_PIECE,
        rot: ClassicTetris.I_ROT,
        iniPos: ClassicTetris.I_INI_POS,
        col: this.iColor,
        box: ClassicTetris.I_BOX
      }
    ];

    // movement/controls
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.rotateClockwise = false;
    this.rotateAnticlockwise = false;
    this.hardDrop = true;
    this.doUndoPause = false;   // pause state changed

    // pointer coords
    this.xIni = undefined;
    this.yIni = undefined;
    this.tIni = undefined;

    // pointer game controls
    this.pointerMoveDownEnabled = false;  // flag to allow/disallow pointer to move piece down

    // game flags
    this.playing = false;       // ongoing game
    this.gameLoop = false;      // ongoing game loop (loop ends after game-over animation)

    this.piece = this.pieces[0];      // current piece
    this.piecePosition = [0, 0];    // current piece's position
    this.pieceRotation = 0;           // current piece's rotation
    this.next = this.pieces[0];       // next piece

    // game parameters
    this.startLevel = 0;
    this.level = 0;
    this.lines = 0;
    this.score = 0;
    this.pressDownScore = 0;

    // event listeners
    this.handlers = new Map();
    this.handlers.set(ClassicTetris.GAME_START, []);
    this.handlers.set(ClassicTetris.GAME_OVER, []);
    this.handlers.set(ClassicTetris.GAME_OVER_START, []);
    this.handlers.set(ClassicTetris.GAME_OVER_END, []);
    this.handlers.set(ClassicTetris.GAME_PAUSE, []);
    this.handlers.set(ClassicTetris.GAME_RESUME, []);
    this.handlers.set(ClassicTetris.PIECE_MOVE_LEFT, []);
    this.handlers.set(ClassicTetris.PIECE_MOVE_RIGHT, []);
    this.handlers.set(ClassicTetris.PIECE_MOVE_DOWN, []);
    this.handlers.set(ClassicTetris.PIECE_HARD_DROP, []);
    this.handlers.set(ClassicTetris.PIECE_ROTATE_CLOCKWISE, []);
    this.handlers.set(ClassicTetris.PIECE_ROTATE_ANTICLOCKWISE, []);
    this.handlers.set(ClassicTetris.PIECE_LOCK, []);
    this.handlers.set(ClassicTetris.NEXT_PIECE, []);
    this.handlers.set(ClassicTetris.LEVEL_CHANGE, []);
    this.handlers.set(ClassicTetris.SCORE_CHANGE, []);
    this.handlers.set(ClassicTetris.LINE_CLEAR_START, []);
    this.handlers.set(ClassicTetris.LINE_CLEAR_END, []);
    this.handlers.set(ClassicTetris.LINE_CLEAR, []);

    // animation frames counters
    this.frameCounter = 0;
    this.areFrames = -1;
    this.framesTilDrop = -1;

    // counters for line-clear and game-over animations
    this.columnsCleared = -1;
    this.gameOverLine = -1;

    // game state
    this.previousGameState = ClassicTetris.STATE_GAME_OVER;
    this.gameState = ClassicTetris.STATE_GAME_OVER;

    // an empty row used to exploit syntactic sugar
    this.emptyRow = [];
    for (let i = 0; i < this.boardWidth; ++i) this.emptyRow.push(-1);

    // paint something for the user to see
    this._render();
  }


  //----------------------------------------------------------------------------------------
  // 
  // setters 
  // 
  //----------------------------------------------------------------------------------------

  // set the starting level
  // does nothing if playing
  setStartLevel(level) {
    if (this.gameState === ClassicTetris.STATE_GAME_OVER) {
      this.startLevel = Math.max(0, Math.min(19, level));  // between 0 and 19
    }
  }

  // set the border and fill colors for game-over squares
  setGameOverColor(color) {
    this.gameOverColor = [...color];
  }

  // set ghost piece colors
  setGhostColor(color) {
    this.ghostColor = [...color];
  }

  // set the border and fill colors for a piece
  setPieceColor(piece, color) {
    switch (piece) {
      case ClassicTetris.Z_PIECE: this.zColor = [...color]; break;
      case ClassicTetris.S_PIECE: this.sColor = [...color]; break;
      case ClassicTetris.O_PIECE: this.oColor = [...color]; break;
      case ClassicTetris.L_PIECE: this.lColor = [...color]; break;
      case ClassicTetris.J_PIECE: this.jColor = [...color]; break;
      case ClassicTetris.T_PIECE: this.tColor = [...color]; break;
      case ClassicTetris.I_PIECE: this.iColor = [...color]; break;
    }
  }


  //----------------------------------------------------------------------------------------
  // 
  // helper functions
  // 
  //----------------------------------------------------------------------------------------

  // frames before the piece drops 1 tile
  // depends on the level
  _getFramesPerGridcell(level) {
    if (level === 0) return 96;  //48;
    else if (level === 1) return 86;  //43;
    else if (level === 2) return 76;  //38;
    else if (level === 3) return 66;  //33;
    else if (level === 4) return 56;  //28;
    else if (level === 5) return 46;  //23;
    else if (level === 6) return 36;  //18;
    else if (level === 7) return 26;  //13;
    else if (level === 8) return 16;  //8;
    else if (level === 9) return 12;  //6;
    else if (level <= 12) return 10;  //5;
    else if (level <= 15) return 8;  //4;
    else if (level <= 18) return 6;  //3;
    else if (level <= 28) return 4;  //2;
    return 2;  //1;
  }


  //----------------------------------------------------------------------------------------
  // 
  // public functions
  // 
  //  - play
  // 
  //----------------------------------------------------------------------------------------

  togglePlayPause() {
    if (this.playing) {
      this.doUndoPause = true;
    } else {
      this.play();
    }
  }

  quit() {
    if (this.playing && this.gameState != ClassicTetris.STATE_GAME_OVER) {
      this._triggerGameOver();
    }
  }

  // start new game
  async play() {
    if (this.playing) return;
    this.playing = true;

    // disable UI
    // attach event listeners
    this._disableUI();
    this._addEventListeners();

    // reset params
    this._resetParams();

    // play theme song
    if (this.gameTheme) {
      this.gameTheme.currentTime = 0;
      this.gameTheme.loop = true;
      this.gameTheme.play();
    }

    // fire game start event
    this._dispatch(ClassicTetris.GAME_START, {
      type: ClassicTetris.GAME_START,
      level: this.level,
      score: this.score,
      lines: this.lines
    });

    // fire new piece placed event
    this._dispatch(ClassicTetris.NEXT_PIECE, {
      type: ClassicTetris.NEXT_PIECE,
      piece: this.piece.name,
      nextPiece: this.next.name
    });

    // game loop
    this.gameLoop = true;
    do {
      this._process();
      this._render();
      await this._sleep();
    } while (this.gameLoop);

    // remove event listeners
    // enable UI
    this._removeEventListeners();
    this._enableUI();

    // toggle playing flag
    this.playing = false;

    // fire game finish event
    this._dispatch(ClassicTetris.GAME_OVER, {
      type: ClassicTetris.GAME_OVER,
      level: this.level,
      score: this.score,
      lines: this.lines
    });
  }

  // get game params ready for a new game
  _resetParams() {
    //  pointer stuff
    this.pointerMoveDownEnabled = false;

    // movement/control flags
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.rotateClockwise = false;
    this.rotateAnticlockwise = false;
    this.hardDrop = false;
    this.doUndoPause = false;

    //  pointer coords
    this.xIni = undefined;
    this.yIni = undefined;
    this.tIni = undefined;

    // select random pieces
    this.piece = this.pieces[(Math.random() * this.pieces.length) | 0];
    this.next = this.pieces[this._nextPieceId()];

    // initial piece's position and rotation
    this.piecePosition = this.piece.iniPos.slice(0);
    this.pieceRotation = 0;

    // starting level, lines and score
    this.level = this.startLevel;
    this.lines = 0;
    this.score = 0;
    this.pressDownScore = 0;

    // clear board
    for (let i = 0; i < this.boardHeight; ++i)
      for (let j = 0; j < this.boardWidth; ++j)
        this.board[i][j] = -1;

    // frame counters
    this.frameCounter = 0;
    this.areFrames = -1;
    this.framesTilDrop = -1;
    this.columnsCleared = -1;
    this.gameOverLine = -1;

    // frames until the piece automatically moves down
    this.framesTilDrop = 36 + this._getFramesPerGridcell(this.level);   // 18 + this._getFramesPerGridcell(this.level);

    // initial state
    this.previousGameState = ClassicTetris.STATE_DROP;
    this.gameState = ClassicTetris.STATE_DROP;
  }


  // add and remove event listeners
  _addEventListeners() {
    this.canvas.addEventListener('contextmenu', this._handleContextMenu, { capture: true, passive: false });
    document.addEventListener('pointerdown', this._handlePointerDown, { capture: true, passive: false });
    document.addEventListener('pointermove', this._handlePointerMove, { capture: true, passive: false });
    document.addEventListener('pointerup', this._handlePointerUp, { capture: true, passive: false });
    document.addEventListener('pointercancel', this._handlePointerCancel, { capture: true, passive: false });
    document.addEventListener('wheel', this._handleWheel, { capture: true, passive: false });
    document.addEventListener('keydown', this._handleKeyDown, { capture: true, passive: false });
  }

  _removeEventListeners() {
    this.canvas.removeEventListener('contextmenu', this._handleContextMenu, true);
    document.removeEventListener('pointerdown', this._handlePointerDown, true);
    document.removeEventListener('pointermove', this._handlePointerMove, true);
    document.removeEventListener('pointerup', this._handlePointerUp, true);
    document.removeEventListener('pointercancel', this._handlePointerCancel, true);
    document.removeEventListener('wheel', this._handleWheel, true);
    document.removeEventListener('keydown', this._handleKeyDown, true);
  }

  // disable/enable UI
  _disableUI() {
    this.canvas.style.touchAction = 'none';
  }

  _enableUI() {
    this.canvas.style.touchAction = 'auto';
  }


  //-----------------------------------------------------------
  // 
  // event handlers
  // 
  //-----------------------------------------------------------

  // context menu handler: don't open during game
  _handleContextMenu = event => {
    event.preventDefault();
  }


  //
  // default keyboard inputs:
  //
  // action                 key           key-code
  // ---------------------------------------------
  // rotate clockwise       up arrow        38
  // rotate clockwise       'w'             87
  // down                   down arrow      40
  // down                   's'             83
  // left                   left arrow      37
  // left                   'a'             65
  // right                  right arrow     39
  // right                  'd'             68
  // rotate clockwise       'x'             88
  // rotate clockwise       'k'             75
  // rotate anticlockwise   'z'             90 
  // rotate anticlockwise   'l'             76 
  // hard drop              space bar       32
  // pause                  esc             27
  // pause                  'p'             80
  // 
  // key event listener
  _handleKeyDown = event => {

    switch (event.keyCode || event.which) {
      case 37:
      case 65:
        // left
        event.preventDefault();
        this.moveRight = !(this.moveLeft = true);
        break;
      case 39:
      case 68:
        // right
        event.preventDefault();
        this.moveLeft = !(this.moveRight = true);
        break;
      case 38:
      case 75:
      case 87:
      case 88:
        // rotate clockwise
        event.preventDefault();
        this.rotateAnticlockwise = !(this.rotateClockwise = true);
        break;
      case 76:
      case 90:
        // rotate anticlockwise
        event.preventDefault();
        this.rotateClockwise = !(this.rotateAnticlockwise = true);
        break;
      case 40:
      case 83:
        // down
        event.preventDefault();
        this.moveDown = true;
        break;
      case 32:
        // hard drop
        event.preventDefault();
        this.hardDrop = true;
        break;
      case 27:
      case 80:
        // pause
        event.preventDefault();
        if (this.gameState != ClassicTetris.STATE_GAME_OVER) {
          this.doUndoPause = true;
        }
        break;
    }
  }


  //
  // pointer device inputs:
  //
  // action                 pointer moves
  // ------------------------------------------------------------------
  // left                   move the pointer to the left of the piece
  // right                  move the pointer to the right of the piece
  // down                   use the pointer drag the piece down
  // rotate clockwise       click / tap            
  //                        (left mouse button,       
  //                        touch contact, 
  //                        pen contact),
  //                        wheel up
  // rotate anticlockwise   click / tap 
  //                        (mouse wheel,
  //                        right mouse button, 
  //                        pen barrel button,
  //                        X1 (back) mouse,
  //                        X2 (forward) mouse,
  //                        pen eraser button),
  //                        wheel down

  // pointer move handler
  _handlePointerMove = event => {
    event.preventDefault();

    // no movement tracking during pause
    if (this.gameState === ClassicTetris.STATE_PAUSE) return;

    // find out if pointer is left or right or below the piece
    // then move piece accordingly
    const { x, y } = this._getEventCoords(event);

    // get pointer's row & column
    const row = ((y - this.boardY) / this.squareSide) | 0;
    const column = ((x - this.boardX) / this.squareSide) | 0;

    // get piece's bounds, calculate center column and row center 
    const { top, bottom, left, right } = this._getPieceBounds();
    const middleRow = ((top + bottom) / 2) | 0;
    const middleColumn = ((left + right) / 2) | 0;

    // enable pointer's ability to move down
    // if the pointer is on the piece or above
    if (row <= bottom) {
      this.pointerMoveDownEnabled = true;
    }

    // move left 
    if (column < middleColumn) {
      this.moveRight = !(this.moveLeft = true);
    }

    // move right
    if (column > middleColumn) {
      this.moveLeft = !(this.moveRight = true);
    }

    // move down
    if (this.pointerMoveDownEnabled && row > middleRow) {
      this.moveDown = true;
    }
  }


  // pointerdown handler
  _handlePointerDown = event => {
    //event.preventDefault();

    // do nothing during pause
    if (this.gameState === ClassicTetris.STATE_PAUSE) return;

    const { x, y } = this._getEventCoords(event);
    this.xIni = x;                  // store pointer coords
    this.yIni = y;
    this.tIni = performance.now();  // time since time origin
  }


  // touch gesture times, relevant in tap detection:
  // Fingertip forces and completion time for index finger and thumb touchscreen gestures.
  // https://www.ncbi.nlm.nih.gov/pubmed/28314216
  // "Tap was the fastest gesture to complete at 133(83)ms,   // Mean(±SD) times
  // followed by slide right at 421(181)ms. 
  // On average, participants took the longest to complete the stretch gesture at 920(398)ms."

  // pointer up handler
  _handlePointerUp = event => {
    event.preventDefault();

    // do nothing during pause
    if (this.gameState === ClassicTetris.STATE_PAUSE) return;

    const { x, y } = this._getEventCoords(event);
    const a = this.xIni - x;                  // calculate distance
    const b = this.yIni - y;                  // between tap-down and tap-up coordinates
    const dist = Math.sqrt(a * a + b * b);

    // detect tap/click:
    if (dist <= this.tapClickMaxDistance &&                           // similar coords
      performance.now() - this.tIni <= this.tapClickMaxDuration) {  // gesture was short

      if (event.button === 0) {
        // left mouse button, touch contact, pen contact
        // rotate piece clockwise
        this.rotateAnticlockwise = !(this.rotateClockwise = true);

      } else {
        // right button, mouse wheel...
        // rotate piece anticlockwise
        this.rotateClockwise = !(this.rotateAnticlockwise = true);

      }
    }
  }


  // pointer cancel
  _handlePointerCancel = event => {
    event.preventDefault();

    // reset pointer flags
    this.pointerMoveDownEnabled = false;
  }

  // wheel rotates the piece
  _handleWheel = event => {
    event.preventDefault();

    // do nothing during pause
    if (this.gameState === ClassicTetris.STATE_PAUSE) return;

    if (event.deltaY > 0) {
      // rotate piece clockwise
      this.rotateAnticlockwise = !(this.rotateClockwise = true);
    } else if (event.deltaY < 0) {
      // rotate piece anticlockwise
      this.rotateClockwise = !(this.rotateAnticlockwise = true);
    }
  }


  // pointer coordinates
  _getEventCoords(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  // get current piece's left and right bounds
  _getPieceBounds() {
    const p = this.piece.rot[this.pieceRotation];
    let top = this.boardHeight;
    let bottom = 0;
    let left = this.boardWidth;
    let right = 0;
    for (let i = 0; i < p.length; ++i) {
      for (let j = 0; j < p[i].length; ++j) {
        if (p[i][j] != 0) {
          const x = this.piecePosition[0] + j;
          const y = this.piecePosition[1] + i;
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    }
    return {
      top: top,
      bottom: bottom,
      left: left,
      right: right
    };
  }


  //-----------------------------------------------------------
  // 
  // game logic
  // 
  //-----------------------------------------------------------

  _process() {

    // game possibly paused/unpaused
    this._pauseCheck();

    // process current state
    switch (this.gameState) {
      case ClassicTetris.STATE_DROP:
        this._processDrop();
        break;
      case ClassicTetris.STATE_BURN:
        this._processBurn();
        break;
      case ClassicTetris.STATE_ARE:
        this._processARE();
        break;
      case ClassicTetris.STATE_GAME_OVER:
        this._processGameOver();
        break;
      case ClassicTetris.STATE_PAUSE:
        // do nothing if paused
        break;
    }
    // clear input flags
    this._resetInputs();

    // global frame counter
    ++this.frameCounter;
  }


  _processDrop() {
    // decrease drop counter
    --this.framesTilDrop;


    // do move if buffered
    if (this.moveLeft && this._canMovePiece(-1, 0)) {
      const oldPosition = [...this.piecePosition];
      --this.piecePosition[0];

      // play move sound
      if (this.moveSound) {
        this.moveSound.currentTime = 0;
        this.moveSound.play();
      }

      // fire move left event
      this._dispatch(ClassicTetris.PIECE_MOVE_LEFT, {
        type: ClassicTetris.PIECE_MOVE_LEFT,
        piece: this.piece.name,
        rotation: this.pieceRotation,
        oldPosition: oldPosition,
        newPosition: [...this.piecePosition]
      });

    }
    if (this.moveRight && this._canMovePiece(1, 0)) {
      const oldPosition = [...this.piecePosition];
      ++this.piecePosition[0];

      // play move sound
      if (this.moveSound) {
        this.moveSound.currentTime = 0;
        this.moveSound.play();
      }

      // fire move right event
      this._dispatch(ClassicTetris.PIECE_MOVE_RIGHT, {
        type: ClassicTetris.PIECE_MOVE_RIGHT,
        piece: this.piece.name,
        rotation: this.pieceRotation,
        oldPosition: oldPosition,
        newPosition: [...this.piecePosition]
      });

    }
    if (this.rotateClockwise && this._canRot((this.pieceRotation + 1) % this.piece.rot.length)) {
      const oldRotation = this.pieceRotation;
      this.pieceRotation = (this.pieceRotation + 1) % this.piece.rot.length;

      // play rotation sound
      if (this.rotateSound) {
        this.rotateSound.currentTime = 0;
        this.rotateSound.play();
      }

      // fire clockwise rotation event
      this._dispatch(ClassicTetris.PIECE_ROTATE_CLOCKWISE, {
        type: ClassicTetris.PIECE_ROTATE_CLOCKWISE,
        piece: this.piece.name,
        position: [...this.piecePosition],
        oldRotation: oldRotation,
        newRotation: this.pieceRotation
      });

    }
    if (this.rotateAnticlockwise && this._canRot((this.pieceRotation + this.piece.rot.length - 1) % this.piece.rot.length)) {
      const oldRotation = this.pieceRotation;
      this.pieceRotation = (this.pieceRotation + this.piece.rot.length - 1) % this.piece.rot.length;

      // play rotation sound
      if (this.rotateSound) {
        this.rotateSound.currentTime = 0;
        this.rotateSound.play();
      }

      // fire anticlockwise rotation event
      this._dispatch(ClassicTetris.PIECE_ROTATE_ANTICLOCKWISE, {
        type: ClassicTetris.PIECE_ROTATE_ANTICLOCKWISE,
        piece: this.piece.name,
        position: [...this.piecePosition],
        oldRotation: oldRotation,
        newRotation: this.pieceRotation
      });

    }

    // hard drop or move down
    // move down: if drop counter says so
    //            or player pushed down
    if (this.hardDrop) {

      // hard drop = push piece as far down as possible
      // score increase is 2x the numer of dropped lines
      const oldPosition = [...this.piecePosition];
      while (this._canMovePiece(0, 1)) {
        ++this.piecePosition[1];
        this.pressDownScore += 2;
      }

      // fire hard drop event
      this._dispatch(ClassicTetris.PIECE_HARD_DROP, {
        type: ClassicTetris.PIECE_HARD_DROP,
        piece: this.piece.name,
        rotation: this.pieceRotation,
        oldPosition: oldPosition,
        newPosition: [...this.piecePosition]
      });

      // do piece lock
      this._lockPiece();

    } else if (this.moveDown || this.framesTilDrop === 0) {
      if (this._canMovePiece(0, 1)) {

        if (this.moveDown) {
          // soft drop makes 1 point per dropped line
          ++this.pressDownScore;
        }
        const oldPosition = [...this.piecePosition];
        ++this.piecePosition[1];

        // reset auto-drop frames
        this.framesTilDrop = this._getFramesPerGridcell(this.level);

        // fire move down event
        this._dispatch(ClassicTetris.PIECE_MOVE_DOWN, {
          type: ClassicTetris.PIECE_MOVE_DOWN,
          piece: this.piece.name,
          rotation: this.pieceRotation,
          oldPosition: oldPosition,
          newPosition: [...this.piecePosition],
          downPressed: this.moveDown
        });

      } else {
        // lock piece if it couldn't move down
        this._lockPiece();
      }
    }
  }

  _lockPiece() {
    this.framesTilDrop = -1;
    this._setPiece();

    // fire piece lock event
    this._dispatch(ClassicTetris.PIECE_LOCK, {
      type: ClassicTetris.PIECE_LOCK,
      piece: this.piece.name,
      rotation: this.pieceRotation,
      position: [...this.piecePosition]
    });

    this.linesCleared = this._getLinesCleared();
    if (this.linesCleared.length > 0) {

      // clear those lines
      this.columnsCleared = 0;
      this.gameState = ClassicTetris.STATE_BURN;

      // remove initial columns of squares for animation
      const mid = this.boardWidth / 2;
      for (let i = 0; i < this.linesCleared.length; ++i) {
        this.board[this.linesCleared[i]][mid + this.columnsCleared] = -1;
        this.board[this.linesCleared[i]][mid - 1 - this.columnsCleared] = -1;
      }

      // play corresponding lines clear sound
      const sound = this.linesCleared.length === 4 ? this.tetrisSound : this.lineSound;
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }

      // fire burn start event
      this._dispatch(ClassicTetris.LINE_CLEAR_START, {
        type: ClassicTetris.LINE_CLEAR_START,
        linesBurnt: [...this.linesCleared]
      });

    } else {

      // play piece lock sound
      if (this.setSound) {
        this.setSound.currentTime = 0;
        this.setSound.play();
      }

      // update score
      const oldScore = this.score;
      this.score += this.pressDownScore;

      // fire score change event
      this._dispatch(ClassicTetris.SCORE_CHANGE, {
        type: ClassicTetris.SCORE_CHANGE,
        oldScore: oldScore,
        newScore: this.score
      });

      // entry delay for next piece
      this.areFrames = this._getARE();
      this.gameState = ClassicTetris.STATE_ARE;
    }
  }

  _processBurn() {
    if ((this.frameCounter % 8) === 0) {  //4) === 0) {
      ++this.columnsCleared;
      if (this.columnsCleared < 5) {
        // remove another columns of squares
        const mid = this.boardWidth / 2;
        for (let i = 0; i < this.linesCleared.length; ++i) {
          this.board[this.linesCleared[i]][mid + this.columnsCleared] = -1;
          this.board[this.linesCleared[i]][mid - 1 - this.columnsCleared] = -1;
        }

      } else {
        this.columnsCleared = -1;

        // clean board up
        for (let i = this.linesCleared.length - 1; i >= 0; --i) {
          this.board.splice(this.linesCleared[i], 1);
        }
        while (this.board.length < this.boardHeight) {
          this.board.unshift([...this.emptyRow]);
        }

        // add score and lines
        const oldScore = this.score;
        const oldLines = this.lines;
        this.score += this.pressDownScore + this._getLinesScore(this.linesCleared.length, this.level);
        this.lines += this.linesCleared.length;

        // fire lines burn end event
        this._dispatch(ClassicTetris.LINE_CLEAR_END, {
          type: ClassicTetris.LINE_CLEAR_END,
          linesBurnt: [...this.linesCleared]
        });

        // fire lines clear event
        this._dispatch(ClassicTetris.LINE_CLEAR, {
          type: ClassicTetris.LINE_CLEAR,
          oldLines: oldLines,
          newLines: this.lines
        });

        // fire score change event
        this._dispatch(ClassicTetris.SCORE_CHANGE, {
          type: ClassicTetris.SCORE_CHANGE,
          oldScore: oldScore,
          newScore: this.score
        });

        // increase level?
        const levelTemp = this._getLevel();
        if (this.level != levelTemp) {
          const oldLevel = this.level;
          this.level = levelTemp;

          // play level change sound
          if (this.levelChangeSound) {
            this.levelChangeSound.currentTime = 0;
            this.levelChangeSound.play();
          }

          // fire level change event
          this._dispatch(ClassicTetris.LEVEL_CHANGE, {
            type: ClassicTetris.LEVEL_CHANGE,
            oldLevel: oldLevel,
            newLevel: this.level
          });

        }

        // entry delay for next piece
        this.areFrames = this._getARE();
        this.gameState = ClassicTetris.STATE_ARE;
      }
    }

  }

  _processARE() {
    // wait are frames
    --this.areFrames;
    if (this.areFrames === 0) {
      this.areFrames = -1;

      // reset drop points
      this.pressDownScore = 0;
      this.pointerMoveDownEnabled = false;

      // get next piece
      this.piece = this.next;
      this.piecePosition = this.piece.iniPos.slice(0);
      this.pieceRotation = 0;
      this.next = this.pieces[this._nextPieceId()];

      // try to place current piece
      if (this._canMovePiece(0, 0)) {
        this.framesTilDrop = this._getFramesPerGridcell(this.level);
        this.gameState = ClassicTetris.STATE_DROP;

        // fire new piece placed event
        this._dispatch(ClassicTetris.NEXT_PIECE, {
          type: ClassicTetris.NEXT_PIECE,
          piece: this.piece.name,
          nextPiece: this.next.name
        });

      } else {
        // can't place piece -it's game over
        this._setPiece();
        this._triggerGameOver();
      }
    }
  }

  _triggerGameOver() {
    // stop theme song
    if (this.gameTheme) {
      this.gameTheme.pause();
    }

    // play game over sound
    if (this.gameOverSound) {
      this.gameOverSound.currentTime = 0;
      this.gameOverSound.play();
    }

    this.gameOverLine = 1;
    this.gameState = ClassicTetris.STATE_GAME_OVER;

    // fire game-over animation start event
    this._dispatch(ClassicTetris.GAME_OVER_START, {
      type: ClassicTetris.GAME_OVER_START,
      level: this.level,
      score: this.score,
      lines: this.lines
    });
  }

  _processGameOver() {
    if ((this.frameCounter % 8) === 0) {  //4) === 0) {
      ++this.gameOverLine;
      if (this.gameOverLine < this.boardHeight) {
        // paint next row
        for (let i = 0; i < this.boardWidth; ++i) this.board[this.gameOverLine][i] = 7;

      } else {
        // game-over animation is done -stop the game loop
        this.gameLoop = false;

        // fire game-over animation end event
        this._dispatch(ClassicTetris.GAME_OVER_END, {
          type: ClassicTetris.GAME_OVER_END,
          level: this.level,
          score: this.score,
          lines: this.lines
        });
      }
    }
  }

  // pause or unpause if requested
  _pauseCheck() {
    if (this.doUndoPause) {
      if (this.gameState === ClassicTetris.STATE_PAUSE) {
        this.gameState = this.previousGameState;

        // reset pointer flags
        this.pointerMoveDownEnabled = false;

        // resume theme song
        if (this.gameTheme) {
          this.gameTheme.play();
        }

        // fire resume event
        this._dispatch(ClassicTetris.GAME_RESUME, {
          type: ClassicTetris.GAME_RESUME,
          level: this.level,
          score: this.score,
          lines: this.lines
        });

      } else {
        this.previousGameState = this.gameState;
        this.gameState = ClassicTetris.STATE_PAUSE;

        // pause theme song
        if (this.gameTheme) {
          this.gameTheme.pause();
        }

        // play pause sound
        if (this.pauseSound) {
          this.pauseSound.currentTime = 0;
          this.pauseSound.play();
        }

        // fire pause event
        this._dispatch(ClassicTetris.GAME_PAUSE, {
          type: ClassicTetris.GAME_PAUSE,
          level: this.level,
          score: this.score,
          lines: this.lines
        });

      }
    }
  }

  // get them inputs ready for the next iteration
  _resetInputs() {
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.rotateClockwise = false;
    this.rotateAnticlockwise = false;
    this.hardDrop = false;
    this.doUndoPause = false;
  }


  //--------------------------------------------------------------------------------------------
  // 
  // game rules: https://tetris.wiki/ClassicTetris_(NES,_Nintendo)
  // 
  //--------------------------------------------------------------------------------------------

  _nextPieceId() {
    let nextId = (Math.random() * 8) | 0;
    if (nextId === 7 || nextId === this.piece.id) {
      nextId = (Math.random() * 8) | 0;
      nextId = (nextId + this.piece.id) % 7;
    }
    return nextId;
  }

  // score for lines cleared
  // depends on the level and # of lines cleared
  _getLinesScore(lines, lvl) {
    if (lines === 1) return 40 * (lvl + 1);
    else if (lines === 2) return 100 * (lvl + 1);
    else if (lines === 3) return 300 * (lvl + 1);
    return 1200 * (lvl + 1);    // tetris!
  }

  // ARE is 10~18 frames depending on the height at which the piece locked; 
  // pieces that lock in the bottom two rows are followed by 10 frames of entry delay, 
  // and each group of 4 rows above that has an entry delay 2 frames longer than the last
  _getARE() {
    const h = this._getLockHeight();
    const are = 10 + (((h + 2) / 4) | 0) * 2;
    return are * 2;   //return are;
  }

  // height at which the piece locked
  _getLockHeight() {
    let h = 0;
    const p = this.piece.rot[this.pieceRotation];
    for (let i = 0; i < p.length; ++i) {
      for (let j = 0; j < p[i].length; ++j) {
        if (p[i][j] != 0)
          h = Math.max(h, this.piecePosition[1] + i);
      }
    }
    return this.boardHeight - 1 - h;
  }

  // when the player clears (startLevel × 10 + 10) or max(100, (startLevel × 10 - 50)) lines, 
  // whatever comes first, the level advances by 1. After this, the level advances by 1 for every 10 lines.
  _getLevel() {
    const a = this.lines - Math.min(this.startLevel * 10 + 10, Math.max(100, this.startLevel * 10 - 50));
    return this.startLevel + (a >= 0 ? ((a / 10) | 0) + 1 : 0);
  }

  // line clear delay is an additional 17~20 frames depending on the frame that the piece locks; 
  // the animation has 5 steps that advance when the global frame counter modulo 4 equals 0. 
  // As a consequence, the first step of the line clear animation is not always a set number of frames
  _getLinesCleared() {
    const arr = [];
    for (let i = 0; i < this.boardHeight; ++i) {
      let b = true;
      for (let j = 0; b && j < this.boardWidth; ++j)
        if (this.board[i][j] === -1) b = false;
      if (b) arr.push(i);
    }
    return arr;
  }

  // set piece down on board (lock it)
  _setPiece() {
    const p = this.piece.rot[this.pieceRotation];
    for (let i = 0; i < p.length; ++i) {
      for (let j = 0; j < p[i].length; ++j) {
        if (p[i][j] != 0) {
          this.board[this.piecePosition[1] + i][this.piecePosition[0] + j] = this.piece.id;
        }
      }
    }
  }

  // can the piece move
  _canMovePiece(offsetX, offsetY) {
    return this._canMove(this.piece, this.pieceRotation, this.piecePosition, offsetX, offsetY);
  }

  _canMove(piece, pieceRot, piecePos, offsetX, offsetY) {
    const p = piece.rot[pieceRot];
    for (let i = 0; i < p.length; ++i) {
      for (let j = 0; j < p[i].length; ++j) {
        if (p[i][j] != 0) {
          const x = offsetX + piecePos[0] + j;
          const y = offsetY + piecePos[1] + i;
          if (x < 0 || x >= this.boardWidth || y >= this.boardHeight || this.board[y][x] != -1)
            return false;
        }
      }
    }
    return true;
  }

  // can the piece rotate
  _canRot(rotation) {
    const p = this.piece.rot[rotation];
    for (let i = 0; i < p.length; ++i) {
      for (let j = 0; j < p[i].length; ++j) {
        if (p[i][j] != 0) {
          const x = this.piecePosition[0] + j;
          const y = this.piecePosition[1] + i;
          if (x < 0 || x >= this.boardWidth || y >= this.boardHeight || this.board[y][x] != -1)
            return false;
        }
      }
    }
    return true;
  }


  //-----------------------------------------------------------
  // 
  // render
  // 
  //-----------------------------------------------------------

  _render() {
    this._drawBackground();
    this._drawBoard();
    this._drawGhost();
    this._drawPiece();
    this._drawHUD();
    this._drawNext();
  }

  _drawBackground() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.lineWidth = 1;

    // if burning a tetris, make background color flash
    const fillColor = this.gameState === ClassicTetris.STATE_BURN &&
      this.linesCleared.length === 4 &&
      this.frameCounter % 8 ?   //4 ?
      this.tetrisBackgroundColor :
      this.backgroundColor;

    // draw background and border
    this.context.beginPath();
    this.context.moveTo(this.boardBorder[0], this.boardBorder[1]);
    this.context.lineTo(this.boardBorder[2], this.boardBorder[1]);
    this.context.lineTo(this.boardBorder[2], this.boardBorder[3]);
    this.context.lineTo(this.boardBorder[0], this.boardBorder[3]);
    this.context.closePath();
    this.context.fillStyle = fillColor;
    this.context.strokeStyle = this.borderColor;
    this.context.fill();
    this.context.stroke();


    if (this.gameState === ClassicTetris.STATE_PAUSE) {
      // pause overlay:
      // write PAUSE on the board if game is paused
      this.context.font = this.canvasFont;
      this.context.fillStyle = this.canvasFontColor;
      this.context.fillText('PAUSE', this.pauseX, this.pauseY);

    } else {
      // draw grid if not paused
      this.context.lineWidth = 0.5;

      // horizontal lines
      this.context.strokeStyle = this.gridColor;
      const boardRight = this.boardX + this.squareSide * this.boardWidth;
      for (let i = 3; i < this.boardHeight; ++i) {
        const height = this.boardY + i * this.squareSide;
        this.context.beginPath();
        this.context.moveTo(this.boardX, height);
        this.context.lineTo(boardRight, height);
        this.context.closePath();
        this.context.stroke();
      }
      // vertical lines
      const boardTop = this.boardY + 2 * this.squareSide;
      const boardBottom = this.boardY + this.boardHeight * this.squareSide;
      for (let j = 0; j < this.boardWidth; ++j) {
        const width = this.boardX + j * this.squareSide;
        this.context.beginPath();
        this.context.moveTo(width, boardTop);
        this.context.lineTo(width, boardBottom);
        this.context.closePath();
        this.context.stroke();
      }

      // back to regular line width
      this.context.lineWidth = 1;
    }
  }

  _drawBoard() {
    if (!(this.gameState === ClassicTetris.STATE_PAUSE)) {
      // draw the game board if the game is not paused
      for (let i = 2; i < this.boardHeight; ++i) {
        for (let j = 0; j < this.boardWidth; ++j) {
          if (this.board[i][j] != -1) {
            const col = this.board[i][j] == 7 ?
              this.gameOverColor :
              this.pieces[this.board[i][j]].col;
            this._drawSquare(
              this.boardX + j * this.squareSide,
              this.boardY + i * this.squareSide,
              col[0], col[1]);
          }
        }
      }
    }
  }

  // draw current piece
  _drawPiece() {
    if (this.gameState === ClassicTetris.STATE_DROP) {
      // current piece is only drawn in drop state
      const p = this.piece.rot[this.pieceRotation];
      for (let i = 0; i < p.length; ++i) {
        for (let j = 0; j < p[i].length; ++j) {
          if (p[i][j] != 0 && this.piecePosition[1] + i > 1) {
            this._drawSquare(
              this.boardX + (this.piecePosition[0] + j) * this.squareSide,
              this.boardY + (this.piecePosition[1] + i) * this.squareSide,
              this.piece.col[0], this.piece.col[1]);
          }
        }
      }
    }
  }

  // draw ghost piece
  // it is a representation of where a tetromino or other piece will land if allowed to drop into the playfield
  _drawGhost() {
    if (this.gameState === ClassicTetris.STATE_DROP) {

      // find ghost piece position, which is lowest position for current piece
      const piecePos = [this.piecePosition[0], this.piecePosition[1]];
      while (this._canMove(this.piece, this.pieceRotation, piecePos, 0, 1)) {
        ++piecePos[1];
      }

      // draw ghost piece
      const p = this.piece.rot[this.pieceRotation];
      for (let i = 0; i < p.length; ++i) {
        for (let j = 0; j < p[i].length; ++j) {
          if (p[i][j] != 0 && piecePos[1] + i > 1) {
            this._drawSquare(
              this.boardX + (piecePos[0] + j) * this.squareSide,
              this.boardY + (piecePos[1] + i) * this.squareSide,
              this.ghostColor[0], this.ghostColor[1]);
          }
        }
      }
    }
  }

  // draw heads-up display
  _drawHUD() {
    let scoreStr = 'Score:   ';
    let levelStr = 'Level:   ';
    let linesStr = 'Lines:   ';
    let nextStr = 'Next';
    if (this.gameState != ClassicTetris.STATE_PAUSE) {
      // show data only if game is not paused
      scoreStr += this.score;
      levelStr += this.level;
      linesStr += this.lines;
    }

    this.context.font = this.canvasFont;
    this.context.fillStyle = this.canvasFontColor;
    this.context.fillText(scoreStr, this.scoreX, this.scoreY);
    this.context.fillText(levelStr, this.levelX, this.levelY);
    this.context.fillText(linesStr, this.linesX, this.linesY);
    this.context.fillText(nextStr, this.nextX, this.nextY);
  }

  // draw next piece
  _drawNext() {
    if (this.gameState === ClassicTetris.STATE_PAUSE ||
      this.gameState === ClassicTetris.STATE_GAME_OVER) return;

    const p = this.next.rot[0];
    const b = this.next.box;
    for (let i = b[0]; i < b[0] + b[2]; ++i) {
      for (let j = b[1]; j < b[1] + b[3]; ++j) {
        if (p[i][j] != 0) {
          this._drawSquare(
            this.nextOffsetX + (j - b[1]) * this.squareSide,
            this.nextOffsetY + (i - b[0]) * this.squareSide,
            this.next.col[0], this.next.col[1]);
        }
      }
    }
  }

  // draw an individual square on the board
  /*_drawSquare(x, y, color, border) {
    this.context.beginPath();
    this.context.moveTo(x + 1, y + 1);
    this.context.lineTo(x + this.squareSide - 1, y + 1);
    this.context.lineTo(x + this.squareSide - 1, y + this.squareSide - 1);
    this.context.lineTo(x + 1, y + this.squareSide - 1);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.strokeStyle = border;
    this.context.fill();
    this.context.stroke();
  }*/
  /*_drawSquare(x, y, color, border) {
    switch (color) {
      case this.oColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,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';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.lColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,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';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.iColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAGfAaADASIAAhEBAxEB/8QAHAAAAQUBAQEAAAAAAAAAAAAAAQACAwQFBgcI/8QAOBAAAgEDAgQFAwMFAAEEAwEAAAECAxEhBDEFEkFREyIzYXEjMoEkNEIGFJGhsVJEYnLBB5Lh8P/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBgX/xAAoEQEBAAICAgICAgMAAwEAAAAAAQIRAzEhMhJBBCITUQUzQiNhcZH/2gAMAwEAAhEDEQA/AMGXGOIwm0uIarlTeHVZY0/9QcVoJqGvr5/8p3/6Y0Hzu+5MsM89/JnPt6aceN+m/T/q7jcP/V83/wAoRf8A9DIf1RxqMpS/vqj5u6Tt/rBjodYn+bk/sfw8c/5iWtqdRqZ89evVqSu3eUmwRqVOWzqT/wD2ZGt0PRnc7/bWYY/0mdWoqMn41S/bmZzEqk6mpnKbbd+rOjmrU5PpZnOTxXl8mvDlbvbLkwjf4b+3ivc16EfPvhGPw30UzZobo5+T2rXHpfk4OjFWtK2X3MzU1KimkpySXZl7db5KOqf1XcznJdr+EQuvWt6tSy/9zI5ylNXlOUvlhYivlf7Hxn9MLiLf9xa7LnCKklzQ5nYpa9X1TLPCXabvk6u+ORz3xm3aMI05Ky6l614lKlui/bBx8jowU68FF7K77oqyhCX8Iq3ZF7U5SKlgxyuuzuM3tA6UH0Vvgw9ZShTruEEoxWyR0bSexz3ErrWSNuG35M+SeEvDLeM/8G/BGDwv1zoKdm1gfL7Jw6XoK1NXRDqVezZOlaK7EOq+1HDv9nTGLxNWo27mGo3kl7m7xL0bGInaf5O7gv6ufknl0FCFqa64Lmni+bBW0+acWX9MldmOc3FYp+VNWKVSHmeTQtgpz+5meFul5RB4drmdxWPLTVjUbM3in2K5rx5X5RGU8MZq9jf0ztSiYKs5JG/plejC9tjflRxrtB2e2S6tipTy44+S1bojkzvlrjFWV3LILdgvfALlShR4gn/bSOdj5ZN33Ok17/TSOaf3HRwXxWPJHYf0XxWXC+I06rV4NtTXsz2yElOClF3TymfP3C8Umz0/+jv6iVaNLhWpT8SKapT7pZs/c7vxOeY53DL7cH5nBcsZyY/TtBCFY+q+UQRCAEIQgA/8EIO4B800pc0bbEyWSCirRXv0LKVvc8/k9LiKv+B6Ah1jKrFIekCCHpZ6E04NRvwZR6WObn6skdHUxSl8HN1MVpG3B9s+Xpu8L9FGzp8MxeF+gmbem3MeSeaeK1ko6pfUdy+9ilq42mvc58e2yo0BIdYVsmmyYPEVbVOxNwr1JEXEcap7EnDPUbOyf63NfZ0FBNyWTRtcz9PujRhJWOHkjfBV1SskVXlF3WSulcpMWN8LoM5/if7pnQX7nP8AE0/7ps6OG/sz5Oj+Fu1Y6GmvMjnuGW8dI6OkrtD5ZvLaMF9Lyoh1KfJcnWyTIdUvpq3c4dfs6J0w+J+kkYafmXybvEl9GxhQspLrk7uD1Y8vbo9Nfwo37GjpcyM7TNeCjR0m9zPL7E7XGvLcoVF538mjvFlGp9zOfGtqhsZvFI2j+DUM3iv2I147+0iMumIl5tjotMrUYfBz/wDI6HTL6MPg6uX6Y4L1BXZbcbLBU0yzl3dy/wB8HFy3zK3xZ08SfyN6rJJUjabfuNUcjgVNer6eRzMl5jqNamtPLCZzEl9RnTw9MuRr8MxS/Jt6SpKjWhVg7Tg+aL9zE4YrU/a5sU8SIuWs1Sfrp69wniEeJ8No6lW5pK00ukupf6HC/wBF6109ZLSyfkqxuk//ACX/APLndHoPxeb+XjmTz/5XD/FyXEuohdAnQ5wCLoIAK3EgdQ7IA+a1G9vYnjblGL7njqPWx57J6WHR/I9DV0HpYMq0PjYeo9Rqs1YcTQFTNOXwc5V9WXa50k/sl8HN1/VnY24L5rPl6bHC/QRu6XBg8J9JG/pXlmfJ3Tw+lt4RS1WZl21ynqsSscu/LdVAksjrANEsHiS/UMPDH52uouIr6zuHhSvUZ2z/AFubL3b1B8tuxpw+3Jn6eNmaStynDy9N8FfU7IqMuajEEU28kY9NKaYPE/3L9zf/ANGDxGz1MvY6OD2ZcnqHDfXR0dN5TOc4cl4yOhp45bmnLfKMGnFYRDqX9PHclg/Kvgh1N/Ds11OD/p0Tpj8RV6F2YEN/yb/EG1Ra7mCvuO3g9WPL26HS5px+DU0qeWZukV6UO7Rp6ZWm12Iy+yi2tmilV9RsvFKr97OfGNqjuZvFftXwaRncUzBdTXD2icumHfzZOh0/owx0Oe/lY6LTejC+9jp5b4Y4drlHEi/F3+SnRWcly+EcXN5sdGPSrU+5r3I7EtT1HnqRscy3Ara2z08sdDmZW5zptYvoSOal6jR08F8VlyNXhsU6crZZq01dGZwy3I7dzVp4ZHJ7Hj01+Eaj+z12nrXaUJpt+3U9ThNTgpRaaavddTyOk0o3O7/pXisdTo1o6k141L7V3j0/wdv+M5pjleO/bg/yXDcsZyT6dFuEQj7j4xB6ACAJC6iF1APm93dRtdySOwxLzMkR52vTQ5JdySKwMW2SSOxlVw5IdYCyOXQkzZ4py+DnNRbxpnSVbcr+Dna6+pKxtwds+XpqcHX0kzoNKrNmBwb02up0Gns30I5O6WP0tp2RR1X3F3YqapJtHN9uhUtkPJi4dgNvGSksHiP7hq+B3CklVkN4ljUe+4eF5rPY7cf9bmy93RUL3VjRSVjO0+69jRSucfK341bU2cCo0XNSvK2VNzLDzGlDcwOI2/uZG/1MHiX7lo6eD2Z8nQcP9dZRvRlsYPDvVXyb8V1L5e2eHTThmnEj1Ppj6VlTQzU+mzh/6dE6YvEfRMFLzL5NziL+iYixP5O3g9WXL26HSYpxZp6T7mZelv4EPg0tH9zIzTGhby5KNV/UZevgo1FapLK3ObHtsj3M/inpo0EzO4q/pp9Hg2w7TemJ/PHRnQ6bNGD9jnl9/wCTodJbwIW2sdPJ0xw7X6GWrovLKyUaLSkr7F5HBy3y3wVKi87GNElRLnZH1HDQ6pLwZNvocvJXm/k6bWtqhI5qavUdjq4WWbT4X9slnc11iSRlcL2fsayzInPsYrlPMA0tVV0Wrp6ihNxqQd0xUVaCIdS+VI58MrM9xrljLjqvVOD8Vo8W0Ma9NpSWJw6xZodTyLhPGdRwjVeNQeHicHtJe56hwvidDimkhqKMt15oN5i+zPS/iflTlmr289+X+LeK/KdLrWA9BBOxxl0EtsiEAfOT+6WLZHxQ+rS5ZJrZgijzVr1MgpD0JIfYiqJLI6wEh24jNqLyS7WOcr+tP5OjqNqlL4Od1Hqyt3NuDusuXpqcI+y/U39N9xhcKhamjd03dEcv2MFxop6prmRc6FTVJcyOXHzW6qNHdxrWDRLC4kvr3Bwz1pDuJX8cXC19ZnXh/rc2fu6HT2ujTuZlDLRpJ4OPmrfBBqPTfyU7Zvcu6j02UuhGHTQHvgweJu+p/BvGBxTGpZvw+zPk6Lh6+tE6FdElY53h3rI6GOyNOXtnhGhT+yI3U5pdCSmvIkR6hWpHFfZ0Y9MTiEfoMw1mRv8AEv2/5OfjiR2cHTLl7dFpcUo/BpaX7sWsZmld6MW+iNPS5kRleyi/i1yjV9SRd6W2Kda/Ozmx7a1EZ/E/SWDRaVsGdxP0sM2xvmJvTDVuY6LSL6EF7HPJedJdTotGrUYp9Dp5L0xx7XaOZK/Rl+NmnYo001JF1dMHz+Xt0YqtRedjHsS1cTZDcuQKuvf6aRzz+54Oh1udPI51/dsb8XTPNqcOTsrdXk2I4Sv+TJ4c1yv2NmCWBchYrVL7UQapXaLUftRBqIuSuuhzS/s2+lGxe4XxTVcM1Ua2nnnaUXtJdmVFHBJCNndnTjyXG7iMsZlNV6hwb+odLxaCjdU9Qt6bf+13NhZVzxyM502pwk4yWzi7NHVcI/rOrRSpcQg6sOlSP3L5XU+v+P8A5DHL9eTx/wC3x/yPwLP24/8A8d0Ig0esoa7TRr6eopwl1XT5Jz6Uss3HzbLLqvBJ0+amV+UvKziQ1Kebo8xt6pCojg2sFdhUBFYfsH3ENqTUFcRoNXVUKLXVmI6bqP3bLmqqurU+CTSUG7zlsb4fpNssv2ul3R0+SjE1tKnYoU42ijS0n23sZZ3ctVO06Kuq3RceWU9W/Ml2OfGeWiri9xue455B8l0MPiGa24OG+q2HiPrg4Zmq0dePo5s/dvadu6uau0U/Yy9NiSRqp3ikcnK2wQahvw2Uy7qLeGyiyMZ4WRgcU/cbG9ujC4rivf2N+H2Rn6mcM/cI6GOxz+gth/y5sHQU1hGnN2zwaNH7EhupfkH0laERupT8JYOLL2dGPTF4nfwDn4u8/wAnQ8QzQdzno2Ujs4Oqx5e3Q6W3K0s269zT0u5l6X0o/BpaPd/Jnn9nOmha69ypVfnaLi+2xTqffJM58WlRMzuJteEjSaM7inoqxrj3CvTDT86fudHpFajG3Y5z+X5Ok0lvAj8HVyzcYY9r1GN3kuR2KtDdJFtHz+bt0YKtX1GRdcktXM2R9S8fMCprlagznZYnY6XWK+nZzlRcs3c340ZNHhvXszbjus7GBwydqvLfY34vmVxciYtRlcM1zIrwk0TKV1ucuWOrtrKhcUC3ckluNZYBbbi2A2khk6sYJ3Y5SXtFxjWcJm6mmrOEXmUXmL+UXKn/AOUdZTXKtBQqSX8uZpP8HKavUyqx5Y4iUVSvurnfwcvJx46lc3LwcfJd5Rcp1b2TJnZopweCdTfLYwrcpbjL2YcjWmLR7MnUS6lSrOU2WXSlJ2sGGlineWRzRXdUqOkdSV3hGjGmkkoqyRIo4ssIfGKWCrdpk0UY9EaNGPLBdCtTpptMtRdjLPL/AJXjDyhXlzVGXqk+Wm+7M2Tu2ZTtRtgiAvguhicSX1gaCz5eXdPIeJYrDOGv9Qzrxv8A43Pn7Nyi7Sjk2I5ijIoJJpmtF+VKxycrbBHXV4MotGhVt4TxkoS3Ix6Ua/8AZhcWX10br2MLir+vk34fdHJ6o+HpKrHJ0VN+WxzvD/XR0NNOxrydssGlT+xAr5pMNL7FcGo9N9jgvs6Z0xuI407OehHmqJLqzouIr9O7HOJ+Y7eD1rHl7je0vpZ3WDS0mZYM/S5oL4NHR4eDLP7ONLoU6v3yLiXlyUqn3yZhi0pkjO4mvomjbBQ4pdUcmuHcK9MFJ88Ut7nR6SXNRXtg5xN+Imu50em9GN/m5053wwx7X6Dyi8n0M/TyUpOKveLs8Gglg4ObtviqVfvZGyapmoyNrYvHoI60eak1vg53U0/O/k6W2HdmVrdP520jTG6Kxm6d+FV5u50OmnzQWTn+Vpl3S6lwdm8bl5TflMbls90BNoZSqc0b3H3yZ2GHiWGuogtJjHC9uhOlbMnUfQgn5t2WXSzuFadNZLw1PKbds7wneyyy1Q0qi1KeX2LSpKLVlYfZGlz/AKTpzNLULmUJYZcUsGLVfLOz3RZoaxpKM8ruX8RtppodYgp1IyWGmT3uT0dKwUkIPUQO3skPhFtjI77E8ME3LUVIliuVEqwiNf6GVayWOpj9rDUVOZpLoV2Bu7uC7Lk0keggMV7AGHxPNYbwt/XeB3EsVrIHDV+o/B1Y/wCtjl7N2inc1ofavgzKC2NSC8iOXka4I63ptexQZfrfY37FFkYqM6GDxXNc32jB4pH6xvw+6M/VFw7Oo9jo4KV73xbY5zhqtWudNTzFWNuTtlgvQiuRdwalfSfyPgrxQzULyYODKeXTOmFxepKGlTXfJgbtOx0HF4KWm80rZMBYdjt4fVhyduh0itRjfsaWltz2RQ07vRhjoaGlw8GPJ9qxX1hWKc4+ZlxFSp97MMGlRmfxRt0smgZ/FfRS/Btj3E3ph8vmujodL6MPg52/m/J0mkj+kpyvudHJ0xw7XaO6LyzEo0L3Se5fSwcPN3G+KpU+9oZ0uSVM1GyPqVj0CdtyGtT51kmtkDCnGLqNO4vbYggnd4NurSU/kz6mnlB3tgqZlo7TaiVOylsaMaymrxaMtRHxUl9rsx7GmqndBfSxRpVakcbosxqt7onY0mT9h1mMjVdth6bu84DcLQ2u9xeHfrgK9tx7Xl2Hs9OL1mllKcpxz1sipG6waanzSu/9DZ0IVM2szpmVnio1tXpTaaa6FynVk83Iv7SUVfcfGnJdCbVSLcZu5ImrZIKaZNEjZ6Sx3Jo26kF7dROb6EWHtPOslhEDeX1YGxdgkIgoHsEAHUV+gQMAw+Jq1ddg8M/dfgXE/WQOG41Wex1YejDL2dBSw8M1IryrNzKpfcjWirwVjm5Z4a49oq32v4KO5oVl5GvYobIzxaG/KMLinrG6YXFr+M+5tw+7PP1QcOa/uEujOmo7HNcM5XWV+nQ6Om0tr29zfk81ji1ILyRQzUekOpu8I4G10vDdzgt8umdMPi0OfT2WFe7OfX3/AJOk4kv0xzi+5/J28HTLkdDpvRhZmjpH5mjO0r+lH4NHSv6lrZMc/tWK80mroq1PuZciinU+5/Jz8fa6jtgz+K4pJpGjaxncVf0V8m+PtE3phX850uk/awXscyl5/lnTaR300bvex0cnTHHtepZlFXtkvJXKVHElzZyXlscXL23xU6yaqsYTVszIh4g22BLcLBbqMEkJxjJWa3DYT3CwKs9Mm/KNVCSLq9gpXEFNU2uhJGJZSQrJXwEh7RRWSaEAX9g8z2D4jaaKjDdkc5t4Wwzmv8gbLkJy8XZJkq3I7JK249PFja9onSaLH2v1I0PWSFHxVoJdV1Cs/gahyAC9rPYSeAboIqB6i9gdA9RUxQb4AvYNse4ArC3D0E0IMPinrIj4c76lYJOKeuvgZw2z1J1Y+jDL2dBSXmv26GxT9OLMmnuadC/hI5+Xppj2VRXTM94djRn9rM5mM6aGswuLL65umJxZX1H4N+H2Tn0rcOjbUd8HQ028LJz2gdtSl1Z0dBGvLWODRovyJCrP6Tux0Vi6GV0/DZxX2dM6Y/E/2+DnkvO7dze4lK1G3cxIpJs7OHxGXI3tGr0I/Bo6VeZGdo8Uor2NTT4kZcn2eK78FOp98i3cp1r87yYYLpqM7iqtSXyX7sz+K38FdTbD2iMumH/I6PSW/t6at0OcX322ydJpF+nhZ9Doz6ZY9tGg1zpFxLoU9Osq66l5I4uWbbYqlVecjtYmqrzsiKx6M1oFh1ri2QyDPQVg2F0AEhBxZWWVv7ishGSuvgHS1x3QHQYNF1yFoZN2TADe+EJvA1SsC+UioTnmrSY5LqBZk21ZkiRtUwYkidyND1sRVH4EmIchArB97iCl/gQJbDrAQUsCMugUK1goAQOg4ZN8sW3sLYYfEs137A4ZH9RcZq581Ru5Z4RFuEpOPXc6t6w2wyn7N2mru5p0vSRmUMP2NWj6WTn5J4XjfJk3Yz5/e/k0p7PsZ0/ufyY4xqY8sw+LL9QjcfcxOLeun7G/D7Iz6VdA76qJ0lF5Oc4f+5R0VJWsa8nemePTVh9iGahLwmOp5hFgrr6TOHL3bzphcSjehfsc/G/OdLxBL+3dznI/czs4emfI39I+alFrsamlfmV0ZeiX04v2NXTLz/gyz+xF22SjX++RfWxRreq0YxoiRn8V9JZNG3lM/ivoo1x7lK9MOOZfk6TRpqjFPGDnKavJdzo9E70I/B08lYY9tLTvPwXjPoSSmkaCyjk5I1itWXnZEyerHNyJrIY9HTGgMcxDBiwEd0B2AEkH2Cg7iAK7QrBtgQbBjIpRuydrBHbIwj5RtnzEtsh5Lr3KgtYDp8vW+NwpXLMaV6ajLLsROm4ysXb5LRqQ5IVrD0LZglgchWCkIysFYD0FYAQcCCkBFYPsCwhbMWVNfXVOjZPLJ6lVU4NtmLXqSr1OboisMflfJZZaV+XnZu6Kh4dCKas7FLQ6XxKjlJKyybMYpLGxpnfpnBgrNGlRb8Kxmxd5F6g/LlmOdVIml7oz6itUZfvdFKuvqMzxaIWYnFvWt7G50MPi1vGRrw+6M+lXh6f91FWOlora5zfD/wB1F9Tpaawjbl9mePTSgrQiCu7UWgw+yL9gVfSaOHL2b49MTiX7dnPfzOj4jG9BnO7zOvh6Z8joNHbwNumDS0kbTz2M3RK1GC9jU02Zr4M852J0uXeSlVd6krl3oUaq+q+hji0M2M/ivpI0WkzP4pbw0jXH2hXpgxxO50ekdqcbdUc6vuOi0T56MX7HRy9MsV2EmrPqaFN3imUFEnpVbW7HN2taqQvC5Xu72f5LMZprchqw6oJ4LszA15Yd1YBds0X2Ag4FZELhWFYLFa+RGTVtsi6Ce4bYEAaG8t3sPe1gJZHsjOUjq1FRpuT6K5Ya9jG4rqk34Uem5eMtvgHqzimCUE0RUZ8qs9ixFqw6cQOnZgsyd7jWkLZo0g7WD3EMgFcILi2BQthLG41yUVlgC589hk6vIm27ENas/wCJTqOU2rsrDDfacroa1aVaVk8Coad1Zpfx7ktDTOrJNq0TRp01BWSsjXK68RnPI0qUacFBbEql5OUakrCRla0kGKzcvUPtyUk7Muae7Iy8w0+5T1OKl/YvFHVYn3wZxSF7GFxZ/W/Btt3wYXFn9c34vZOfSDQfuonT0ldXOX4e/wBVE6iklymnL2ywaNNeRArL6TYad+VXFXxTZxZdt8emNxD9u8HNJ+e3udLxHGmZzaj538nXwdM+R0eja8GPsjS01nNGZo19GNtrGnpornv1sZ52+RFvd2RUqL6juXLFSp97McO2lRpK5n8VS8K5pFDicb0Xg0ncJzzfXsdBw9L+2i+5z0otOxv8OlfTwydHJf1Zztorpkcn0GJ2wPXS1rHO0TU6lpWuWOa5TWLZJYy7sL5SfKGcDGnfJLe+wJNMXUOI2L2DgGLilUX/AAcgK4bYDZEFAz2A2luxbPR3S/QDXXoRz1EIK1yjqda5NqGEPey1Uus1saUHGDvJmBU5pzcnlsszUqkt2Php5Tlyo2w8eRdGxZNGT6FeDuiVMOiifmuhXI1YKuSZzyNYr9g3wMBcY5NMk3GuDfQC2inN+5FJt9Sw6TAqEb5eBjyq+G5PCJqeku05FqMIx2Q/YJlorjslFU0kth2//BtxX9xfIaFiXuxAb7CMr2Zc0ssWsUYu8jQ08UruxGV0azbBS1P3sut+Uz68r1GRFK7MTiyvVRuMxOKZqpG/F7Iz6VeH51EH2Z1EG3Taj91jmNA/1MbHUUMpGvL2yxaFJtU4qbV7ZYq3pyHQxFXG1sUWcV9m86Y/Ev2zObWHf3Oi4k/00jnF97Ovh6RyOi0fox72NXTLzp+xlaNN049uVY9zW0uXsZZidLi2KlT1Gi4tilVzUkZY9rMZV10eag8FrFiKtHmpSXsabJy9ReY1uGT+ny9jOqwcajTLHDqnLW5dlI2y84ok8txNtbDouy2GRl0JF26sw+1nJ9x1+4zFg3wMksZtYeUPbfXBDldRNra4aI9+wuZjXfoJ3/IrD2TqtDXXBJ4I2uxPxVs96iSWCvU1E5dbDnG/RjXSk9oi0e0LcpPLGeHeVt/gtrTS64JoUIQfdl4+CtVKGnbd+VWXVlyjp1TXeXclSwkhyV7f4NN7RXL6Sr41FN7lpGFoq7pV+Rvys24tNGvLj8anDLcSrsORGh5k0LqOsNYUAOXYVmwWJIxu9wpAldMViR2ivcY3dMRlhgYksWF1AELIGH2AD8gdxC6YyxA6nHzLBoU8KxXoU7RuywrIzzvg4dUnyQZQllvuT16l/KmV2LGHTWjG4rbxDbVzD4rfxjo4p+yM74VdAr6qDOlod7nNaB8upidJRXYvk7Z49NSErxQq2abBT+1Bremzjy9206Y3Ev27OZi/qN+503EV+mkcvfzSOvg6qOR02kSdKL62NPTPzGXoLvSwv2Rq6VXnaxnnOxF5O6uUqq+rIurGCnW9RmGM8rRvYFk/gcBbmhMLX0nCq8e6KcJcslJbp3N7X0FUpXSyjCnCzyaYZbmqG9p6ni01JfksWs8GNoNQqUuSWzNeMr7Mi4+fBSnO+yHr/Y26Un/scnu/+gDtvyK1pX7CW4RglkPawrdQpAQWyDlxsG6TF7MRgrJXtkO7ywqLbyhdcAAumG2FkFr/ACH/AP2AAp2xZ3Hxu0kgJO79yanDIdE80qQlCS5k098mpoNW5x5JfctmN1Wn8ejGccyUV+UZsJSjK6wd1szxrGS4V0sJXJE+hm6TVqpFRm7SWz7l1TZy3GzttLKm6iWCNSJIu/Qkzl8D4OxGhyGD279QBYHsIFawLWD/ABEKmVshtkHuPis4AFGm5MsQ01/uJKVPlj7kzaUfcL4iZd020VsMnNQiFysrlWpPmluZa3Wht23cHyL/AAFLBRB7mDxN3qm9LEW+yOd10uau7G3D7Iz9TdBC+pTfTJ0tBxSu9zC4dC9Rt9EbdO2O5fJ7Ix6alPMEKt6b+BtB/Tyh9bFFnHl7N50xeIP9NJdzl4252vc6fiH7VnMK3iHZwdVnyfTptArUIW7GlppJVEZmhS8CL77mhQ8tVdiL5pfTRK1dfU33LSIdSrtOxzztasAIiwDXMrMx9dpeSd0sPJsjKtONWPKxb1dhzdrNd0aej1V7Qm89GV9RppU6lmiNU5JYRrLKVjczvfoPjlX7lHTatOPhzw1sX4tW3C4lsdg5sgLMh6WNhaApPlv0Er/AEsJdBPAgV+thJ3fUV8YBfO4tmLnbFhvPvcddW9xWTWQAXY9SuR8l3d7Esaav7dxbB638qyyxDGBlOGcZY9vlRFuzkcXp7OjSv/4K/wDgravR2fiU1jqixp01p6bv/Bf8LF7pZumddtxyqJN4xgxvF9S/Q1bSSl/kmr6KNS8oWTKbozhK0ou5XymUL42NOFVSzGVyxTXM7XMim2vYt0q8l7ozsU0XFxeegl7kEa6la5LzxewtQH3EtxvMu4r5Jqj87f6CgJ36BRIFJ7E1OKi03kjRImK0aW4TVrWwNnLtsQcwydRtWFbacmhqVG8LYj6CBm4aMbEkUmsjBKXQCR6ifLSkc1qJOVVs2+IVVCny3yYdnOpGPVs6OGXtHJrWmnw+P0Oa27RqU0kr9WUqNPlhCCWFkv08InOxOMaGlfNRi73fUfW9J/BHpV9N9rslqr6T+Dkvs2jD4k7aWVtzmdqh0/Ev20jmEvqfk7uC+Kz5HS6B/poLqXoStZ5+EUNC2qMXtgt81kn02IyvksemxCzW5HVV4jNNUw733Jmrqxhe1RSsgew+a5ZNDWMw6hsAOwjRVqMa0bPfuZ06M6UnfKNYbKnGayOXQ7ZHKmS0tRKn1bRPW0tsxV17Fd0muhdyL4r1LVQksuz9yys2dzI5WSwqTjbPwL5bK4tO/XuJyWcFONeaWdySNdvdD2NVMsfgSeSN1G9kJOTI2ciVe4rjVdvLZLCAvkegjFyfsWIpDVHsOTUV7i80JE1HzMjlLmBJ33GrcqQnJ6dfRh/8UTWs7DKSapQv/wCKJOW/ydGd3anHqDF23C4xkrNA3Y5EKQy0qeYvJH4EovYuK49CtpqaTRJFsscsX0B4cd7C+RaCPuPiDlQ9JCtMl2HoagokHp2ww8wxbh6gDrvIr3GXaHpjMhBWQpewiN2uJtRTb6DnG1r7FPW1/Dg4p5HO9DbN1tbxazs8IZoaPiajn/jEjfNKVt2zX0enVKik93k6bfjjpl7VNFZJou2BiVsruGN727mF8ramlio0VL+Utx9b02ClHloxS7Cqq8Gc+fjJePTE4l+2kcz/ADfydPxJfpZJHOclpbnb+P0z5G/o/wBvB+xaTu2iro1ahBPsW0s3tuTn4ox6WdPO07MvRyjMj8l/T1LpJ7oyyn2oNRTv5kV7YNCSurdClUjyy9iRDEJh9xAZbi+BB65ABboNlRjLoSMWyAKs9LbYj/t5J7F62MiSvvsLR7U40/keoWLTiuwUkrYDWggUB8aZJZXyhyuljYPANjDI/C/APZhAjrgbAn07CsrX632GCvYKeRv+gruOFXOaeHO7dOUfKDjh9C1p6EaEErXbW7GSiqiw8rBtcpbdFJ4V0kOSE4NMSXQmmKHLoD5CkICg2EhwjNWR1hW6hsIEKweoJYWFkQEKTW6E0ujCBilgdYCwPvdDhAkPUBR6sZV1Cpx3VxyEZqq6pw3MOtVlVm2yxqKzrSsmNo6fnl7GuOOv2rO5b8QdFpm5eJJY6Gkkl8BhBQpKy2Fe7bSJuW6qTRLbckhGyTvnsMT6D4STCCtOlL6SDP7H8EdBNU0nkfPEGzkz9mmM8MbiN/7WXyc4/Uv0Oj4jK+lmzmOZcx2/j9I5HR6R3owL8YQ5MX5/9WMzh8r6WPyaFOdtuos/NTilU1G8ZQvfrfYdTk1K6I73/IU3e5Cq0oyTS6jKkFONupXpVbX6osRmpLBNhSq3LZ2aFbBYlBTW9mQOLi7NExWwEO6YA1YYKwA/8EIyEn5RBXYASV2LoIIgFg2YssIUAkOF0FkAVroVg7iHAVsEGprR01Fzk17EtSpGjByk0jn9dqZaqpi/KtkXjN0l3/0/PfoRadNwbfXJFFtKxLCfLjoVYUSSgpfJDKm4ssJp5Fa/QRqyHWJHTQ3laECSD1EkGxJgEWEIAQbAFcAI5DQ+4Ab3Yb2I5VIwyytU1Ld1HAeTWKuoVNblCpU8R5eBjcpvLbJaVCU3e1oo2wxndZ5U2nR5nfp2LsIqCSHRpqOEPSQsstljNDzJQWdgWSWBWTurASyTVQk8DqeJIba7sPjF8yQQVpUr8qxYNV2pNijsrbgrtOk1bJy5ec1zpka5X0s0cvKPLPJ1teDqUKkOrRy9aNp/OUd3B/TPka/CnfS2vszRWEZfB5JRnH3NWKbDOeaWPSRO4UrfILW7Ct3M1jF8rx17k1KfLm+GyBrO+RR5kmrWv/oE2NCMk8ilnoivCbSJlJMVglNlFpDd9yS9wNLcmqlME13dh2G+wLW9ydma/kaubm9h9sZCo5HoEtg2uhBAG3sFCsxWEDlsJYA2lh2GyqwgruX4DY0k6EFfUU6EctOS6Iq19bdtR2KFWUpu9ysZbRS1OpnXk847EKh1fUfGDb2LtHSXs5ZvsbxFqo24rIVK4yNuVKOw6wstbPHej41GtiaFVNZwVhyeexPg1oTd8EHNZj+a5NM6yEC4290IHABv1B+RaB10JyS3I2xjeR6Gz3VS6DJVpPZjAKEpSt07lakLZspX3AoSk0kizGjHN9r4+CWMUtlYe59DVQ0tPy5kWElYNg2F/wDRo35YcCzcOwgXW/uKytcX+hbP2AG7O5Yoxcppb5IUk0i1plab+A+Wis2u015bN3ZFqnaCV8kqwVdRLmnbsc/dXFad/m5zWtio12mup1Fu5hcV06VZzV8nVw5+dIzx2ZwmaWocfY6CmlbBzGln4VaMr2szpaE+aFzTPzdoniJWgKIZvCsH3M6o3lV7hFcSeCTJXTuiRNsZfGweblew9pSJtbh5rjE77ivf4HZCFvIk2gYvuC5HwX8jnNpB8RIY/dDW/cPie0vjxtkD1EexXe/sNYvie1j+5stiJ6l9EkRjXH2D4jZTrzk9yGTbeWSeG27Clp/b5KmMFyV9/kfT085q/QsQoR/JapqyWP8ABUqKipaaNPKVyysbIYmsj4NSdk72HbvsnL6SsqlNZLadzD0NflqcvRmtCVn3K5MdU8LuJluFZGJj0zNYj0xt7hQgN7oK2BZCTzsAHHToLlxuFIPyBG8qByIfe4rZC7M3kWMDlGz2CIASQUDZhXd9AgFb9g3Gp5wHpcCJIcBPIrZECtgXQOVsC2+4qD6cbtFyjGyK9Bcy2wXoKyIzy14OT7Ouoxu+hSlK8m+5YrztDl7lVERRPJS4jR56DfVF7oNlBShJPqrGs8XZVyeVI2+H1+ako3yjL1dHwa8lbFw6Sq6dRNbI6pZZtll4dLF80fYctnbcgoT5oKxMrkZ+BjRT7iTCtwe5morsPvcDysXv1EmnhAR18YDi2PyNewlYY0N22+4U8WGN9UOTwME78oFl9g/I5K6WMADGlfKBKmrq3UMnbO5YhyK3Pt7C2FVwhGUVlN7LuSOnhXRYqVKcotUlyyXW2wydRzs5O7e7DcJAqajK9tgS8rSfUklL+Ky0Rzjzxus2FYqFCErq3V/4JLNOw2l5opWyia1lnccJFNNvsvZj6MVG7xnf3C2uXCsOi7Qd1v0APOs059mjY0ldVoLPmRU4npuWfiwWHuVNNXdKWDssnJjtnP1unQpW6j0tivQqqpBNdSxE5cvDaHpZDsAKebEmK+R8VkCCgIXta4GsewbZBcAEUOBfIthGXUO4LizcDJY6hBYSWQIeg5PoN2dg9QByfUKAsC62Aht2HqOBkL89uhapw6snK6gnlJRjyxsTJ2V+g1EdadvKjDzlV9RFVnzSbQ0QTX4p2TyKwRFaDO4lp/Ep86WTDV4s6xxU4tPZnP6/TSo1W1szTjy+iynhZ4fqbeST+DXjLyYSb7nMUpcsk75RuaTUxqU1nzF5zcZzxVxPCfUPT5BF812PMtLNdr7CtbYd0uDN+gwCd+gRMCV9tgIs22EvcV1zWYgByz2HNYQ1Dlt/9AAtcKz0HJ9FsDCW6QGSVhK12mna4r4DG1wAcivdiUbNq1h2OUTeErj0QQSXPZpYuua+RPq31F0zuB+ZWW4aIU7roSU4c7TeyG04ZSLMIqKsiM8tKkcjOMakXFq90YWq00tPU/8Aa9mbmfLfcbXoRr03GS+Dowz+NTljKydJqnRmu3U3KVRTgnHZmDV08tPUs9uhPp9TKjLDx1ReeMy8wpdeK3U+g4r0a8a0bxdvYni7nPY02chy2AmSSirJpEmYxXEDf5ACgCFgAO4l7AEkAOxsJbsCD1AF8h2EFLqAJZHW/wBDb2WWSxhzZlsF8F2fSgpNNrBZWGRReMD+blVzC25VetHymoL3K0nd3FKTk8gb6GmOOk2ndRIasBL0R3sK2ACuAEi1GnjqKbi9+hLcKdnuFglczWoyo1XFpqw/T1ZU5pp2NrWaVaiF/wCS69zDqUpU5NSVmXjkLNtzS1o1I+5bsc7QrSpyWbGzp9XGrFJ4aHZtHmLas89QLfAk04gvi5GtCD13GydkFy3zsBWsBg9rvcarvYd37BbdkIyVthyG7vIrvd7DB6fVjlZ52wRptqw72/6IaK11fPccr9gJ2dkJu6z/AJAHdOwm7We4Oa2Xawr/APSpS0c2m1gUYq+ARTkSpJE5Z66Emz4xSHTkoxG3srkc5Xd2Z4z5eablelyR2xyu6td/JGvtQ5ZZ1WQBVoxrQs1+TLraaVJ3tg1k87jrRkrSV0Ey0LJWNSqypyTWGaVDWXVprHciraJJtwRAoSg7WHbMi1psQqKSusk/MnT3/wAGPSnKDwy1DU90RcKe1y4W8WsV1Xj33D48WtxfGl8kt8C6jPEi1h5CppuyYaOUnJ3HxzawxtN9BJtPDJ0e0vwEg8Z32Hc0n2Qa0O0vNZZGqTbwgJX3dx6wL5SH8dnQjm7JkyJf6HqRGrkrpInYDnd9yNvIOa5UwTafcKaI+ZXDzYVi9J2fcN+wzmFzD0Nnp4EmN5sC5haNJfAU7kdxyYtEc31INTpo6hXtaXcl5g3FYc8MGtp50ZWaFCpKLVmzbq0oVo2kvyZ1fRShmKuu5cy0LqpaGtknae3cvxqqSw73MK0oysSRrSWzaHbL2n4tlO12uo5O5n09Y0vMr2LENQpK9zOmsWxYXZsZGotrh5r7sAk/4DorAvFgUk3bsMHXsmJTjhPcCd0Naj9zWQk2Nprpq4U8ZI4u6HLmvvZE3wfYqNpbj1FPcC3HJE3P6h/E+KsPt1vYasAlL3F8bRspybdlsRtZugtjXnY2k1EOWoVqdampwmpRfVMmdjD/AKco+HpKk28zm8fBt7nRy8cwzuMqeLO54TKkn2HJ5GZuOuZ6WfcThGatJXG3HL3FrQRy0iy4sMYJQcZwbts4omXQsUKjpVIyW62FLRZtmWksPYKtK10adeMKtRycUm8si8CD9hXM9KnhrdNkijaJOtMr7k6pUvDazz/6Fu37GoppLceklsiXwl3CqaZF2qSIrD0iRQS6B2dxSHs1RfUda2RCuPRbG4rjbsFy5E09vILsaLNitFsXKzFzDeosj0m0/mFzDNhJ5HobS3YbjLqwU8bhobSXwFMj5gruKw0ieQr5GLKCTYezh3T2GXuOXyI0VTTU55tZ+xVnpJLZXRoJdA26E6ErJ8GSewVFmq4xe8Rr08HeyyGqe1GN7dSROVrXZZWnQnp37Bu/Y8IFKXRj4t9yXwX7DlRaQvlfoaiNXusjt1YlVK4VTta5H7U9SGxwh6zuOskk7A6sXxGxVgqVgWwB4jd7mkxK07mBfI3LfwLbJcibR/IL3E3bKA9iviW3/9k=';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.sColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABxAHIDASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAAIDAQQFBv/EADgQAAICAQMBBQYFAQgDAAAAAAECAAMREiExBBMiQVGRBRQyQmFxM1JTgZKhIzRDVFVicoKisfH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAb/xAAfEQEBAQADAAIDAQAAAAAAAAAAARECITESUQMiYUH/2gAMAwEAAhEDEQA/APm2c4gth2yYrKx8oyV5GdSj9586+y6P2hIwODzF2J4B+4j9mo5sEAtefjPpB0apamYdpgKNztLPX7NIJQPnwLKMSNYUswJwuOZXsel0tnqCBj8sM3G09N0Br13DcnYKsnfX0WtVpA351LKUpUaF12FfLbM5766Vsr7J2Z875GABCT1f3f2SoIbUWHkg5nC1dOo9mqlfPEuRUxPdfOd5i+76G0K+B+Yy9rMcxSv8i+kUIg+RfSXJrHyH1i5r/IfWNrWT6S01/pr6TVqqO7Vp6R9SAfB/WZ2m3wiNpZPpmin9Cv8AjCU7dcfhLCXaz8Z9MYbzVjadzNVZlvWDebjaaVIgQIQyY338DMYdwwTZj9jGVcjGeZBqAtSsU1ZsBwcDcmM+vpiqnes8MJWu0qdQ3B5HnDOoZBJKnIJlUqXQQg73iPOJdT2Z7andD8S+URLCSHVsESguqKkCc7Lgz0S46pdwBao3+s5HXBOeYalc/EBH0zDtKpMfWEbMJUdg6e9k1LUx+oEZem6kj8J/SYeqtBwtxAA2AM1et6j9dvWZZb7t1OPwX9IjUXoNTVMAPHEoOt6kj8dvWb751B+K1mXxBkXtzMupccTKrNJ0WfsZ0OgdTZXx8y+U5yofYiWHrqDDQUbBQznIPTtzqqPB8oiuUOh+PAy6MANLDKGPEOlmMFTseR5yN9RQ9tTuvzL5QdD0+4Oqo8fSVrsxuv8A9gQV9WHU4IlmHbrkbWDkecndRp/tqQcfMsVH1YZTuICFLM/A3pMetwuSpH7TtPtHqQMaxj7Tnv8AaHUWJh2BU+GIXa5TzCacZhNDrPR9EwD2WWhjzp4gOj9n/rXiSY9ScaemdxjGQJmOpPPSW5+0nadLDovZ/wDmL4j9OemGutzZUfE8iT7R0IFtDoD4sJ1VOVHmp5HnF1S1vjDoY7ILFNlf7r5SVlfYHtat6jyPKMlnDoZE8I6h1wZNHNbaH3U8GddlYsBesd4crOZlDLgiJVzXQjaQVIyh5Ei6npzqXvVH+kklhqbS/wAPgZ0I4BIYZRuRAZLcYZTsYHounv746k0seVAkLKmo79YL1HwHIk/eVH+G/wDGWfxMdB9mU/6if4yN3s+tAGHWdpg/DiTPUqd9D/xk2u1kAI3PiJf2TO1SBk7GEQucmErT0PfLUIVLCABsBGHW9Rx2zes47ejVyG1kHG+DI+6bbWN6zMxMeoLTaCt5LqfOczoelb81LcHykqrTWQlhyPBp1q4HdYakPIk8UqPjcbg8iTevsj2tO6H4l8otlbdMdS5ak8Hyla7NJyMEGEFb5w6NKtWLRrQYf5lkrKjXm6kZX5l8oqW5w6GTBN1BBBEkrGptLbr4HynoFReCyjFg5HnOOxckgiWVr10VXvWcoZX3+7/b/ETyjS4PdtYDyimq39ZpcjOPWPX3nfuY/wCInPd11tiFW04+04ewtA2uMwdM5KlrCfpLkJP40sMmEDW+o908wmjXUxOqZmDcxTObQYBgR4TUc1kK/wAPgZoXxJE1lBGDvGldVb4BBGpDyJC6o9K2tO9S3/jI1vZUwUgsp4+k6hZhDndTyDGYyau3YMpyD/WSuQI62UnGo7rF6dVFIYDknabaQLK/vCmbKnIOCPKRDlwWPOZWzYtIV7JADFJjNzEMrTVyWA8zO1akXfGSPGcKkhsidK2niZo1m7x28YSTWjWeOYTWOYPO8MRjWzWMoUg/WMarE2K/aRr5RPG00cQYFeZm+ODKbFKiO2A+hmsRoOJFS6nIHe8JNrOowR2MSJbHR0xHuwz+YzLN7qx4ZkgbqKgNIYc+UVbLLLASoULuN4w3t1vwQeZCs9w/eTfqbSSvZZPmDKVhjWNWNR8BGYRhEQyuh2JwpJHMnpO+Ya0CPnIiaWA4OD4xkU5G8CDY1H7wg/4jfcwm2HtWf3p4lnxmEJy4vLy9Zbx6TV8YQm6xxYfiMoeIQiHJN/gnO0ITPJ1/E52/E/7H/wBQr+X7QhI9DW5nM/4hhCb4sz1rfCk6en5hCTk1/hfGEISsP//Z';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.zColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,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';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.jColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,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';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.tColor[0]:
        var img = new Image();
        img.src = 'data:image/jpeg;base64,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';
        this.context.drawImage(img, x + 1, y + 1, this.squareSide, this.squareSide);
        break;

      default:
        this.context.beginPath();
        this.context.moveTo(x + 1, y + 1);
        this.context.lineTo(x + this.squareSide - 1, y + 1);
        this.context.lineTo(x + this.squareSide - 1, y + this.squareSide - 1);
        this.context.lineTo(x + 1, y + this.squareSide - 1);
        this.context.closePath();
        this.context.fillStyle = color;
        this.context.strokeStyle = border;
        this.context.stroke();
        this.context.fill();
        break;
    }
  }*/
  _drawSquare(x, y, color, border) {
    switch (color) {
      case this.oColor[0]:        
        this.context.drawImage(document.images[0], x + 1, y + 1, this.squareSide, this.squareSide);        
        break;
      case this.lColor[0]:
        this.context.drawImage(document.images[2], x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.iColor[0]:
        this.context.drawImage(document.images[6], x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.sColor[0]:        
        this.context.drawImage(document.images[5], x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.zColor[0]:       
        this.context.drawImage(document.images[3], x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.jColor[0]:      
        this.context.drawImage(document.images[1], x + 1, y + 1, this.squareSide, this.squareSide);
        break;
      case this.tColor[0]:  
        this.context.drawImage(document.images[4], x + 1, y + 1, this.squareSide, this.squareSide);
        break;

      default:
        this.context.beginPath();
        this.context.moveTo(x + 1, y + 1);
        this.context.lineTo(x + this.squareSide - 1, y + 1);
        this.context.lineTo(x + this.squareSide - 1, y + this.squareSide - 1);
        this.context.lineTo(x + 1, y + this.squareSide - 1);
        this.context.closePath();
        this.context.fillStyle = color;
        this.context.strokeStyle = border;
        this.context.stroke();
        this.context.fill();
        return;

    }
    this.context.beginPath();
    this.context.moveTo(x + 1, y + 1);
    this.context.lineTo(x + this.squareSide - 1, y + 1);
    this.context.lineTo(x + this.squareSide - 1, y + this.squareSide - 1);
    this.context.lineTo(x + 1, y + this.squareSide - 1);
    this.context.closePath();
    this.context.strokeStyle = border;
    this.context.stroke();
  }
  //-----------------------------------------------------------
  // 
  // sleep function
  // 
  //-----------------------------------------------------------

  _sleep() { return new Promise(requestAnimationFrame); }



  //-----------------------------------------------------------
  // 
  // observer pattern
  // 
  //-----------------------------------------------------------

  // add an event handler
  on(event, handler) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.push(handler);
    }
  }

  // remove an event handler
  off(event, handler) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index != -1) handlers.splice(index, 1);
    }
  }

  // fire events
  _dispatch(event, data) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }

}











