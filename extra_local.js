$ready('#efy_sbtheme', ()=>{

/*Keyboard*/ let current_input;

$add('details', {id: 'efy_keyboard', efy_select: ''}, [['summary', {}, [ ['p', {efy_lang: 'virtual_keyboard'}], ['mark', {efy_lang: 'alpha'}] ]],
     ['input', {type: 'checkbox', name: 'efy_keyboard', id: 'efy_keyboard_status'}],
     ['label', {for: 'efy_keyboard_status', efy_lang: 'active'}],
     ['div', {efy_lang: 'max_width', efy_range_text: 'Max Width KB'}, [
        ['div', {class: 'efy_max_width_div'}, [
            ['input', {id: 'efy_kb_width', class: 'efy_maxwidth_input', type: 'range', min: '50', max: '100', value: '80', step: '1'}],
            ['input', {id: 'efy_kb_width_rem', class: 'efy_maxwidth_input efy_hide', type: 'range', min: '680', max: '8000', value: '680', step: '10'}],
            ['select', {id: 'efy_kb_unit', name: 'efy_name'}, [
                ['option', {value: '%'}, '%'], ['option', {value: 'rem'}, 'REM']
            ]]
        ]],
        ['div', {efy_range_text: 'KB Height', efy_lang: 'height'}, [
            ['input', {id: 'efy_kb_height', type: 'range', min: '30', max: '120', value: '50', step: '1'}],
        ]]
    ]]
], $('#efy_accessibility'));

$add('div', {efy_keyboard: '', class: 'efy_hide_i'}, [
    ...Array(5).fill(['div', {class: 'row'}])
], $('body'), 'afterbegin');

const rows = [
    [`1 2 3 4 5 6 7 8 9 0 - =`, `! @ # $ % ^ & * ( ) _ +`],
    [`q w e r t y u i o p [ ] bl`, `Q W E R T Y U I O P { } |`],
    [`a s d f g h j k l ; '`, `A S D F G H J K L : ''`],
    [`z x c v b n m , . /`, `Z X C V B N M < > ?`]
],
set_focus =()=>{
    current_input.dispatchEvent(new Event('input', {'bubbles': true}));
    current_input.focus();
},
addKeyboardButtons =(i, keys)=>{
    const parent = $(`[efy_keyboard] .row:nth-of-type(${i})`);

    keys[0].split(' ').forEach(key => {
        $add('button', {efy_key: key}, (key === 'bl')? `\\` : key, parent);
        $event($(`[efy_key="${key}"]`), 'click', (x) => {
            if (x.target.getAttribute('efy_key') === 'bl') key = `\\`;
            try { current_input.value += key; set_focus()}
            catch { $notify('short', 'Select a Text Area')}
        });
    });

    keys[1].split(' ').forEach(key => {
        $add('button', {efy_key: key, class: 'efy_hide'}, [key], parent);
        $event($(`[efy_key="${key}"]`), 'click', (x) => {
            if (x.target.getAttribute('efy_key') === `''`) key = `"`;
            current_input.value += key; set_focus();
        });
    });
};
rows.map((row, i)=> addKeyboardButtons(i+1, row));

const row1 = $('[efy_keyboard] .row:nth-of-type(1)'), row2 = $('[efy_keyboard] .row:nth-of-type(2)'),
row3 = $('[efy_keyboard] .row:nth-of-type(3)'), row4 = $('[efy_keyboard] .row:nth-of-type(4)'),
row5 = $('[efy_keyboard] .row:nth-of-type(5)');

$add('button', {efy_key: 'backspace'}, [['i', {efy_icon: 'chevron_left'}]], row1);
$add('button', {efy_key: 'delete', class: 'efy_hide'}, [['i', {efy_icon: 'remove'}]], row1);
$add('button', {efy_key: 'tab', class: 'efy_show'}, 'Tab', row2, 'afterbegin');
$add('button', {efy_key: 'selection', class: 'efy_show'}, 'Character', row3, 'afterbegin');
$add('button', {efy_key: 'enter', class: 'efy_show'}, 'Enter', row3);
$add('button', {efy_key: 'caps', class: 'efy_show'}, [['i', {efy_icon: 'arrow_up'}]], row4, 'afterbegin');
$add('button', {efy_key: 'up', class: 'efy_show'}, [['i', {efy_icon: 'arrow_up'}]], row4);
$add('button', {efy_key: 'close', class: 'efy_show'}, [['i', {efy_icon: 'remove'}]], row4);
$add('button', {efy_key: 'menu', class: 'efy_show', efy_sidebar_btn: ''}, [['i', {efy_icon: 'menu'}]], row5);
$add('button', {efy_key: 'shortcuts', class: 'efy_show'}, [['i', {efy_icon: 'star'}]], row5);
$add('button', {efy_key: 'super', class: 'efy_show'}, [['i', {efy_icon: 'dots'}]], row5);
$add('button', {efy_key: '`'}, '`', row5);
$add('button', {efy_key: '~', class: 'efy_hide'}, '~', row5);


let d = 'space copy paste left down right'.split(' '), e = ' copy paste arrow_left arrow_down arrow'.split(' '); d.map((a,i)=>{let b = e[i];
  $add('button', {efy_key: a, class: 'efy_show'}, [['i', {efy_icon: b}]], $('[efy_keyboard] .row:nth-of-type(5)'))
});

$event($(`[efy_key="space"]`), 'click', ()=>{ current_input.value += ' ' });

let backspace =()=>{ let a = current_input.value; current_input.value = a.slice(0, -1) }, intv;

$event($(`[efy_key="caps"]`), 'click', ()=>{
    $all('[efy_key]:not(.efy_show)').forEach(a =>{ a.classList.toggle('efy_hide') })
});
$event($(`[efy_key="enter"]`), 'click', ()=>{
    current_input.value += '\n';
});

let c = $(`[efy_key="backspace"]`);
$event(c, 'click', backspace);
$event(c, 'pointerdown', ()=>{ intv = setInterval(backspace, 100) });
$event(c, 'pointerup', ()=> clearInterval(intv) );
$event(c, 'pointerleave', ()=> clearInterval(intv) );

$all('input:not([type="color"], [type="range"], [type="file"], [type="radio"], [type="checkbox"]), textarea').forEach(input =>{
    $event(input, 'focus', ()=>{
        $('body').setAttribute('efy_kb', '');
        current_input = input;
    });
});

$all('[efy_keyboard] [efy_key="close"]').forEach(a =>{ $event(a, 'click', ()=>{ $('body').removeAttribute('efy_kb')})});

/*Prevent Default*/ $all('[efy_keyboard]').forEach(a => $event(a, 'contextmenu', ()=> event.preventDefault()));

let a = $('[efy_keyboard]'), b = $('#efy_keyboard_status'); if (efy.keyboard){ b.setAttribute('checked', ''); a.classList.remove('efy_hide_i')}
$event(b, 'click', (c)=>{ a.classList.toggle('efy_hide_i');
    if (c.target.checked){ efy.keyboard = true} else {delete efy.keyboard} $save();
});

let kb_selection = {focused: null, type: 'move', size: 'character'};

$ready('input, textarea', (a)=>{ $event(a, 'focusout', ()=> kb_selection.focused = a)});
// $ready('.kb_buttons button', (a)=>{ $event(a, 'contextmenu', ()=> event.preventDefault)});

$event($('[efy_keyboard] [efy_key="copy"]'), 'click', ()=> navigator.clipboard.writeText(window.getSelection().toString()));
$event($('[efy_keyboard] [efy_key="paste"]'), 'click', async ()=>{
    try { const text = await navigator.clipboard.readText();
        if (kb_selection.focused && ['INPUT', 'TEXTAREA'].includes(kb_selection.focused.tagName)){ kb_selection.focused.value += text}
        else { $notify('short', 'No focused input', '')}
    } catch (error){ $notify('short', "Can't read the clipboard", error)}
});

$event($('[efy_keyboard] [efy_key="selection"]'), 'click', (a)=>{ x = a.target;
    if (kb_selection.size == 'character'){ kb_selection.size = 'word'; x.textContent = 'Word'}
    else { kb_selection.size = 'character'; x.textContent = 'Character'}
    x.classList.toggle('efy_active');
});
$event($('[efy_keyboard] [efy_key="caps"]'), 'click', (a)=>{
    kb_selection.type = (kb_selection.type == 'move') ? 'extend' : 'move';
    a.target.classList.toggle('efy_active');
});

$event($('[efy_keyboard] [efy_key="left"]'), 'click', ()=>{ let selection = window.getSelection();
    selection.modify(kb_selection.type, 'backward', kb_selection.size);
});
$event($('[efy_keyboard] [efy_key="right"]'), 'click', ()=>{ let selection = window.getSelection();
    selection.modify(kb_selection.type, 'forward', kb_selection.size);
});
$event($('[efy_keyboard] [efy_key="delete"]'), 'click', ()=>{ let selection = window.getSelection();
    selection.deleteFromDocument();
});

const kb_width_inputs = $all('#efy_kb_width, #efy_kb_width_rem');

kb_width_inputs.forEach(x=>{ $event(x, 'input', ()=>{
    efy.kb_width = x.value + $('#efy_kb_unit').value; $save();
    $css_prop('--efy_kb_width', efy.kb_width);
})});

$event($('#efy_kb_unit'), 'change', (x)=>{ x = x.target.value;
    kb_width_inputs.forEach(a => a.classList.toggle('efy_hide'));
    $css_prop('--efy_kb_width', kb_width_inputs[(x === '%') ? 0 : 1].value + x);
});

$event($('#efy_kb_height'), 'input', (x)=>{
    efy.kb_height = x.target.value + 'rem'; $save();
    $css_prop('--efy_kb_height', efy.kb_height);
});

['width', 'height'].map(a=>{ if (efy[`kb_${a}`]) $css_prop(`--efy_kb_${a}`, efy[`kb_${a}`]) });

}, 1);