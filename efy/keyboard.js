import {$, $all, $root, $body, $add, $append, $insert} from './efy.js';

(()=>{ $append($('#efy_accessibility'), $add('details', {id: 'efy_keyboard', efy_select: ''}, [$add('summary', {}, [ $add('i', {efy_icon: 'accessibility'}), 'Virtual Keyboard (Alpha, Extra)']) ]));

$insert($body, 'afterbegin', $add('div', {efy_keyboard: '', class: 'efy_hide_i'}));

for (let c = `${'`'} 1 2 3 4 5 6 7 8 9 0 - = q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , . /`, d = `~ ! @ # $ % ^ & * ( ) _ + Q W E R T Y U I O P { } A S D F G H J K L : | Z X C V B N M < > ?`, a = c.split(' '), b = d.split(' '), i = 0; i < a.length; i++) {
    $append($('[efy_keyboard]'), $add('button', {efy_key: a[i]}, [a[i]]));
    $(`[efy_key="${a[i]}"]`).addEventListener('click', ()=>{ $('input').value += a[i] });

    $append($('[efy_keyboard]'), $add('button', {efy_key: `${b[i]}`, class: 'efy_hide'}, [b[i]]));
    $(`[efy_key="${b[i]}"]`).addEventListener('click', ()=>{ $('input').value += b[i] });
}

for (let a = ['space', 'caps', 'backspace', 'close'], b = ['dots', 'star', 'remove', 'remove'], i = 0; i < a.length; i++) {
    $append($('[efy_keyboard]'), $add('button', {efy_key: a[i], class: 'efy_show'}, [$add('i', {efy_icon: b[i]})]))}

$(`[efy_key="space"]`).addEventListener('click', ()=>{ $('input').value += ' ' });

let backspace =()=>{ let a = $('input').value; $('input').value = a.slice(0, -1) }, intv;

$(`[efy_key="caps"]`).addEventListener('click', ()=>{
    $all('[efy_key]:not(.efy_show)').forEach(a =>{ a.classList.toggle('efy_hide') })
});

$(`[efy_key="backspace"]`).addEventListener('click', backspace);
$(`[efy_key="backspace"]`).addEventListener('pointerdown', ()=>{ intv = setInterval(backspace, 100) });
$(`[efy_key="backspace"]`).addEventListener('pointerup', ()=> clearInterval(intv) );
$(`[efy_key="backspace"]`).addEventListener('pointerleave', ()=> clearInterval(intv) );

$all('input:not([type="color"], [type="radio"], [type="checkbox"])').forEach(a =>{ a.addEventListener('focus', ()=>{ $root.setAttribute('efy_kb', '') })});

$all('[efy_keyboard] [efy_key="close"]').forEach(a =>{ a.addEventListener('click', ()=>{ $root.removeAttribute('efy_kb')})});

/*Prevent Default*/ $all('[efy_keyboard]').forEach(a => a.addEventListener('contextmenu', ()=> event.preventDefault()));

let a = $('#efy_keyboard');
$append(a, $add('input', {type: 'checkbox', name: 'efy_keyboard', id: 'efy_keyboard_status'}));
$append(a, $add('label', {for: 'efy_keyboard_status'}, ['On / Off']));
$('#efy_keyboard_status').addEventListener('click', ()=>{
    $('[efy_keyboard]').classList.toggle('efy_hide_i')
});

})();