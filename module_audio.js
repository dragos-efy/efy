const add_audio_range = {type: 'range', min: '0', max: '1', value: '1', step: '0.01'},

efy_audio_menu = $add('details', {efy_select: '', id: 'efy_audio', name: 'efy_sidebar_modules'}, [
    ['summary', [ ['i', {efy_icon: 'audio'}], ['p', {efy_lang: 'audio_effects'}], ['mark', {efy_lang: 'alpha'}]]],
    ['div', {efy_lang: 'efy_volume', efy_range_text: 'EFY Volume'}, [ ['input', {class: 'efy_audio_volume', ...add_audio_range}] ]],
    ['div', {efy_lang: 'page_volume', efy_range_text: 'Page Volume'}, [ ['input', {class: 'efy_audio_volume_page', ...add_audio_range}] ]],
    ['p', {efy_lang: 'sidebar_audio_text'}]
], $('.efy_sidebar'));

for (let a = [['status', 'active'], ['click', 'click_tap'], ['hover', 'mouse_hover']],
b = [[], $('#efy_audio [efy_range_text="EFY Volume"]'), 'beforebegin'], i = 0; i < a.length; i++){
    const id = `efy_audio_${a[i][0]}`,
    margin = a[i][0] === 'hover' ? {style: 'margin: 0 0 15rem 0'} : null;
    $add('input', {type: 'checkbox', name: 'efy_audio', id: id}, ...b);
    $add('label', {for: id, efy_lang: a[i][1], ...margin}, ...b);
}

/*Effects*/ if (efy.audio_status){ efy_audio.folder = $css_prop('---audio_folder');
    'pop ok ok2 ok3 hover slide step error disabled call wind'.split(' ').forEach(x =>{
        efy_audio[x] = new Audio(`${efy_audio.folder}/${x}.webm`);
        efy_audio[x].volume = efy_audio.volume;
    });

    if (efy.audio_click){[ // Sound, Event, Selectors
        ['ok, pointerup', 'button:not([disabled], [type=submit], [type=reset], [efy_tab], [efy_sidebar_btn], [efy_toggle], [efy_keyboard] [efy_key], .efy_quick_fullscreen, [tabindex="-1"], [efy_audio_mute*=ok])'],
        ['ok', 'change', 'input, textarea'],
        ['ok2', 'pointerup', '.efy_img_previews [efy_bg_nr]'],
        ['ok3', 'pointerup', '[type=submit]'],
        ['pop', 'pointerup', 'summary, [efy_toggle], select:not([multiple], [disabled]), [efy_tabs] [efy_tab], [efy_alert], [efy_alert] *'],
        ['slide', 'pointerup', '[efy_sidebar_btn]'],
        ['error', 'pointerup', '[type=reset]'],
        ['disabled', 'pointerup', '[disabled]'],
        ['step', 'pointerdown', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled]), [efy_keyboard] [efy_key]'],
        ['step', 'input', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])'],
        ['wind', 'click', '.efy_quick_fullscreen']
    ].map(x =>{
        $event($body, x[1], ()=>{ if (event.target.matches(x[2])) $audio_play(efy_audio[x[0]]) })
    })}

    if (efy.audio_hover){ $event($body, 'mouseover', ()=>{ try {
        if (event.target.matches(':is(a, button, input, label, summary, select):not([multiple], [disabled])')){
            $audio_play(efy_audio.hover)
        }} catch {}
    })}
    /*Volume*/

    $event(efy_audio_menu, 'input', ()=>{ x = event.target;
        if (x.matches('.efy_audio_volume')){
            for (let y = Object.keys(efy_audio), i = 0; i < y.length; i++){ efy_audio[y[i]].volume = x.value}
        }
        else if (x.matches('.efy_audio_volume_page')){
            $all('audio, video').forEach(y => y.volume = x.value);
        }
    });
}

/*Checkbox Toggles*/  ['status', 'click', 'hover'].map(type =>{
    const x = `audio_${type}`, toggle = $(`#efy_${x}`);
    if (efy[x]) toggle.setAttribute('checked', '');
    $event(toggle, 'click', ()=>{ efy[x] ? delete efy[x] : efy[x] = true; $save()});
});