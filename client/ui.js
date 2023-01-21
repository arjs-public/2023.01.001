//this is the controller sketch, it just takes input and sends it to the secondsketch.js

//make some empty data where we will store stuff before sending
const PERIODS = {
  'period-zero': ['-', ['gamereset']],
  'period-one': ['Pre', ['pregame', 'gamereset']],
  'period-two': ['1st', ['gamestart', 'gamereset']],
  'period-three': ['2nd', ['end1st', 'gamereset']],
  'period-four': ['HT', ['end2nd', 'gamereset']],
  'period-five': ['3rd', ['endbreak', 'gamereset']],
  'period-six': ['4th', ['end3rd', 'gameend']],
  'period-seven': ['OT', ['end4th', 'gamereset']],
  'period-eight': ['Final', ['end4th', 'overtime', 'gamereset']]
}
const EVENTS = {
  "INIT": {
    "event": "init",
    "clock": [0,0,0,0],
    "penalty": false
  },
  "PRE": {
    "event": "pregame",
    "clock": [1,5,0,0],
    "penalty": false
  },
  "1ST": {
    "event": "1st",
    "clock": [1,2,0,0],
    "penalty": false
  },
  "2ND": {
    "event": "2nd",
    "clock": [1,2,0,0],
    "penalty": false
  },
  "3RD": {
    "event": "3rd",
    "clock": [1,2,0,0],
    "penalty": false
  },
  "4TH": {
    "event": "4th",
    "clock": [1,2,0,0],
    "penalty": false
  },
  "OT": {
    "event": "ot",
    "clock": [1,2,0,0],
    "penalty": false
  },
  "HT": {
    "event": "ht",
    "clock": [1,5,0,0],
    "penalty": false
  },
  "FINAL": {
    "event": "final",
    "clock": [0,0,0,0],
    "penalty": false
  },
  "HTD": {
    "event": "HomeTD",
    "scoreH": 6,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "GTD": {
    "event": "GuestTD",
    "scoreG": 6,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "HPT": {
    "event": "HomePAT",
    "scoreH": 1,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "GPT": {
    "event": "GuestPAT",
    "scoreG": 1,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "HFG": {
    "event": "HomeFG",
    "scoreH": 3,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "GFG": {
    "event": "GuestFG",
    "scoreG": 3,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "HNG": {
    "event": "HomeNG",
    "scoreH": 0,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "GNG": {
    "event": "GuestNG",
    "scoreG": 0,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "HSY": {
    "event": "HomeSafety",
    "scoreH": 2,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "GSY": {
    "event": "GuestSafety",
    "scoreG": 2,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "H2P": {
    "event": "HomeTry",
    "scoreH": 2,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "G2P": {
    "event": "GuestTry",
    "scoreG": 2,
    "down": "",
    "on": "",
    "ball": "",
    "penalty": false
  },
  "Hto": {
    "event": "TimeoutHome",
    "to": 1,
    "penalty": false
  },
  "Gto": {
    "event": "TimeoutGuest",
    "to": 1,
    "penalty": false
  },
  "noside": {
    "event": "NoSide",
    "on": '',
    "penalty": false
  },
  "hside": {
    "event": "SideHome",
    "on": '<',
    "penalty": false
  },
  "gside": {
    "event": "SideGuest",
    "on": '>',
    "penalty": false
  },
  "flag": {
    "count": 30,
    "event": "FLAG",
    "penalty": true
  },
  "active": {
    "event": "",
    "penalty": false
  },
  "referee": {
    "count": 60,
    "event": "REFEREE",
    "penalty": false
  },
  "BOSet": {
    "event": "BallOnSet",
    "penalty": false
  },
  "TSet": {
    "event": "TimeSet",
    "clock": '',
    "count": 0,
    "penalty": false
  },
  "SSet": {
    "event": "ScoreSet",
    "hscore": '1',
    "gscore": '1',
    "penalty": false
  },
  "DClear": {
    "event": "DownClear",
    "penalty": false
  },
  "DReset": {
    "event": "DownReset",
    "penalty": false
  },
  "DSet": {
    "event": "DownSet",
    "penalty": false
  },
  "DTGSet": {
    "event": "DownToGoSet",
    "penalty": false
  },
  "none": {
    "event": "NoneBall",
    "count": 0,
    "penalty": false
  },
  "home": {
    "event": "HomeBall",
    "count": 0,
    "penalty": false
  },
  "guest": {
    "event": "GuestBall",
    "count": 0,
    "penalty": false
  },
  "TimerReset": {
    "event": "TimerReset",
    "count": 0,
    "penalty": false
  }
}
const EVENTMAP = {
  'PREGAME': 'PRE',
  'GAMESTART': '1ST',
  'END1ST': '2ND',
  'END2ND': 'HT',
  'ENDBREAK': '3RD',
  'END3RD': '4TH',
  'END4TH': 'FINAL',
  'OVERTIME': 'OT',
  'GAMEEND': 'FINAL',
  'GAMERESET': 'INIT'
}
const DOWNMAP = {
  'In': 'IN',
  'Gl': 'GL',
  'p1': '+1',
  'm1': '-1',
  'p5': '+5',
  'm5': '-5',
  'pA': '+10',
  'mA': '-10',
}
const ALLOWED_QTRS = ['1st', '2nd', '3rd', '4th', 'ot']
const ALLOWED_TIME = ['pregame', '1st', '2nd', 'halftime', '3rd', '4th', 'ot']
const RESET_TIMEOUT = ['1st', '3rd', 'ot']
const KEEP_TIMEOUT = ['2nd', '4th']
const SCORE_RESET = ['init', 'pregame']
const SCORE_BTNS = ['HTD', 'HSY', 'H2P', 'HPT', 'HFG', 'HNG', 'GTD', 'GSY', 'G2P', 'GPT', 'GFG', 'GNG']
const LED_BTNS = ['flag', 'active', 'referee']
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const URL = 'http://localhost:8888/game'
const game = {
  "event": "",
  "home": "muc",
  "guest": "tz2",
  "scoreH": 0,
  "scoreG": 0,
  "state": "-",
  "toH": 3,
  "toG": 3,
  "period": "-",
  "down": "",
  "on": "",
  "secs": 0,
  "clock": "",
  "count": 0,
  "play": 40,
  "ball": "",
  "penalty": false,
  "flag": "FLAG",
  "visible": false
}
let packedData = {...game}
let yard = ''
let yardMarker = '-'
let oldYardMarker = '-'
let timerNew = null
let timerMax = [0,0,0,0]
let timer = [0,0,0,0]
let gameClock = null
let minutes = '00'
let seconds = '00'
let hscore = ''
let gscore = ''
let score = ''
let down = ''
let togo = ''
let ball = ''
let buttonInterval = null
let countDownButton = () => {
  if (--buttonCount > 0) return buttonCount
  clearInterval(buttonInterval)
  buttonCount = 0
  buttonInterval = null
  packedData.event = ''
  httpPost(URL, packedData, doSuccess, doError)
}
let buttonTimerInterval = null
let countDownTimer = (counter_, button_) => {
  counter_.innerText = (buttonTimerCount > 0) ? buttonTimerCount : ''
  if (buttonTimerCount == 1) {
    packedData.event = 'CLEAR' + button_.id.toUpperCase()
    httpPost(URL, packedData, doSuccess, doError)
    return --buttonTimerCount
  }
  if (--buttonTimerCount >= 0) return buttonTimerCount
  clearInterval(buttonTimerInterval)
  if (button_) {
    button_.ariaChecked = "false"
    _led = button_.firstElementChild
    if (_led) _led.className = "circleGrey"  
  }
  buttonTimerCount = 0
  buttonTimerInterval = null
  packedData.event = ''
  packedData.count = 0
  packedData.penalty = false
  httpPost(URL, packedData, doSuccess, doError)
}
let resetEvent = (count_) => {
  print('count', count_)
  if (--count_ > 0) return setTimeout(resetEvent, 1000, count_)
  packedData.count = 0
  packedData.event = ''
  httpPost(URL, packedData, doSuccess, doError)
}

function doSuccess(result_) {
  //console.log('ok', result_)
}

function doError(error_) {
  console.log('fail', error_)
}

function initPanel() {
  packedData = { ...game }

  reset()

  _segs = [['scoreH', 2], ['scoreG', 2]]
  _segs.forEach(_info => {
    for (var _i = 1; _i <= _info[1]; _i++) {
      _seg = select(`#${_info[0]}${_i}`)
      _seg.elt.defaultValue = 0
    }
  })
}

function reset() {
  print('reset', fsm.state)

  resetLEDs(fsm.state)  
  resetClock(fsm.state)
  resetScore(fsm.state)
  resetBallSelect(fsm.state)
  resetTimeouts(fsm.state)
  resetScoreButtons(fsm.state)
  resetSetBallOn(fsm.state)
  resetSetTime(fsm.state)
  resetSetScore(fsm.state)
  resetSetDown(fsm.state)
}

function resetSetDown(state_) {
  let _block = select('#block-down')
  let _downs = ['1st', '2nd', '3rd', '4th', 'down']
  if (ALLOWED_QTRS.includes(state_)) {
    _block.elt.className = 'container'
    _downs.forEach(_down => {
      _down = select(`#option-${_down}`)
      _down.elt.checked = false
    })
    let _label = select('#label-down')
    _label.elt.innerHTML = 'DOWN'
    let _option = select('#option-down')
    _option.elt.checked = true
    _option.elt.disabled = false
  } else {
    _block.elt.className = 'container hidden'
  }
}

function resetSetScore(state_) {
  let _block = select('#block-score')
  let _score = select('#option-score')
  if (ALLOWED_QTRS.includes(state_)) {
    _block.elt.className = 'container'
    _score.elt.checked = true
  } else {
    _block.elt.className = 'container hidden'
  }
}

function resetSetTime(state_) {
  let _block = select('#block-time')
  if (ALLOWED_QTRS.includes(state_)) {
    _block.elt.className = 'container'
  } else {
    _block.elt.className = 'container hidden'
  }
}

function resetSetBallOn(state_) {
  let _block = select('#block-ballonside')
  let _ballon = select('#option-noside')
  let _label = select('#label-noside')
  if (ALLOWED_QTRS.includes(state_)) {
    _block.elt.className = 'container'
    _ballon.elt.checked = true
    _label.elt.innerHTML = 'BALL ON'
    yard = '0'
    yardMarker = '-'
    oldYardMarker = '-'  
  } else {
    _block.elt.className = 'container hidden'
  }
}

function resetScoreButtons(state_) {
  SCORE_BTNS.forEach(_name => {
    let _btn = select(`#${_name}`)
    _btn.elt.className = 'rect shape ' + ((_name.startsWith('H')) ? 'blue' : 'red')
    if (!ALLOWED_QTRS.includes(state_)) _btn.elt.className += ' disabled'
  })
}

function resetTimeouts(state_) {
  _tos = ['Hto1', 'Hto2', 'Hto3', 'Gto1', 'Gto2', 'Gto3']
  if (RESET_TIMEOUT.includes(state_)) {
    _tos.forEach(_name => {
      _to = select(`#${_name}`)
      _to.elt.checked = true
      _to.elt.disabled = false
    })
  } else if (KEEP_TIMEOUT.includes(state_)) {
    /* keep */
  } else {
    _tos.forEach(_name => {
      _to = select(`#${_name}`)
      _to.elt.checked = false
      _to.elt.disabled = true
    })
  }
}

function resetLEDs(state_) {
  let _leds = ['flag', 'referee', 'active']
  _leds.forEach(_name => {
    let _obj = select(`#${_name}`)
    _obj.elt.className = 'rect shape green'
    if (!ALLOWED_QTRS.includes(state_)) {
      _obj.elt.className += ' disabled'
    }
    _obj.elt.ariaChecked = "false"
    _led = _obj.elt.firstElementChild
    _led.className = "circleGrey"
    let _counter = _obj.elt.childNodes[3]
    if (_counter) _counter.innerText = ''
  })
}

function resetClock(state_) {
  if (gameClock) {
    clearInterval(gameClock)
    gameClock = null
  }

  let _label = select('#label-clock')
  _label.elt.innerText = 'START'

  let _clock = select('#clock')
  let _active = select('#active')
  _clock.elt.className = 'rect shape green'
  _active.elt.className = 'rect shape green'
  if (!ALLOWED_TIME.includes(state_)) {
    _clock.elt.className += ' disabled'
    _active.elt.className += ' disabled'

    setClockDigits([0, 0, 0, 0])
  }
}

function resetScore(state_) {
  if (SCORE_RESET.includes(state_)) {
    setScore([0, 0, 0, 0], true)
    setScore([0, 0, 0, 0], false)
  }
}

function resetBallSelect(state_) {
  let _ball = select('#option-none')
  let _ballHome = select('#option-home')
  let _ballGuest = select('#option-guest')
  packedData.ball = ball = ''
  if (ALLOWED_QTRS.includes(state_)) {
    _ball.elt.checked = true
    _ball.elt.disabled = false
    _ballHome.elt.disabled = false
    _ballGuest.elt.disabled = false
  } else {
    _ball.elt.checked = false
    _ball.elt.disabled = true
    _ballHome.elt.disabled = true
    _ballGuest.elt.disabled = true
  }
}

function calcSecs() {
  _tmpMin = timer[0] * 10 + timer[1]
  _tmpSec = timer[2] * 10 + timer[3]
  _secs = _tmpMin * 60 + _tmpSec
  return _secs
}

function calcClock() {
  packedData.secs = _secs = calcSecs()
  if (_secs == 0) return true

  packedData.clock = convertClock(_secs - 1)

  timer = []
  _temp = (packedData.clock.replace(':', '')).split('')
  _temp.forEach(_n => { timer.push(int(_n)) })

  return ((_tmpMin == '00') && (_tmpSec == '00'))
}

function convertClock(secs_) {
  _tmpMin = floor(secs_ / 60)
  _tmpMin = ((_tmpMin < 10) ? '0' : '') + str(_tmpMin)
  _tmpSec = secs_ % 60
  _tmpSec = ((_tmpSec < 10) ? '0' : '') + str(_tmpSec)
  return _tmpMin + ':' + _tmpSec
}

function setClockDigits(digits_) {
  for (var _i = 1; _i <= 4; _i++) {
    _seg = select(`#timeN${_i}`)
    _seg.elt.defaultValue = digits_[_i-1]
  }
}

function setScore(digits_, home_) {
  if (home_) {
    _seg = select('#scoreH1')
    _seg.elt.defaultValue = digits_[0]
    _seg = select('#scoreH2')
    _seg.elt.defaultValue = digits_[1]
    hscore = (str(digits_[0]) == '0') ? '' : str(digits_[0])
    hscore += str(digits_[1])
  } else {
    _seg = select('#scoreG1')
    _seg.elt.defaultValue = digits_[0]
    _seg = select('#scoreG2')
    _seg.elt.defaultValue = digits_[1]
    gscore = (str(digits_[0]) == '0') ? '' : str(digits_[0])
    gscore += str(digits_[1])
  }
}

function getId(event_) {
  try {
    let _obj = event_.srcElement
    return _obj.id ? _obj.id : event_.srcElement.innerText
  } catch (error) {
    return event_.srcElement.innerText
  }
}

function changeStatusOf(elements_, prefix_, status_, color_='') {
  elements_.forEach(_item => {
    let _key = select(`#${prefix_}${_item}`)
    if (!_key) return
    _key.elt.className = 'numkey shape'
    _key.elt.className += (status_) ? ' enabled ' + color_ : ' disabled'
  })
}

var lastState = null
var fsm = new StateMachine({
  init: 'init',
  transitions: [
    { name: 'pregame',   from: 'init',     to: 'pregame' },
    { name: 'gamestart', from: 'pregame',  to: '1st' },
    { name: 'gamereset', from: 'pregame',  to: 'init' },
    { name: 'end1st',    from: '1st',      to: '2nd' },
    { name: 'gamereset', from: '1st',      to: 'init' },
    { name: 'end2nd',    from: '2nd',      to: 'halftime' },
    { name: 'gamereset', from: '2nd',      to: 'init' },
    { name: 'endbreak',  from: 'halftime', to: '3rd' },
    { name: 'gamereset', from: 'halftime', to: 'init' },
    { name: 'end3rd',    from: '3rd',      to: '4th' },
    { name: 'gamereset', from: '3rd',      to: 'init' },
    { name: 'end4th',    from: '4th',      to: 'final' },
    { name: 'overtime',  from: '4th',      to: 'ot' },
    { name: 'gamereset', from: '4th',      to: 'init' },
    { name: 'gameend',   from: 'ot',       to: 'final' },
    { name: 'gamereset', from: 'ot',       to: 'init' },
    { name: 'gamereset', from: 'final',    to: 'init' },
  ],
  methods: {
    onPregame: stateChangeEvent,
    onGamestart: stateChangeEvent,
    onEnd1st: stateChangeEvent,
    onEnd2nd: stateChangeEvent,
    onEndbreak: stateChangeEvent,
    onEnd3rd: stateChangeEvent,
    onEnd4th: stateChangeEvent,
    onOvertime: stateChangeEvent,
    onGameend: stateChangeEvent,
    onGamereset: stateChangeEvent
  }
});

function setup() {
  createCanvas(windowWidth,windowHeight)

  httpPost(URL, packedData, setupUI, doError)
}

function setupUI() {
  noCanvas()
  setupPeriods()
  setupBallSelect()
  setupButtons()
  setupTimeouts()
  setupBallOn()
  setupTimer()
  setupScore()
  setupDown()
  setupClock()
}

/* Setup and Handling periods */
function stateChangeEvent(param_) {
  print(param_)
  timerMax = timer = EVENTS[EVENTMAP[param_.transition.toUpperCase()]].clock
  if (lastState == fsm.state) return
  lastState = fsm.state
  if (fsm.state == 'init') {
    initPanel()
  } else if (fsm.state == 'pregame') {
    reset()
    setClockDigits(EVENTS.PRE.clock)
  } else if (fsm.state == '1st') {
    reset()
    setClockDigits(EVENTS["1ST"].clock)
    print(EVENTS["1ST"].clock)
  } else if (fsm.state == '2nd') {
    reset()
    setClockDigits(EVENTS["2ND"].clock)
    packedData.event = 'EndOfQtr1'
    packedData.count = 15
    packedData.flag = "END"
  } else if (fsm.state == 'halftime') {
    reset()
    setClockDigits(EVENTS.HT)
    packedData.event = 'EndOfQtr2'
    packedData.count = 5
    packedData.flag = "END"
  } else if (fsm.state == '3rd') {
    reset()
    setClockDigits(EVENTS["3RD"].clock)
    packedData.event = 'EndOfQtrH'
    packedData.count = 15
    packedData.flag = "END"
  } else if (fsm.state == '4th') {
    reset()
    setClockDigits(EVENTS["4TH"].clock)
    packedData.event = 'EndOfQtr3'
    packedData.count = 15
    packedData.flag = "END"
  } else if (fsm.state == 'overtime') {
    reset()
    setClockDigits(EVENTS.OT.clock)
    packedData.event = 'EndOfQtr4'
    packedData.count = 15
    packedData.flag = "END"
  } else if (fsm.state == 'final') {
    reset()
    setClockDigits(EVENTS.FINAL.clock)
    packedData.event = 'EndOfGame'
    packedData.count = 1500
    packedData.flag = "END"
  }
  print('state', fsm.state, timer)
  packedData.secs = calcSecs(timer)
  packedData.clock = convertClock(packedData.secs)
  packedData.state = fsm.state
  packedData.period = param_.to
  packedData.visible = false
  httpPost(URL, packedData, doSuccess, doError)
}

function periodsEvent(event_, id_) {
  _period = PERIODS[id_][0]
  _state = PERIODS[id_][1]
  if (Array.isArray(_state)) {
    if (fsm.state == '4th') {
      _state = null
      if (_period == 'OT') {
        _state = 'overtime'
      } else if (_period == 'Final') {
        _state = 'end4th'
      }
    } else if (fsm.state == 'ot') {
      _state = (_period == 'Final') ? 'gameend' : null
    } else {
      _state = _state[0]
      // _leds = ['flag', 'active', 'referee']
      // _leds.forEach(_name => {
      //   _obj = select(`#${_name}`)
      //   _obj.elt.ariaChecked = "false"
      //   _led = _obj.elt.firstElementChild
      //   _led.className = "circleGrey"
      //   _counter = _obj.elt.childNodes[3]
      //   if (_counter) _counter.innerText = ''
      // })
    }
  }
  if (!_state) return
  if (fsm.can(_state)) {
    //print('pe', _state, fsm.state, _period, timer)
    fsm[_state](event_, _state)
  } else {
    return event_.preventDefault()
  }
}

function setupPeriods() {
  let _obj = select('#periods')
  let _childs = new p5.Element(_obj.child()[1]).elt.childNodes
  if (!_childs) doError('setupPeriods')
  _childs.forEach(_element => {
    if (_element.nodeName != 'INPUT') return
    _tmp = new p5.Element(_element)
    _tmp.mouseClicked(
      (event_) => {
        try {
          print(event_.target.id)
          _id = event_.target.id
        } catch (error) {
          _id = event_.toElement.labels[0]['htmlFor']
        }
        if (_id) periodsEvent(event_, _id)
      }
    )
  })
}

/* Setup and Handling ball select */
function ballSelectEvent(event_, data_, ball_) {
  if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
  packedData.event = data_.event
  packedData.count = data_.count
  packedData.ball = ball_
  httpPost(URL, packedData, doSuccess, doError)
  buttonCount = 0
  buttonInterval = setInterval(countDownButton, 1000)
}

function setupBallSelect() {
  let _obj = select('#balls')
  let _childs = new p5.Element(_obj.child()[1]).elt.childNodes
  if (!_childs) doError('setupBallSelect')
  _childs.forEach(element => {
    if (element.nodeName != 'INPUT') return 
    _tmp = new p5.Element(element)
    _tmp.mouseClicked(
      (event_) => {
        _id = getId(event_)
        _id = ball = _id.replace('option-', '')
        if (_id) ballSelectEvent(event_, EVENTS[_id], ball)
      }
    )
  })
}

/* Setup and Handling special buttons */
function buttonEvent(id_, data_) {
  print('be', id_, data_)
  packedData.event = data_.event
  packedData.down = data_.down
  packedData.count = ('count' in data_) ? 0 : 5
  packedData.flag = ""
  packedData.penalty = data_.penalty
  if (data_.event.startsWith('H')) {
    packedData.flag = "SCORE"
    packedData.scoreH += data_.scoreH
    if (packedData.scoreH < 10) {
      setScore([0, packedData.scoreH], true)
    } else {
      setScore([floor(packedData.scoreH / 10), packedData.scoreH % 10], true)
    }
  } else if (data_.event.startsWith('G')) {
    packedData.flag = "SCORE"
    packedData.scoreG += data_.scoreG
    if (packedData.scoreG < 10) {
      setScore([0, packedData.scoreG], false)
    } else {
      setScore([floor(packedData.scoreG / 10), packedData.scoreG % 10], false)
    }
  }
  httpPost(URL, packedData, doSuccess, doError)
  if (!LED_BTNS.includes(id_)) {
    resetBallSelect(packedData.period)
    setGameClockButton(false)
    buttonCount = 5
    buttonInterval = setInterval(countDownButton, 1000)
  }
}

function setupButton(name_, active_=null) {
  _btn = select('#'+name_)
  _btn.mouseClicked(
    (event_) => {
      if (!ALLOWED_TIME.includes(fsm.state)) return event_.preventDefault()
      try {
        _obj = (event_.srcElement.nodeName == 'DIV') ? event_.srcElement : event_.path[1]
        _id = _obj.id
        print('id', name_, _id)
        if ((_id != 'active') && (!ALLOWED_QTRS.includes(fsm.state))) return event_.preventDefault()
        if (LED_BTNS.includes(name_)) {
          _checked = _obj.ariaChecked
          _checked = (_checked === "true") ? "false" : "true"
          _obj.ariaChecked = _checked
          if (active_) {
            _led = _obj.firstElementChild
            _led.className = (_checked === "true") ? active_ : "circleGrey"
            if (_id != 'active') {
              _counter = _obj.childNodes[3]
              _counter.innerText = (_checked === "true") ? EVENTS[_id].count : ""
              buttonTimerCount = (_checked === "true") ? EVENTS[_id].count : 1
              if (buttonTimerInterval) clearInterval(buttonTimerInterval)
              buttonTimerInterval = setInterval(countDownTimer, 1000, _counter, _obj)
              if (_id == 'referee') setGameClockButton(false)
            } else if (_id == 'active') {
              packedData.visible = (_checked === "true")
            }
          }
        }
      } catch (error) {
        _id = event_.toElement.labels[0]['htmlFor']
      }
      //print('id', _id, _id in EVENTS)
      if (_id in EVENTS) buttonEvent(_id, EVENTS[_id])
    }
  )
}

function setupButtons() {
  SCORE_BTNS.forEach(_btn => {
    setupButton(_btn)  
  })
  setupButton('flag', "circleYellow")
  setupButton('active', "circleRed")
  setupButton('referee', "circleWhite")
}

/* Setup and Handling clock button */
function clockEvent() {
  let _done = calcClock()
  setClockDigits(timer)
  packedData.penalty = false
  httpPost(URL, packedData, doSuccess, doError)  
  if (_done) resetClock(fsm.state)
}

function isGameClockActive() {
  return select('#label-clock').elt.innerText == 'START'
}

function setGameClockButton(active_) {
  let _clock = select('#clock')
  let _label = select('#label-clock')
  if (active_) {
    _label.elt.innerText = 'STOP'
    _clock.elt.className = 'rect shape pink'
    gameClock = setInterval(clockEvent, 1000)
    clockEvent()
  } else {
    _label.elt.innerText = 'START'
    _clock.elt.className = 'rect shape green'
    if (gameClock) {
      clearInterval(gameClock)
      gameClock = null  
    }
  }
}

function setupClock() {
  print('setupClock')
  let _clock = select('#clock')
  _clock.mouseClicked(
    (event_) => {
      if (!ALLOWED_TIME.includes(fsm.state)) return event_.preventDefault()
      setGameClockButton(isGameClockActive())
    }
  )
}

/* Setup and Handling special buttons for timeouts */
function timeoutEvent(event_, obj_, data_) {
  if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
  packedData.event = (obj_.value == "false") ? data_.event : 'redraw'
  packedData.penalty = data_.penalty
  if (obj_.id.startsWith('H')) {
    packedData.toH += (obj_.value == "false") ? -data_.to : data_.to
    packedData.toH = (packedData.toH < 0) ? 0 : packedData.toH
    packedData.toH = (packedData.toH > 3) ? 3 : packedData.toH
  } else if (obj_.id.startsWith('G')) {
    packedData.toG += (obj_.value == "false") ? -data_.to : data_.to
    packedData.toG = (packedData.toG < 0) ? 0 : packedData.toG
    packedData.toG = (packedData.toG > 3) ? 3 : packedData.toG
  }
  httpPost(URL, packedData, doSuccess, doError)
  setGameClockButton(false)
  buttonCount = 5
  buttonInterval = setInterval(countDownButton, 1000)
}

function setupTimeout(name_, count_=0) {
  _btn = select('#'+name_)
  _btn.mouseClicked(
    (event_) => {
      try {
        _obj = (event_.srcElement.nodeName == 'INPUT') ? event_.srcElement : event_.path[1]
        _id = _obj.id
        _checked = (_obj.value === "true") ? "false" : "true"
        _obj.value = _checked
      } catch (error) {
        _id = event_.toElement.labels[0]['htmlFor']
      }
      _event = _id.substring(0, 3)
      if (_event in EVENTS) timeoutEvent(event_, _obj, EVENTS[_event])
    }
  )
}

function setupTimeouts() {
  setupTimeout('Hto1')
  setupTimeout('Hto2')
  setupTimeout('Hto3')
  setupTimeout('Gto1')
  setupTimeout('Gto2')
  setupTimeout('Gto3')
}

/* Setup and Handling timer buttons */
function timerEvent(data_, label_, timer_, set_, ballon_) {
  //packedData.on = ballon_.elt.innerText
  packedData.clock = label_.elt.innerText
  packedData.event = data_.event
  packedData.penalty = data_.penalty
  setClockDigits(timer)
  httpPost(URL, packedData, doSuccess, doError)
  timerNew = null
  label_.elt.innerText = 'TIME'
  label_.elt.className = 'green'
  timer_.elt.checked = true
  set_.elt.className = 'numkey shape disabled'
  setTimeout(resetEvent, 1000, 0)
}

function setupTimer() {
  let _allowed = ['pregame', '1st', '2nd', 'ht', '3rd', '4th', 'ot']
  let _tks = select('#TimerKeys')
  let _set = select('#TKSet')
  let _label = select('#label-time')
  let _timer = select('#option-time')
  let _ballon = select('#option-ballonside')
  let _childs = _tks.elt.childNodes
  _childs.forEach(_child => {
    if (_child.nodeName == '#text') return
    let _dom = select(`#${_child.id}`)
    _dom.mouseClicked(
      (event_) => {
        if (!_allowed.includes(fsm.state)) {
          _set.elt.className = 'numkey shape lightgrey'
          return event_.preventDefault()
        }
        let _id = getId(event_)
        let _event = _id.replace('TK', '')
        let _state = fsm.state.toUpperCase()
        _state = (_state in EVENTMAP) ? EVENTMAP[_state]: _state
        if (_event == 'R') {
          timer = timerMax
          _text = timer.join('')
          _text = _text.substring(0, 2) + ':' + _text.substring(2)
          _label.elt.innerText = _text
          timerEvent(EVENTS['TimerReset'], _label, _timer, _set, _ballon)
        } else if (_event == 'Set') {
          if (_label.elt.className == 'red') return event_.preventDefault()
          timer = (!timerNew) ? [...timerMax] : [...timerNew]
          timerEvent(EVENTS['TSet'], _label, _timer, _set, _ballon)
        } else {
          if ((!_state in EVENTS) || (fsm.state == 'init')) return event_.preventDefault()
          let _maxMin = EVENTS[_state].clock[0] * 10 + EVENTS[_state].clock[1]
          let _maxSec = EVENTS[_state].clock[2] * 10 + EVENTS[_state].clock[3]
          let _timePeriod = _maxMin*60 + _maxSec
          let _temp = (!timerNew) ? [...timerMax] : [...timerNew]
          _temp.shift()
          _temp.push(int(_event))
          _tmpMin = _temp[0] * 10 + _temp[1]
          _tmpSec = _temp[2] * 10 + _temp[3]
          let _tempPeriod = _tmpMin*60 + _tmpSec
          if ((_tempPeriod > _timePeriod) || (int(_tmpSec)>=60)) {
            _label.elt.className = 'red'
            _timer.elt.checked = false
            _set.elt.className = 'numkey shape red'
          } else {
            _label.elt.className = 'yellow'
            _timer.elt.checked = false
            _set.elt.className = 'numkey shape yellow'
          }
          _label.elt.innerText = '' + _temp[0] + _temp[1] + ':' + _temp[2] + _temp[3]
          timerNew = [..._temp]
        }
      }
    )
  })
}

/* Setup and Handling special buttons for ball on */
function ballOnEvent(event_, data_) {
  _allowed = ['1st', '2nd', '3rd', '4th', 'ot']
  if (!_allowed.includes(fsm.state)) return event_.preventDefault()
  print('boe', data_)
  _side = ''
  oldYardMarker = yardMarker
  yardMarker = data_.on
  let _ballon = select('#option-ballon')
  let _label = select('#label-ballon')
  _label.elt.className = 'yellow'
  let _key = select('#BOK20')
  _key.elt.className = 'numkey shape white'
  _key = select('#BOK25')
  _key.elt.className = 'numkey shape white'
  _key = select('#BOK35')
  _key.elt.className = 'numkey shape white'
  _key = select('#BOK40')
  _key.elt.className = 'numkey shape white'
  if (data_.event == 'NoSide') {
    yard = '0'
    yardMarker = '-'
    _label.elt.innerHTML = 'BALL ON'
    _ballon.elt.checked = true
  }
  packedData.event = data_.event
  packedData.penalty = data_.penalty
  packedData.on = _side
  print('yard', yard)
  print('side', _side)
  if (yard != '0') {
    packedData.on = (data_.on != '') ? data_.on : (yardMarker == '-') ? '' : yardMarker
    print('bon', packedData.on)
  }
  httpPost(URL, packedData, doSuccess, doError)
}

function setupBallOn() {
  let _bos = ['hside', 'noside', 'gside']
  _bos.forEach(_name => {
    let _bo = select('#option-'+_name)
    _bo.mouseClicked(
      (event_) => {
        try {
          _obj = (event_.srcElement.nodeName == 'INPUT') ? event_.srcElement : event_.path[1]
          _id = _obj.id
          _checked = (_obj.value === "true") ? "false" : "true"
          _obj.value = _checked
        } catch (error) {
          _id = event_.toElement.labels[0]['htmlFor']
        }
        _event = _id.replace('option-', '')
        if (_event in EVENTS) ballOnEvent(event_, EVENTS[_event])
      }
    )
  })
  let _boks = select('#BallOnKeys')
  let _childs = _boks.elt.childNodes
  _childs.forEach(_child => {
    if (_child.nodeName == '#text') return
    let _dom = select(`#${_child.id}`)
    _dom.mouseClicked(
      (event_) => {
        if ((!ALLOWED_QTRS.includes(fsm.state)) || (yardMarker == '-')) return event_.preventDefault()
        let _id = getId(event_)
        let _event = _id.replace('BOK', '')
        let _label = select('#label-noside')
        let _set = select('#BOKSet')
        let _data = EVENTS['BOSet']
        if (_event == 'C') {
          yard = '0'
          yardMarker = '-'
          oldYardMarker = '-'
          _label.elt.innerHTML = 'BALL ON'
          _label.elt.className = 'white'
          _ballonside = select('#option-noside')
          _ballonside.elt.checked = true
          let _key = select('#BOK20')
          _key.elt.className = 'numkey shape lightgrey'
          _key = select('#BOK25')
          _key.elt.className = 'numkey shape lightgrey'
          _key = select('#BOK35')
          _key.elt.className = 'numkey shape lightgrey'
          _key = select('#BOK40')
          _key.elt.className = 'numkey shape lightgrey'
          _key = select('#BOKSet')
          _key.elt.className = 'numkey shape lightgrey'
        
          packedData.event = _data.event
          packedData.penalty = _data.penalty
          packedData.on = ''
          httpPost(URL, packedData, doSuccess, doError)
        } else if (_event == 'Set') {
          if (_label.elt.innerText == 'BALL ON') return event_.preventDefault()
          _label.elt.className = 'white'
          _set.elt.className = 'numkey shape white'
          let _key = select('#BOKSet')
          _key.elt.className = 'numkey shape lightgrey'

          packedData.event = _data.event
          packedData.penalty = _data.penalty
          packedData.on = (yardMarker == '<') ? yardMarker + ' ' + _label.elt.innerText : _label.elt.innerText + ' ' + yardMarker
          httpPost(URL, packedData, doSuccess, doError)
        } else if (['20', '25', '35', '40'].includes(_event)) {
          yard = _event
          _label.elt.className = 'yellow'
          _label.elt.innerHTML = _event
          packedData.event = _data.event
          packedData.penalty = _data.penalty
          packedData.on = (yardMarker == '<') ? yardMarker + ' ' + _event : _event + ' ' + yardMarker
          httpPost(URL, packedData, doSuccess, doError)
          print('sbon', packedData.on)
          _label.elt.className = 'white'
          _set.elt.className = 'numkey shape white'
        } else {
          _label.elt.className = 'yellow'
          _set.elt.className = 'numkey shape yellow'
          if (yard == 'IN') yard = '0'
          if (int(yard + _event) > 50) {
            yard = _event
          } else {
            yard += _event
          }
          yard = str(int(yard.slice(-2)))
          if (yard == '0') yard = 'IN'
          _label.elt.innerHTML = yard
        }
      }
    )
  })
}

/* Setup and Handling special buttons for score */
function scoreEvent(label_, score_, data_, Post_='') {
  label_.elt.innerText = 'SCORE'
  score_.elt.checked = true
  changeStatusOf(['Set'], 'SK', false)
  changeStatusOf(NUMBERS, 'SK', false)
  packedData.event = data_.event
  packedData.event += Post_
  packedData.penalty = data_.penalty
  packedData.count = 0
  packedData.scoreH = hscore
  packedData.scoreG = gscore
  httpPost(URL, packedData, doSuccess, doError)
  setTimeout(resetEvent, 1000, 1)
}

function setupScore() {
  let _scores = ['hscore', 'score', 'gscore']
  _scores.forEach(_name => {
    let _score = select('#option-'+_name)
    _score.mouseClicked(
      (event_) => {
        if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
        let _obj = select('#label-score')
        _obj.elt.className = 'yellow'
        changeStatusOf(['Set'], 'SK', true, 'white')
        changeStatusOf(NUMBERS, 'SK', true, 'green')
      }
    )
  })
  let _sks = select('#ScoreKeys')
  let _childs = _sks.elt.childNodes
  _childs.forEach(_child => {
    if (_child.nodeName == '#text') return
    let _dom = select(`#${_child.id}`)
    _dom.mouseClicked(
      (event_) => {
        if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
        let _id = getId(event_)
        let _event = _id.replace('SK', '')
        let _label = select('#label-score')
        let _score = select('#option-score')
        let _data = EVENTS['SSet']
        if (_event == 'C') {
          scoreEvent(_label, _score, _data)
          score = ''
        } else if (_event == 'Set') {
          if (_label.elt.innerText == 'SCORE') return event_.preventDefault()
          let _side = select('#option-hscore').elt.checked
          if (score < 10) {
            setScore([0, score], _side)
          } else {
            setScore([floor(score / 10), score % 10], _side)
          }
          scoreEvent(_label, _score, _data, (_side) ? 'Home' : 'Guest')
          score = ''
        } else {
          _label.elt.className = 'yellow'
          if (_score.elt.checked) return event_.preventDefault()
          _label.elt.className = 'yellow'
          changeStatusOf(['Set'], 'SK', true, 'yellow')
          score += _event
          score = str(int(score.slice(-2)))
          _label.elt.innerHTML = score
        }
      }
    )
  })
}

/* Setup and Handling special buttons for downs */
function downEvent(name_, down_, togo_) {
  let _data = EVENTS[name_]
  packedData.event = _data.event
  packedData.penalty = _data.penalty
  packedData.down = down_
  packedData.togo = togo_
  httpPost(URL, packedData, doSuccess, doError)
  if ((togo != '') && (!down_.endsWith('Down'))) {
    select('#label-down').elt.className = 'white'
    select('#DKSet').elt.className = 'numkey shape white'  
  }
}

function setupDown() {
  let _instant = ['In', 'Gl', 'p1', 'm1', 'p5', 'm5', 'pA', 'mA']
  let _label = select('#label-down')
  let _extraKeys = ['IN', 'GL', '+1', '-1', '+5', '-5', '+10', '-10']
  let _modifiers = ['+1', '-1', '+5', '-5', '+10', '-10']
  let _specials = ['IN', 'GL']
  let _downs = ['1st', '2nd', '3rd', '4th', 'down']
  _downs.forEach(_name => {
    let _down = select('#option-'+_name)
    _down.mouseClicked(
      (event_) => {
        if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
        if (_name == 'down') return event_.preventDefault()
        let _text = _label.elt.innerText
        togo = (((down != '') || (_text == 'DOWN')) && (_name == '1st')) ? '10' : togo
        _label.elt.innerText = str(togo)
        _label.elt.className = 'yellow'
        if (togo == 'DOWN') {
          _label.elt.className = 'red'
          changeStatusOf(['Set'], 'DK', true, 'red')
        } else {
          changeStatusOf(_instant, 'DK', true, 'white')
          changeStatusOf(NUMBERS, 'DK', true, 'green')
          changeStatusOf(['Set'], 'DK', true, 'yellow')
        }
        down = _name
        downEvent('DSet', _name + ' Down', '')
      }
    )
  })
  let _sks = select('#DownKeys')
  let _childs = _sks.elt.childNodes
  _childs.forEach(_child => {
    if (_child.nodeName == '#text') return
    let _dom = select(`#${_child.id}`)
    _dom.mouseClicked(event_ => {
      if (!ALLOWED_QTRS.includes(fsm.state)) return event_.preventDefault()
      let _id = getId(event_)
      //let _set = select('#DKSet')
      let _down = select('#option-down')
      let _event = _id.replace('DK', '')
      _event = (_instant.includes(_event)) ? DOWNMAP[_event] : _event
      if (!_event) return event_.preventDefault()
      if (_event == 'C') {
        down = ''
        togo = ''
        _down.elt.checked = true
        _label.elt.innerText = 'DOWN'
        changeStatusOf(['Set'], 'DK', false)
        changeStatusOf(_instant, 'DK', false)
        changeStatusOf(NUMBERS, 'DK', false)
        downEvent('DClear', '', '')
      } else if (_event == 'Set') {
        if (_label.elt.innerText == 'DOWN') {
          _label.elt.className = 'red'
          changeStatusOf(['Set'], 'DK', true, 'red')
          return event_.preventDefault()
        }
        downEvent('DTGSet', down, togo)
        resetEvent(3)
      } else if (_extraKeys.includes(_event)) {
        if (!ALLOWED_QTRS.includes(fsm.state)) {
          _label.elt.innerText = 'DOWN'
          _label.elt.className = 'red'
          changeStatusOf(['Set'], 'DK', true, 'red')
          return event_.preventDefault()
        }
        _text = _label.elt.innerText
        _modifier = _modifiers.includes(_event)
        togo = ((_text == 'GL') || (_text == 'IN')) ? '' : togo 
        togo = ((_event == 'GL') || (_event == 'IN')) ? '' : togo 
        if (((_text == 'GL') || (_text == 'IN')) && (_modifier)) return event_.preventDefault()
        let _togo = (_text == 'DOWN') ? abs(_event) : int((!togo) ? 0 : togo) + int(_event)
        _togo = (_specials.includes(_event)) ? _event.toUpperCase() : _togo
        if (_modifier) {
          togo = str(_togo)
        } else {
          togo += _togo
        }
        togo = (_specials.includes(_event)) ? togo : str(int(togo.slice(-2)))
        if (togo < 0) {
          _1st = select('#option-1st')
          _1st.elt.checked = true
          _label.elt.innerHTML = '10'
          changeStatusOf(['Set'], 'DK', true, 'blue')
        } else if (togo == 0) {
          togo = 'IN'
          _label.elt.innerHTML = 'IN'
        } else {
          _label.elt.innerHTML = togo
        }
        downEvent('DTGSet', down, togo)
        resetEvent(3)
      } else {
        if (_down.elt.checked) return event_.preventDefault()
        togo += _event
        togo = str(int(togo.slice(-2)))
        _label.elt.className = 'yellow'
        changeStatusOf(['Set'], 'DK', true, 'yellow')
        _label.elt.innerHTML = togo
      }
    })
  })
}
