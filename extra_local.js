$ready('#efy_sbtheme', ()=>{

/*Keyboard*/

$add('details', {id: 'efy_keyboard', efy_select: ''}, [['summary', {}, [ ['p', {efy_lang: 'virtual_keyboard'}], ['mark', {efy_lang: 'alpha'}] ]],
     ['input', {type: 'checkbox', name: 'efy_keyboard', id: 'efy_keyboard_status'}],
     ['label', {for: 'efy_keyboard_status', efy_lang: 'active'}]
], $('#efy_accessibility'));

$add('div', {efy_keyboard: '', class: 'efy_hide_i'}, [], $('body'), 'afterbegin');

for (let c = `${'`'} 1 2 3 4 5 6 7 8 9 0 - = q w e r t y u i o p [ ] a s d f g h j k l ; ' z x c v b n m , . /`, d = `~ ! @ # $ % ^ & * ( ) _ + Q W E R T Y U I O P { } A S D F G H J K L : | Z X C V B N M < > ?`, a = c.split(' '), b = d.split(' '), i = 0; i < a.length; i++) {
    $add('button', {efy_key: a[i]}, [a[i]], $('[efy_keyboard]'));
    $event($(`[efy_key="${a[i]}"]`), 'click', ()=>{ $('input').value += a[i] });

    $add('button', {efy_key: `${b[i]}`, class: 'efy_hide'}, [b[i]], $('[efy_keyboard]'));
    $event($(`[efy_key="${b[i]}"]`), 'click', ()=>{ $('input').value += b[i] });
}

d = 'space caps backspace close'.split(' '), e = 'dots star remove remove'.split(' '); d.map((a,i)=>{let b = e[i];
  $add('button', {efy_key: a, class: 'efy_show'}, [['i', {efy_icon: b}]], $('[efy_keyboard]'))
});

$event($(`[efy_key="space"]`), 'click', ()=>{ $('input').value += ' ' });

let backspace =()=>{ let a = $('input').value; $('input').value = a.slice(0, -1) }, intv;

$event($(`[efy_key="caps"]`), 'click', ()=>{
    $all('[efy_key]:not(.efy_show)').forEach(a =>{ a.classList.toggle('efy_hide') })
});

c = $(`[efy_key="backspace"]`);
$event(c, 'click', backspace);
$event(c, 'pointerdown', ()=>{ intv = setInterval(backspace, 100) });
$event(c, 'pointerup', ()=> clearInterval(intv) );
$event(c, 'pointerleave', ()=> clearInterval(intv) );

$all('input:not([type="color"], [type="range"], [type="file"], [type="radio"], [type="checkbox"])').forEach(a =>{ $event(a, 'focus', ()=>{ $('body').setAttribute('efy_kb', '') })});

$all('[efy_keyboard] [efy_key="close"]').forEach(a =>{ $event(a, 'click', ()=>{ $('body').removeAttribute('efy_kb')})});

/*Prevent Default*/ $all('[efy_keyboard]').forEach(a => $event(a, 'contextmenu', ()=> event.preventDefault()));

let a = $('[efy_keyboard]'); b = $('#efy_keyboard_status'); if (efy.keyboard){ b.setAttribute('checked', ''); a.classList.remove('efy_hide_i')}
$event(b, 'click', (c)=>{ a.classList.toggle('efy_hide_i');
    if (c.target.checked){ efy.keyboard = 'on'} else {delete efy.keyboard} $save();
});

}, 1);