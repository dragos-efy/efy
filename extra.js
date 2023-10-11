import {$, $all, $add, $ready, efy, $save} from './efy.js';

$ready('#efy_sbtheme', ()=>{

/*Keyboard*/

$add('details', {id: 'efy_keyboard', efy_select: ''}, [$add('summary', {}, [$add('p', {efy_lang: 'virtual_keyboard'}), $add('mark', {efy_lang: 'alpha'})]), $add('input', {type: 'checkbox', name: 'efy_keyboard', id: 'efy_keyboard_status'}), $add('label', {for: 'efy_keyboard_status', efy_lang: 'active'}) ], $('#efy_accessibility'));

$add('div', {efy_keyboard: '', class: 'efy_hide_i'}, [], $('body'), 'afterbegin');

for (let c = `${'`'} 1 2 3 4 5 6 7 8 9 0 - = q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , . /`, d = `~ ! @ # $ % ^ & * ( ) _ + Q W E R T Y U I O P { } A S D F G H J K L : | Z X C V B N M < > ?`, a = c.split(' '), b = d.split(' '), i = 0; i < a.length; i++) {
    $add('button', {efy_key: a[i]}, [a[i]], $('[efy_keyboard]'));
    $(`[efy_key="${a[i]}"]`).addEventListener('click', ()=>{ $('input').value += a[i] });

    $add('button', {efy_key: `${b[i]}`, class: 'efy_hide'}, [b[i]], $('[efy_keyboard]'));
    $(`[efy_key="${b[i]}"]`).addEventListener('click', ()=>{ $('input').value += b[i] });
}

d = 'space caps backspace close'.split(' '), e = 'dots star remove remove'.split(' '); d.map((a,i)=>{let b = e[i];
  $add('button', {efy_key: a, class: 'efy_show'}, [$add('i', {efy_icon: b})], $('[efy_keyboard]'))
});

$(`[efy_key="space"]`).addEventListener('click', ()=>{ $('input').value += ' ' });

let backspace =()=>{ let a = $('input').value; $('input').value = a.slice(0, -1) }, intv;

$(`[efy_key="caps"]`).addEventListener('click', ()=>{
    $all('[efy_key]:not(.efy_show)').forEach(a =>{ a.classList.toggle('efy_hide') })
});

c = $(`[efy_key="backspace"]`);
c.addEventListener('click', backspace);
c.addEventListener('pointerdown', ()=>{ intv = setInterval(backspace, 100) });
c.addEventListener('pointerup', ()=> clearInterval(intv) );
c.addEventListener('pointerleave', ()=> clearInterval(intv) );

$all('input:not([type="color"], [type="range"], [type="file"], [type="radio"], [type="checkbox"])').forEach(a =>{ a.addEventListener('focus', ()=>{ $('body').setAttribute('efy_kb', '') })});

$all('[efy_keyboard] [efy_key="close"]').forEach(a =>{ a.addEventListener('click', ()=>{ $('body').removeAttribute('efy_kb')})});

/*Prevent Default*/ $all('[efy_keyboard]').forEach(a => a.addEventListener('contextmenu', ()=> event.preventDefault()));

let a = $('[efy_keyboard]'); b = $('#efy_keyboard_status'); if (efy.keyboard){ b.setAttribute('checked', ''); a.classList.remove('efy_hide_i')}
b.addEventListener('click', (c)=>{ a.classList.toggle('efy_hide_i');
    if (c.target.checked){ efy.keyboard = 'on'} else {delete efy.keyboard} $save();
});

}, 1);