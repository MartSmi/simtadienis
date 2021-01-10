// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player = /*#__PURE__*/function () {
  function Player(game) {
    _classCallCheck(this, Player);

    var smallOfset = 5;
    this.sizeX = game.level.cellSizeX - smallOfset;
    this.sizeY = game.level.cellSizeY - smallOfset;
    this.radius = this.sizeX / 2;
    this.speed = 150;
    this.dir = 0;
    this.savedDir = 0;
    this.position = {
      x: game.gameWidth / 2,
      y: game.gameHeight / 2
    };
    this.img = document.getElementById("img_pacman");
    this.game = game;
  }

  _createClass(Player, [{
    key: "updateDir",
    value: function updateDir(newDir) {
      // this.dir = newDir;
      this.savedDir = newDir;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var posX = this.position.x - this.sizeX / 2;
      var posY = this.position.y - this.sizeY / 2;
      ctx.drawImage(this.img, posX, posY, this.sizeX, this.sizeY);
    }
  }, {
    key: "moveLeft",
    value: function moveLeft(deltaTime) {
      var newPosition = {
        x: this.position.x + this.speed * deltaTime,
        y: this.position.y
      };

      if (this.game.level.canMove(newPosition)) {
        this.position = newPosition;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "moveRight",
    value: function moveRight(deltaTime) {
      var newPosition = {
        x: this.position.x - this.speed * deltaTime,
        y: this.position.y
      };

      if (this.game.level.canMove(newPosition)) {
        this.position = newPosition;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "moveUp",
    value: function moveUp(deltaTime) {
      var newPosition = {
        x: this.position.x,
        y: this.position.y - this.speed * deltaTime
      };

      if (this.game.level.canMove(newPosition)) {
        this.position = newPosition;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "moveDown",
    value: function moveDown(deltaTime) {
      var newPosition = {
        x: this.position.x,
        y: this.position.y + this.speed * deltaTime
      };

      if (this.game.level.canMove(newPosition)) {
        this.position = newPosition;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "move",
    value: function move(direction, deltaTime) {
      switch (direction) {
        case 0:
          return this.moveUp(deltaTime);

        case 1:
          return this.moveRight(deltaTime);

        case 2:
          return this.moveDown(deltaTime);

        case 3:
          return this.moveLeft(deltaTime);

        default:
          console.log("unknown direction");
          return false;
      }
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      // console.log("pacman pos: " + this.position.x + ", " + this.position.y);
      var moved = this.move(this.savedDir, deltaTime);

      if (moved) {
        this.dir = this.savedDir;
      } else {
        this.move(this.dir, deltaTime);
      } // console.log("pacman pos: " + this.position.x + ", " + this.position.y);

    }
  }]);

  return Player;
}();

exports.default = Player;
},{}],"src/input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _player = _interopRequireDefault(require("./player"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputHandler = function InputHandler(player) {
  _classCallCheck(this, InputHandler);

  document.addEventListener('keydown', function (event) {
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
        console.log('pressed unknown key');
        break;
    }
  });
};

exports.default = InputHandler;
},{"./player":"src/player.js"}],"src/level.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Level = /*#__PURE__*/function () {
  function Level(game) {
    _classCallCheck(this, Level);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; // 0 - empty
    // 1 - wall
    // 2 - empty with dot

    this.grid = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 2, 1, 1, 1, 1, 1, 1, 1], [1, 1, 2, 0, 0, 1, 1, 1, 1, 1], [1, 2, 2, 1, 0, 1, 1, 1, 1, 1], [1, 1, 2, 1, 0, 0, 1, 1, 1, 1], [1, 1, 2, 1, 0, 0, 1, 1, 1, 1], [1, 1, 2, 1, 1, 0, 0, 2, 1, 1], [1, 0, 2, 0, 0, 0, 1, 1, 1, 1], [1, 0, 2, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
    this.levelHeight = this.grid.length;
    this.levelWidth = this.grid[0].length;
    this.cellSizeX = this.gameWidth / this.levelWidth;
    this.cellSizeY = this.gameHeight / this.levelHeight; // console.log("level width: " + this.levelWidth);
    // console.log("level height: " + this.levelHeight);

    this.imgWall = document.getElementById("img_wall");
    this.imgEmpty = document.getElementById("img_bg");
    this.game = game;
  }

  _createClass(Level, [{
    key: "draw",
    value: function draw(ctx) {
      for (var i = 0; i < this.levelHeight; i++) {
        for (var j = 0; j < this.levelWidth; j++) {
          var posX = this.cellSizeX * j;
          var posY = this.cellSizeY * i;

          if (this.grid[i][j] == 1) {
            // ctx.fillStyle = 'blue';
            // ctx.fillRect(this.cellSizeX * j, this.cellSizeY * i, this.cellSizeX, this.cellSizeY);
            // console.log("draw level: " + (cellSizeX * j) + ", " + (cellSizeY * i) + ", " + cellSizeX + ", " + cellSizeY);
            ctx.drawImage(this.imgWall, posX, posY, this.cellSizeX, this.cellSizeY);
          } else {
            ctx.drawImage(this.imgEmpty, posX, posY, this.cellSizeX, this.cellSizeY);
          }
        }
      }
    }
  }, {
    key: "getDotPositions",
    value: function getDotPositions() {
      var positions = [];

      for (var i = 0; i < this.levelHeight; i++) {
        for (var j = 0; j < this.levelWidth; j++) {
          if (this.grid[i][j] == 2) {
            var pos = {
              x: this.cellSizeX * j + this.cellSizeX / 2,
              y: this.cellSizeY * i + this.cellSizeY / 2
            };
            positions.push(pos);
          }
        }
      } // console.log("in getdotpos: " + positions);
      // for (var p of positions)
      //     console.log("  in p: " + p.x + " " + p.y);


      return positions;
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      return;
    }
  }, {
    key: "canMove",
    value: function canMove(position) {
      // needs optimisation
      var minX = position.x - this.game.player.sizeX / 2;
      var minY = position.y - this.game.player.sizeY / 2;
      var maxX = minX + this.game.player.sizeX;
      var maxY = minY + this.game.player.sizeY; // let eps = 0.002;

      for (var i = 0; i < this.levelHeight; i++) {
        for (var j = 0; j < this.levelWidth; j++) {
          if (this.grid[i][j] == 1) {
            var cellMinX = this.cellSizeX * j;
            var cellMinY = this.cellSizeY * i;
            var cellMaxX = cellMinX + this.cellSizeX;
            var cellMaxY = cellMinY + this.cellSizeY; // // console.log("cellmin: " + cellMinX + " with eps: " + (cellMinX+eps));
            // cellMinX += eps;
            // cellMinY += eps;
            // cellMaxX -= eps;
            // cellMaxY -= eps;
            // console.log("cellminX: " + cellMinX);
            // console.log("cellminY: " + cellMinY);
            // console.log("cellmaxX: " + cellMaxX);
            // console.log("cellmaxY: " + cellMaxY);

            var inX = cellMinX < minX && minX < cellMaxX || cellMinX < maxX && maxX < cellMaxX;
            var inY = cellMinY < minY && minY < cellMaxY || cellMinY < maxY && maxY < cellMaxY;

            if (inX && inY) {
              return false;
            }
          }
        }
      }

      return true;
    }
  }]);

  return Level;
}();

exports.default = Level;
},{}],"src/pickup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pickup = /*#__PURE__*/function () {
  function Pickup(game, position) {
    _classCallCheck(this, Pickup);

    this.game = game;
    this.position = position;
    this.radius = 10;
    this.position = position;
    this.picked = false;
    this.points = 10; // console.log(" got pos: " + position);

    this.img = document.getElementById("img_dot");
  }

  _createClass(Pickup, [{
    key: "draw",
    value: function draw(ctx) {
      if (this.picked) return;
      var posX = this.position.x - this.radius / 2;
      var posY = this.position.y - this.radius / 2;
      ctx.drawImage(this.img, posX, posY, this.radius, this.radius); // console.log("pickup: posx: " + posX + " posy: " + posY + " radius: " + this.radius);
    }
  }, {
    key: "pick",
    value: function pick() {
      this.picked = true;
      this.game.addScore(this.points);
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      if (this.picked) return;
      var dx = this.position.x - this.game.player.position.x;
      var dy = this.position.y - this.game.player.position.y;
      var sqDist = dx * dx + dy * dy;
      var sumRadius = this.radius + this.game.player.radius;
      var doPick = sqDist <= sumRadius * sumRadius;
      if (doPick) this.pick();
    }
  }]);

  return Pickup;
}();

exports.default = Pickup;
},{}],"src/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _player = _interopRequireDefault(require("./player"));

var _input = _interopRequireDefault(require("./input"));

var _level = _interopRequireDefault(require("./level"));

var _pickup = _interopRequireDefault(require("./pickup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game = /*#__PURE__*/function () {
  function Game(gameWidth, gameHeight) {
    _classCallCheck(this, Game);

    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.score = 0;
  }

  _createClass(Game, [{
    key: "createLevel",
    value: function createLevel() {
      this.level = new _level.default(this);
      this.player = new _player.default(this);
      this.dots = [];
      var dotPositions = this.level.getDotPositions(); // console.log("dotPositions: " + dotPositions);

      var _iterator = _createForOfIteratorHelper(dotPositions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pos = _step.value;
          // console.log("in dot: " + pos.x + "  " + pos.y);
          this.dots.push(new _pickup.default(this, pos));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.createLevel();
      new _input.default(this.player);
      this.gameObjects = [this.level].concat(_toConsumableArray(this.dots), [this.player]);
    }
  }, {
    key: "update",
    value: function update(deltaTime) {
      this.gameObjects.forEach(function (object) {
        return object.update(deltaTime);
      });
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.clearRect(0, 0, this.gameWidth, this.gameWidth);
      this.gameObjects.forEach(function (object) {
        return object.draw(ctx);
      });
    }
  }, {
    key: "addScore",
    value: function addScore(scoreToAdd) {
      this.score += scoreToAdd;
      console.log("Score: " + this.score);
    }
  }]);

  return Game;
}();

exports.default = Game;
},{"./player":"src/player.js","./input":"src/input.js","./level":"src/level.js","./pickup":"src/pickup.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _game = _interopRequireDefault(require("./game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext('2d');
var GAME_WIDTH = 500;
var GAME_HEIGHT = 500;
var game = new _game.default(GAME_WIDTH, GAME_HEIGHT);
game.start();
var lastTime = 0;

function gameLoop(timestamp) {
  var deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop(0);
},{"./game":"src/game.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64527" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map