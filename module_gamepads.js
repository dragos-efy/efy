let dom = [
  /*Body*/ ':is(a, button, input, select, textarea):not([disabled], [tabindex="-1"], .efy_hide_i, .efy_hide_i *, .efy_sidebar *, details *, [efy_content]:not([efy_active]) *, [efy_keyboard]:not([efy_kb] [efy_keyboard]) *), details[open] :is(a, button, input, select, textarea), summary:not(.efy_sidebar summary)',
  /*Sidebar*/ '.efy_sidebar :is(:is([efy_about], #efy_quick, .efy_about_div, .efy_quick_notify_content) :is(a, button, input, select, textarea), [efy_search_input]):not([disabled], [tabindex="-1"], .efy_hide_i, .efy_hide_i *, [efy_content]:not([efy_active]) *), .efy_sidebar summary:not(.efy_sidebar details:not([open]) details summary), .efy_sidebar details[open] :is(a, button, input, select, textarea, summary):not(details:not([open]) *, [disabled], [tabindex="-1"], .efy_hide_i, .efy_hide_i *, [efy_content]:not([efy_active]) *)'
],
[focus_index, dom_focus_index, dom_focus] = [0, 0, []],
vibration_fn =()=> {};

const update_focus =(seconds = 0.3)=>{
  const i = $root.matches('[efy_sidebar^=on]') ? 1 : 0;
  $wait(seconds, ()=> dom_focus = $all(dom[i]));
  // console.log(dom_focus)
},

gamepads_selector = $add('div', {id: 'gamepads'}), gamepads_by_index = {};

function add_gamepad(gamepad){
  const axes = [], buttons = [];
  gamepads_by_index[gamepad.index] = {gamepad, ...{} /*map*/, axes, buttons};
}

function remove_gamepad(gamepad){
  const info = gamepads_by_index[gamepad.index];
  if (info){
    delete gamepads_by_index[gamepad.index];
}}

function add_gamepad_if_new(gamepad){
  const info = gamepads_by_index[gamepad.index];
  info ? info.gamepad = gamepad : add_gamepad(gamepad);
}

function connect_gamepad(e){
  add_gamepad_if_new(e.gamepad); update_focus(0);
  $notify('short', 'Gamepad: ON', e.gamepad.id || null, null, 'gamepad'); update_focus(3);
}
function disconnect_gamepad(e){
  remove_gamepad(e.gamepad);
  $notify('short', 'Gamepad: OFF', e.gamepad.id || null, null, 'gamepad');
}

let process_buttons, process_stick_left, process_stick_right;

let gamepad_maps = {
  back: [0, 'b'],
  ok: [1, 'a'],
  yes: [2, 'y'],
  no: [3, 'remove'],
  l1: [4, 'l'],
  r1: [5, 'r'],
  l2: [6, 'zl'],
  r2: [7, 'zr'],
  extra: [8, 'minus'],
  menu: [9, 'plus'],
  l_ok: [10, '⬤ L'],
  r_ok: [11, '⬤ R'],
  up: [12, 'up'],
  down: [13, 'down'],
  left: [14, 'left'],
  right: [15, 'right'],
  home: [16, 'home'],
  capture: [17, '◯'],
};

const no = ['.','.'];

const ps_map = {
  back: [0, 'remove'],
  ok: [1, 'circle'],
  yes: [2, 'square'],
  no: [3, 'triangle'],
  l1: [4, 'L1'],
  r1: [5, 'R1'],
  l2: [6, 'L2'],
  r2: [7, 'R2'],
  extra: [8, '\\〡/'],
  menu: [9, 'menu'],
  l_ok: [10, '⬤ L'],
  r_ok: [11, '⬤ R'],
  up: [12, 'up'],
  down: [13, 'down'],
  left: [14, 'left'],
  right: [15, 'right'],
  home: [16, 'home'],
  capture: no
};

Object.keys(ps_map).map(key =>{
  gamepad_maps[key][0] = ps_map[key][0];
  gamepad_maps[key][1] = ps_map[key][1];
})

let restore_gamepad_maps =()=>{};

const gamepad_maps_reset_functions =()=>{
  gamepad_maps.functions = 'default';
  gamepad_maps.speed_buttons = 0.15;
  gamepad_maps.speed_stick_l = 0.125;
  gamepad_maps.speed_stick_r = 0.001;
  gamepad_maps.back[2] =()=>{ window.history.go(-1)};
  gamepad_maps.ok[2] =()=>{ document.activeElement.click(); update_focus()};
  gamepad_maps.yes[2] =()=>{};

  const d = ['up', 'down', 'left', 'right'];
  d.forEach(d =>{ gamepad_maps[d][2] =()=> {}});
  d.forEach(d =>{ gamepad_maps[`l_${d}`] =()=> {}});
  d.forEach(d =>{ gamepad_maps[`r_${d}`] =()=> {}});

  gamepad_maps.global_before =()=>{};
  gamepad_maps.global_after =()=>{};
}; gamepad_maps_reset_functions();

if (efy.gamepads_bar){
  $add('div', {class: 'gamepads_bar efy_trans_filter'}, [
    ['div', [
      ['div', {gp_btn: 'Home'}, [['i', {efy_icon: 'home'}], ['p', 'Menu']]]
    ]],
    ['div', [
      ['div', {gp_btn: 'move'}, [
        ['i', {efy_icon: 'move'}], ['p', '/'], ['i', {efy_icon: 'gamepad_stick_l'}], ['p', 'Move']
      ]],
      ['div', {gp_btn: 'R'}, [ ['i', {efy_icon: 'gamepad_stick_r'}], ['p', 'Scroll']]]
    ]],
    ['div', [
      ['div', {gp_btn: 'B'}, [ ['i', {efy_icon: `gamepad_${gamepad_maps.back[1]}`}], ['p', 'Back']]],
      ['div', {gp_btn: 'A'}, [ ['i', {efy_icon: `gamepad_${gamepad_maps.ok[1]}`}], ['p', 'OK'] ]]
    ]]
  ]);
}

$wait(1, ()=>{

$('[efy_sidebar_btn]').click(); $('[efy_sidebar_btn]').click();

$add('details', {id: 'efy_gamepads'}, [
  ['summary', [['i', {efy_icon: 'gamepad'}], ['p', 'Gamepads']]],
  ['div', {efy_card: '', efy_lang: 'coming_soon'}]
], $('.efy_sidebar'), 'beforeend');

$root.classList.add('gamepads_on');

const process_buttons =(info)=>{
  const {gamepad} = info, buttons = gamepad.buttons;
  if (buttons.length){
    ['ok', 'yes', 'back', 'up', 'down', 'left', 'right'].map(x=>{
      if (buttons[gamepad_maps[x][0]].pressed){
        gamepad_maps.global_before(); gamepad_maps[x][2](); gamepad_maps.global_after();
      }
    });
  }
},
process_home =(info)=>{
  const {gamepad} = info, buttons = gamepad.buttons;
  /*Wii Support*/ if (buttons.length && buttons.length >= 12){
    /*Home*/ if (buttons[gamepad_maps.home[0]].pressed){ $('[efy_sidebar_btn]').click()}
  }
},

process_stick_left =(info)=>{
  const {gamepad} = info, buttons = gamepad.buttons,
  hover =()=>{ if (efy.audio_status) $audio_play(efy_audio.hover)},
  focus =(x)=>{ dom_focus[x].focus()},
  dispatch =(x, position)=>{
      position === 'up' ? x.stepUp() : x.stepDown();
      x.dispatchEvent(new Event('input', {bubbles: true}))
  };

  const [ZL, ZR] = [gamepad.buttons[6].pressed ? 5 : 1, gamepad.buttons[7].pressed];

  if (gamepad_maps.functions === 'default'){
    /*Left*/ if ((gamepad.axes[0] < -0.3 || buttons[14].pressed) && focus_index >= 0){
        try { focus_index -= ZL;
          (focus_index < 0) ? focus_index = 0 : hover();
          focus(focus_index);
        } catch {}
    }
    /*Right*/ if ((gamepad.axes[0] > 0.3 || buttons[15].pressed) && (focus_index - ZL) < dom_focus.length){
        try { focus_index += ZL;
          (focus_index >= dom_focus.length) ? focus_index = dom_focus.length - 1 : hover();
          focus(focus_index);
        } catch {}
    }
    /*Up*/ if ((gamepad.axes[1] < -0.3 || buttons[12].pressed) && focus_index > 0){
        try { for (let i = 0; i < ZL; i++){ dispatch(dom_focus[focus_index], 'up')}} catch {}
    }
    /*Down*/ if ((gamepad.axes[1] > 0.3 || buttons[13].pressed) && focus_index < dom_focus.length){
        try { for (let i = 0; i < ZL; i++){ dispatch(dom_focus[focus_index], 'down')}} catch {}
    }
  }
  else {
    /*Left*/ if (gamepad.axes[0] < -0.3){
        gamepad_maps.global_before(); gamepad_maps.l_left(); gamepad_maps.global_after();
    }
    /*Right*/ if (gamepad.axes[0] > 0.3){
        gamepad_maps.global_before(); gamepad_maps.l_right(); gamepad_maps.global_after();
    }
    /*Up*/ if (gamepad.axes[1] < -0.3){
        gamepad_maps.global_before(); gamepad_maps.l_up(); gamepad_maps.global_after();
    }
    /*Down*/ if (gamepad.axes[1] > 0.3){
        gamepad_maps.global_before(); gamepad_maps.l_down(); gamepad_maps.global_after();
    }
  }

}

process_stick_right =(info)=>{ const {gamepad} = info;
  const scroll = $('.gamepad_scroll:focus-within') || $('.efy_sidebar:focus-within') || $('.gamepad_scroll_force') || $body,
  size = 15, size2 = -1 * size;
  if (gamepad_maps.functions === 'default'){
    /*Up*/ if (gamepad.axes[3] < -0.3) scroll.scrollBy(0, size2);
    /*Down*/ if (gamepad.axes[3] > 0.3) scroll.scrollBy(0, size);
    /*Left*/ if (gamepad.axes[2] < -0.3) scroll.scrollBy(size2, 0);
    /*Right*/ if (gamepad.axes[2] > 0.3) scroll.scrollBy(size, 0);
  } else {
    /*Up*/ if (gamepad.axes[3] < -0.3) gamepad_maps.r_up();
    /*Down*/ if (gamepad.axes[3] > 0.3) gamepad_maps.r_down();
    /*Left*/ if (gamepad.axes[2] < -0.3) gamepad_maps.r_left();
    /*Right*/ if (gamepad.axes[2] > 0.3) gamepad_maps.r_right();
  }
}


function add_new_gamepads(){ const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++){
    const gamepad = gamepads[i];
    if (gamepad) add_gamepad_if_new(gamepad);
}}

$event(window, 'gamepadconnected', connect_gamepad);
$event(window, 'gamepaddisconnected', disconnect_gamepad);


const process_buttons_anim =()=>{
    add_new_gamepads();
    Object.values(gamepads_by_index).forEach(process_buttons);
    $wait(gamepad_maps.speed_buttons, ()=> requestAnimationFrame(process_buttons_anim));
},
process_home_anim =()=>{
    Object.values(gamepads_by_index).forEach(process_home);
    $wait(0.3, ()=> requestAnimationFrame(process_home_anim));
},
process_stick_left_anim =()=>{ const now = Date.now();
    Object.values(gamepads_by_index).forEach(process_stick_left);
    $wait(gamepad_maps.speed_stick_l, ()=> requestAnimationFrame(process_stick_left_anim));
},
process_stick_right_anim =()=>{ const now = Date.now();
    Object.values(gamepads_by_index).forEach(process_stick_right);
    $wait(gamepad_maps.speed_stick_r, ()=> requestAnimationFrame(process_stick_right_anim));
};

[process_buttons_anim, process_home_anim, process_stick_left_anim, process_stick_right_anim].map(x => requestAnimationFrame(x));

/*Vibration*/ vibration_fn =(intensity = 0.02, duration = 0.05)=>{
    const gamepad = navigator.getGamepads()[0]; // 1st Gamepad
    if (gamepad && gamepad.vibrationActuator){
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0, duration: duration * 1000, // miliseconds
        weakMagnitude: intensity, strongMagnitude: intensity,
      });
    }
};

$root.setAttribute('efy_outline', '');

$event(window, 'click', (event)=>{
  if (event.target.matches('[efy_sidebar_btn]')){
    /*Toggle Function Maps*/ gamepad_maps.functions === 'default' ? restore_gamepad_maps() : gamepad_maps_reset_functions();
    let index = 0;
    if ($root.matches('[efy_sidebar^=on]')){ index = 4; dom_focus_index = Array.from($all(dom[0])).indexOf(document.activeElement)}
    else {index = dom_focus_index}
    update_focus(); focus_index = index;
    $wait(0.3, ()=> dom_focus[index].focus());
    if (efy.audio_status) $audio_play(efy_audio.slide);
  }
});

});