$add('details', {id: 'efy_accessibility', efy_select: ''}, [
    ['summary', {efy_lang: 'accessibility'}, [['i', {efy_icon: 'accessibility'}]]],
    ['details', {id: 'efy_accessibility_outline', efy_select: ''}, [
        ['summary', {efy_lang: 'outline'}],
        ['p', {efy_lang: 'sidebar_outline_text'}],
        ['input', {id: 'efy_outline', type: 'checkbox', name: 'efy_accessibility'}],
        ['label', {for: 'efy_outline', efy_lang: 'focus_outline'}]
    ]],
    ['details', {id: 'efy_accessibility_animations', efy_select: ''}, [
        ['summary', {efy_lang: 'animations'}],
        ['div', {efy_lang: 'speed', efy_range_text: 'Speed'}, [ ['input', {class: 'efy_anim_speed', type: 'range', min: '0', max: '20', value: '1', step: '0.1'}] ]]
    ]],
    ['details', {id: 'efy_accessibility_text', efy_select: ''}, [
        ['summary', {efy_lang: 'text_size'}],
        ['form', {class: 'efy_text_accessibility'}, [
            ['div', {efy_lang: 'zoom', efy_range_text: 'Zoom'}, [ ['input', {class: 'efy_ui_zoom', type: 'range', min: '0.75', max: '2', value: '1', step: '0.05'}] ]],
            ['div', {efy_lang: 'text_spacing', efy_range_text: 'Text Spacing'}, [ ['input', {class: 'efy_text_spacing', type: 'range', min: '0', max: '15', value: '0', step: '1'}] ]]
        ]]
    ]],
    ['details', {id: 'efy_accessibility_cursor', efy_select: ''}, [
        ['summary', {efy_lang: 'cursor'}], ['div', {efy_lang: 'sidebar_cursor_text'}]
    ]]
], $('.efy_sidebar'));

for (let a = ['efy_cursor_default', 'efy_cursor_custom', 'efy_cursor_none'], b = ['default', 'custom', 'hide'], c = $('#efy_accessibility_cursor'), i = 0; i < a.length; i++){
  $add('input', {type: 'radio', name: 'efy_accessibility_cursor', id: a[i]}, [], c);
  $add('label', {for: a[i], efy_lang: b[i]}, [], c);
} $('#efy_cursor_default').setAttribute('checked', '');

/*Cursor*/ $add('div', {efy_cursor: ''});

const switch_cursor =(type)=>{ const cursor = `efy_cursor_${type}`;
    $root.setAttribute(cursor, ''); $(`#${cursor}`).setAttribute('checked','');
    if (type == 'custom') $event(document, 'pointermove', cursor_fn); efy.cursor = type;
};
if (['custom', 'none'].includes(efy.cursor)) switch_cursor(efy.cursor);

['default', 'custom', 'none'].map(type =>{ const option = $(`#efy_cursor_${type}`);
   $event(option, 'change', ()=>{ if (option.checked){
        if (type == 'default'){
            $root.removeAttribute('efy_cursor_custom'); $root.removeAttribute('efy_cursor_none');
            $event_rm(document, 'pointermove', cursor_fn); delete efy.cursor;
        } else { switch_cursor(type)} $save();
    }});
});


/*Animations*/ (()=>{ let status = '---anim_status', state = '---anim_state', input = $('.efy_anim_speed');
    $add('style', {class: 'efy_anim_accessibility'}, [], $head);
    if (efy.anim_speed){ let speed = efy.anim_speed; input.value = speed;
        $text($('.efy_anim_accessibility'), `:root {---anim_speed: ${speed}!important}`);
        if (speed == '0'){ $body.style.setProperty(status, '0'); $body.style.setProperty(state, 'paused'); $body.setAttribute('efy_animations', 'off')}
    }
    $event(input, 'change', ()=>{ let speed = input.value; efy.anim_speed = speed; $save();
        if (speed == '0'){ $body.style.setProperty(status, '0'); $body.style.setProperty(state, 'paused'); $body.setAttribute('efy_animations', 'off')}
        else { $body.style.setProperty(status, '1'); $body.style.setProperty(state, 'running'); $body.removeAttribute('efy_animations')}
        $text($('.efy_anim_accessibility'), `:root {---anim_speed: ${speed}!important}`)
}) })();

/* Text Size*/ $add('style', {class: 'efy_text_accessibility'}, [], $head);
if (efy.text_zoom){
    $text($('.efy_text_accessibility'), `:root {---font_size: ${efy.text_zoom}px!important} html {letter-spacing: ${efy.text_spacing}px!important}`)
    $('.efy_ui_zoom').value = efy.text_zoom;
    $('.efy_text_spacing').value = efy.text_spacing;
}
$all('.efy_text_accessibility input').forEach(x => $event(x, 'input', ()=>{
    $text($('.efy_text_accessibility'), `:root {---font_size: ${$('.efy_ui_zoom').value}px!important} html {letter-spacing: ${$('.efy_text_spacing').value}px!important}`);
    efy.text_zoom = $('.efy_ui_zoom').value;
    efy.text_spacing = $('.efy_text_spacing').value;
    $save(); $100vh();
}));

/*Checkbox Toggles*/  ['outline'].forEach(x =>{
    if (efy[x]){ $(`#efy_${x}`).setAttribute('checked', '')}
    $event($(`#efy_${x}`), 'click', ()=>{
        efy[x] ? delete efy[x] : efy[x] = true; $save()
    })
});

/*Focus Outline*/
if (efy.outline){ $root.setAttribute('efy_outline', '')}
$('#efy_outline').onchange =()=>{ $root.toggleAttribute('efy_outline')}