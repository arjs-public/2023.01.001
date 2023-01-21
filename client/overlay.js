// this is the display sketch it will not work without opening the controller sketch!

///// constants
const Y_AXIS = 1
const X_AXIS = 2
const URL = 'http://localhost:8888/game'
const CLOCK_QTRS = ['1st', '2nd', '3rd', '4th', 'ot']
const CLEAR_FLAGS = ['SCORE', 'END']

/// variables
let game = null
let parts = {}
let teams = {}
let config = null
let images = {}
let offsets = {}
let partDraw = {}
let elements = {}
let settings = null
let interval = null
let imageCount = 0
let lastEffect = null
let eventRenderer = {}
let stateRenderer = {}

/// structs
let state = {
  'last': '',
  'flag': '',
  'event': '',
  'state': '',
  'clock': '',
  'count': 0,
  'pause': false,
  'effect': '',
  'visible': false
}

let receive = () => {
  //print('running', state.count, state.pause)
  if (--state.count < 0) {
    if (CLEAR_FLAGS.includes(state.flag)) {
      clearCanvas('receive')
      print('state', state.state, state.last, state.last.ball)
      state.last.ball = ''
      _finished = stateRenderer[state.state](state.last)
    }
    state.last = ''
    state.flag = ''
    state.count = 0
    state.pause = false
  }
  if (state.pause) return
  httpGet(URL, 'json', doHandleEvent, doError)
}

//////// default funcs
function preload() {
  game = loadJSON(URL, doOk, doError)
  parts = loadJSON('config/parts.json', doOk, doError)
  teams = loadJSON('config/teams.json', doOk, doError)
  elements = loadJSON('config/elements.json', doOk, doError)
  settings = loadJSON('config/general.json', doSetup, doError)
}

function setup() {
  noLoop()
  createCanvas(windowWidth,windowHeight)

  colorMode(RGB, 255)
  clearCanvas('setup')
  textAlign(CENTER);
  textSize(50);

  // setupEmpty()
  setupScoreboard()
  setupSignal()

  interval = setInterval(receive, 1000)

  print('setup done...', game)
  //receive()
}

//////// callback funcs
function doSetup(info_) {
  config = settings.general
  images = config.images
  offsets = config.bannerOffsets
  imageCount = 2 + Object.keys(images).length
  for (var _i in images) {
    images[_i] = loadImage('assets/'+images[_i], doLoaded, doError)
  }
  images.home = loadImage('assets/'+teams[game.home].logo, doLoaded, doError)
  images.guest = loadImage('assets/'+teams[game.guest].logo, doLoaded, doError)
}

function doLoaded(info_) {
  imageCount--
  if (imageCount > 0) return
  images.dark = images['dark']
  images.light = images['light']
  images.td = images['touchdown']
  images.fg = images['fieldgoal']
  images.ng = images['nogood']
  images.pat = images['pat']
  images.try = images['try']
  images.safety = images['safety']
  images.timeout = images['timeout']
  images.eoq = images['eoq']
  images.halftime = images['halftime']
  images.final = images['final']
  print('loaded images:', Object.keys(images).length)
}

function doOk(e_) {
  //print('Ok', e_)
}

function doError(error_) {
  print('Fail', error_)
}

function doHandleEvent(e_) {
  print('State:', e_.clock, ':', e_.state, ':', state.state, ':', e_.visible, ':', state.visible)
  if (e_.event) print('Event:', e_.clock, ':', e_.event, ':', state.event, ':', e_.visible, ':', state.visible)
  let _finished = false
  if (state.visible != game.visible) {
    state.effect = (game.visible) ? 'in' : 'out'
    //print('effect', state.effect)
  }
  if ((e_.event in eventRenderer) && (state.event != e_.event)) {
    print('Render event 1', e_.event, e_)
    state.flag = e_.flag
    state.pause = true
    state.count = e_.count
    _finished = eventRenderer[e_.event](e_)
    if (CLEAR_FLAGS.includes(e_.flag)) state.last = e_
  } else if (((e_.state in stateRenderer) && (state.state != e_.state)) || e_.visible != state.visible) {
    if (e_.visible) {
      print('Render state 2', e_.state, e_)
      _finished = stateRenderer[e_.state](e_)  
    } else {
      clearCanvas('render state')
      _finished = true
    }
  } else if ((e_.event in eventRenderer) && (state.event != e_.event)) {
    print('Render event 3', e_.event, e_)
    state.flag = e_.flag
    state.pause = true
    state.count = e_.count
    _finished = eventRenderer[e_.event](e_)
    if (CLEAR_FLAGS.includes(e_.flag)) state.last = e_
  } else if (e_.visible && (state.clock != e_.clock)) {
    print('Render event 4', e_.event, e_)
    state.pause = false
    _finished = eventRenderer['clock'](e_)
//  } else {
      //print('Rendering skipped', state.event)
  }
  if (_finished) {
    //print('Finished')
    state.clock = e_.clock
    state.event = e_.event
    state.state = e_.state
    state.visible = e_.visible
  }
}

//////// setup funcs
function setupScoreboard() {
  print('setupScoreboard')
  _element = elements['scoreboard']
  _h = _w = 0
  _element.items.forEach((_item) => {
    parts[_item].x = _w
    if (parts[_item].usew) _w += parts[_item].width
    parts[_item].y = _h
    if (parts[_item].useh) _h += parts[_item].height
  })
  _element.width = _w
  _element.x = _x = round((width - _element.width) / 2)
  _element.y = _y = round((height - _element.height) - 25)
  if (_element.graphic == null) _element.graphic = createGraphics(_element.width, _element.height)
}

function setupSignal() {
  print('setupSignal')
  _signals = ['flag', 'referee']
  _signals.forEach((_signal) => {
    _element = elements[_signal]
    _x = 1000
    _h = _w = 0
    _items = ['clock', 'down', 'on']
    _items.forEach((_item) => {
      if (parts[_item].usew) {
        _x = min(_x, parts[_item].x)
        _w += parts[_item].width
      }
    })
    parts[_signal].x = _x
    parts[_signal].y = _h
    _element.width = parts[_signal].width = _w
    _element.x = _x + 40
    _element.y = _y = round((height - _element.height) - 40)
    if (_element.graphic == null) _element.graphic = createGraphics(_element.width, _element.height)  
  })
}

//////// utility funcs
function calculateDimensions(image_) {
  let _dims = {}
  _dims.ww2 = windowWidth / 2
  _dims.wh2 = windowHeight / 2
  _dims.ww4 = windowWidth / 4
  _dims.wh4 = windowHeight / 4
  _dims.iw = images.pregame.width
  _dims.ih = images.pregame.height
  _dims.iw2 = images.pregame.width / 2
  _dims.ih2 = images.pregame.height / 2
  _dims.l1w = _dims.l1h = 250
  _dims.l1w2 = _dims.l1h2 = 125
  _dims.l1w4 = _dims.l1h4 = 62.5
  if (images.home.width != 250) {
    images.home.resize(_dims.l1w, _dims.l1h)
  }
  _dims.l2w = _dims.l2h = 250
  _dims.l2w2 = _dims.l2h2 = 125
  _dims.l2w4 = _dims.l2h4 = 62.5
  if (images.guest.width != 250) {
    images.guest.resize(_dims.l2w, _dims.l2h)
  }
  if (images.eoq.width == 1298) {
    _iw = images.eoq.width
    _ih = images.eoq.height
    images.eoq.resize(_iw / 2, _ih / 2)
  }
  if (images.halftime.width == 1367) {
    _iw = images.halftime.width
    _ih = images.halftime.height
    images.halftime.resize(_iw / 2, _ih / 2)
  }
  if (images.final.width == 1688) {
    _iw = images.final.width
    _ih = images.final.height
    images.final.resize(_iw / 2, _ih / 2)
  }
  return _dims
}

function setGradient(g, x, y, w, h, c1, c2, axis) {
  push()
  noFill()

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1)
      let c = lerpColor(c1, c2, inter)
      g.stroke(c)
      g.line(x, i, x + w, i)
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1)
      let c = lerpColor(c1, c2, inter)
      g.stroke(c)
      g.line(i, y, i, y + h)
    }
  }
  pop()
}

//////// drawing funcs
function clearCanvas(from_='') {
  print('clear', from_)
  clear()
  background(config.chromaKey)
}

function drawClock(time_, dims_) {
  //print('drawClock')
  push()
  stroke('white')
  strokeWeight(5)
  textStyle(BOLD)
  textSize(50)
  fill('#0066FF')
  rect(dims_.ww2 - (textWidth('15:00') / 2) - 10, dims_.wh4 * 3, 150, 70, 10)
  fill('black')
  stroke('white')
  text(time_, dims_.ww2 + 1, dims_.wh4 * 3 + 52)
  pop()
}

function drawLogoLeague(element_, part_, data_) {
  _part = parts[part_]
  _x = _part.x
  _y = _part.y
  _h = _part.height
  _w = _part.width - 2
  if (_part.pc) {
    element_.graphic.fill(_part.pc)
    element_.graphic.noStroke()
    element_.graphic.rect(_x,_y,_w,_h,10)  
  }
  element_.graphic.image(images.league, _x, _y, _w, _h)
}
partDraw['logo'] = drawLogoLeague

function drawTeam(element_, part_, data_) {
  _part = parts[part_]
  _x = _part.x
  _y = _part.y
  _w = _part.width
  _h = _part.height
  if (_part.pc) {
    element_.graphic.fill(_part.pc)
    setGradient(element_.graphic, _x, _y, _w, _h, color(_part.pc), color(_part.sc), X_AXIS)
  }
  element_.graphic.textAlign(CENTER, CENTER)
  element_.graphic.textStyle(BOLDITALIC)
  element_.graphic.textSize(_part.ts)
  element_.graphic.stroke(_part.sc)
  element_.graphic.strokeWeight(3)
  element_.graphic.text(teams[data_[part_]].short, _x + 115, _y + 2 + parts[part_].height/2)

  element_.graphic.image(images[part_], _x-5, -10, 70, 70)
  
  _index = 'to'+part_[0].toUpperCase()
  element_.graphic.noStroke()
  element_.graphic.fill(element_.bg)
  element_.graphic.rect(_x, element_.height-element_.timeoutH, parts[part_].width, element_.timeoutH)
  element_.graphic.fill(_element.fg)
  for (var _i = 0; _i < data_[_index]; _i++) {
    element_.graphic.rect(_x+6+_i*65, 54, 58, 7)
  }

  if (data_.ball == part_) {
    element_.graphic.image(images[_part.ball], _x+170, 15, 20, 20)  
  } else if (data_.ball == part_) {
    element_.graphic.image(images[_part.ball], _x+170, 15, 20, 20)  
  }
}
partDraw['home'] = drawTeam
partDraw['guest'] = drawTeam

function drawText(element_, part_, data_) {
  _part = parts[part_]
  _x = _part.x
  _y = _part.y
  _w = _part.width
  _h = _part.height
  if (_part.pc) {
    element_.graphic.fill(_part.pc)
    element_.graphic.noStroke()
    element_.graphic.rect(_x,_y,_w,_h,0)
  } else {
    element_.graphic.image(_part.bg,_x,_y)
  }
  element_.graphic.textAlign(CENTER, CENTER)
  element_.graphic.textStyle(BOLD)
  element_.graphic.textSize(_part.ts)
  if (_part.sc) element_.graphic.fill(_part.sc)
  _text = ((part_ == 'down') && data_['togo']) ? data_[part_] + ' & ' + data_['togo'] : data_[part_]
  _text = (_text == 'ot') ? _text.toUpperCase() : _text
  element_.graphic.text(_text, _x + _part.offset, _y + 2 + parts[part_].height/2)
}
partDraw['scoreH'] = drawText
partDraw['scoreG'] = drawText
partDraw['period'] = drawText
partDraw['down'] = drawText
partDraw['on'] = drawText
partDraw['clock'] = drawText
partDraw['play'] = drawText
partDraw['flag'] = drawText

function drawScoreboard(element_, data_) {
  _finished = false
  _element = elements[element_.render]
  if (!_element) return false

  while (!_finished) {
    _rate = round(256 / _element.frames, 2)
    _element.fade += (element_.effect == 'in') ? _rate : (element_.effect == 'out') ? -_rate : 0
    _element.fade = (!element_.effect) ? (state.visible) ? 256 : 0 : _element.fade
    _color = color(255, 0, 0, _element.fade)
    _alpha = alpha(_color)
  
    _h = images.bg.height
    _w = images.bg.width
    _element.graphic.clear()
    _element.graphic.background(_element.bg)
    _element.graphic.image(images.bg, _element.width - _w, 0 - _h/2, _w, _h)  
    _element.graphic.noStroke()
    _element.graphic.fill(config.chromaKey)
    _element.graphic.rect(0, _element.height-_element.timeoutH, _element.width, _element.timeoutH)

    _element.items.forEach((_item) => {
      if (!(_item in partDraw)) return
      _part = parts[_item]
      if (!_part.bg) _part.bg = _element.graphic.get(_part.x, _part.y, _part.width, _part.height)
      partDraw[_item](_element, _item, data_)
    })
  
    if (config.showFade) {
      fill(config.chromaKey)
      rect(0,0,200,80)
      fill('white')
      textSize(50)
      text(str(round(_element.fade)+','+str(round(_alpha))), 10, 50)
    }
  
    tint(255, _alpha)
    image(_element.graphic, _element.x, _element.y)
  
    if (_alpha >= 255) {
      _element.visible = true
      _element.fade = 255
      _finished = true
    }
    else if (_alpha <= 0) {
      _element.visible = false
      _element.fade = 0
      _finished = true
    }
    if (_finished) _element.fade = (_element.visible) ? 255 : 0  
  }

  return true
}

function drawSignal(element_, data_) {
  _finished = false
  _element = elements[element_]
  print('element', element_, _element)
  if (!_element) return false

  push()
  strokeWeight(0)
  stroke(_element.bg)
  fill(_element.bg)
  rect(_element.x, _element.y, _element.width, _element.height)
  fill(_element.fg)
  stroke(_element.fg)
  strokeWeight(3)
  textSize(40)
  textAlign(CENTER)
  text(data_.event, _element.x + (_element.width / 2), _element.y + _element.height - 10)
  pop()
  return true
}

function drawScreenBanner(info_, image_, offset_) {
  print(info_, image_, offset_)
  clearCanvas(info_.event)
  let _dims = calculateDimensions(image_)
  push()
  stroke('white')
  strokeWeight(5)
  tint(255, 255)
  imageMode(CENTER)
  if (image_) {
    print('--------------------------------')
    image(image_, _dims.ww2, _dims.wh2 - _dims.ih2 - offset_)
    print('--------------------------------')
    if (state.state == 'halftime') {
      pop()
      return true
    }
  }
  if (info_.event.startsWith('H') || info_.event.endsWith('Home')) {
    image(images.home, _dims.ww2, _dims.wh2 + _dims.l1w4)
  } else if (info_.event.startsWith('G') || info_.event.endsWith('Guest')) {
    image(images.guest, _dims.ww2, _dims.wh2 + _dims.l2w4)
  } else if (info_.event.startsWith('End') && info_.event.endsWith('H')) {
    image(images.halftime, _dims.ww2, _dims.wh2)
  } else if (info_.event.startsWith('End') && info_.event.endsWith('Game')) {
    image(images.final, _dims.ww2, _dims.wh2)
  } else if (info_.event.startsWith('End')) {
    image(images.eoq, _dims.ww2, _dims.wh2)
  } else {
    print('New Image')
  }
  pop()
  return true
}

//////// render funcs
function renderStateInit(info_) {
  print('renderStateInit')
  clearCanvas()
  return true
}
stateRenderer['-'] = renderStateInit
stateRenderer['init'] = renderStateInit

function renderStatePregame(e_) {
  print('renderPregame', e_)
  clearCanvas('pregame')
  if (!e_.visible) return e_.visible
  let _dims = calculateDimensions(images.pregame)

  push()
  image(images.pregame, _dims.ww2 - _dims.iw2, _dims.wh4 - _dims.ih2)
  image(images.guest, _dims.ww4 - _dims.l1w2, _dims.wh2 - _dims.l1h2 + 35)
  image(images.home, _dims.ww4*3 - _dims.l2w2, _dims.wh2 - _dims.l2h2 + 35)

  stroke('white')
  strokeWeight(5)
  textStyle(BOLD)
  textSize(100)
  text('at', _dims.ww2, _dims.wh2 + 60)
  
  textSize(40)
  fill('white')
  stroke('black')
  rect(_dims.ww4 - (textWidth(teams[e_.guest].long)/1.8)-5, _dims.wh4*3, (textWidth(teams[e_.guest].long)*1.125)+10, 70, 10)
  rect(_dims.ww4*3 - (textWidth(teams[e_.guest].long)/1.8)-10, _dims.wh4*3, (textWidth(teams[e_.home].long)*1.125)+10, 70, 10)
  
  fill('black')
  stroke('white')
  text(teams[e_.guest].long, _dims.ww4, _dims.wh4*3+50)
  text(teams[e_.home].long, _dims.ww4*3, _dims.wh4*3+50)

  if (game.clock) drawClock(e_.clock, _dims)
  pop()

  return true
}
stateRenderer['pregame'] = renderStatePregame

function renderStateQtrs(info_) {
  print('renderStateQtrs')
  clearCanvas('qtrs')
  return drawScoreboard({render:'scoreboard', effect:state.effect}, info_)
}
stateRenderer['1st'] = renderStateQtrs
stateRenderer['2nd'] = renderStateQtrs
stateRenderer['3rd'] = renderStateQtrs
stateRenderer['4th'] = renderStateQtrs
stateRenderer['ot'] = renderStateQtrs

function renderStateHalftime(info_) {
  print('renderStateHalftime')
  clearCanvas('halftime')
  drawScreenBanner(info_, images.halftime, offsets['halftime'])
  let _dims = calculateDimensions(images.pregame)
  textSize(40)
  stroke('white')
  strokeWeight(3)
  fill('black')
  stroke('white')
  text(teams[info_.guest].long, _dims.ww2 - 50, _dims.wh2+90)
  text(teams[info_.home].long, _dims.ww2 - 50, _dims.wh2+140)

  text(info_.scoreG, _dims.ww2 + 190, _dims.wh2+90)
  text(info_.scoreH, _dims.ww2 + 190, _dims.wh2+140)

  return true
}
stateRenderer['halftime'] = renderStateHalftime

function renderEventScoreboard(info_) {
  return drawScoreboard({render:'scoreboard', effect:lastEffect}, info_)
}
eventRenderer['redraw'] = renderEventScoreboard
eventRenderer['NoneBall'] = renderEventScoreboard
eventRenderer['HomeBall'] = renderEventScoreboard
eventRenderer['GuestBall'] = renderEventScoreboard
eventRenderer['ScoreSet'] = renderEventScoreboard
eventRenderer['ScoreSetHome'] = renderEventScoreboard
eventRenderer['ScoreSetGuest'] = renderEventScoreboard

function renderEventClock(e_) {
  //print('renderclock', e_)
  if (e_.state == 'pregame') {
    let _dims = calculateDimensions(images.pregame)
    drawClock(e_.clock, _dims)
    return true
  } else if (CLOCK_QTRS.includes(e_.state)) {
    drawText(elements['scoreboard'], 'clock', e_)
    image(_element.graphic, _element.x, _element.y)
    return true
  }
}
eventRenderer['clock'] = renderEventClock

function renderEventBallOn(e_) {
  //print('renderballon', e_)
  if (CLOCK_QTRS.includes(e_.state)) {
    drawText(elements['scoreboard'], 'on', e_)
    image(_element.graphic, _element.x, _element.y)
    return true
  }
}
eventRenderer['BallOnSet'] = renderEventBallOn

function renderEventDown(e_) {
  print('renderdown', e_.state, e_.down, e_.togo)
  if (CLOCK_QTRS.includes(e_.state)) {
    drawText(elements['scoreboard'], 'down', e_)
    image(_element.graphic, _element.x, _element.y)
    return true
  }
}
eventRenderer['DownReset'] = renderEventDown
eventRenderer['DownClear'] = renderEventDown
eventRenderer['DownSet'] = renderEventDown
eventRenderer['DownToGoSet'] = renderEventDown

function renderEventBanner(info_) {
  let _index = info_.event.replace('Home', '').replace('Guest', '')
  let _image = _index.toLowerCase()
  if (!_index.startsWith('End')) {
    return drawScreenBanner(info_, images[_image], offsets[_index])
  } else {
    drawScreenBanner(info_, images[_image], offsets[_index])
    let _dims = calculateDimensions(images.pregame)
    textSize(40)
    stroke('white')
    strokeWeight(3)
    fill('black')
    stroke('white')
    if (_index != 'EndOfGame') {
      text(teams[info_.guest].long, _dims.ww2 - 40, _dims.wh2+150)
      text(teams[info_.home].long, _dims.ww2 - 40, _dims.wh2+200)  

      text(info_.scoreG, _dims.ww2 + 200, _dims.wh2+150)
      text(info_.scoreH, _dims.ww2 + 200, _dims.wh2+200)
    } else {
      text(teams[info_.guest].long, _dims.ww2 - 50, _dims.wh2+90)
      text(teams[info_.home].long, _dims.ww2 - 50, _dims.wh2+140)  

      text(info_.scoreG, _dims.ww2 + 190, _dims.wh2+90)
      text(info_.scoreH, _dims.ww2 + 190, _dims.wh2+140)
    }

    return true
  }
}
eventRenderer['HomeTD'] = renderEventBanner
eventRenderer['GuestTD'] = renderEventBanner
eventRenderer['HomePAT'] = renderEventBanner
eventRenderer['GuestPAT'] = renderEventBanner
eventRenderer['HomeTry'] = renderEventBanner
eventRenderer['GuestTry'] = renderEventBanner
eventRenderer['HomeFG'] = renderEventBanner
eventRenderer['GuestFG'] = renderEventBanner
eventRenderer['HomeNG'] = renderEventBanner
eventRenderer['GuestNG'] = renderEventBanner
eventRenderer['HomeSafety'] = renderEventBanner
eventRenderer['GuestSafety'] = renderEventBanner
eventRenderer['TimeoutHome'] = renderEventBanner
eventRenderer['TimeoutGuest'] = renderEventBanner
eventRenderer['EndOfQtr1'] = renderEventBanner
eventRenderer['EndOfQtr2'] = renderEventBanner
eventRenderer['EndOfQtr3'] = renderEventBanner
eventRenderer['EndOfQtr4'] = renderEventBanner
eventRenderer['EndOfGame'] = renderEventBanner

function renderEventSignal(info_) {
  print(info_)
  if (info_.event == 'FLAG') {
    return drawSignal('flag', info_)
  } else if (info_.event == 'REFEREE') {
    return drawSignal('referee', info_)
  } else if (info_.event.startsWith('CLEAR')) {
    return drawScoreboard({render:'scoreboard', effect:lastEffect}, info_) 
  } 
  return true
}
eventRenderer['FLAG'] = renderEventSignal
eventRenderer['CLEARFLAG'] = renderEventSignal
eventRenderer['REFEREE'] = renderEventSignal
eventRenderer['CLEARREFEREE'] = renderEventSignal
