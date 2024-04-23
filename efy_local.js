let efy_version = '24.04.23 Beta', $ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document),
$head, $body, $root, $efy_module, efy = {}, efy_lang = {}, efy_audio = {volume: 1}, $save =()=>{},
/*Add: Selector, optional: {Attributes}, [Text, Children], Parent, Position*/
$add =(tag, attrs = {}, children = [], parent = document.body, position = 'beforeend')=>{
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([attr, value])=>{
        if (element.getAttribute(attr) !== value){ element.setAttribute(attr, value)}
    }); if (!Array.isArray(children)){ children = [children]}
    children.forEach(child =>{
        if (Array.isArray(child)){ const [tag, attrs, content] = child,
            childElement = $add(tag, attrs, content, element);
            element.appendChild(childElement);
        } else if (typeof child === 'string'){ element.textContent += child}
        else if (child instanceof Node){ element.appendChild(child)}
    }); parent.insertAdjacentElement(position, element); return element;
},
/*Text: Selector, Text, Position (optional)*/ $text = (a, b, c) =>{ c ? a.insertAdjacentText(c,b) : a.textContent = b},
$css_prop =(prop, value, position = $root)=>{ if (value){ position.style.setProperty(prop, value)}
    else { let value = getComputedStyle(position).getPropertyValue(prop);
        if (value.startsWith(' ')){ value = value.slice(0,1)}; return value
}},
/*Event*/ $event =(a,b,c,d)=>{ d ? a.addEventListener(b,c,d) : a.addEventListener(b,c) },
/*Remove Event*/ $event_rm = (a,b,c,d) =>{ d ? a.removeEventListener(b,c,d) : a.removeEventListener(b,c) },
/*Ready: Selector, Function, 1 (optional)*/ $ready =(sel, fn, once)=>{ let d = document.documentElement; if (once == 1){
        return new Promise((res) =>{ let b = $(sel); if (b){res(b); return}
        new MutationObserver((m, x) =>{ Array.from($all(sel)).forEach((c) =>{ res(c); x.disconnect() })}).observe(d, { childList: true, subtree: true })}).then(() => fn(sel.selector))
    } else { let a = [{sel, fn}], o, check =()=>{
        for (let {sel, fn} of a) { let e = Array.from($all(sel));
            for (let a of e){ if (!a.$ready){ a.$ready = true; fn(a,a)}}
    }}; if (!o){ o = new MutationObserver(check).observe(d, {childList: true, subtree: true})} check()
}},
/*Cursor FN*/ cursor_fn =(e)=>{let x = $('[efy_cursor]'); x.style.left = e.pageX + 'px'; x.style.top = e.pageY + 'px'},
/*Audio Play*/ $audio_play = async (a,b)=>{ try { a.pause(); a.currentTime = 0; a.play(); if (b == 'loop'){ $event(a, 'ended', ()=>{ a.pause(); a.currentTime = 0; a.play()}, false)}} catch {/**/}},
/*Wait: Seconds, FN*/ $wait =(a,b)=> setTimeout(b,a*1000),
/*Custom QuerySelectors*/ $$ =(a,b)=> a.querySelector(b), $$all =(a,b)=> a.querySelectorAll(b),
/*Notify*/ $notify =(seconds, title, info, lang, callback)=>{ let selectors = [];
    const presets = {'short': 5, 'long': 30, 'infinite': 600}, startTime = Date.now(), id = 'alert' + startTime, i = $('.efy_quick_notify i');
    seconds = presets[seconds] !== undefined ? presets[seconds] : seconds; let current = seconds;
    const icon_fn =()=>{ let icon = ($all('.efy_quick_notify_content [efy_alert]').length > 0) ? 'notify_active' : 'notify'; i.setAttribute('efy_icon', icon)};
    if (lang == 'lang'){ title = efy_lang[title]; info = efy_lang[info]}

    ['[efy_alerts]', '.efy_quick_notify_content'].map(e =>{
        const time_left = (e == '[efy_alerts]') ? ['div', {class: 'time_left'}, String(seconds)] : '';
        selectors.push( $add('div', {efy_alert: '', class: id}, [
            ['div', {}, [['h6', {}, title], ['p', {}, info]]], ['div', {class: 'remove_timer'}, [
                time_left, ['button', {efy_btn_square: '', class: 'remove'}, [['i', {efy_icon: 'remove'}]]]
        ]]], $(e)) );
    }); icon_fn();

    efy_timer_interval = setInterval(()=>{ const element = $(`.${id} .time_left`);
        current = seconds - (Math.floor((Date.now() - startTime) / 1000));
        element ? element.textContent = current : clearInterval(efy_timer_interval);
    }, 1000);

    if (callback) callback(selectors);

    $wait(seconds, ()=>{ clearInterval(efy_timer_interval);
        try {$(`[efy_alerts] .${id}`).remove()} catch {/**/}
        icon_fn()
    });
},
/*Convert seconds to hh:mm:ss*/ $sec_time =(a)=>{
    const h = Math.floor(a / 3600).toString().padStart(2,'0'), m = Math.floor(a % 3600 / 60).toString().padStart(2,'0'), s = Math.floor(a % 60).toString().padStart(2,'0'); return `${h}:${m}:${s}`
};

/*After Page Loads*/ window.onload = async ()=>{ $root = $(":root"), $head = document.head, $body = document.body; let modules_array = $css_prop('--efy_modules').replaceAll(' ', '').split(',');
    $efy_module = (a) =>{ let b = modules_array.includes(a) ? true : false; return b}; let a, b;

/*Check LocalStorage*/ try { if (localStorage.efy){ efy = JSON.parse(localStorage.efy)} $save =()=>{ localStorage.efy = JSON.stringify(efy)}
} catch { $wait(2, ()=>{
    $add('div', {class: 'efy_no_ls', efy_card: ''}, [ ['h6', {efy_lang: 'localstorage_off'}], ['p', {efy_lang: 'localstorage_off_text'}] ], $('.efy_sidebar > [efy_about]'), 'afterend')
})}

/*Translations*/ efy.folder = $css_prop('--efy_folder'); if (efy.lang_code == undefined){ efy.lang_code = $css_prop('--efy_lang_code')}
$add('link', {href: `${efy.folder}/lang/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: ''}, [], $head);
$add('link', {href: `${$css_prop('--efy_lang_folder')}/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: '', class: 'efy_lang_app_file'}, [], $head);

/*Responsive 100vh*/ const $100vh =()=>{ $css_prop(`--efy_100vh`, (visualViewport.height * visualViewport.scale).toFixed(2) + 'rem')}; $100vh();
$event(window.visualViewport, 'resize', $100vh); $event(window.visualViewport, 'orientationchange', $100vh);

/*Sidebar Modules*/ $add('div', {id: 'efy_sidebar', class: 'efy_sidebar', efy_search: 'details:not(.efy_quick_shortcuts, [efy_logo]), .efy_sidebar [efy_tabs] > *'}, [
    ['div', {efy_about: ''}, [
        ['div', {class: 'efy_flex'}, [
            ['button', {class: 'efy_about', efy_toggle: '.efy_about_div', efy_logo: ''}, [ ['p', {}, 'EFY'], ['p', {}, ' UI'] ]],
            ['button', {class: 'efy_quick_notify efy_square_btn', efy_toggle: '.efy_quick_notify_content'}, [['i', {efy_icon: 'notify'}]]],
            ['button', {class: 'efy_quick_search efy_square_btn', efy_toggle: '#efy_sidebar [efy_search_input]'}, [['i', {efy_icon: 'search'}]]],
            ['button', {id: 'efy_quick_toggle', efy_toggle: '#efy_quick', class: 'efy_square_btn', title: 'Quick shortcuts'}, [['i', {efy_icon: 'star'}]]]
        ]],
        ['button', {efy_sidebar_btn: 'close', class: 'efy_square_btn'}, [['i',{efy_icon: 'remove'}]]],
    ]],
    ['div', {efy_card: '', class: 'efy_about_div efy_hide_i'}, [
        ['mark', {efy_lang: 'version'}, [`: ${efy_version}`]], ['p', {efy_lang: 'sidebar_about_text'}],
        ['div', {class: 'efy_flex'}, [
            ['a', {href: 'https://efy.ooo', role: 'button', efy_lang: 'website'}],
            ['a', {href: 'https://github.com/dragos-efy/efy', role: 'button'}, 'Github'],
            ['a', {href: 'https://matrix.to/#/#efy_ui:matrix.org', role: 'button'}, 'Matrix'],
            ['a', {href: 'https://translate.codeberg.org/projects/efy', role: 'button', efy_lang: 'translations'}]
        ]]
    ]], ['div', {id: 'efy_modules'}],
    ['details', {id: 'efy_sbtheme', efy_select: ''}, [
        ['summary', {efy_lang: 'theme'}, [['i', {efy_icon: 'star'}]]],
        ['div', {efy_tabs: 'efy_theme'}, [['div', {class: 'efy_tabs'}]]]
    ]]
]);
$add('div', {efy_sidebar_btn: 'absolute'});
$add('video', {class: 'efy_3d_bg', autoplay: '', loop: '', muted: '', playsinline: ''});

/*Quick Shortcuts*/ if ($efy_module('efy_quick')){ let a = $('[efy_about]');
    $add('input', {type: 'text', efy_search_input: '', class: 'efy_hide_i', placeholder: 'Search through menu...', name: 'efy_name'}, [], a, 'afterend');
    $add('div', {class: 'efy_quick_notify_content efy_hide_i', efy_card: ''}, [], a, 'afterend');

    $add('div', {id: 'efy_quick', class: 'efy_quick_shortcuts efy_hide_i', efy_card: ''}, [
        ['div', {class: 'efy_quick_buttons efy_flex'}, [ ['div', {efy_clock: ''}] ]]
    ], a, 'afterend');

    ['reload', 'fullscreen', 'back', 'forward'].forEach((a, i) => { let b = ['reload', 'fullscreen', 'chevron', 'chevron'][i];
    $add('button', {'class': `efy_quick_${a} efy_square_btn`}, [['i', {efy_icon: b}]], $('.efy_quick_buttons'));
    });

    $event($(".efy_quick_reload"), 'click', ()=> location.reload());
    $event($(".efy_quick_fullscreen"), 'click', ()=> document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
    ['back', 'forward'].map(a =>{ $event($(`.efy_quick_${a}`), 'click', ()=> window.history.go(a === 'back' ? -1 : 1)) });
}

/*Theme*/

/*Tabs*/ ['mode', 'colors', 'size', 'menu'].map(a =>{
    const tab = $add('button', {efy_tab: a, efy_lang: a}, [], $('[efy_tabs=efy_theme] .efy_tabs')),
    content = $add('div', {efy_content: a, efy_select: '', id: `efy_${a}`}, [], $('[efy_tabs=efy_theme]'));
    if (a == 'mode'){ tab.setAttribute('efy_active', ''); content.setAttribute('efy_active', '')}
});

/*Colors*/ b = $('#efy_sbtheme [efy_content=colors]');
let css = $css_prop(`--efy_color`).split(', ');
css.map((a,i) => css[i] = `${i+1} ${a}`);
let colors = efy.colors ? String(efy.colors) : css;

let container = $add('div', {id: 'efy_gradient', efy_tabs: 'container', efy_color: `${colors}, range:1-18`}, [], b);
$add('div', {efy_lang: 'angle', efy_range_text: 'Angle'}, [
    ['input', {class: 'efy_color_angle_input', type: 'range', min: '0', max: '360', value: '165', step: '1'}]
], b);

const update_color =(angle)=>{ let [alpha, gradient, gradient_trans, gradients, colors] = [[],[],[],[],[]];
    const contents = $$all(container, '[efy_content]');
    if (!angle){ angle = $('.efy_color_angle_input').value + 'deg'}

    contents.forEach((form, i)=>{ alpha.push($$(form, `.alpha`).value);
        const ok = `${$$(form, '.lightness').value} ${$$(form, '.chroma').value} ${$$(form, '.hue').value}`;
        colors.push(`${i+1} ${ok} ${alpha[i]}`);
        gradient.push(`oklch(${ok} / ${alpha[i]})`);
        gradient_trans.push(`oklch(${ok} / ${ (alpha[i] / 3).toFixed(2) })`);
    });

    gradients = (contents.length > 1) ? [gradient, gradient_trans] : [`${gradient}, ${gradient}`, `${gradient_trans}, ${gradient_trans}`];
    efy.colors = colors; $save();
    ['', '_trans'].map((a,i)=> $css_prop(`--efy_color${a}`, `linear-gradient(${angle}, ${gradients[i]})` ));
};

/*Restore Gradient*/ if (efy.colors){ let gradient = [[],[]];
    const angle = efy.color_angle || `${$('.efy_color_angle_input').value}deg`;
    efy.colors.forEach(a=>{ a = a.split(' '); for (let i = 0; i < 2; i++){
        gradient[i].push(`oklch(${a[1]} ${a[2]} ${a[3]} / ${i === 0 ? a[4] : (a[4] / 3).toFixed(2)})`)
        if (efy.colors.length < 2) gradient[i].push(...gradient[i]);
    }});
    ['', '_trans'].map((a,i)=> $css_prop(`--efy_color${a}`, `linear-gradient(${angle}, ${gradient[i]})`));
} else { $ready('#efy_gradient .alpha', update_color, 1)}

$event($('.efy_color_angle_input'), 'input', ()=> update_color());
$event(container, 'input', ()=> update_color());
$event(container, 'click', (e)=>{ const x = e.target;
    if (x.matches('.color_add') || x.matches('.color_remove')) update_color();
});

$add('div', {class: 'efy_hr_div'}, [ ['details', {efy_help: 'custom_colors'}, [
    ['summary', {}, [['p', {efy_lang: 'custom_colors'}], ['hr']]], ['div', {efy_lang: 'custom_colors_help'}]
]]], b);


$add('div', {class: 'efy_custom_colors', efy_color: `Text 0.5 0.2 0 1 efy_color_text, Background 0.7 0.2 100 1 efy_color_bgcol, Border 0.7 0.2 100 1 efy_color_bordercol, Button 0.7 0.2 100 1 efy_color_buttoncol`}, [], b);

$ready(`[for=efy_color_buttoncol]`, ()=>{

    ['text', 'bgcol', 'bordercol', 'buttoncol'].map((a,i)=>{
        const j = i + 1, id = `efy_${a}_status`, begin = [[], $(`.efy_custom_colors [efy_content="${j}"]`), 'afterbegin'];
        $add('label', {for: id, efy_lang: 'active'}, ...begin); $add('input', {id: id, type: 'checkbox'}, ...begin);
        if (efy[a] !== undefined) $css_prop(`--efy_color_${a}_var`, efy[a]);
    });

    /*Checkbox Toggles*/  'audio_status audio_click audio_hover outline text_status bgcol_status bordercol_status buttoncol_status trans_filter_menu'.split(' ').forEach(x =>{
        if (efy[x] == 'on'){ $(`#efy_${x}`).setAttribute('checked', '')}
        $event($(`#efy_${x}`), 'click', ()=>{
            efy[x] == 'on' ? delete efy[x] : efy[x] = 'on'; $save()
        })
    });
    /*Focus Outline*/ if (efy.outline == 'on'){$root.setAttribute('efy_outline', '')} $('#efy_outline').onchange =()=>{$root.toggleAttribute('efy_outline')}
    /*Custom Text Color*/ if (efy.text_status == 'on'){$root.setAttribute('efy_color_text', '')} $('#efy_text_status').onchange =()=>{$root.toggleAttribute('efy_color_text')}
    /*Custom BG Color*/ if (efy.bgcol_status == 'on'){$root.setAttribute('efy_color_bgcol', '')} $('#efy_bgcol_status').onchange =()=>{$root.toggleAttribute('efy_color_bgcol')}
    /*Custom BG Color*/ if (efy.bordercol_status == 'on'){$root.setAttribute('efy_color_bordercol', '')} $('#efy_bordercol_status').onchange =()=>{$root.toggleAttribute('efy_color_bordercol')}
    /*Custom Button Color*/ if (efy.buttoncol_status == 'on'){$root.setAttribute('efy_color_buttoncol', '')} $('#efy_buttoncol_status').onchange =()=>{$root.toggleAttribute('efy_color_buttoncol')}

    /*Keyboard Accessibility*/
    $event($('.efy_custom_colors .efy_tabs'), 'keydown', (event)=>{
        const inputs = Array.from($all('.efy_custom_colors .efy_tabs .efy_tab input')), index = inputs.indexOf(document.activeElement);

        if (event.key === 'Tab'){ event.shiftKey ? inputs[0].focus() : index !== inputs.length - 1 ? inputs[inputs.length - 1].focus() : null}
        if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) { event.preventDefault();
            const index2 = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + inputs.length) % inputs.length; inputs[index2].focus();
        }
    });

},1);

/*Shadows*/ const efy_shadows = $add('div', {class: 'efy_shadows'}, [], b); let efy_shadow = [];

/*Set*/ ['button', 'trans'].map(type =>{ const key = `shadow_${type}`,
    shadows = `.efy_shadows .efy_shadows_${type}`; let b = [], colors = [];

    if (efy[key]){ efy_shadow.push(type);
        efy[key].map((a,i)=> colors.push(`${i+1} ${a.lightness} ${a.chroma} ${a.hue} ${a.alpha}`))
    }
    // $add('p', {}, `Shadows: ${type.charAt(0).toUpperCase() + type.slice(1)}`, efy_shadows);
    $add('div', {class: 'efy_hr_div'}, [['p', {}, `Shadows: ${type.charAt(0).toUpperCase() + type.slice(1)}`], ['hr']], efy_shadows);

    $add('div', {class: `efy_shadows_${type}`, efy_color: `${(colors.length === 0) ? '' : `${colors}, `}range:0-10`}, [], efy_shadows);

    $ready(`${shadows} .alpha`, ()=>{
        const set_css =(style, style_button)=>{
            $css_prop(`--efy_${key}`, style); if (type === 'button') $css_prop(`--efy_${key}_trans`, style_button);
        };

        /*Restore*/ if (efy[key]){ let [style, style_button] = [[],[]];
            efy[key].map((a,i)=>{
                const props = a, j = i+1, c = $(`${shadows} [efy_content="${j}"]`),
                [L, C, H, A] = [$$(c, '.lightness'), $$(c, '.chroma'), $$(c, '.hue'), $$(c, '.alpha')],
                ok = [props.lightness, props.chroma, props.hue], lch = `, oklch(${ok})`;
                [[style, props.alpha], [style_button, (props.alpha / 3).toFixed(2)]].map(a=> a[0].push(`${props.css} ${a[1]})`))
                [L.value, C.value, H.value, A.value] = [...ok, props.alpha];
                [[L, `oklch(0 0 0)${lch}, #fff)`], [C, `oklch(0.5 0 0)${lch})`], [A, `transparent${lch})`]]
                .forEach(x=> x[0].style.background = `linear-gradient(to right, ${x[1]}`);
            });
            set_css(style, style_button);
        }

        /*Set*/ $event($(shadows), 'input', ()=>{ if (event.target.matches('input')){ let [array, style, style_button] = [[],[],[]];
            $all(`${shadows} [efy_content]`).forEach((a,i)=>{
                const [inset, x, y, blur, spread, lightness, chroma, hue, alpha] = [
                    $$(a, `#efy_shadow_${type}_inset${i}`).checked, $$(a, '.x').value, $$(a, '.y').value,
                    $$(a, '.blur').value, $$(a, '.spread').value, $$(a, '.lightness').value,
                    $$(a, '.chroma').value, $$(a, '.hue').value, $$(a, '.alpha').value,
                ], css = `${(inset) ? 'inset ': ''}${x}rem ${y}rem ${blur}rem ${spread}rem oklch(${lightness} ${chroma} ${hue} /`;
                array.push({inset: inset, x: x, y: y, blur: blur, spread: spread, lightness: lightness, chroma: chroma, hue: hue, alpha: alpha, css: css});
                [[style, alpha], [style_button, (alpha / 3).toFixed(2)]].map(a=> a[0].push(`${css} ${a[1]})`))
            });
            set_css(style, style_button); efy[key] = array; $save();

            if (!efy_shadow.includes(type)) efy_shadow.push(type);
            $root.setAttribute('efy_shadow', efy_shadow);
        }});

    }, 1);
}); if (efy_shadow !== []) $root.setAttribute('efy_shadow', efy_shadow);

/*Color Picker | Name color1 id, lang:Name color2 id, range:min-max*/ let unique = 0;
$ready('[efy_color]', (a)=>{ const now = `colors_${Date.now()}${unique}`; unique++;
    let [colors, names, lightnesses, chromas, hues, alphas, ids, min, max] = [[],[],[],[],[],[],[], 1, 9];
    a.setAttribute('efy_tabs', now); $add('div', {class: 'efy_tabs', efy_select: ''}, [], a);

    a.getAttribute('efy_color').replaceAll(', ', ',').split(',').map((x,i) =>{ let ok = x.split(' '), name = ok[0];
        // Find a Solution | name = getComputedStyle($('[efy_lang]')).getPropertyValue(`--${ok[0].replace('lang:', '')}`);
        if (ok[0].includes('lang:')) name = ok[0].replace('lang:', '');
        names[i] = name; lightnesses[i] = ok[1] || null; chromas[i] = ok[2] || null;
        hues[i] = ok[3] || null; alphas[i] = ok[4] || null; ids[i] = ok[5] || null;
    });

    const last_name = names[names.length - 1],range_status = last_name.includes('range'), previews = $$(a, '.efy_tabs');
    if (range_status){ [min, max] = last_name.replace('range:', '').split('-');
        [names, lightnesses, chromas, hues, alphas, ids].map(a=> a.pop());
    }; let nr = names.length, last;

    /*Add Buttons: Add, Remove, Copy, Paste*/
    const range_hide = (!range_status) ? ' efy_hide_i' : '', bg = 'background: linear-gradient(to right,';
    [['add', 'plus'], ['remove', 'remove']].map(a =>{
        $add('button', {class: `color_${a[0]}${range_hide}`}, [['i', {efy_icon: a[1]}]], previews);
    }); ['copy', 'paste'].map(a => $add('button', {class: `efy_${a}`, title: a}, [['i', {efy_icon: a}]], previews));
    const add = $$(a, '.color_add'), remove = $$(a, '.color_remove'), copy = $$(a, '.efy_copy'), paste = $$(a, '.efy_paste'),
    toggle_arcp =()=>{ if (range_status){
            (nr < max) ? add.classList.remove('efy_hide_i') : add.classList.add('efy_hide_i');
            (nr > min) ? remove.classList.remove('efy_hide_i') : remove.classList.add('efy_hide_i');
        }; if (nr > min){ copy.classList.remove('efy_hide_i'); paste.classList.remove('efy_hide_i')}
        else if (nr == 0){ copy.classList.add('efy_hide_i'); paste.classList.add('efy_hide_i')}
    }; toggle_arcp();

    const add_color =(start, nr)=>{ for (let i = start; i < nr; i++){ const j = String(i + 1);
        const color = `oklch(${lightnesses[i]} ${chromas[i]} ${hues[i]} / ${alphas[i]})`, inputs = [
            ['hue', 'hue', 360, 1, hues[i]],
            ['saturation', 'chroma', 0.37, 0.01, chromas[i], `${bg} oklch(.5 0 0), ${color})`],
            ['brightness', 'lightness', 1, 0.01, lightnesses[i], `${bg} oklch(0 0 0), ${color}, oklch(1 0 0))`],
            ['alpha', 'alpha', 1, 0.01, alphas[i], `${bg} oklch(0 0 0 / 0), ${color})`]
        ].map(p =>{ return ['div', { efy_lang: p[0], efy_range_text: p[0] }, [
            ['input', { class: p[1], type: 'range', min: 0, max: p[2], step: p[3], value: p[4], style: p[5] }]
        ]]}), id = ids[i] || `${now}_${j}`;
        const content = $add('div', {efy_content: j}, [...inputs], a);
        $add('input', {id: id, type: 'radio', name: now}, [], add, 'beforebegin');
        $add('label', {for: id, efy_tab: j, style: `background: ${color}`}, names[i] || nr, add, 'beforebegin');

        /*Add Shadows*/ ['button', 'trans'].map(type =>{ if (a.classList.contains(`efy_shadows_${type}`)){
            let [inset, x, y, blur, spread] = [false, 0, 0, 0, 0]; const inset_id = `efy_shadow_${type}_inset${i}`, begin = [[], content, 'afterbegin'];
            if (efy[`shadow_${type}`]){
                const props = efy[`shadow_${type}`][i] || efy[`shadow_${type}`][i - 1];
                [inset, x, y, blur, spread] = [props.inset, props.x, props.y, props.blur, props.spread];
            }
            $add('label', {efy_lang: 'inset', for: inset_id}, ...begin); $add('input', {id: inset_id, type: 'checkbox', ...(inset ? {checked: true} : {})}, ...begin);
            [['x', x], ['y', y]].map(a => $add('div', {efy_range_text: a[0], efy_lang: a[0]}, [['input', {class: a[0], type: 'range', min: '-30', max: '30', value: a[1], step: '1'}]], content));
            $add('div', {efy_range_text: 'blur', efy_lang: 'blur'}, [['input', {class: `blur`, type: 'range', min: '0', max: '50', value: blur, step: '1'}]], content);
            $add('div', {efy_range_text: 'spread', efy_lang: 'spread'}, [['input', {class: `spread`, type: 'range', min: '-20', max: '30', value: spread, step: '1'}]], content);
        }});

    }}; add_color(0, nr);

    /*Copy, Paste, Add, Remove*/ $event(previews, 'click', (event)=>{
        let current, active, l, c, h, alpha; const target = event.target; toggle_arcp();
        const match = {
            copy: target.matches('.efy_copy'), paste: target.matches('.efy_paste'),
            add: target.matches('.color_add'), remove: target.matches('.color_remove')
        };
        if (nr !== 0){ active = $$(a, '[efy_content][efy_active]') || $$(a, '[efy_content]:last-of-type');
            current = active.getAttribute('efy_content') - 1;
        }
        if (match.copy || match.paste){ [l, c, h, alpha] =
            [$$(active, '.lightness'), $$(active, '.chroma'), $$(active, '.hue'), alpha = $$(active, '.alpha')]
        }
        if (match.add && (nr < max)){ nr++; last = nr - 1;
            [names[last], lightnesses[last], chromas[last], hues[last], alphas[last]] =
            [String(nr), lightnesses[current], chromas[current], hues[current], alphas[current]];
            if (nr === 0){ add_color(0, 1); active = $$(a, '[efy_content]'); current = active.getAttribute('efy_content')}
            else { add_color(last, nr)}
            $$(a, '[efy_tab]:last-of-type').click();
        }
        else if (match.copy){ const ok = `${l.value} ${c.value} ${h.value} ${alpha.value}`;
            navigator.clipboard.writeText(ok);
            if (efy.notify_clipboard != false) $notify('short', 'Copied to clipboard', ok);
        }
        else if (match.paste){ navigator.clipboard.readText().then(ok =>{
            [l.value, c.value, h.value, alpha.value] = ok.split(' ');
            h.dispatchEvent(new Event('input', { 'bubbles': true }))
        }).catch()}
        else if (match.remove && (nr > min)){ $$all(a, `[efy_tab], [efy_content], input[type=radio]`).forEach(x => x.remove());
            [lightnesses, chromas, hues, alphas].map(x => x.splice(current, 1));
            nr--; last = nr - 1; names = []; for (let i =  1; i <=  nr; i++) { names.push(String(i))}
            add_color(0, nr);
            if (nr !== 0){ const focus = $$(a, `[efy_tab="${current + 1}"]`) || $$(a, '[efy_tab]:last-of-type'); focus.click()}
            else { ['button', 'trans'].map(type =>{ if (a.classList.contains(`efy_shadows_${type}`)){
                efy_shadow = efy_shadow.filter(x => x !== type); $root.setAttribute('efy_shadow', efy_shadow);
                delete efy[`shadow_${type}`]; $save();
            }})}
        }
    });

    $event(a, 'input', (d)=>{ if (d.target.getAttribute('type') == 'range'){
        const active = $$(a, '[efy_content][efy_active]'), current = active.getAttribute('efy_content'),
        l = $$(active, '.lightness').value, c = $$(active, '.chroma').value, h = $$(active, '.hue').value,
        alpha = $$(active, '.alpha').value, ok = `${l} ${c} ${h}`,
        style = [`.5 0 0), oklch(${l} ${c} ${h}))`, `0 0 0), oklch(.5 ${c} ${h}), oklch(1 0 0))`, `0 0 0 / 0), oklch(${l} ${c} ${h}))`];

        /*Update Design*/ ['.chroma', '.lightness', '.alpha'].map((b,i)=>{
            $$(active, b).style.background = 'linear-gradient(to right, oklch(' + style[i]
        }); $$(a, `[efy_tab="${current}"]`).style.background = `oklch(${ok} / ${alpha})`;

        [lightnesses[current-1], chromas[current-1], hues[current-1], alphas[current-1]] = [l, c, h, alpha];

        ['text', 'bgcol', 'bordercol', 'buttoncol'].map(x =>{
            if ($$(a, `[efy_tab="${current}"]`).getAttribute('for') == `efy_color_${x}`){
                $css_prop(`--efy_color_${x}_var`, ok); efy[x] = ok; $save()
        }});
    }});

});


/*Mode*/ (()=>{ const content = $('#efy_sbtheme [efy_content=mode]'),
    themes = [['div', {class: 'defaults'}], ['p', {efy_lang: 'custom'}], ['div', {class: 'custom'}]];
    $add('div', {class: 'current_mode'}, [
        ['div', {class: 'efy_mode_div'}],
        ['div', {class: 'efy_mode_type_div efy_hide_i'}, [
            ['details', {class: 'system_light'}, [['summary', {efy_lang: 'light'}], ...themes]],
            ['details', {class: 'system_dark'}, [['summary', {efy_lang: 'dark'}], ...themes]],
            ['input', {type: 'checkbox', id: 'system_theme_confirmation'}],
            ['label', {for: 'system_theme_confirmation', efy_lang: 'confirm'}]
        ]]
    ], content);
})();

'default switch_light switch_dark system'.split(' ').map(a =>{
    const content = [[], $('#efy_sbtheme [efy_content=mode] .efy_mode_div')], id = `efy_mode_${a}`;
    a = a.replace('switch_', '');
    $add('input', {type: 'radio', name: 'efy_mode', id}, ...content);
    $add('label', {for: id, efy_lang: a}, ...content);
});

$add('div', {class: 'efy_hr_div'}, [
    ['details', {efy_help: 'type', class: 'efy_hide_i'}, [
        ['summary', {}, [['p', {efy_lang: 'type'}], ['hr']]],
        ['div', {efy_lang: 'sidebar_transparency_help'}]
    ]]
], $('#efy_sbtheme [efy_content=mode] .efy_mode_div'), 'afterend');

'solid sepia nord black trans'.split(' ').map(a =>{
    const content = [[], $('#efy_sbtheme .efy_mode_type_div')],
    light = [[], $('#efy_sbtheme .system_light .defaults')],
    dark = [[], $('#efy_sbtheme .system_dark .defaults')];
    ['_trans', 'light_', 'dark_'].forEach(b => a = a.replace(new RegExp(b, 'g'), ''));
    const id = `efy_mode_${a}`, id_light = `efy_mode_light_${a}`, id_dark = `efy_mode_dark_${a}`;

    $add('input', {type: 'radio', name: 'efy_mode_type', id}, ...content);
    $add('label', {for: id, efy_lang: a, class: 'efy_hide_i'}, ...content);

    if (a === 'solid' || a === 'trans'){ const check = (a === 'solid') ? {checked: ''} : null;
        $add('input', {type: 'radio', name: 'efy_mode_system_light', id: id_light, ...check}, ...light);
        $add('label', {for: id_light, efy_lang: a}, ...light);
        $add('input', {type: 'radio', name: 'efy_mode_system_dark', id: id_dark, ...check}, ...dark);
        $add('label', {for: id_dark, efy_lang: a}, ...dark);
    }
    else if (a === 'sepia'){
        $add('input', {type: 'radio', name: 'efy_mode_system_light', id: id_light}, ...light);
        $add('label', {for: id_light, efy_lang: a}, ...light);
    }
    else {
        $add('input', {type: 'radio', name: 'efy_mode_system_dark', id: id_dark}, ...dark);
        $add('label', {for: id_dark, efy_lang: a}, ...dark);
    }
});


$add('div', {class: 'trans_window_div efy_hide_i'}, [
    ['input', {type: 'checkbox', name: 'trans_window', id: `trans_window`}],
    ['label', {for: `trans_window`, efy_lang: 'window'}]
], $('#efy_sbtheme [efy_content=mode] .efy_mode_type_div'));

/*Images*/ $add('div', {id: 'efy_images_bg'}, [
    ['div', {class: 'efy_hr_div'}, [ ['details', {efy_help: 'images'}, [
        ['summary', {}, [['p', {efy_lang: 'images'}], ['hr']]], ['div', {efy_lang: 'sidebar_images_warning_help'}]
    ]]]],
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: 'idb_addimg_bg', type: 'file', accept: 'image/*, video/*', style: 'display: none'}],
        ['label', {for: 'idb_addimg_bg', title: 'Add file', class: 'efy_color', type:'button', role: 'button'}, [['i', {efy_icon: 'plus'}]]],
        ['input', {id: 'idb_remove_toggle', type: 'checkbox', style: 'display: none'}],
        ['label', {for: 'idb_remove_toggle', title: 'Remove', class: 'efy_color', type:'button', role: 'button'}, [['i', {efy_icon: 'remove'}]]],
        ['button', {class: 'efy_idb_reset efy_hide_i', title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
    ]]
], $('#efy_sbtheme [efy_content=mode] .efy_mode_type_div'), 'afterend');

/*Custom Themes*/ const selector = $('#efy_sbtheme [efy_content=mode]');
$add('details', {id: 'efy_themes'}, [
    ['summary', {efy_lang: 'saved_themes'}, [['i', {efy_icon: 'group'}]]], ['hr'],
    ['div', {class: 'themes'}, [
        ['input', {type: 'checkbox', id: 'efy_theme_add', name: 'efy_theme_add', class: 'add efy_square_btn'}],
        ['label', {for: 'efy_theme_add', class: 'add efy_square_btn', title: 'Save'}, [['i', {efy_icon: 'arrow_down'}]]],
        ['input', {type: 'checkbox', id: 'efy_theme_remove', name: 'efy_theme_remove', class: 'remove efy_square_btn'}],
        ['label', {for: 'efy_theme_remove', class: 'remove efy_square_btn', title: 'Remove'}, [['i', {efy_icon: 'remove'}]]],
        ['input', {type: 'checkbox', id: 'efy_theme_edit', name: 'efy_theme_edit', class: 'edit efy_square_btn'}],
        ['label', {for: 'efy_theme_edit', class: 'edit efy_square_btn', title: 'Edit'}, [['i', {efy_icon: 'edit'}]]],
        ['input', {type: 'text', class: 'name efy_square_btn efy_hide_i', placeholder: 'Theme Name...', name: 'efy_themes_name'}]
    ]],
    ['hr'],
    ['p', {}, [
        'Find & Share more themes at ',
        ['a', {href: 'https://efy.ooo/themes'}, 'efy.ooo/themes']
    ]]
], selector);


/*IndexedDB*/ let themes_load_nr = 0, efy_idb = '', idb_themes = '', idb_themes_system = '';

let open_idb =(name = 'efy')=>{
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open(name);
        request.onerror = e => reject("efy: Can't open db");
        request.onsuccess = e =>{
            efy_idb = request.result; resolve(efy_idb);
            if (themes_load_nr === 0) load_themes(efy_idb); themes_load_nr++;
        }
        request.onupgradeneeded = e =>{ const db = e.target.result;
            'bg settings themes themes_system front back button trans'.split(' ').map(a =>{
                db.createObjectStore(a, { keyPath: "id", autoIncrement: true })
        })}
})};


const $switch_theme =(name)=>{
    const theme = idb_themes.find(x => x.name === name),
    change =()=>{
        try { efy = JSON.parse(theme.info); $save()}
        catch {
            const mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (['dark,black'].includes(idb_themes_system[mode])){
                $root.setAttribute('efy_mode', 'dark,black');
            }
        }
        $save()
    };
    change(); // Fix: Gotta change only if system themes are on
    if ($('#system_theme_confirmation').checked && $('#efy_mode_system').checked){
        $notify('infinite', `Set Theme to "${theme.name}?"`, 'The page will reload', '', (where)=>{
        $add('div', {class: 'answers'}, [
            ['button', {class: 'yes', efy_lang: 'yes'}, [['i', {efy_icon: 'reload'}]]],
            ['button', {class: 'empty', efy_lang: 'no'}, [['i', {efy_icon: 'remove'}]]],
        ], where[0]);
        $event($$(where[0], '.yes'), 'click', ()=>{ location.reload()});
    })} else if (!$('#efy_mode_system').checked) { location.reload()}
},

load_themes =(db)=>{
    const transaction = db.transaction(['themes', 'themes_system'], 'readonly');
    transaction.objectStore('themes').getAll().onsuccess =(event)=>{
        idb_themes = event.target.result;
        idb_themes.forEach(a => theme_ui(a));
    };
    transaction.objectStore('themes_system').getAll().onsuccess =(event)=>{
        idb_themes_system = event.target.result[0];
    }
},

theme_ui =(theme)=>{ const edit = $('#efy_theme_edit'),
    button = $add('button', {'data-id': theme.id, spellcheck: false}, theme.name, $$(selector, '.themes'));

    $event(button, 'click', (x)=>{ const btn = x.target;
        /*Remove*/ if ($('#efy_theme_remove').checked){
            theme_actions('remove', Number(btn.getAttribute('data-id'))); btn.remove()
        } /*Switch*/ else if (!edit.checked){ localStorage.efy = theme.info; location.reload()}
    });
    /*Edit*/ $event(button, 'input', (x)=>{ const btn = x.target;
        if (edit.checked){ theme_actions('edit', Number(btn.getAttribute('data-id')), btn.textContent)}
    });
    /*Spacebar Glitch Fix*/ $event(button, 'keypress', (event)=>{ if (event.key === ' ' || event.keyCode === 32){
        const selection = window.getSelection(), range = selection.getRangeAt(0),
        start = range.startContainer.textContent, offset = range.startOffset;
        event.target.textContent = start.slice(0, offset) + '\u00A0' + start.slice(offset);
        for (let i = 0; i < offset + 1; i++){ selection.modify('move', 'forward', 'character')}
    }});

    $wait(0.1, ()=>{
        const transaction = efy_idb.transaction(['themes_system'], 'readonly'),
        store = transaction.objectStore('themes_system');
        store.getAll().onsuccess =(event)=>{ const themes = event.target.result[0];
            ['light', 'dark'].map(mode =>{
                const checked = (themes[mode] === theme.name) ? {'checked': 'true'} : null;
                const parent = [theme.name, $$(selector, `.system_${mode} .custom`)], id = `efy_mode_system_${mode}_${theme.name}`;
                $add('input', {type: 'radio', id: id, name: `efy_mode_system_${mode}`, ...checked}, ...parent);
                $add('label', {for: id}, ...parent);
            });
        }
    });
},

theme_actions =(type, name, new_name)=>{
    const transaction = efy_idb.transaction(['themes'], 'readwrite'),
    store = transaction.objectStore('themes');

    if (type === 'remove'){ store.delete(name)}
    else if (type === 'edit'){
        store.get(name).onsuccess =(event)=>{
            const theme = event.target.result; theme.name = new_name; store.put(theme);
    }} else {
        $$all(selector, '.themes [data-id]').forEach(a => a.remove());
        const info = localStorage.efy, request = store.add({name, info});
        request.onsuccess =(event)=> load_themes(efy_idb);
    }
},

switch_theme_system =(mode)=>{
    const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
    store = transaction.objectStore('themes_system');
    store.getAll().onsuccess =(event)=>{
        $switch_theme(event.target.result[0][mode])
    }
};


$event($('#efy_themes .add'), 'click', (x)=>{
    const name = $('#efy_themes .name'), value = name.value;
    name.classList.toggle('efy_hide_i');
    if (value){ theme_actions('add', value); name.value = ''}
    $notify('short', `Add Themes - ${x.target.checked ? 'ON' : 'OFF'}`, '');
});

$event($('#efy_themes .edit'), 'click', (x)=>{ const checked = x.target.checked;
    $all('#efy_themes .themes > button').forEach(a => a.contentEditable = checked);
    $notify('short', `Rename Themes - ${checked ? 'ON' : 'OFF'}`, '');
});

$event($('#efy_themes .remove'), 'click', (x)=>{
    $notify('short', `Remove Themes - ${x.target.checked ? 'ON' : 'OFF'}`, '');
});

$event($('.efy_sidebar [efy_content="mode"]'), 'click', (event)=>{
    const x = event.target, toggle =(a,b)=> a.classList.toggle('efy_hide_i', b),
    selectors = '.efy_mode_type_div :is(.system_light, .system_dark), [for=system_theme_confirmation]';

    if ($('#efy_mode_default').checked) $('#efy_mode_trans').checked = false;

    $all('[for=efy_mode_sepia]').forEach(a =>{
        toggle(a, !$('#efy_mode_switch_light').checked)
    });

    $all('[for=efy_mode_solid], [for=efy_mode_nord], [for=efy_mode_black]').forEach(a =>{
        toggle(a, !$('#efy_mode_switch_dark').checked)
    });

    $all('[efy_help=type], [for=efy_mode_solid], [for=efy_mode_trans], .efy_mode_type_div').forEach(a =>{
        toggle(a, !($('#efy_mode_switch_light').checked || $('#efy_mode_switch_dark').checked))
    });

    if ($('#efy_mode_system').checked){
        const mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        $root.setAttribute('efy_mode', mode); $('#efy_mode_trans').checked = false;
        $all(`.efy_mode_type_div, ${selectors}`).forEach(a => a.classList.remove('efy_hide_i'));
    } else { $all(selectors).forEach(a => a.classList.add('efy_hide_i'))}

    $all('#efy_sbtheme .defaults label').forEach(a =>{ toggle(a, !($('#efy_mode_system').checked)) });

    if (x.matches('#efy_mode_switch_light') || x.matches('#efy_mode_switch_dark')) $('#efy_mode_solid').checked = true;

    toggle($('#efy_mode_trans'), !$('.trans_window_div').checked);
    toggle($('.trans_window_div'), !$('#efy_mode_trans').checked);
    toggle($('#efy_images_bg'), $('#trans_window').checked);
});

/*Restore*/ if (efy.mode){ let mode = efy.mode;
    const current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    $wait(0.1, ()=>{
        const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
        store = transaction.objectStore('themes_system');
        store.getAll().onsuccess =(event)=>{ const themes = event.target.result[0];

            const system =()=>{ mode = current; switch_theme_system(mode);
                themes.changed = mode; store.put(themes);
            };

            if (themes.status === true){
                $('#efy_mode_system').click;
                $('#efy_mode_system').dispatchEvent(new Event('click', {'bubbles': true }));
                if (themes.changed !== current) system();
            }
            $('#system_theme_confirmation').checked = themes.confirm;

            if (mode.includes('system')) system();
        };
    });

    $root.setAttribute('efy_mode', mode); const type = mode.replace('dark,', '').replace('light,', '');
    try {
        if (mode.includes('default')){ $('#efy_mode_' + mode).checked = true}
        else if (['light', 'dark'].some(x => mode.includes(x))){
            $('#efy_mode_switch_' + mode).checked = true;
            $('#efy_mode_switch_' + mode).dispatchEvent(new Event('click', {'bubbles': true }));
        }
        if (['sepia', 'nord', 'black', 'trans'].some(x => type.includes(x))){ $('#efy_mode_' + type).checked = true}
        if (type.includes('trans')){ $('#efy_mode_' + type).dispatchEvent(new Event('click', {'bubbles': true }))}
        if (efy.trans_window === true) $('#trans_window').checked = true;
    }
    catch {alert(mode)}
}
else {$root.setAttribute('efy_mode', 'default'); $('#efy_mode_default').setAttribute('checked', '')}

$wait(0.2, ()=>{
    const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
    store = transaction.objectStore('themes_system');
    store.getAll().onsuccess =(event)=>{ const themes = event.target.result;
        if (Array.isArray(themes) && themes.length === 0){
            store.add({light: 'light', dark: 'dark', status: false, confirm: true})
        }
    }
});

$event($('#efy_mode_system'), 'change', (a)=>{
    $notify('short', 'WARNING - Alpha Testing', 'This feature is not stable yet');
    const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
    store = transaction.objectStore('themes_system');
    store.getAll().onsuccess =(event)=>{
        const themes = event.target.result[0];
        themes.status = a.target.checked; themes.confirm = $('#system_theme_confirmation').checked;
        store.put(themes);
    }
});
$event($('#system_theme_confirmation'), 'change', (a)=>{
    const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
    store = transaction.objectStore('themes_system');
    store.getAll().onsuccess =(event)=>{
        const themes = event.target.result[0];
        themes.confirm = $('#system_theme_confirmation').checked;
        store.put(themes);
    }
});

const mode_inputs = ':is(.efy_mode_div, .efy_mode_type_div) > input',
mode_inputs_system = '.efy_mode_type_div :is(.system_light, .system_dark) input';

$all(mode_inputs).forEach(x =>{
    $event(x, 'change', ()=>{ let active = [];
        $all(`:is(${mode_inputs}):checked`).forEach(a => active.push(a.id.replace('efy_mode_', '').replace('switch_', '')));
        active = String(active); active = [
            ['default', 'default'], [',solid', active.replace(',solid', '')],
            ['light,nord', 'light'], ['light,black', 'light'], ['dark,sepia', 'dark']
        ].find(([x])=> active.includes(x))?.[1] || active;

        if (active.includes('system')){
            const mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            switch_theme_system(mode); active = mode;
        }

        $root.setAttribute('efy_mode', active); efy.mode = active; $save()
    })
});

$event(window.matchMedia('(prefers-color-scheme: dark)'), 'change', (e)=>{
    if (idb_themes_system.active === true) switch_theme_system(e.matches ? 'dark' : 'light');
});

['light', 'dark'].map(mode =>{
    $event($(`.system_${mode}`), 'change', (event)=>{ const x = event.target;
        if (x.matches('input')){
            const transaction = efy_idb.transaction(['themes_system'], 'readwrite'),
            store = transaction.objectStore('themes_system');
            store.getAll().onsuccess =(event)=>{
                const themes = event.target.result[0];
                themes[mode] = x.id.replace('efy_mode_', '').replace(`system_${mode}_`, '').replace('_', ',').replace(',solid', '');
                store.put(themes);
                const md = themes[mode], scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                if (scheme === mode){
                    if ('light light,sepia light,trans dark dark,nord dark,black dark,trans'.split(' ').includes(md)){
                        $root.setAttribute('efy_mode', md); efy.mode = md; $save()
                    } else { switch_theme_system(mode)}
                }
            }
        }
})});

/*Transparent Window*/ if (efy.trans_window){ a = efy.trans_window; $root.classList.add('trans_window'); $('#trans_window').setAttribute('checked', '')}
$event($("#trans_window"), 'change', ()=>{ $root.classList.toggle('trans_window'); efy.trans_window = $("#trans_window").checked; $save() });

/*Radius & Gap*/ a = $('#efy_sbtheme [efy_content=size]');
$add('div', {efy_lang: 'radius', efy_range_text: 'Radius'}, [['input', {class: 'efy_radius_input', type: 'range', min: '0', max: '25', value: '12', step: '1'}]], a);
$add('div', {efy_lang: 'border', efy_range_text: 'Border'}, [['input', {class: 'efy_border_size_input', type: 'range', min: '0', max: '8', value: '1.5', step: '0.1'}]], a);
$add('div', {efy_lang: 'gap', efy_range_text: 'Gap alpha'}, [['input', {class: 'efy_gap_input', type: 'range', min: '0', max: '30', value: '15', step: '1'}]], a);
$add('div', {efy_lang: 'max_width', efy_range_text: 'Max Width alpha'}, [
    ['div', {class: 'efy_max_width_div'}, [
        ['input', {class: 'efy_maxwidth_input', type: 'range', min: '500', max: '5000', value: '1200', step: '1'}],
        ['select', {name: 'efy_name'}, [ ['option', {value: 'rem'}, 'REM'], ['option', {value: '%'}, '%'] ]]
]] ], a);

/*Radius, Gap & Color Angle*/ a = ['radius', 'border_size', 'gap', 'color_angle']; let e = ['rem', 'rem', 'rem', 'deg'];
a.forEach((n, i)=>{ let b = efy[n], d = $(`.efy_${n}_input`);
   if (b){ d.value = b.replace(e[i], ''); $css_prop(`--efy_${n}`, b)}
   $event(d, 'input', ()=>{ let c = d.value + e[i]; $css_prop(`--efy_${n}`, c); efy[n] = c; $save()})
});


/*Max Width*/ let input2 = $('.efy_maxwidth_input'), y, zz = '[efy_range_text*="Max Width"] select', z = $(zz), width = efy.max_width;
if (width){ y = width.replace('rem', '').replace('%', ''); input2.value = y; $css_prop('--efy_body_width', width) } else {y = 1200}
input2.oninput =()=>{ let y = input2.value; z = $(zz).value; $css_prop('--efy_body_width', y + z); efy.max_width = y + z; $save()}
z.oninput =()=>{ if (z.value == '%'){ input2.setAttribute('min', '10'); input2.setAttribute('max', '100'); input2.setAttribute('value', '100')} if (z.value == 'rem'){ input2.setAttribute('min', '500'); input2.setAttribute('max', '5000'); input2.setAttribute('value', '1200')}
 let y = input2.value; z = $(zz).value; $css_prop('--efy_body_width', y + z); efy.max_width = y + z; $save()}


 /*EFY Sidebar Button*/ const sbmenu = $('#efy_sbtheme [efy_content=menu]');
$add('details', {id: 'efy_btn_align', efy_select: ''}, [['summary', {efy_lang: 'button_position'}], ['div']], sbmenu);
$add('details', {id: 'efy_sidebar_align', efy_select: ''}, [['summary', {efy_lang: 'menu'}], ['div']], sbmenu);

/*EFY Sidebar*/ ['left', 'right'].map(a =>{ const id = `efy_sidebar_align_${a}`, parent = $('#efy_sidebar_align > div');
    $add('input', {type: 'radio', name: 'efy_sidebar_align', id: id}, [], parent); $add('label', {for: id, efy_lang: a}, [], parent)
});

/*Align Sidebar*/ let align = efy.sidebar_align || 'right';
if (efy.sidebar_align) $root.setAttribute('efy_sidebar', align);
$(`#efy_sidebar_align_${align}`).setAttribute('checked', '');

$all("[name=efy_sidebar_align]").forEach(x =>{ const y = x.id.replace('efy_sidebar_align_', '');
    $event(x, 'click', ()=>{ const z = $root.getAttribute('efy_sidebar').includes('on') ? 'on_' : '';
        $root.setAttribute('efy_sidebar', z + y); efy.sidebar_align = y; $save();
})});

 /*Align & Toggle Button*/ 'left_top middle_top right_top left_middle middle_middle right_middle left_bottom middle_bottom right_bottom'.split(' ').map(a =>{
    const input = $add('input', {type: 'radio', name: 'efy_btn_align', id: a}, [], $('#efy_btn_align > div'));
    if (a == 'middle_middle') input.setAttribute('disabled','');
});

(()=>{ let sd_btn = $css_prop('--efy_sidebar_button').replaceAll(' ', '').split(','), a = 'efy_sidebar_btn_hide', c = $('#efy_btn_align'), d = 'beforeend', e = $('[efy_sidebar_btn*=absolute]');
    $add('input', {type: 'checkbox', name: a, id: a, checked: ''}, [], c, d); $add('label', {for: a, efy_lang: 'floating_button'}, [], c, d);
    if (!(efy.sidebar_btn_status) && (sd_btn.includes('off'))){ e.classList.add('efy_hide_i'); $('#'+a).removeAttribute('checked')}
    $event($('#'+a), 'click', ()=>{ if (e.classList.contains('efy_hide_i')){efy.sidebar_btn_status = 'on'; $save()} else {delete efy.sidebar_btn_status; $save()} e.classList.toggle('efy_hide_i') });

    a = $('[efy_sidebar_btn=absolute]'); b = 'efy_btn_align';

    if (efy.btn_align){ let c = efy.btn_align; $("#" + c).setAttribute('checked', ''); a.setAttribute(b, c)}
    else { let y = sd_btn[0]; $('#'+y).setAttribute('checked', ''); a.setAttribute(b, y)}
    $all("[name=efy_btn_align]").forEach(x =>{ x.onclick =()=>{ a.setAttribute(b, x.id); efy.btn_align = x.id; $save() }});

    /*Toggle Sidebar*/ $event($body, 'click', ()=>{ let x = event.target;
        if (x.matches('[efy_sidebar_btn]')){ a.classList.toggle('efy_hide'); let final = 'on';
            if ($root.hasAttribute('efy_sidebar')){ let d = $root.getAttribute('efy_sidebar'), e = '';
                if (['left', 'right'].some(s => d.includes(s))) e = d.replace('on_', '');
                final = d.includes('on') ? e : 'on_' + e; $('.efy_sidebar [efy_sidebar_btn="close"]').focus();
            }; $root.setAttribute('efy_sidebar', final)
        }; if (x.matches('[efy_sidebar_btn*=close]')) $('body [efy_sidebar_btn]:not(.efy_sidebar button)').focus()
    })
})()

 /*EFY Notifications*/ $add('details', {id: 'efy_notifications', efy_select: ''}, [
    ['summary', {efy_lang: 'notifications'}, [['mark', {efy_lang: 'alpha'}]]],
    ['div', {id: 'efy_notify_status'}], ['p', {}, 'Position'], ['div', {id: 'efy_notify_align'}]
], $('#efy_sbtheme [efy_content=menu]'));

'Offline Clipboard'.split(' ').map(a =>{
    let b = `notify_${a.toLowerCase()}`, c = $('#efy_notifications #efy_notify_status');
    $add('input', {type: 'checkbox', name: 'efy_notify_status', id: a, checked: ''}, [], c); $add('label', {for: a}, a, c);
    let d = $$(c, `#${a}`); if (efy[b] == false){ d.removeAttribute('checked')}
    $event(d, 'change', ()=>{ efy[b] = d.checked; $save()})
});

$ready('[efy_alerts]', ()=>{ let b = $('[efy_alerts]'), c = $('#efy_notify_align');
    'left_top middle_top right_top left_bottom middle_bottom right_bottom'.split(' ').map(a =>{
        $add('input', {type: 'radio', name: 'efy_notify_align', id: `notify_${a}`}, [], c);
        $event($$(c, `#notify_${a}`), 'change', ()=>{
            (a == 'left_top') ? delete efy.notify_align : efy.notify_align = a;
            b.setAttribute('efy_alerts', a); $save()
        })
    });
    if (efy.notify_align) b.setAttribute('efy_alerts', efy.notify_align);
    let d = (efy.notify_align) ? $$(c, `#notify_${efy.notify_align}`) : $$(c, '#notify_left_top'); d.checked = true;
}, 1);

/*Visual Filters*/ if ($efy_module('efy_filters')){ $add('details', {id: 'efy_vfilters', efy_select: ''}, [
    ['summary', {efy_lang: 'visual_filters'}, [['i', {efy_icon: 'dots'}]]],
    ['div', {efy_tabs: 'efyui_filters'}, [['div', {class: 'efy_tabs'}]]]
], $('.efy_sidebar'));

const effects = [['brightness', 'blur', 'saturate', 'contrast', 'hue-rotate', 'sepia', 'invert'], ['0', '0', '0', '0.1', '0', '0', '0'],
['4', '150', '4', '4', '360', '1', '1'], ['1', '0', '1', '1', '0', '0', '0'], ['0.05', '1', '0.05', '0.05', '1', '0.05', '0.05']];

/*Tabs & Form*/ 'bg content trans front back button'.split(' ').map(a=>{
    const lang = (a == 'bg') ? 'background' : a,
    tab = $add('button', {efy_tab: a, efy_lang: lang}, [], $('[efy_tabs=efyui_filters] .efy_tabs'));

    /*Temporary*/ if (a == 'button'){ $add('div', {efy_card: '', efy_lang: 'coming_soon', efy_content: a, style: 'margin: 0'}, [], $('[efy_tabs=efyui_filters]'))} else {

        const content = $add('form', {efy_content: a, efy_select: '', class: `efy_${a}_filter`, onsubmit: 'return false'}, [
            ['button', {type: 'reset', efy_lang: 'reset'}, [['i', {efy_icon: 'reload'}]]]
        ], $('[efy_tabs=efyui_filters]'));

        'brightness blur saturation contrast hue sepia invert'.split(' ').map((item, i)=>{
            $add('div', {efy_lang: item, efy_range_text: item}, [
                ['input', {class: `efy_${a}_${effects[0][i]}`, type: 'range', min: effects[1][i], max: effects[2][i], value: effects[3][i], step: effects[4][i]}]
            ], content);
        });

        /*Active*/ if (a == 'bg'){ [tab, content].map(b => b.setAttribute('efy_active', ''))}
    }
});

/*Trans Menu*/ a = $('[efy_tabs=efyui_filters] [efy_content=trans] [type=reset]'), b = 'efy_trans_filter_menu';
$add('label', {for: b, efy_lang: 'menu'}, [], a, 'afterend'); $add('input', {id: b, type: 'checkbox'}, [], a, 'afterend');

/*BG Size & Position*/ a = $('[efy_tabs=efyui_filters] [efy_content=bg] [type=reset]'), b = 'efy_bg_size'; let c = 'afterend';
$add('div', {efy_lang: 'size', efy_range_text: 'bg_size', class: 'efy_hide_i'}, [['input', {class: `efy_bg_size`, type: 'range', min: 10, max: 3000, value: 300, step: 10}]], a, c);
$add('div', {efy_lang: 'left', efy_range_text: 'bg_position_x', class: 'efy_hide_i'},  [['input', {class: `bg_position_x`, type: 'range', min: -3000, max: 3000, value: 0, step: 1}]], a, c);
$add('div', {efy_lang: 'up', efy_range_text: 'bg_position_y', class: 'efy_hide_i'}, [['input', {class: `bg_position_y`, type: 'range', min: -3000, max: 3000, value: 0, step: 1}]], a, c);

$add('label', {for: b, efy_lang: 'size'}, [], a, c); $add('input', {id: b, type: 'checkbox', efy_toggle: '[efy_range_text=bg_size], [efy_range_text=bg_position_x], [efy_range_text=bg_position_y]'}, [], a, c);

$event($('.'+b), 'input', (a)=> $css_prop(`--efy_bg_size`, `${a.target.value}rem`))
$event($('.bg_position_x'), 'input', (a)=> $css_prop(`--efy_bg_x`, `${a.target.value}rem`))
$event($('.bg_position_y'), 'input', (a)=> $css_prop(`--efy_bg_y`, `${a.target.value}rem`))

for (let a = ['bg', 'content', 'trans', 'front', 'back'], j = [
    '[efy_mode*=trans] .efy_3d_bg {filter: ',
    'img, video:not(.efy_3d_bg, .efy_3d_front, .efy_3d_back) {filter: ',
    ':is(details:not([efy_help]), select, input, textarea, blockquote, pre, article, table, audio, button, [efy_card], [efy_tabs] [efy_content], [efy_timer], [efy_clock], [efy_tabs] [efy_tab], [efy_color_picker], [efy_keyboard], [efy_sidebar_btn*=absolute], [efy_select] label, .efy_trans_filter, .efy_btn_trans, .efy_trans):not(.efy_trans_filter_off, .efy_trans_filter_off_all, .efy_trans_filter_off_all *, .efy_sidebar *, [efy_range_text] input){backdrop-filter: ',
    '.efy_3d_front {filter: ',
    '.efy_3d_back {filter: '
], k = ['!important}', '!important}', '!important; -webkit-backdrop-filter: ', '!important}', '!important}'], l = ['', '', '!important}', '', ''], i = 0; i < a.length; i++){

$add('style', {class: `efy_css_${a[i]}_filter`}, [], $head); let css = $(`.efy_css_${a[i]}_filter`), f = {}, g = `${a[i]}_filter`, h = `${g}_css`,  fn = async ()=>{
    ['blur','brightness','saturate','contrast','hue-rotate','sepia','invert'].forEach(x =>{ f[x] = $(`.efy_${a[i]}_${x}`).value; if (x == 'blur'){ f[x] = f[x] + 'px' } else if (x == 'hue-rotate'){ f[x] = f[x] + 'deg' }});

    let string = ''; Object.keys(f).forEach(x =>{ string = string + ` ${x}(${f[x]})` });
    let y; if (a[i] == 'trans'){ let m = ''; if ($('#efy_trans_filter_menu').checked){ m = ', .efy_sidebar'; efy.trans_filter_menu = 'on'} y = j[i] + string + k[i] + string + l[i] + ' ::-webkit-progress-bar, ::-webkit-meter-bar' + m + '{backdrop-filter: ' + string + k[i] + string + l[i]} else {y= y = j[i] + string + k[i]; delete efy.trans_filter_menu}
    $text(css, y); efy[g] = JSON.stringify(f); efy[h] = y; $save() };

if (efy[g]){ $text(css, efy[h]); let f = JSON.parse(efy[g]); Object.keys(f).forEach(x => $(`.efy_${a[i]}_${x}`).value = f[x].replace('px','').replace('deg','') ) }
$all(`.efy_${a[i]}_filter input`).forEach(x =>{ $event(x, 'input', fn)});
$all(`.efy_${a[i]}_filter [type=reset]`).forEach(x =>{ $event(x, 'pointerup', ()=>{ delete efy[g]; delete efy[h]; $save(); $text(css, ''); x.click() }) })
}}

/*Backup*/ if ($efy_module('efy_backup')){
    $add('details', {id: 'efy_backup'}, [ ['summary', {efy_lang: 'backup'}, [['i', {efy_icon: 'arrow_down'}]]] ], $('.efy_sidebar'));
    for (let a = ['localstorage', 'idb'], b = ['theme', 'efy_database'], c = '#efy_backup', i = 0; i < a.length; i++){
        let aa = `efy_${a[i]}`;
        $add('p', {efy_lang: b[i]}, [], $(c));
        $add('div', {class: 'efy_backup_div'}, [
            ['a', {href: '#', class: `${aa}_export`, download: `${b[i]}.json`, role: 'button', efy_lang: 'save'}, [ ['i', {efy_icon: 'arrow_down'}]]],
            ['button', {type: 'reset', class: `${aa}_reset`, efy_lang: 'reset'}, [['i', {efy_icon: 'reload'}]]],
            ['label', {efy_upload: `${aa}_import, .json`}]
        ], $(c))
}}

/*Language*/ if ($efy_module('efy_language')){
    let a = 'en id ro ru de pl sv'.split(' '), b = 'English Indonesia Română Русский Deutsch Polski Svenska'.split(' ');
    $add('details', {id: 'efy_language'}, [
        ['summary', {efy_lang: 'efy_language'}, [ ['i', {efy_icon: 'globe'}]]],
        ['div', {efy_select: ''}, [
            ['p', {efy_lang: 'lang_info'}, [['a', {href: 'https://translate.codeberg.org/projects/efy'}, ' Weblate']]]
    ]]], $('.efy_sidebar'));

    let c = $('#efy_language > div'); a.map((a,i) =>{ let d = `efy_language_${a}`;
        $add('input', {type: 'radio', name: 'efy_language', id: d}, [], c); $add('label', {for: d}, [b[i]], c);
        $event($('#' + d), 'click', ()=>{ efy.lang_code = a; $save(); location.reload()})
    });
    if (efy.lang_code){ $(`#efy_language_${efy.lang_code}`).setAttribute('checked', '')} else {$('#efy_language_en').setAttribute('checked', '')}
}

/*Accessibility*/ if ($efy_module('efy_accessibility')){
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
                ['div', {efy_lang: 'zoom', efy_range_text: 'Zoom'}, [ ['input', {class: 'efy_ui_zoom', type: 'range', min: '1', max: '2', value: '1', step: '0.01'}] ]],
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


/*Animations*/ (()=>{ let status = '--efy_anim_status', state = '--efy_anim_state', input = $('.efy_anim_speed');
    $add('style', {class: 'efy_anim_accessibility'}, [], $head);
    if (efy.anim_speed){ let speed = efy.anim_speed; input.value = speed;
        $text($('.efy_anim_accessibility'), `:root {--efy_anim_speed: ${speed}!important}`);
        if (speed == '0'){ $body.style.setProperty(status, '0'); $body.style.setProperty(state, 'paused'); $body.setAttribute('efy_animations', 'off')}
    }
    $event(input, 'change', ()=>{ let speed = input.value; efy.anim_speed = speed; $save();
        if (speed == '0'){ $body.style.setProperty(status, '0'); $body.style.setProperty(state, 'paused'); $body.setAttribute('efy_animations', 'off')}
        else { $body.style.setProperty(status, '1'); $body.style.setProperty(state, 'running'); $body.removeAttribute('efy_animations')}
        $text($('.efy_anim_accessibility'), `:root {--efy_anim_speed: ${speed}!important}`)
}) })();

/* Text Size*/ $add('style', {class: 'efy_text_accessibility'}, [], $head); if (efy.text_zoom){ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${efy.text_zoom}px!important} html {letter-spacing: ${efy.text_spacing}px!important}`)
    $('.efy_ui_zoom').value = efy.text_zoom; $('.efy_text_spacing').value = efy.text_spacing;
}
$all('.efy_text_accessibility input').forEach(x => $event(x, 'input', ()=>{ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${$('.efy_ui_zoom').value}px!important} html {letter-spacing: ${$('.efy_text_spacing').value}px!important}`); efy.text_zoom = $('.efy_ui_zoom').value; efy.text_spacing = $('.efy_text_spacing').value; $save() }));
}

/*Audio*/ if ($efy_module('efy_audio')){ $add('details', {efy_select: '', id: 'efy_audio'}, [
    ['summary', {}, [ ['i', {efy_icon: 'audio'}], ['p', {efy_lang: 'audio_effects'}], ['mark', {efy_lang: 'alpha'}]]],
    ['div', {efy_lang: 'efy_volume', efy_range_text: 'EFY Volume'}, [ ['input', {class: 'efy_audio_volume', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}] ]],
    ['div', {efy_lang: 'page_volume', efy_range_text: 'Page Volume'}, [ ['input', {class: 'efy_audio_volume_page', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}] ]],
    ['p', {efy_lang: 'sidebar_audio_text'}]
], $('.efy_sidebar'));
for (let a = ['status', 'click', 'hover'], b = ['active', 'click_tap', 'mouse_hover'], c = '#efy_audio > summary', d = 'beforebegin', i = 0; i < a.length; i++){
    const id = `efy_audio_${a[i]}`;
    $add('input', {type: 'checkbox', name: 'efy_audio', id: id}, [], $(c), d);
    $add('label', {for: id, efy_lang: b[i]}, [], $(c), d)
}}

/*Effects*/ if (efy.audio_status == 'on' ){ efy_audio.folder = $css_prop('--efy_audio_folder');
    'pop ok ok2 ok3 hover slide step error disabled call wind'.split(' ').forEach(x =>{
        efy_audio[x] = new Audio(`${efy_audio.folder}/${x}.webm`); efy_audio[x].volume = efy_audio.volume
    });
    $event($body, 'pointerdown', ()=>{ if (efy.audio_click == 'on'){
    for (let a = 'ok ok ok2 ok3 pop slide error disabled step step wind'.split(' '),
    b = 'pointerup change pointerup pointerup pointerup pointerup pointerup pointerup pointerdown input click'.split(' '),
    c = ['button:not([disabled], [type=submit], [type=reset], [efy_tab], [efy_sidebar_btn], [efy_toggle], [efy_keyboard] [efy_key], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button, .efy_quick_fullscreen, [tabindex="-1"], [efy_audio_mute*=ok]), .video-grid>div', 'input, textarea', '.efy_img_previews [efy_bg_nr]', '[type=submit]', 'summary, [efy_toggle], select:not([multiple], [disabled]), [efy_tabs] [efy_tab], [efy_alert], [efy_alert] *, .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button', '[efy_sidebar_btn]', '[type=reset]', '[disabled]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled]), [efy_keyboard] [efy_key]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])', '.efy_quick_fullscreen'], i = 0; i < a.length; i++){
        $event($body, b[i], ()=>{ if (event.target.matches(c[i])){ $audio_play(efy_audio[a[i]]) }})
    }}
    /*Hover*/ if (efy.audio_hover == "on"){
        $all("summary, select:not([multiple], [disabled]), [type=submit], [type=reset], [efy_sidebar_btn], .video-grid>div")
        .forEach(x => $event(x, 'mouseenter',()=> $audio_play(efy_audio.hover)))
    }
    /*Online Status*/ for (let a = ['online', 'offline'], b = ['ok', 'error'], i = 0; i < a.length; i++){
        $event(window, a[i], ()=>{ $audio_play(efy_audio[b[i]])})
    }
}, {once: true});

/*Volume*/ $all('.efy_audio_volume').forEach(a => a.oninput =()=>{ for (let b = Object.keys(efy_audio), i = 0; i < b.length; i++){ efy_audio[b[i]].volume = a.value }});
$all('.efy_audio_volume_page').forEach(a => a.oninput =()=>{ $all('audio, video').forEach(b => b.volume = a.value) })

} /*Sidebar Modules - End*/

/*Upload Input: id, accept, efy_lang or 'small', multiple, icon*/ $ready('[efy_upload]', (a)=>{
    let value = a.getAttribute('efy_upload'), accept_array = value.match(/\[(.*?)\]/), accept, b = value.replaceAll(' ','').split(','), c = 'plus';
    if (accept_array){ accept = accept_array[1]; b = value.replace(`[${accept}],`, ',').replaceAll(' ','').split(',')} else {accept = b[1]}
    if (b[2]){ if (b[2] !== 'small'){ a.setAttribute('efy_lang', b[2]) } } else {a.setAttribute('efy_lang', 'add_file')} if (b[4]){ c = b[4]}
    a.setAttribute('role', 'button'); $add('input', {type: 'file', id: b[0], accept: accept}, [], a); $add('i', {efy_icon: c}, [], a);
    if (b[3] == 'multiple'){ $all(`#${b[0]}`).forEach(a=>{ a.setAttribute('multiple', '')})}
});

/*3D Layers*/ ['front', 'back'].map(a =>{
  $add('video', {class: `efy_3d_${a}`, autoplay: '', loop: '', muted: '', playsinline: ''});

  $add('div', {id: `efy_images_${a}`, style: 'display: grid'}, [
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: `idb_addimg_${a}`, type: 'file', accept: 'image/*, video/*', style: 'display: none'}],
        ['label', {for: `idb_addimg_${a}`, title: 'Add file', class: 'efy_color', type:'button', role: 'button'}, [ ['i', {efy_icon: 'plus'}] ]],
        ['button', {class: `idb_reset_${a}`, title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
  ]], ['hr']], $(`[efy_tabs=efyui_filters] [efy_content=${a}]`), 'afterbegin')
});

/*3D Layer Input*/ let efy_css = {}; $ready('#idb_addimg_back', ()=>{
    ['bg', 'front', 'back'].map(a=>{ let b = `efy_css_${a}`;
        $add('style', {class: b}, [], $head); efy_css[a] = $('.' + b);
        $event($(`#idb_addimg_${a}`), 'change', x => efy_add_bgimg(a, x));
})}, 1);


/*Add Images*/ const efy_add_bgimg = async (type, e)=>{ let db = await open_idb(), read = new FileReader();
    read.readAsDataURL(e.target.files[0]); read.onload = e =>{

    let file = read.result, img = new Image(), a = 'efy_temp_canvas', thumbnail;
    img.onload = ()=>{
        /*Thumbnail*/ $add('canvas', {id: a}, [], $(`#efy_images_${type} .efy_img_previews`)); let c = $(`#${a}`); c.width = (img.width / img.height) * 80; c.height = 80; c.getContext('2d').drawImage(img,0,0, c.width, c.height); thumbnail = $(`#${a}`).toDataURL('image/webp'); c.remove();
        /*Update*/
        db.transaction([type], "readwrite").objectStore(type).add({image: file, thumbnail: thumbnail}).onerror = e =>{ console.error(e)};
    }; img.src = file;

    (async ()=>{ let request = indexedDB.open('efy');
    request.onsuccess =()=>{ let count_img = 0, transaction = request.result.transaction([type], "readonly"), store = transaction.objectStore(type), get_cursor = store.openCursor();
        get_cursor.onerror =()=> console.error("efy: no db entries");
        get_cursor.onsuccess = e =>{ let cursor = e.target.result;
            if (cursor){ count_img++; cursor.continue()}
            else { /*Set bgimg nr*/ efy[`nr_${type}`] = count_img; $save(); const previews = `#efy_images_${type} .efy_img_previews`;
                /*Restore Background*/ $text(efy_css[type], `.efy_3d_${type} {background: url(${file})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important}`);
                /*Add Preview*/ $add('button', {efy_bg_nr: count_img, style: `background: url(${thumbnail})`}, [], $(previews));
                const preview = $(`${previews} [efy_bg_nr="${count_img}"]`);
                $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active'));
                preview.setAttribute('efy_active','');
                /*Preview Click*/ $event(preview, 'click', ()=>{
                    $text(efy_css[type], `.efy_3d_${type} {background: url(${file})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important}`);
                    efy[`nr_${type}`] = count_img; $save();
                    $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active')); preview.setAttribute('efy_active','')
                })
                if (file.includes('video')){
                    $(`.efy_3d_${type}`).setAttribute('src', file); $(`.efy_3d_${type}`).volume = 0;
                    $event(document, 'visibilitychange', ()=>{ let a = $(`.efy_3d_${type}`); document.hidden ? a.pause() : a.play() });
                }

            } }}})()}}

/*Count images*/ const count_images = async (type) =>{ let current_id = 0;
    const db = await open_idb('efy'), transaction = db.transaction([type], "readonly"),
    store = transaction.objectStore(type), cursor_request = store.openCursor(); let count_img = 0, last_img = 0;

    cursor_request.onsuccess = (event) =>{ const cursor = event.target.result;
        if (cursor){ count_img++; const x = cursor.value, previews = `#efy_images_${type} .efy_img_previews`, current = count_img;
            if (efy[`nr_${type}`] == current) current_id = x.id;

            /*Preview Click*/ $add('button', {efy_bg_nr: x.id, style: `background: url(${x.thumbnail})`, efy_audio_mute: 'ok'}, [], $(previews));
            $event($(`${previews} [efy_bg_nr="${x.id}"]`), 'click', (y) =>{
                $text(efy_css[type], `.efy_3d_${type} {background: url(${x.image})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important; background-size: cover!important}`);
                efy[`nr_${type}`] = current; $save();
                $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active')); y.target.setAttribute('efy_active', '')
            });
            cursor.continue();
        } else { /*Check bg_nr*/
            /*Restore Background*/ if (count_img > 0){ store.get(current_id).onsuccess = e =>{
                $text(efy_css[type], `.efy_3d_${type} {background: url(${e.target.result.image})!important; background-size: var(--efy_bg_size)!important}`);
                $(`#efy_images_${type} .efy_img_previews [efy_bg_nr]:nth-of-type(${efy[`nr_${type}`] + 1})`).setAttribute('efy_active', '')
            }}
            /*Reset iDB*/ $all('.efy_idb_reset').forEach(a =>{ $event(a, 'click', () =>{
                const transaction = efy_idb.transaction(['bg'], 'readwrite'),
                store = transaction.objectStore('bg');
                store.clear().onsuccess =(event)=>{
                    $all('.efy_img_previews [efy_bg_nr]').forEach(a => a.remove());
                    $notify('short', 'Images Deleted - Success');
                }
            })});
        }
    };
    cursor_request.onerror = () => console.error("efy: no db entries");
};

/*Remove Images*/ const img_previews = $('.efy_img_previews');

$event(img_previews, 'click', (e)=>{
    if (e.target.matches('.efy_remove [efy_bg_nr]')){ const x = e.target, nr = Number(x.getAttribute('efy_bg_nr'));
    indexedDB.open('efy').onsuccess =(res)=>{
        const db = res.target.result, trans = db.transaction(['bg'], 'readwrite'),
        store = trans.objectStore('bg'); store.delete(nr); x.remove();
    }} else if (e.target.matches('#idb_remove_toggle')){
        img_previews.classList.toggle('efy_remove'); $('.efy_idb_reset').classList.toggle('efy_hide_i');
        const status = e.target.checked;
        $notify('short', status ? 'Remove Media' : 'Set Background', status ? 'Select what to remove' : 'Select your background');
    }
});

/*Run Functions*/ (async ()=>{ await count_images('bg'); await count_images('front'); count_images('back') })();

/*Export iDB*/ (async ()=>{ try { let db = await open_idb(),
    json = await new Promise((resolve, reject)=>{ let export_object = {};
        let transaction = db.transaction(db.objectStoreNames, "readonly");
        $event(transaction, 'error', reject);

        for (let store_name of db.objectStoreNames){ let objects = [];
            $event(transaction.objectStore(store_name).openCursor(), 'success', event =>{
            let cursor = event.target.result;
            if (cursor){ objects.push(cursor.value); cursor.continue()}
            else { export_object[store_name] = objects;
                if (db.objectStoreNames.length === Object.keys(export_object).length){
                    resolve(JSON.stringify(export_object))
        }}})}})

        $event($('.efy_idb_export'), 'click', async ()=>{ let e = event.target; $audio_play(efy_audio.ok3);
            e.href = URL.createObjectURL(new Blob([json], {type: 'application/json'}));
            e.setAttribute('download', 'efy_database.json');
        })
} catch (err){ console.error(err)}})();

// Import IndexedDB
let efy_idb_import = $('#efy_idb_import');
$event(efy_idb_import, 'change', async ()=>{
  let file = efy_idb_import.files[0], read = new FileReader();
  read.onload = async ()=>{ let data = JSON.parse(read.result);
    $audio_play(efy_audio.ok3);
    let importIDB = async (images = "images", settings = "settings", arr = data[images], arr2 = data[settings])=>{
      let db = await open_idb(), transaction = db.transaction([images, settings], "readwrite");
      let store = transaction.objectStore(images), store2 = transaction.objectStore(settings);
      for (let obj of arr){ store.put(obj)}
      for (let obj of arr2){ store2.put(obj)}
    };
    await importIDB(); $wait(3, ()=>{ location.reload() });
}; read.readAsText(file) });


/*Export Settings*/ $event($('.efy_localstorage_export'), 'click', (e)=>{
    if (localStorage.efy){ efy.version = efy_version; $save();
        let result = JSON.stringify(JSON.parse(localStorage.efy), null, 2), x = e.target;
        x.href = URL.createObjectURL(new Blob([result], {type: 'application/json'}));
        x.download = 'efy_settings.json'; $audio_play(efy_audio.ok3)}
    else { $notify('short', 'Nothing to export', "You're using default settings")}
});

/*Import Settings*/ let efy_ls_import = $('#efy_localstorage_import'); $event(efy_ls_import, 'change', ()=>{ let file = efy_ls_import.files[0], read = new FileReader();
	read.onload =()=>{ localStorage.efy = read.result.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}'); location.reload()}; read.readAsText(file)});

/*Reset Settings*/ $all(".efy_localstorage_reset").forEach(x =>{ $event(x, 'click', ()=>{ localStorage.removeItem('efy'); location.reload() })});


/*Tabs*/ $ready('[efy_tabs]', a => $event(a, 'click', event =>{ const tab = event.target;
    if (!tab.matches(`[efy_tab]`)) return; event.stopPropagation();
    const name = `[efy_tabs="${tab.closest('[efy_tabs]').getAttribute('efy_tabs')}"]`, active = tab.hasAttribute('efy_active'),
    tabs = `:is(${name}, ${name} > div, ${name} > div > div) >`, content = $(`${tabs} [efy_content="${tab.getAttribute('efy_tab')}"]`),
    toggle =(a,b)=> a[b ? 'removeAttribute' : 'setAttribute']('efy_active', '');
    $all(`${tabs} :is([efy_tab], [efy_content])[efy_active]`).forEach(x => toggle(x, true));
    [tab, content].forEach(x=> toggle(x, active))
}));

/*Code*/ $ready('[efy_code]', (a)=>{ let b = a.getAttribute('efy_code').split(','), chars = a.getAttribute('efy_code').length + 2;
    $add('div', {class: 'efy_bar'}, [ ['mark', {}, b[0]], ['div', {}, [
        ['button', {class: 'efy_code_trans'}, 'transparent'],
        ['button', {class: 'efy_fs'}, [ ['i', {efy_icon: 'fullscreen'}] ]],
        ['button', {class: 'efy_copy'}, [ ['i', {efy_icon: 'copy'}] ]]
    ]]], a, 'afterbegin');

    $event(a, 'click', (x)=>{ x = x.target;
        if (x.matches('.efy_fs')){ document.fullscreenElement ? document.exitFullscreen() : a.requestFullscreen()}
        else if (x.matches('.efy_code_trans')){ $body.classList.toggle('efy_code_trans_on')}
        else if (x.matches('.efy_copy')){
            let c = a.innerText, d = c.substring(c.indexOf('copy') + chars); navigator.clipboard.writeText(d);
            if (efy.notify_clipboard != false){ $notify('short', 'Copied to clipboard', d)}
        }
    });
});

/*EFY Range Text*/ let p; $ready('[efy_range_text]', (a)=>{ let c = $$(a, 'input[type=range]');
    $add('input', {class: 'efy_range_text_p', type: 'number', value: c.value, step: c.step, min: c.min, max: c.max, name: 'efy_name'}, [], a, 'afterbegin'); p = $$(a, '.efy_range_text_p');
    $event(p, 'input', (x)=>{ c.value = x.target.value; c.dispatchEvent(new Event('input', {'bubbles': true }))});
    $event(c, 'input', (x)=>{ $$(a, '.efy_range_text_p').value = x.target.value });
}); $all('form[class*=efy], [efy_content=colors] [efy_color_picker]').forEach(x =>{ $event(x,'reset', ()=>{
        $$all(x, '[efy_range_text]').forEach(y =>{ $$(y, '.efy_range_text_p').value = $$(y, 'input').value })
})});

/*Clock & Timer*/ let time_0 =(i)=>{ if (i < 10){i = '0' + i} return i},

/*Clock*/ efy_clock =()=>{ let t = new Date(), h = t.getHours(), m = time_0(t.getMinutes()), s = ''; $all('[efy_clock]').forEach(x =>{ let f = '';
    if (x.getAttribute('efy_clock').includes('12')){ f = h < 12 ? ' AM' : ' PM'}
    if (x.getAttribute('efy_clock').includes('hms')){ s = time_0(t.getSeconds())}
    let z = 'hour s1 minute s2 second format'.split(' '); [h,':',m,':',s,f].map((a,i)=>{ $$(x, '.' + z[i]).textContent = a });
 })};
$ready('[efy_clock]', (x)=>{ 'hour s1 minute s2 second format'.split(' ').map(a =>{ $add('p', {class: a}, [], x)});
    $wait(.1, efy_clock); setInterval(efy_clock, 1000)
});

/*Timer: ID, Time, Reverse (optional)*/ $ready('[efy_timer]', (y) =>{ let tm = y.getAttribute('efy_timer').replaceAll(' ', '').split(','), time = '00:00:00'; if (tm[1]  !== undefined){ time = $sec_time(tm[1])}
    $add('div', {efy_text: ''}, [time], y); $add('button', {efy_start: '', title: 'Start or Pause'}, [], y); $add('button', {efy_reset: '', title: 'Reset'}, [], y);

    let play = $$(y, '[efy_start]'), reset= $$(y, '[efy_reset]'), timer_text = $$(y, '[efy_text]'), interval, i = 0;
    const time_reset =()=>{clearInterval(interval); i = 0; if (tm[2] == 'reverse'){ $text(timer_text, $sec_time(tm[1]) )} else {$text(timer_text, "00:00:00")} play.removeAttribute('efy_active')}

    $event(play, 'click', ()=>{ clearInterval(interval); play.toggleAttribute('efy_active'); if (play.hasAttribute('efy_active')){ interval = setInterval(()=>{
        /*Reverse*/ if (tm[2] == 'reverse'){ i++; $text(timer_text, $sec_time(tm[1] - i))}
        /*Normal*/ else { i++; $text(timer_text, $sec_time(i))}
        /*Reset & Notify*/ if (i == tm[1]){ $notify('infinite', 'Done!', 'Time is up!'); $audio_play(efy_audio.call, 'loop'); time_reset(); $event($('[efy_alert]'), 'click', ()=>{ try {efy_audio.call.pause()} catch {/**/} })}
    }, 1000)} else { clearInterval(interval) }});
    $event(reset, 'click', time_reset);
});

/*Search Filter */ $ready('[efy_search]', (sc)=>{
    let a = sc, search = a.getAttribute('efy_search'), container = `#${a.id}[efy_search="${search}"]`, z = $(container +' [efy_search_input]');
    $event(z, 'keyup', ()=>{ let val = z.value.toLowerCase();
        $all(container +' '+ search).forEach(x =>{
            if (x.textContent.toLowerCase().includes(val) == 0){x.classList.add('efy_hide_i')}
            else {x.classList.remove('efy_hide_i')}
})})});

/*EFY Toggle*/ $ready('[efy_toggle]', (a)=>{ let b = a.getAttribute('efy_toggle'); $event(a, 'click', ()=>{ $all(b).forEach(c =>{ c.classList.toggle('efy_hide_i')})})});

/*Alerts*/ $add('div', {efy_alerts: '', class: 'efy_sidebar_width'}, [], $body, 'afterbegin');
$event($body, 'pointerup', ()=>{ let a = event.target;
    if (a.matches('[efy_alert]')){
        let b = a.classList[0], icon_fn =()=>{
            let active = $all('.efy_quick_notify_content [efy_alert]').length > 0 ? '_active' : '';
            $('.efy_quick_notify i').setAttribute('efy_icon', 'notify' + active);
        };
        a.classList.add('efy_anim_remove');
        $wait($css_prop('--efy_anim_speed') * 0.05, ()=>{
            a.remove(); try { $(`.efy_quick_notify_content [efy_alert].${b}`).remove(); clearInterval(efy_timer_interval)} catch {/**/} icon_fn()
        })
}});

/*Lang Pseudo Trigger (Temporary)*/ $add('i', {efy_lang: 'no_notifications', style: 'opacity: 0; pointer-events: none; position: absolute'}, [], $('.efy_sidebar'));
/*Prevent Default*/ $all('input[type="range"], .plus-btn, .minus-btn').forEach(a => $event(a, 'contextmenu', ()=> event.preventDefault()));

/*Lang files loaded*/ $('.efy_lang_app_file').onload =()=>{
    /*Translations*/ const processed = new WeakSet(),
    observer = new MutationObserver(mutations =>{
        for (let mutation of mutations){ if (mutation.type === 'childList'){
                $$all(mutation.target, '[efy_lang]').forEach(element =>{
                    if (!processed.has(element)){
                        const string = getComputedStyle($('[efy_lang]')).getPropertyValue(`--${element.getAttribute('efy_lang')}`);
                        element.insertAdjacentText(
                            $$(element, '[efy_icon]') ? 'beforeend' : 'afterbegin',
                            element.hasAttribute('efy_range_text') ? `${string}:` : string
                        );
                        processed.add(element);
                    }
                });
                mutation.removedNodes.forEach(node =>{
                    if (node.nodeType === 1) processed.delete(node);
                });
            }}
    }); observer.observe(document.body, { childList: true, subtree: true });

    /*Alpha*/ ['"Max Width"'].map(a=>{ $add('mark', {efy_lang: 'alpha'}, [], $(`[efy_content=size] [efy_range_text*=${a}] .efy_range_text_p`), 'afterend') });
    /*No Notifications*/ $add('style', {}, [`.efy_quick_notify_content:empty:before {content: '${efy_lang.no_notifications}'}`], $head);
    /*Extra Modules*/ ['extra'].map(a=>{
        if ($efy_module(`efy_${a}`)){ $add('link', {href: `${efy.folder}/${a}.css`, rel: 'stylesheet'}, [], $head);
            if ($css_prop('--efy_protocol') == 'http'){ $add('script', {src: `${efy.folder}/${a}.js`, type: 'module'}, [], $head)}
            else { $add('script', {src: `${efy.folder}/${a}_local.js`}, [], $head)}
    }});

    /*Online Status*/ ['offline', 'online'].map((a,i)=>{ $event(window, a, ()=>{ if (efy.notify_offline !== false){
        const lang = ['', $('[efy_lang]')], n = `--${a}_notify`; $notify('short', $css_prop(n, ...lang), $css_prop(`${n}_text`, ...lang))
    }})});

}}