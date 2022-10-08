/*EFY UI 2022.10.08*/ let $ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document), $create = document.createElement.bind(document), $body, $root, $efy_module,  efyaudio = {}, efyaudio_volume = 1,
/*Append: Where, Element*/ $append = (where, el) =>{ where.appendChild(el)},
/*Insert: Where, Position, Element*/ $insert = (where, pos, el) =>{ where.insertAdjacentElement(pos,el)},
/*Get CSS Property*/ $css_prop = (a) =>{ return getComputedStyle($root).getPropertyValue(a).replaceAll(' ','')},
/*Add: Element, {Attributes}, [Children, Text] (optional)*/ $add = (el, atb = {}, cld = []) => { const x = $create(el);
  for (let a = Object.keys(atb), b= Object.values(atb), i = 0; i < a.length; i++){ x.setAttribute(a[i], b[i])}
  cld.forEach(c => { if(!c) return; const cd = (typeof c === 'string') ? document.createTextNode(c) : c; x.appendChild(cd) })
return x},
/*Text*/ $text = (a,b)=>{a.textContent = b},
/*Cursor FN*/ cursor_fn =(e)=>{let x = $('[efy_cursor]'); x.style.left = e.pageX + 'px'; x.style.top = e.pageY + 'px'},
/*Ready: Selector*/ $ready =(a)=>{ return new Promise((res) =>{ let b = $(a); if (b) {res(b); return}
new MutationObserver((mutationRecords, d) =>{ Array.from($all(a)).forEach((c) =>{ res(c); d.disconnect() })}).observe(document.documentElement, { childList: true, subtree: true })})},
/*Audio Play*/ $audio_play = async (a)=>{ a.pause(); a.currentTime = 0; a.play()},
/*Wait: Seconds, FN*/ $wait =(a,b)=> setTimeout(b,a*1000),
/*Custom QuerySelectors*/ $$ =(a,b)=> a.querySelector(b), $$all =(a,b)=> a.querySelectorAll(b);

/*After Page Loads*/ window.onload = async ()=>{ $root = $(":root"), $body = $("body"); $efy_module = (a) =>{ let b = $css_prop('--efy_modules').split(',').includes(a) ? true : false; return b}; let a, b;

/*Check LocalStorage*/ try {let x = 'LS'; localStorage.setItem(x, x); let y = localStorage.getItem(x); localStorage.removeItem(x); if (x !== y) {throw new Error()}} catch (exception) {$append($body, $add('div', {class: 'efy_no_ls', efy_alert: '', style: 'background: #eee; grid-template-columns: 1fr; gap: 0'}, [$add('h6', {}, ['EFY - Your browser blocks LocalStorage']), $add('p', {}, ["Privacy matters! So block 3rd party cookies if you want, no worries, but please allow 1st party cookies in your browser's settings, to be able to save your EFY preferences locally. Have fun!"])]))}

/*Sidebar Modules*/ $append($body, $add('div', {id: 'efy_sidebar', class: 'efy_sidebar', efy_search: 'details:not(.efy_quick_shortcuts, [efy_logo]), .efy_sidebar [efy_tabs] > *'}, [ $add('div', {efy_about: ''}, [
    $add('details', {class: 'efy_about', efy_logo: ''}, [
    $add('summary', {}, [$add('code', {}, ['EFY']), $add('code', {}, [' UI']) ]),
    $add('div', {}, ['This page uses ', $add('code', {}, ['EFY']), ', a customisable, convergent, transparent, modular, futuristic css / js framework that can be added to your own web / local apps & websites.', $add('br', {}), $add('a', {href: 'https://efy.ooo/ui'}, [$add('button', {tabindex: '-1'}, ['Learn more'])]), $add('a', {href: 'https://matrix.to/#/#efy_ui:matrix.org'}, [$add('button', {tabindex: '-1'}, ['Matrix Chat'])]) ])
  ]), $add('button', {efy_sidebar_btn_close: ''}, [$add('i',{efy_icon: 'remove'})])
]), $add('div', {id: 'efy_modules'})
])); $append($body, $add('div', {efy_sidebar_btn_open: ''}));

/*Quick Shortcuts*/ if ($efy_module('efy_quick')){ $append($('.efy_sidebar'), $add('details', {id: 'efy_quick', class: 'efy_quick_shortcuts'}, [$add('summary', {}, [ $add('i', {efy_icon: 'star'}), 'Quick Shortcuts']),
    $add('div', {class: 'efy_quick_buttons'}),
    $add('div', {efy_clock: ''}), $add('div', {efy_timer: 'efy_ui0'})
]));
for (let a = ['search', 'reload', 'fullscreen', 'back', 'forward'], b = ['search', 'reload', 'fullscreen', 'chevron', 'chevron'], i = 0; i < a.length; i++) {
    $append($('.efy_quick_buttons'), $add('button', {'class': `efy_quick_${a[i]}`}, [$add('i', {efy_icon: b[i]})]))
}
$append($('.efy_quick_buttons'), $add('input', {type: 'text', efy_search_input: '', efy_display_none: '', placeholder: 'Search through menu...'}));

$(".efy_quick_search").onclick =()=> $('.efy_quick_shortcuts [efy_search_input]').toggleAttribute('efy_display_none');
$(".efy_quick_reload").onclick =()=> location.reload();
$(".efy_quick_fullscreen").onclick =()=> { document.exitFullscreen(); document.documentElement.requestFullscreen(); };
$(".efy_quick_back").onclick =()=> window.history.go(-1);
$(".efy_quick_forward").addEventListener('pointerup', async ()=> window.history.go(1));
}

/*Theme*/ if ($efy_module('efy_mode')){ $append($('.efy_sidebar'), $add('details', {id: 'efy_sbtheme', efy_select: ''}, [$add('summary', {}, [ $add('i', {efy_icon: 'star'}), 'Theme']), $add('div', {efy_tabs: 'efyui_0'})]));

/*Tabs*/ for (let a = ['mode', 'colors', 'images', 'border'], b = ['Mode', 'Colors', 'Images', 'Border'], c = $('[efy_tabs=efyui_0]'), i = 0; i < a.length; i++) { $append(c, $add('button', {efy_tab: a[i]}, [b[i]]))}
for (let a = ['mode', 'colors', 'images', 'border'], c = $('[efy_tabs=efyui_0]'), i = 0; i < a.length; i++) { $append(c, $add('div', {efy_content: a[i], efy_select: '', id: `efy_${a[i]}`})) }
/*Active*/ for (let a = ['[efy_tab=mode]', '[efy_content=mode]'], b = '[efy_tabs=efyui_0] > ', i = 0; i < a.length; i++){$(b + a[i]).setAttribute('efy_active', '')}

/*Colors*/ for (let a = ['efy_color1', 'efy_color2', 'efy_color_text', 'efy_color_bgcol'], b = ['Color 1', 'Color 2', 'Text', 'Background'], c = $('#efy_sbtheme [efy_content=colors]'), i = 0; i < a.length; i++) { $append(c, $add('label', {for: a[i]}, [b[i], $add('input', {id: a[i], type: 'color', value: '#555555'})]))}

for (let a = ['text', 'bgcol'], c = 'afterend', i = 0; i < a.length; i++){ let b = $(`#efy_sbtheme [efy_content=colors] [for=efy_color_${a[i]}]`); $insert(b, c, $add('label', {for: `efy_${a[i]}_status`}, ['On / Off'])); $insert(b, c, $add('input', {type: 'checkbox', name: `efy_${a[i]}_color_status`, id: `efy_${a[i]}_status`}))}
$insert($('#efy_sbtheme [efy_content=colors] [for=efy_text_status]'), 'afterend', $add('br',{}));

$insert($('#efy_sbtheme [efy_content=colors] [for=efy_color_text]'), 'beforebegin', $add('details', {efy_help: ''}, [$add('summary', {}, ['Custom Colors']), $add('div', {}, ['These colors override the default ones'])]));

/*Colors - Old*/ let efy_color = {'color1': 'efy_color', 'color2': 'efy_color2', 'color_text': 'efy_text', 'color_bgcol': 'efy_bgcol'}, rgb2hex = c => "#" + c.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0)).join``;
Object.keys(efy_color).forEach(z =>{ let y = $css_prop(`--efy_${z}_var`); $(`#efy_${z}`).oninput = ev => {
let x = ev.target.value, r = parseInt(x.substr(1, 2), 16), g = parseInt(x.substr(3, 2), 16), b = parseInt(x.substr(5, 2), 16); x = `${r},${g},${b}`; localStorage.setItem(efy_color[z], x); $root.style.setProperty(`--efy_${z}_var`, x) }
if (localStorage.getItem(efy_color[z])) {y = localStorage.getItem(efy_color[z]); $root.style.setProperty(`--efy_${z}_var`, y)}
$(`#efy_${z}`).value = rgb2hex(`rgb(${y})`) });

/*Mode*/ for (let a = ['default_mode', 'light_light', 'light_sepia', 'dark_dark', 'dark_nord', 'dark_black', 'light_trans', 'dark_trans'], b = ['Default', 'Light', 'Sepia', 'Dark', 'Nord', 'Black', 'Light', 'Dark'], c = $('#efy_sbtheme [efy_content=mode]'), i = 0; i < a.length; i++) { $append(c, $add('input', {type: 'radio', name: 'efy_mode', id: a[i]})); $append(c, $add('label', {for: a[i]}, [b[i]]))}

$insert($('#efy_sbtheme [efy_content=mode] #light_trans'), 'beforebegin', $add('details', {efy_help: ''}, [$add('summary', {}, ['Transparency']), $add('div', {}, ['If your operating system or window manager supports transparency, the background becomes transparent. Otherwise just import your own images and turn this on.'])]));

/*Theme - Old*/ if (localStorage.efy_mode) {a = localStorage.efy_mode; $root.setAttribute('efy_mode', a); $('#'+a).setAttribute('checked', '')}
else {$root.setAttribute('efy_mode', 'default_mode'); $('#default_mode').setAttribute('checked', '')}
$all("[name=efy_mode]").forEach(x => { x.onclick = () => { $root.setAttribute('efy_mode', x.id); localStorage.efy_mode = x.id }});

/*Images*/ a = $('#efy_sbtheme [efy_content=images]'); $append(a, $add('input', {type: 'file', accept: 'image/*', id: 'idb_addimg'})); $append(a, $add('div', {class: 'efy_img_previews'})); $append(a, $add('button', {class: 'efy_idb_reset'}, [$add('i', {efy_icon: 'reload'}), 'Reset']));

/*Help*/ $insert($('#efy_sbtheme [efy_content=images] .efy_img_previews'), 'afterend', $add('details', {efy_help: ''}, [$add('summary', {}, ['Warning! Bigger = Slower']), $add('div', {}, ['Keep them bellow 1MB per image, unless your device has a powerful CPU / GPU. You can also convert png, jpg etc to webp to reduce the size'])]));

/*Radius*/ a = $('#efy_sbtheme [efy_content=border]'); $append(a, $add('div', {efy_range_text: 'Radius'}, [ $add('input', {class: 'efy_radius_input', type: 'range', min: '0', max: '25', value: '12', step: '1'}) ]));
let input = $('.efy_radius_input'), x, radius = localStorage.efy_radius;
if (radius) { x = radius.replace('rem', ''); input.value = x; $root.style.setProperty('--efy_radius', radius) } else {x = 12}
input.oninput = () => { let x = input.value; $root.style.setProperty('--efy_radius', x + 'rem'); localStorage.efy_radius = x + 'rem'}
}

/*Visual Filters*/ if ($efy_module('efy_filters')){ $append($('.efy_sidebar'), $add('details', {id: 'efy_vfilters', efy_select: ''}, [$add('summary', {}, [ $add('i', {efy_icon: 'dots'}), 'Visual Filters (Beta)']), $add('div', {efy_tabs: 'efyui_filters'})]));

/*Tabs*/ for (let a = ['bg', 'content', 'trans'], b = ['Background', 'Content', 'Trans Elements'], c = $('[efy_tabs=efyui_filters]'), i = 0; i < a.length; i++) { $append(c, $add('button', {efy_tab: a[i]}, [b[i]])) }
for (let a = ['bg', 'content', 'trans'], c = $('[efy_tabs=efyui_filters]'), i = 0; i < a.length; i++) { $append(c, $add('form', {efy_content: a[i], efy_select: '', class: `efy_${a[i]}_filter`})) }
/*Active*/ for (let a = ['[efy_tab=bg]', '[efy_content=bg]'], b = '[efy_tabs=efyui_filters] >', i = 0; i < a.length; i++) { $(b +' '+ a[i]).setAttribute('efy_active', '')}

$all('[efy_tabs=efyui_filters] form').forEach(y =>{ let z = y.getAttribute('efy_content');
  $append(y, $add('button', {type: 'reset'}, [$add('i', {efy_icon: 'reload'}), 'Reset']));
  for (let a = ['Brightness', 'Blur', 'Saturation', 'Contrast', 'Hue', 'Sepia', 'Invert'], b = ['brightness', 'blur', 'saturate', 'contrast', 'hue-rotate', 'sepia', 'invert'], c = ['0', '0', '0', '0.1', '0', '0', '0'], d = ['3', '100', '3', '3', '360', '1', '1'], e = ['1', '0', '1', '1', '0', '0', '0'], f = ['0.1', '1', '0.1', '0.1', '1', '0.1', '0.1'], i = 0; i < a.length; i++){ $append(y, $add('div', {efy_range_text: `${a[i]}`}, [ $add('input', {class: `efy_${z}_${b[i]}`, type: 'range', min: c[i], max: d[i], value: e[i], step: f[i]}) ] ))}
})
for (let a = ['bg', 'content', 'trans'], j = ['html:before, html:after {filter: ', 'img, video {filter: ', 'details:not([efy_help]), select, input, textarea, blockquote, pre, article, table, [efy_tabs] [efy_content], [efy_timer], [efy_clock] {backdrop-filter: '], k = ['!important}', '!important}', '!important; -webkit-backdrop-filter: '], l = ['', '', '!important}'], i = 0; i < a.length; i++){

$append(document.head, $add('style', {class: `efy_css_${a[i]}_filter`})); let css = $(`.efy_css_${a[i]}_filter`), f = {}, g = `efy_${a[i]}_filter`, h = `${g}_css`,  fn = async ()=>{
    ['blur','brightness','saturate','contrast','hue-rotate','sepia','invert'].forEach(x => { f[x] = $(`.efy_${a[i]}_${x}`).value; if (x == 'blur') { f[x] = f[x] + 'px' } else if (x == 'hue-rotate') { f[x] = f[x] + 'deg' } });

    let string = ''; Object.keys(f).forEach(x =>{ string = string + ` ${x}(${f[x]})` });
    let y; if (a[i] == 'trans'){ y = j[i] + string + k[i] + string + l[i]} else {y= y = j[i] + string + k[i]}
    $text(css, y); localStorage.setItem(g, JSON.stringify(f)); localStorage.setItem(h, y) };

if (localStorage.getItem(g)) { $text(css, localStorage.getItem(h)); let f = JSON.parse(localStorage.getItem(g)); Object.keys(f).forEach(x => $(`.efy_${a[i]}_${x}`).value = f[x].replace('px','').replace('deg','') ) }
$all(`.efy_${a[i]}_filter input`).forEach(x =>{ x.addEventListener("input", fn )});
$all(`.efy_${a[i]}_filter [type=reset]`).forEach(x =>{ x.addEventListener("pointerup", ()=>{ localStorage.removeItem(g); localStorage.removeItem(h); $text(css, ''); x.click() }) })
}}

/*Backup*/ if ($efy_module('efy_backup')){ $append($('.efy_sidebar'), $add('details', {id: 'efy_backup'}, [$add('summary', {}, [ $add('i', {efy_icon: 'arrow_down'}), 'Save & Restore'])]));
for (let a = ['localstorage', 'idb'], b = ['Settings', 'Images'], c = '#efy_backup', i = 0; i < a.length; i++) {
    $append($(c), $add('p', {}, [`EFY ${b[i]}`]));
    $append($(c), $add('a', {href: '#', class: `efy_${a[i]}_export`, download: `efy_${b[i]}.json`}, [
        $add('button', {tabindex: '-1'}, [ $add('i', {efy_icon: 'arrow_down'}), 'Save'])]));
    $append($(c), $add('button', {type: 'reset', class: `efy_${a[i]}_reset`}, [$add('i', {efy_icon: 'reload'}), 'Reset']));
    $append($(c), $add('input', {type: 'file', class: `efy_${a[i]}_import`, accept: '.json'}))
}}

/*Accessibility*/ if ($efy_module('efy_accessibility')){ $append($('.efy_sidebar'), $add('details', {id: 'efy_accessibility', efy_select: ''}, [$add('summary', {}, [ $add('i', {efy_icon: 'accessibility'}), 'Accessibility (Beta)']),
  $add('details', {id: 'efy_btn_align', efy_select: ''}, [$add('summary', {}, ['Menu Button Position']), $add('div', {})]),
  $add('details', {id: 'efy_accessibility_outline', efy_select: ''}, [$add('summary', {}, ['Outline']), $add('p', {}, ["Safari & Webkit don't support custom outline radius yet, so it's not up to efy, but the outline itself works & the radius as well on other browsers."]), $add('input', {id: 'efy_outline', type: 'checkbox', name: 'efy_accessibility'}), $add('label', {for: 'efy_outline'}, ['Focus Outline'])]),
  $add('details', {id: 'efy_accessibility_animations', efy_select: ''}, [$add('summary', {}, ['Animations']), $add('input', {id: 'efy_anim_status', type: 'checkbox', name: 'efy_anim_status'}), $add('label', {for: 'efy_anim_status'}, ['On / Off']),
       $add('div', {efy_range_text: 'Speed'}, [ $add('input', {class: 'efy_anim_speed', type: 'range', min: '0', max: '20', value: '1', step: '0.1'})]), $add('button', {type: 'reset'}, [$add('i', {efy_icon: 'reload'}), 'Reset'])
  ]),
  $add('details', {id: 'efy_accessibility_text', efy_select: ''}, [$add('summary', {}, ['Text Size']), $add('form', {class: 'efy_text_accessibility'}, [
    $add('button', {type: 'reset'}, [$add('i', {efy_icon: 'reload'}), 'Reset']),
    $add('div', {efy_range_text: 'Zoom'}, [ $add('input', {class: 'efy_ui_zoom', type: 'range', min: '1', max: '2', value: '1', step: '0.01'})]),
    $add('div', {efy_range_text: 'Text Spacing'}, [ $add('input', {class: 'efy_text_spacing', type: 'range', min: '0', max: '15', value: '0', step: '1'})])
  ])]),
  $add('details', {id: 'efy_accessibility_cursor', efy_select: ''}, [$add('summary', {}, ['Cursor']), $add('p', {}, ['WARNING! Only hide it on touchscreen devices!'])])
]));
for (let i = 0, a = ['left_top', 'middle_top', 'right_top', 'left_middle', 'middle_middle', 'right_middle', 'left_bottom', 'middle_bottom', 'right_bottom']; i < a.length; i++){ $append($('#efy_btn_align > div'), $add(['input'], {type: 'radio', name: 'efy_btn_align', id: a[i]}))} $('#middle_middle[name=efy_btn_align]').setAttribute('disabled','');

for (let a = ['efy_cursor_default', 'efy_cursor_custom', 'efy_cursor_none'], b = ['Default', 'Custom', 'Hide (Touchscreen)'], c = $('#efy_accessibility_cursor'), i = 0; i < a.length; i++) {
  $append(c, $add('input', {type: 'radio', name: 'efy_accessibility_cursor', id: a[i]}));
  $append(c, $add('label', {for: a[i]}, [b[i]]));
} $('#efy_cursor_default').setAttribute('checked', '');

/*Cursor*/ $append($body, $add('div', {efy_cursor: ''})); /*Storage*/ if (localStorage.efy_cursor == 'custom') {$root.setAttribute('efy_cursor_custom', ''); document.addEventListener('pointermove', cursor_fn); $('#efy_cursor_custom').setAttribute('checked','')} else if (localStorage.efy_cursor == 'none') {$root.setAttribute('efy_cursor_none', ''); $('#efy_cursor_none').setAttribute('checked','')}

/*Custom*/ $('#efy_cursor_custom').addEventListener('change', ()=>{ if ($('#efy_cursor_custom').checked) {$root.removeAttribute('efy_cursor_none'); $root.setAttribute('efy_cursor_custom', ''); document.addEventListener('pointermove', cursor_fn); localStorage.efy_cursor = 'custom'}});

/*None*/ $('#efy_cursor_none').addEventListener('change', ()=>{ if ($('#efy_cursor_none').checked) {$root.removeAttribute('efy_cursor_custom'); $root.setAttribute('efy_cursor_none',''); document.removeEventListener('pointermove', cursor_fn); localStorage.efy_cursor = 'none'}});

/*Default*/ $('#efy_cursor_default').addEventListener('change', ()=>{ if ($('#efy_cursor_default').checked) {$root.removeAttribute('efy_cursor_custom'); $root.removeAttribute('efy_cursor_none'); document.removeEventListener('pointermove', cursor_fn); localStorage.removeItem('efy_cursor')}});


/*Animations*/ a = 'efy_anim_status', b = '--efy_anim_state'; if (localStorage.efy_anim_status == 'off') {$body.style.setProperty('--'+a, '0'); $body.style.setProperty(b, 'paused')} else {$('#'+a).setAttribute('checked', '')}
$('#'+a).onchange = () =>{ if (localStorage.getItem(a) == 'on') { localStorage.setItem(a, 'off'); $body.style.setProperty('--'+a, '0'); $body.style.setProperty(b, 'paused')} else {localStorage.setItem(a, 'on'); $body.style.setProperty('--'+a, '1'); $body.style.setProperty(b, 'running')}}

/* Text Size*/ $append(document.head, $add('style', {class: 'efy_text_accessibility'})); let efy_text_accessibility = $('.efy_text_accessibility'); $all('.efy_text_accessibility input').forEach(x => x.oninput =()=>{ $text(efy_text_accessibility, `:root {--efy_font_size: ${$('.efy_ui_zoom').value}px!important;} html {letter-spacing: ${$('.efy_text_spacing').value}px!important;}`) });
/* Animation Speed*/ $append(document.head, $add('style', {class: 'efy_anim_accessibility'})); let efy_anim_accessibility = $('.efy_anim_accessibility'); $all('#efy_accessibility_animations input').forEach(x => x.oninput =()=>{ $text(efy_anim_accessibility, `:root {--efy_anim_speed: ${$('.efy_anim_speed').value}!important;}`) });
}

/*Audio*/ if ($efy_module('efy_audio')){ $append($('.efy_sidebar'), $add('details', {efy_select: '', id: 'efy_audio'}, [
    $add('summary', {}, [ $add('i', {efy_icon: 'audio'}), 'Audio Effects (Beta)']),
    $add('div', {efy_range_text: 'EFY Volume'}, [ $add('input', {class: 'efy_audio_volume', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}) ]),
    $add('div', {efy_range_text: 'Page Volume'}, [ $add('input', {class: 'efy_audio_volume_page', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}) ]),
    $add('p', {}, ['You might have to click / tap on the ssl / lock icon on your browser & allow sounds, to hear them automatically.'])
]));
for (let a = ['status', 'click', 'hover'], b = ['On / Off', 'Click & Tap', 'Mouse Hover'], c = '#efy_audio > summary', d = 'beforebegin', i = 0; i < a.length; i++) {
    $insert($(c), d, $add('input', {type: 'checkbox', name: 'efy_audio', id:`efy_audio_${a[i]}`})); $insert($(c), d, $add('label', {for: `efy_audio_${a[i]}`}, [b[i]]))
}
/*Effects*/ let audioPath = $css_prop('--efy_audio_path'); ['pop','ok','ok2','ok3','ok4','hover','slide','squish','step','error','disabled'].forEach(x => { efyaudio[x] = new Audio(`${audioPath}/${x}.mp3`); efyaudio[x].volume = efyaudio_volume }); $body.addEventListener("pointerdown", ()=>{ if (localStorage.efy_audio_status == 'on' ){ if (localStorage.efy_audio_click == 'on') {
    for (let a = ['ok', 'ok' /*change*/, 'ok2', 'ok4', 'pop', 'slide', 'error', 'disabled', 'step'], b = ['pointerup', 'change', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerdown'], c = ['button:not([disabled], [type=submit], [type=reset], [efy_tab], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button), .video-grid>div', 'input, textarea', '.efy_img_previews [efy_bg_nr]', '[type=submit]', 'summary, select:not([multiple], [disabled]), [efy_tabs] [efy_tab], [efy_alert], [efy_alert] *, .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button', '[efy_sidebar_btn_open], [efy_sidebar_btn_close]', '[type=reset]', '[disabled]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])'], i = 0; i < a.length; i++){ $body.addEventListener(b[i], ()=>{ if (event.target.matches(c[i])) { $audio_play(efyaudio[a[i]]) }})}}
    /*Hover*/ if (localStorage.efy_audio_hover == "on") { $all("summary, select:not([multiple], [disabled]), [type=submit], [type=reset], [efy_sidebar_btn_open], [efy_sidebar_btn_close], .video-grid>div").forEach(x => x.addEventListener("mouseenter",()=> $audio_play(efyaudio.hover) ))}
    /*Online Status*/ for (let a = ['online', 'offline'], b = ['ok', 'error'], i = 0; i < a.length; i++){ window.addEventListener(a[i], ()=>{ $audio_play(efyaudio[b[i]])})}
}}, {once: true});

/*Volume*/ $all('.efy_audio_volume').forEach(a => a.oninput =()=>{ for (let b = Object.keys(efyaudio), i = 0; i < b.length; i++){ efyaudio[b[i]].volume = a.value }});
$all('.efy_audio_volume_page').forEach(a => a.oninput =()=>{ $all('audio, video').forEach(b => b.volume = a.value) })

} /*Sidebar Modules - End*/


/*EFY Button Position*/ if (localStorage.efy_btn_align) { $("#" + localStorage.efy_btn_align).setAttribute('checked', ''); $("[efy_sidebar_btn_open]").setAttribute("efy_btn_align", localStorage.efy_btn_align); } else { let y = $css_prop('--efy_sidebar_button');
$('#'+y).setAttribute('checked', ''); $('[efy_sidebar_btn_open]').setAttribute('efy_btn_align', y);}
$all("[name=efy_btn_align]").forEach(x => { x.onclick = () => { $("[efy_sidebar_btn_open]").setAttribute("efy_btn_align", x.id); localStorage.efy_btn_align = x.id; }; });


/*Checkbox Toggles*/  ["efy_audio_status", "efy_audio_click", "efy_audio_hover", "efy_outline", 'efy_text_status', 'efy_bgcol_status'].forEach(x => { if (localStorage.getItem(x) == "on") {$("#" + x).setAttribute('checked', '');} $("#" + x).onclick = () => { if (localStorage.getItem(x) == "on") { localStorage.setItem(x, "off"); } else { localStorage.setItem(x, "on"); } };});

/*Focus Outline*/ if (localStorage.efy_outline == 'on') {$root.setAttribute('efy_outline', '');}  $('#efy_outline').onchange = () => {$root.toggleAttribute('efy_outline')}
/*Custom Text Color*/ if (localStorage.efy_text_status == 'on') {$root.setAttribute('efy_color_text', '')}  $('#efy_text_status').onchange = () => {$root.toggleAttribute('efy_color_text')}
/*Custom BG Color*/ if (localStorage.efy_bgcol_status == 'on') {$root.setAttribute('efy_color_bgcol', '')}  $('#efy_bgcol_status').onchange = () => {$root.toggleAttribute('efy_color_bgcol')}

/*EFY Menu Toggles*/ $body.addEventListener("click", ()=>{ if (event.target.matches('[efy_sidebar_btn_open]')) {
    $("[efy_sidebar_btn_open]:not([efy_sidebar_btn_open=relative])").style.display = "none";
    $("[efy_sidebar_btn_close]").style.display = "block";
    $(".efy_sidebar").classList.toggle("efy_toggle_efy_sidebar_panel");
    $("body").classList.toggle("efy_toggle_efy_sidebar");
}});
/*Close*/ $("[efy_sidebar_btn_close]").onclick = () => { $(".efy_sidebar").classList.toggle("efy_toggle_efy_sidebar_panel"); $("body").classList.toggle("efy_toggle_efy_sidebar"); $("[efy_sidebar_btn_open]:not([efy_sidebar_btn_open=relative])").style.display = "block"; $("[efy_sidebar_btn_close]").style.display = "none"; };


/*Change bg image*/ $append(document.head, $add('style', {class: 'efy_css_bgimg'})); let efy_css_bgimg = $('.efy_css_bgimg');

/*Background image*/ let db; $("#idb_addimg").addEventListener("change", efy_add_bgimg);
let request = indexedDB.open('efy');
request.onerror = () => console.error("efy: Can't open db");
request.onsuccess = e => (db = e.target.result);
request.onupgradeneeded = e => { let db = e.target.result; db.createObjectStore("images", { keyPath: "id", autoIncrement: true }); db.createObjectStore("settings", { keyPath: "id", autoIncrement: true }); };

async function efy_add_bgimg(e) { let read = new FileReader(); read.readAsDataURL(e.target.files[0]); read.onload = e => { let ob = { data: e.target.result };
    db.transaction(["images"], "readwrite").objectStore("images").add(ob).onerror = e =>{ console.error(e)};

async function efy_bg_update_fn2(){ let request2 = indexedDB.open('efy');
request2.onsuccess = () => { let efy_count_img2 = 0, transaction2 = request2.result.transaction(["images"], "readonly"), invoiceStore2 = transaction2.objectStore("images"), getCursorRequest2 = invoiceStore2.openCursor();
    getCursorRequest2.onerror = () => console.error("efy: no db entries");
    getCursorRequest2.onsuccess = e => { let cursor2 = e.target.result;
        if (cursor2) { efy_count_img2++; cursor2.continue(); }
        else { /*Set bgimg nr*/ localStorage.efy_bg_nr = efy_count_img2;
             /*Restore Background*/ $text(efy_css_bgimg, `html:before, html:after {background: url(${read.result})!important; background-size: cover!important} html {background: var(--efy_text2)!important}`);
            /*Add Preview*/ $append($('.efy_img_previews'), $add('div', {efy_bg_nr: efy_count_img2, style: `background: url(${read.result})`})); $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); $('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]').setAttribute('efy_active','');
             /*Preview Click*/ let y = $('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]'); y.onclick = () => { $text(efy_css_bgimg, `html:before, html:after {background: url(${read.result})!important; background-size: cover!important} html {background: var(--efy_text2)!important}`); localStorage.efy_bg_nr = efy_count_img2; $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active',''); };
        }
    };};
} efy_bg_update_fn2();

};}

/*Count images*/ async function efy_bg_update_fn(){ request = indexedDB.open('efy');
request.onsuccess = () => { let efy_count_img = 0, transaction = request.result.transaction(["images"], "readonly"), invoiceStore = transaction.objectStore("images"), getCursorRequest = invoiceStore.openCursor();
    getCursorRequest.onerror = () => console.error("efy: no db entries");
    getCursorRequest.onsuccess = e => { let cursor = e.target.result;
        if (cursor) { efy_count_img++; let req = invoiceStore.get(efy_count_img);
            req.onsuccess = e => { let x = e.target.result.data;
                /*Preview Click*/ $append($('.efy_img_previews'), $add('div', {efy_bg_nr: efy_count_img, style: `background: url(${x})`})); let y = $('.efy_img_previews [efy_bg_nr="'+efy_count_img+'"]'); y.onclick = () => { $text(efy_css_bgimg, `html:before, html:after {background: url(${x})!important; background-size: cover!important} html {background: var(--efy_text2)!important; background-size: cover!important}`); localStorage.efy_bg_nr = e.target.result.id; $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active','')};
            }; cursor.continue();
        } else { /*Check bgimg number*/ let bgnr; if (localStorage.efy_bg_nr) { bgnr = JSON.parse(localStorage.efy_bg_nr); } else { bgnr = 1; }
            /*Restore Background*/ if (efy_count_img > 0) { invoiceStore.get(bgnr).onsuccess = e => { let x = e.target.result.data, y = e.target.result.id; $text(efy_css_bgimg, `html:before, html:after {background: url(${x})!important; background-size: cover!important}`); $('.efy_img_previews [efy_bg_nr="'+y+'"]').setAttribute('efy_active','')}}
            /*Remove BG - Button*/ $all(".efy_idb_reset").forEach(z =>{ z.onclick = () => { indexedDB.deleteDatabase("efy"); location.reload()}});
}};};} efy_bg_update_fn();

/*Export IndexedDB*/ (async () => { try {
    let dbExists = await new Promise(resolve => { let request = window.indexedDB.open('efy');
        request.onupgradeneeded = e => { e.target.transaction.abort(); resolve(false); };
        request.onerror = () => resolve(true); request.onsuccess = () => resolve(true); });
    if (!dbExists) { throw new Error("efy: db doesn't exist")}

    let idbDatabase = await new Promise((resolve, reject) => { let request = window.indexedDB.open('efy');
        request.onerror = () => reject("efy: Can't open db");
        request.onsuccess = () => resolve(request.result); });
    let json = await new Promise((resolve, reject) => { let exportObject = {};
        if (idbDatabase.objectStoreNames.length === 0) { resolve(JSON.stringify(exportObject)); }
        else { let transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readonly");
            transaction.addEventListener("error", reject);

            for (let storeName of idbDatabase.objectStoreNames) { let allObjects = [];
                transaction.objectStore(storeName).openCursor().addEventListener("success", event => { let cursor = event.target.result;
                    if (cursor) { /*Store data*/ allObjects.push(cursor.value); cursor.continue();}
                    else { /*Store completed*/ exportObject[storeName] = allObjects;
                        if (idbDatabase.objectStoreNames.length === Object.keys(exportObject).length) { resolve(JSON.stringify(exportObject)); } } }); } } });

    $(".efy_idb_export").addEventListener('click', async () => { efyaudio.ok4.cloneNode().play(); event.target.href = "data:application/json," + json });
} catch (err) { console.error(err) } })();

/*Import indexedDB*/ let efy_idb_import = $(".efy_idb_import");
efy_idb_import.addEventListener("change", () => { let file = efy_idb_import.files[0], read = new FileReader();
    read.onload = async () => { let data = JSON.parse(read.result);
        function importIDB(storename = "images", storename2 = "settings", arr = data["images"], arr2 = data["settings"]) {
            return new Promise(resolve => { let r = window.indexedDB.open("efy");
                r.onupgradeneeded = () => { let idb = r.result; idb.createObjectStore(storename, { keyPath: "id", autoIncrement: true }); idb.createObjectStore(storename2, { keyPath: "id", autoIncrement: true }); };
                r.onsuccess = () => { let idb = r.result, store = idb.transaction(storename, "readwrite").objectStore(storename), store2 = idb.transaction(storename2, "readwrite").objectStore(storename2);
                    for (let obj of arr) { store.put(obj)} for (let obj of arr2) { store2.put(obj)} resolve(idb);
                }; r.onerror = e => console.log(e.target.errorCode) })}
await importIDB() }; read.readAsText(file) });


/*Save & Restore Preferences*/ $('.efy_localstorage_export').onclick =()=>{ let x=''; Object.entries(localStorage).forEach(([k,v])=>{ if (k.includes('efy')){ x=x+ JSON.stringify(k, null, 2)+' :'+JSON.stringify(v, null, 2) +',\n'; } }); $('.efy_localstorage_export').href = "data:application/json," + '{\n'+x.slice(0,-2)+'\n}'};

/*Import Settings*/ let efy_localstorage_import = $('.efy_localstorage_import'); efy_localstorage_import.addEventListener('change', function() {
	let file = efy_localstorage_import.files[0], read = new FileReader();
	read.onload = function() { Object.entries(JSON.parse(read.result)).forEach(([k,v])=>localStorage.setItem(k,v)); location.reload() }
	read.readAsText(file); });

/*Reset Settings*/ $all(".efy_localstorage_reset").forEach(x =>{ x.onclick = () => { Object.entries(localStorage).forEach(([k])=>{ if (k.includes('efy')){ localStorage.removeItem(k)} }); location.reload() }});

/*EFY Tabs*/ $all('[efy_tabs]').forEach(z => { let x = '[efy_tabs='+z.getAttribute('efy_tabs')+'] > ';
    $all(x+'[efy_tab]').forEach(y => { let txt = y.textContent; $text(y, ''); $append(y, $add('code', {}, [txt])); y.onclick = e => { let efy_tab = e.target.getAttribute('efy_tab');
        $all(x+'[efy_tab]').forEach(y => y.removeAttribute('efy_active') ); e.target.setAttribute('efy_active', '');
        $all(x+'[efy_content]').forEach(y => y.removeAttribute('efy_active') ); $(x+' [efy_content="'+efy_tab+'"]').setAttribute('efy_active', '');
} }); });

/*EFY Range Text*/ (async ()=>{ $all('[efy_range_text]').forEach(a => { let b = a.getAttribute('efy_range_text'), c = $$(a, '[type=range]');
    $insert(a, 'afterbegin', $add('p', {}, [`${b}: ${c.value}`]));
    c.addEventListener('input', ()=>{ $text($$(a, 'p'), `${b}: ${event.target.value}`) });
}); $all('form[class*=efy]').forEach(x =>{ x.addEventListener('reset', ()=>{
        $$all(x, '[efy_range_text]').forEach(y =>{ $text($$(y, 'p'), `${y.getAttribute('efy_range_text')}: ${$$(y, '[type=range]').value}`) })
})})})()

/*Clock & Timer*/ function efy_time_0(i){ if (i < 10){i = '0' + i} return i}

/*Clock*/ $wait(1, async ()=>{let t = new Date(), h = t.getHours(), m = t.getMinutes(); m = efy_time_0(m); $all('[efy_clock]').forEach(x =>{ $text(x, h+':'+m)}) });

/*Timer*/ $all('[efy_timer]').forEach(y => { $append(y, $add('div', {efy_text: ''}, ['00:00:00'])); $append(y, $add('button', {efy_start: ''})); $append(y, $add('button', {efy_reset: ''}));

let x = '[efy_timer='+y.getAttribute('efy_timer')+'] ', play = $(x+'[efy_start]'), reset= $(x+'[efy_reset]'), timer_text = $(x+'[efy_text]'), interval, [hour,minute,second,h,m,s] = [0,0,0,'00','00','00'];
play.addEventListener("click", () => {clearInterval(interval); play.toggleAttribute('efy_active'); if (play.hasAttribute('efy_active')) { interval = setInterval(() => { second++;
    s = efy_time_0(second); if (second > 59) {s = '00'; second = 0; minute++;
    m = efy_time_0(minute); if (minute > 59) {m = '00'; minute = 0; hour++;
    h = efy_time_0(hour);
}} $text(timer_text, h+':'+m+':'+s) }, 1000); } else { clearInterval(interval) } });
reset.addEventListener("click", () => {clearInterval(interval); [hour,minute,second,h,m,s] = [0,0,0,'00','00','00']; $text(timer_text, "00:00:00"); play.removeAttribute('efy_active')}); });

/*Search Filter */ $all('[efy_search]').forEach(a =>{ let search = a.getAttribute('efy_search'), container = `#${a.id}[efy_search="${search}"]`;
$all(container +' [efy_search_input]').forEach(z =>{ z.addEventListener('keyup', ()=>{ let val = z.value.toLowerCase();
$all(container +' '+ search).forEach(x =>{ if (x.innerHTML.toLowerCase().includes(val) == 0) {x.setAttribute('efy_display_none','')} else {x.removeAttribute('efy_display_none')}})})})});

/*Alerts*/ $insert($body, 'afterbegin', $add('div', {efy_alerts: ''})); $body.addEventListener("pointerup", ()=>{ if (event.target.matches('[efy_alert]')) { let a = event.target; a.classList.add('efy_anim_remove'); $wait($css_prop('--efy_anim_speed') * 0.05, ()=>{ a.remove() }) }});

/*Online Status*/ for (let a = ['offline', 'online'], b = ["You're OFFLINE", "You're back ONLINE"], c = ['Maybe check your internet connection?', 'Reload the page if needed'], i = 0; i <a.length; i++) { window.addEventListener(a[i], () =>{ $append($('[efy_alerts]'), $add('div', {efy_alert: '', class: `efy_alert_${a[i]}`}, [$add('div', {}, [$add('h6', {}, [b[i]]), $add('p', {}, [c[i]])]), $add('button', {efy_btn_square: ''}, [$add('i', {efy_icon: 'remove'})])]))})}

}; export {$, $all, $$, $$all, $body, $root, $add, $append, $insert, $create, $css_prop, $efy_module, $ready, $audio_play}
