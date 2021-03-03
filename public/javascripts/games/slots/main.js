const costImage = document.querySelector('[data-cost-image]');
const loseImage = document.querySelector('[data-lose-image]');
const winImage = document.querySelector('[data-win-image]');
const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];

// document.getElementById('Gira').addEventListener('click', doSlot);

let spinInProgress = false;
// const spin = [
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
//   new Audio('res/sounds/spin.mp3'),
// ];
// const coin = [
// new Audio('res/sounds/coin.mp3'),
//   new Audio('res/sounds/coin.mp3'),
//   new Audio('res/sounds/coin.mp3'),
// ];
// const win = new Audio('res/sounds/win.mp3');
// const lose = new Audio('res/sounds/lose.mp3');
var audio = false;
var info = true;

async function doSlot() {
  if (spinInProgress) {
    return;
  }
  spinInProgress = true; //TODO: set to false somewhere
  const symbols = await spinRequest();
  costImage.src = '/images/games/slots/transparent.svg';

  // symbols.forEach((symbol, i) => {
  //   reels[i].className = 'symbol' + (symbol + 1);
  // });
  const winnings = calWinnings(symbols);
  if (winnings > 0) {
    console.log('won');
    costImage.src = '/images/games/slots/laimejai.png';
  } else {
    console.log('lost');
    costImage.src = '/images/games/slots/pralaimejai.png';
  }
  spinInProgress = false;
  return;

  slot1 = setInterval(spin1, 50);
  slot2 = setInterval(spin2, 50);
  slot3 = setInterval(spin3, 50);
  function spin1() {
    i1++;
    if (i1 >= symbols[0]) {
      //coin[0].play()
      clearInterval(slot1);
      return null;
    }
    reels[0].className = 'symbol' + (symbols[0] + 1);

    // slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
  function spin2() {
    i2++;
    if (i2 >= symbols[1]) {
      //coin[1].play()
      clearInterval(slot2);
      return null;
    }
    if (slotTile.className == 'a7') {
      slotTile.className = 'a0';
    }
    reels[2].className = 'symbol' + (symbols[0] + 1);
    slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
  function spin3() {
    i3++;
    if (i3 >= symbols[2]) {
      //coin[2].play()
      clearInterval(slot3);
      testWin();
      return null;
    }
    if (reels[0].className == 'symbol7') {
      reels[0].className = 'symbol0';
    }
    sound++;
    if (sound == spin.length) {
      sound = 0;
    }
    //spin[sound].play();
    reels[0].className = 'symbol0';
    slotTile.className = 'a' + (parseInt(slotTile.className.substring(1)) + 1);
  }
}

function calWinnings(symbols) {
  if (symbols[0] == symbols[1] && symbols[1] == symbols[2]) {
    if (symbols[0] == 6) {
      return 250;
    } else {
      return 100;
    }
  } else if (
    (symbols[0] == symbols[1] && symbols[2] == 6) ||
    (symbols[0] == symbols[2] && symbols[1] == 6) ||
    (symbols[1] == symbols[2] && symbols[0] == 6)
  ) {
    return 25;
  } else if (
    (symbols[0] == symbols[1] && symbols[0] == 6) ||
    (symbols[0] == symbols[2] && symbols[0] == 6) ||
    (symbols[1] == symbols[2] && symbols[1] == 6)
  ) {
    return 25;
  }
  return -5;
}

function testWin(slots) {
  var slot1 = document.getElementById('slot1').className;
  var slot2 = document.getElementById('slot2').className;
  var slot3 = document.getElementById('slot3').className;

  if (
    ((slot1 == slot2 && slot2 == slot3) ||
      (slot1 == slot2 && slot3 == 'a7') ||
      (slot1 == slot3 && slot2 == 'a7') ||
      (slot2 == slot3 && slot1 == 'a7') ||
      (slot1 == slot2 && slot1 == 'a7') ||
      (slot1 == slot3 && slot1 == 'a7') ||
      (slot2 == slot3 && slot2 == 'a7')) &&
    !(slot1 == slot2 && slot2 == slot3 && slot1 == 'a7')
  ) {
    costImage.src = '/images/games/slots/laimejai.png';
    //win.play();
  } else {
    costImage.src = '/images/games/slots/pralaimejai.png';
    //lose.play();
  }
}

function spinRequest() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/games/slots/spin', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).slots);
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };
    xhr.send(null);
  }).catch(e => console.error(e));
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

$('#Gira').click(function () {
  slotMachine.spin();
});

var slotMachine = {
  stripHeight: 700,
  alignmentOffset: 86,
  firstReelStopTime: 667,
  secondReelStopTime: 575,
  thirdReelStopTime: 568,
  reelSpeedDifference: 0,
  reelSpeed1Delta: 100,
  reelSpeed1Time: 0,
  reelSpeed2Delta: 100,
  positioningTime: 200,
  bounceHeight: 50,
  bounceTime: 1000,
  numIconsPerReel: 7,
  spin: function () {
    spinRequest().then(symbols => {
      window.setTimeout(function () {
        var a = 0;
        window.setTimeout(function () {
          slotMachine._stop_reel_spin(1, symbols[0]);
        }, a);
        a += slotMachine.secondReelStopTime;
        window.setTimeout(function () {
          slotMachine._stop_reel_spin(2, symbols[1]);
        }, a);
        a += slotMachine.thirdReelStopTime;
        window.setTimeout(function () {
          slotMachine._stop_reel_spin(3, symbols[2]);
        }, a);
        a += slotMachine.payoutStopTime;
        // window.setTimeout(function () {
        //   slotMachine.end_spin(d);
        // }, a);
      }, slotMachine.firstReelStopTime);
    });

    // var a = parseInt($('#credits').html(), 10);

    // if ($('#spinButton').hasClass('disabled')) return !1;
    // slotMachine.show_won_state(!1),
    // $('#spinButton').addClass('disabled'),
    // $('#credits').html(a - slotMachine.curBet),
    slotMachine._start_reel_spin(1, 0),
      slotMachine._start_reel_spin(2, slotMachine.secondReelStopTime),
      slotMachine._start_reel_spin(
        3,
        slotMachine.secondReelStopTime + slotMachine.thirdReelStopTime
      );
    // try {
    //   slotMachine.sounds.spinning.play();
    // } catch (a) {}
  },

  _start_reel_spin: function (a, b) {
    var c = Date.now(),
      d = $('#reel' + a);
    d.css({
      top: -(Math.random() * slotMachine.stripHeight * 2),
    });
    var e = parseInt(d.css('top'), 10),
      f = function () {
        d.css({
          top: e,
        }),
          (e +=
            Date.now() < c + slotMachine.reelSpeed1Time + b
              ? slotMachine.reelSpeed1Delta
              : slotMachine.reelSpeed2Delta),
          (e += a * slotMachine.reelSpeedDifference),
          e > 0 && (e = 2 * -slotMachine.stripHeight);
      },
      g = window.setInterval(f, 20);
    d.data('spinTimer', g);
  },
  _stop_reel_spin: function (a, b) {
    var c = $('#reel' + a),
      d = c.data('spinTimer');
    if ((window.clearInterval(d), c.data('spinTimer', null), null != b)) {
      var e = slotMachine.stripHeight / slotMachine.numIconsPerReel,
        f =
          -slotMachine.stripHeight - (b - 1) * e + slotMachine.alignmentOffset;
      c.css({
        top: f - slotMachine.stripHeight,
      }).animate(
        {
          top: f + slotMachine.bounceHeight,
        },
        slotMachine.positioningTime,
        'linear'
        // function () {
        //   c.animate(
        //     {
        //       top: f,
        //     },
        //     slotMachine.bounceTime,
        //     'easeOutBounce'
        //   );
        // }
      );
    }
  },
  // end_spin: function (a) {
  //   null != a.prize
  //     ? (slotMachine.show_won_state(!0, a.prize.id, a.prize.winType),
  //       slotMachine._increment_payout_counter(a))
  //     : slotMachine._end_spin_after_payout(a);
  // },
};
