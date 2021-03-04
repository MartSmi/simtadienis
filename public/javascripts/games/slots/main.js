const alertImage = document.getElementById('alertImage');

const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];

var slotMachine = {
  stripHeight: 700,
  containerHeight: 141,
  alignmentOffset: -70,
  firstReelStopTime: 667,
  secondReelStopTime: 575,
  thirdReelStopTime: 568,
  reelSpeedDifference: 0,
  reelSpeed1Delta: 100,
  reelSpeed1Time: 0,
  reelSpeed2Delta: 100,
  positioningTime: 200,
  bounceHeight: 0,
  bounceTime: 1000,
  payoutStopTime: 200,
  numIconsPerReel: 7,
  spinning: false,
  spin: function () {
    if (slotMachine.spinning) {
      return;
    }
    alertImage.hidden = true;
    gameOutcome = 'lose'
    outcomeAmount = -5
    winningAnimation()

    slotMachine.spinning = true;
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
        window.setTimeout(function () {
          slotMachine.end_spin(symbols);
        }, a);
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
    let top = parseInt(
      (-(Math.random() * slotMachine.stripHeight * 2) /
        slotMachine.containerHeight) *
        100
    );
    d.css({
      top: top,

      // top: -(Math.random() * slotMachine.stripHeight * 2),
    });
    var e = top,
      f = function () {
        d.css({
          top: e + '%',
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
        top:
          ((f - slotMachine.stripHeight) / slotMachine.containerHeight) * 100 +
          '%',
      }).animate(
        {
          top:
            ((f + slotMachine.bounceHeight) / slotMachine.containerHeight) *
              100 +
            '%',
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
  end_spin: function (symbols) {
    if (calWinnings(symbols) > 0) {
      console.log('won');
      gameOutcome = 'win'
      outcomeAmount = calWinnings(symbols)
      winningAnimation()
      alertImage.src = '/images/games/slots/laimejai.png';
    } else {
      console.log('lost');
      alertImage.src = '/images/games/slots/pralaimejai.png';
    }
    alertImage.hidden = false;

    slotMachine.spinning = false;
  },
};
function calWinnings(symbols) {
  if (symbols[0] == symbols[1] && symbols[1] == symbols[2]) {
    if (symbols[0] == 6) {
      return 245;
    } else {
      return 95;
    }
  } else if (
    (symbols[0] == symbols[1] && symbols[2] == 6) ||
    (symbols[0] == symbols[2] && symbols[1] == 6) ||
    (symbols[1] == symbols[2] && symbols[0] == 6)
  ) {
    return 20;
  } else if (
    (symbols[0] == symbols[1] && symbols[0] == 6) ||
    (symbols[0] == symbols[2] && symbols[0] == 6) ||
    (symbols[1] == symbols[2] && symbols[1] == 6)
  ) {
    return 20;
  }
  return -5;
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

document.getElementById('Gira').addEventListener('click', slotMachine.spin);
