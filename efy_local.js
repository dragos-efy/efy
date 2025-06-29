let efy_version = '25.06.29 Beta', $ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document),
$head, $body, $root, $efy_module, efy = {}, efy_lang = {}, efy_audio = {volume: 1}, $save =()=>{}, $100vh, open_idb, efy_css = {},
/*Add: Selector, optional: {Attributes}, [Text, Children], Parent, Position*/
$add =(tag, attrs = {}, children = [], parent = document.body, position = 'beforeend')=>{
    const element = document.createElement(tag);
    if (typeof attrs === 'string' || Array.isArray(attrs)){
        if (parent !== document.body){ const type = typeof parent;
            if (type === 'string') position = parent;
            if (['string', 'object'].includes(type)) parent = children;
        }; [children, attrs] = [attrs, {}];
    }
    Object.entries(attrs).forEach(a => element.setAttribute(...a));
    if (!Array.isArray(children)) children = [children];
    children.forEach(child =>{
        if (Array.isArray(child)){ let [a,b,c] = child;
            if (typeof b === 'string' || Array.isArray(b)) [c,b] = [b,{}];
            element.appendChild($add(a, b, c, element));
        } else if (typeof child === 'string'){ element.textContent += child}
        else if (child instanceof Node){ element.appendChild(child)}
    }); parent.insertAdjacentElement(position, element); return element;
},
/*Text: Selector, Text, Position (optional)*/ $text = (a, b, c) =>{ c ? a.insertAdjacentText(c,b) : a.textContent = b},
$css_prop =(prop, value, position = $root)=>{ if (value){ position.style.setProperty(prop, value)}
    else { let value = getComputedStyle(position).getPropertyValue(prop);
        if (value.startsWith(' ')){ value = value.slice(0,1)}; return value
}},
$event =(a,b,c,d)=>{ d ? a.addEventListener(b,c,d) : a.addEventListener(b,c) },
/*Remove Event*/ $event_rm = (a,b,c,d) =>{ d ? a.removeEventListener(b,c,d) : a.removeEventListener(b,c) },
/*Ready: Selector, Function, 1 (optional)*/ $ready =(sel, fn, once)=>{ let d = document.documentElement; if (once == 1){
        return new Promise((res) =>{ let b = $(sel); if (b){res(b); return}
        new MutationObserver((m, x) =>{ Array.from($all(sel)).forEach((c) =>{ res(c); x.disconnect() })}).observe(d, { childList: true, subtree: true })}).then(() => fn(sel.selector))
    } else { let a = [{sel, fn}], o, check =()=>{
        for (let {sel, fn} of a) { let e = Array.from($all(sel));
            for (let a of e){ if (!a.$ready){ a.$ready = true; fn(a,a)}}
    }}; if (!o){ o = new MutationObserver(check).observe(d, {childList: true, subtree: true})} check()
}},
cursor_fn =(e)=>{let x = $('[efy_cursor]'); x.style.left = e.pageX + 'px'; x.style.top = e.pageY + 'px'},
$audio_play = async (a,b)=>{ try { if (document.hasFocus()){
    a.pause(); a.currentTime = 0; a.play();
    if (b == 'loop'){ $event(a, 'ended', ()=>{ a.pause(); a.currentTime = 0; a.play()}, false)}
}} catch (error) {/**/}},
/*Wait: Seconds, FN*/ $wait =(a,b)=> setTimeout(b,a*1000),
$$ =(a,b)=> a.querySelector(b), $$all =(a,b)=> a.querySelectorAll(b),
$notify =(seconds, title, info, lang, icon, callback)=>{ let selectors = [];
    const presets = {'short': 5, 'long': 30, 'infinite': 600}, startTime = Date.now(), id = 'alert' + startTime, i = $('.efy_quick_notify i');
    seconds = presets[seconds] !== undefined ? presets[seconds] : seconds; let current = seconds;
    const icon_fn =()=>{ let icon = ($all('.efy_quick_notify_content [efy_alert]').length > 0) ? 'notify_active' : 'notify'; i.setAttribute('efy_icon', icon)};
    if (lang == 'lang'){ title = efy_lang[title]; info = efy_lang[info]}

    icon = (typeof icon === 'string') ? ['i', {efy_icon: icon}] : null;

    ['[efy_alerts]', '.efy_quick_notify_content'].map(e =>{
        const time_left = (e == '[efy_alerts]') ? ['div', {class: 'time_left'}, String(seconds)] : '';
        selectors.push( $add('div', {efy_alert: '', class: id}, [
            ['div', {class: 'nav'}, [
                ['div', {class: 'title'}, [icon, ['p', title]]],
                ['div', {class: 'remove_timer'}, [
                    time_left, ['button', {efy_btn_square: '', class: 'remove'}, [['i', {efy_icon: 'remove'}]]]
                ]]
            ]],
            info ? ['p', {class: 'info'}, info] : null
        ], $(e)) );
    }); icon_fn();

    if (efy.audio_status) $audio_play(efy_audio.ok3)

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

/*After Page Loads*/ window.onload = async ()=>{ $root = $(":root"), $head = document.head, $body = document.body;
    if (!efy.modules) efy.modules = $css_prop('---modules').replaceAll(' ', '').split(',');
    $efy_module = (a) =>{ let b = efy.modules.includes(a) ? true : false; return b}; let a, b;

/*Check LocalStorage*/ try { if (localStorage.efy){ efy = JSON.parse(localStorage.efy)} $save =()=>{ localStorage.efy = JSON.stringify(efy)}
} catch { $wait(2, ()=>{
    $add('div', {class: 'efy_no_ls', efy_card: ''}, [ ['h6', {efy_lang: 'localstorage_off'}], ['p', {efy_lang: 'localstorage_off_text'}] ], $('.efy_sidebar > [efy_about]'), 'afterend')
})}

/*Translations*/ efy.folder = $css_prop('---folder'); if (efy.lang_code == undefined){ efy.lang_code = $css_prop('---lang_code')}
$add('link', {href: `${efy.folder}/lang/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: ''}, [], $head);
$add('link', {href: `${$css_prop('---lang_folder')}/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: '', class: 'efy_lang_app_file'}, [], $head);

/*Responsive 100vh*/ $100vh =()=>{
    const text = efy.text_zoom || 1;
    $css_prop(`---100vh`, ((visualViewport.height * visualViewport.scale).toFixed(2) / text) + 'rem')
}; $100vh();
$event(window.visualViewport, 'resize', $100vh);
$event(window.visualViewport, 'orientationchange', $100vh);

/*Sidebar Modules*/ $add('div', {id: 'efy_sidebar', class: 'efy_sidebar', efy_search: 'details:not(.efy_quick_shortcuts, [efy_logo]), .efy_sidebar [efy_tabs] > *'}, [
    ['div', {efy_about: ''}, [
        ['div', {class: 'efy_flex efy_sidebar_top_buttons'}, [
            ['button', {class: 'efy_about', efy_toggle: '.efy_about_div', efy_logo: ''}, [ ['p', 'EFY'], ['p', ' UI'] ]],
            ['button', {class: 'efy_quick_notify efy_square_btn', efy_toggle: '.efy_quick_notify_content', title: 'Notifications'}, [['i', {efy_icon: 'notify'}]]],
            ['button', {class: 'efy_quick_search efy_square_btn', efy_toggle: '#efy_sidebar [efy_search_input]', title: 'Search'}, [['i', {efy_icon: 'search'}]]]
        ]],
        ['button', {efy_sidebar_btn: 'close', class: 'efy_square_btn', title: 'close'}, [['i',{efy_icon: 'remove'}]]],
    ]],
    ['div', {efy_card: '', class: 'efy_about_div efy_hide_i'}, [
        ['mark', {efy_lang: 'version'}, [`: ${efy_version}`]], ['p', {efy_lang: 'sidebar_about_text'}],
        ['div', {class: 'efy_flex'}, [
            ['a', {href: 'https://efy.ooo', role: 'button', efy_lang: 'website'}],
            ['a', {href: 'https://github.com/dragos-efy/efy', role: 'button'}, 'Github'],
            ['a', {href: 'https://matrix.to/#/#efy_ui:matrix.org', role: 'button'}, 'Matrix'],
            ['a', {href: 'https://translate.codeberg.org/projects/efy', role: 'button', efy_lang: 'translate'}]
        ]]
    ]], ['div', {id: 'efy_modules'}],
    ['details', {id: 'efy_sbtheme', efy_select: ''}, [
        ['summary', {efy_lang: 'theme'}, [['i', {efy_icon: 'star'}]]],
        ['div', {efy_tabs: 'efy_theme'}, [['div', {class: 'efy_tabs'}]]]
    ]],
    ['details', {id: 'efy_modules_menu', efy_select: ''}, [
        ['summary', {efy_lang: 'modules'}, [['i', {efy_icon: 'group'}]]],
        ['div', {id: 'efy_modules_menu_div'}, [
            ['div', {class: 'efy_modules_menu_reload efy_hide_i', efy_card: ''}, [
                ['p','Refresh the page to see the changes'],
                ['button', {efy_lang: 'reset', onClick: 'location.reload();'}, [['i', {efy_icon: 'reload'}]]]
            ]]
        ]]
    ]]
]);
$add('button', {efy_sidebar_btn: 'absolute', title: 'menu'}, [['i', {efy_icon: 'menu'}]]);
$add('video', {class: 'efy_3d_bg', autoplay: '', loop: '', muted: '', playsinline: ''});

['quick', 'filters', 'backup', 'accessibility', 'languages', 'audio', 'virtual_keyboard', 'gamepads', 'click_effects'].map(x =>{
    const name = 'efy_module_toggles', id = `${name}_efy_${x}`, end = [[], $('#efy_modules_menu_div')];
    $add('input', {id: id, type: 'checkbox', name: 'efy_module_toggles'}, ...end);
    $add('label', {for: id, efy_lang: x}, ...end);
});

efy.modules.map(x => $(`#efy_module_toggles_${x}`).checked = true);

$event($body, 'change', ()=>{ const x = event.target;
    if (x.matches('#efy_modules_menu_div input')){
        efy.modules = Array.from($all('#efy_modules_menu_div input:checked'))
            .map(y => y.id.replace('efy_module_toggles_', ''));
        $save();
        $('.efy_modules_menu_reload').classList.remove('efy_hide_i');
    }
});

// Quick Module
let about = $('[efy_about]');
$add('input', {type: 'text', efy_search_input: '', class: 'efy_hide_i', tabindex: '-1', placeholder: 'Search through menu...', name: 'efy_name'}, [], about, 'afterend');
$add('div', {class: 'efy_quick_notify_content efy_hide_i', efy_card: ''}, [], about, 'afterend');

/*Theme*/

/*Tabs*/ ['mode', 'colors', 'size', 'menu'].map(a =>{
    const id = `efy_theme_${a}`, parent = [[], $('[efy_tabs=efy_theme] .efy_tabs')];
    const tab = $add('input', {efy_tab: a, type: 'radio', id: id, name: 'efy_theme_tabs'}, ...parent),
    content = $add('div', {efy_content: a, efy_select: '', id: `efy_${a}`}, [], $('[efy_tabs=efy_theme]'));
    $add('label', {efy_lang: a, for: id}, ...parent);
    if (a == 'mode'){ tab.setAttribute('efy_active', ''); content.setAttribute('efy_active', '')}
});

/*Colors*/ b = $('#efy_sbtheme [efy_content=colors]');
let css = $css_prop(`---color`).split(', ');
css.map((a,i) => css[i] = `${i+1} ${a}`);
let colors = efy.colors ? String(efy.colors) : css;

let container = $add('div', {id: 'efy_gradient', efy_tabs: 'container', efy_color: `${colors}, range:1-18`}, [], b);
$add('div', {efy_lang: 'angle', efy_range_text: 'Angle'}, [
    ['input', {class: 'efy_color_angle_input', type: 'range', min: '0', max: '360', value: '165', step: '1'}]
], b);

const update_color =(angle)=>{ let [alpha, gradient, gradient_trans, gradients, colors] = [[],[],[],[],[]];
    const contents = $$all(container, '[efy_content]');
    contents.forEach((form, i)=>{ alpha.push($$(form, `.alpha`).value);
        const ok = `${$$(form, '.lightness').value} ${$$(form, '.chroma').value} ${$$(form, '.hue').value}`;
        colors.push(`${i+1} ${ok} ${alpha[i]}`);
        gradient.push(`oklch(${ok} / ${alpha[i]})`);
        gradient_trans.push(`oklch(${ok} / ${ (alpha[i] / 3).toFixed(2) })`);
    });

    gradients = (contents.length > 1) ? [gradient, gradient_trans] : [`${gradient}, ${gradient}`, `${gradient_trans}, ${gradient_trans}`];
    efy.colors = colors; $save();
    ['', '_trans'].map((a,i)=> $css_prop(`---color${a}`, `linear-gradient(var(---color_angle), ${gradients[i]})` ));
};

/*Restore Gradient*/ if (efy.colors){ let gradient = [[],[]];
    efy.colors.forEach(a=>{ a = a.split(' '); for (let i = 0; i < 2; i++){
        gradient[i].push(`oklch(${a[1]} ${a[2]} ${a[3]} / ${i === 0 ? a[4] : (a[4] / 3).toFixed(2)})`)
        if (efy.colors.length < 2) gradient[i].push(...gradient[i]);
    }});
    ['', '_trans'].map((a,i)=> $css_prop(`---color${a}`, `linear-gradient(var(---color_angle), ${gradient[i]})`));
} else { $ready('#efy_gradient .alpha', update_color, 1)}

$event($('.efy_color_angle_input'), 'input', ()=> update_color());
$event(container, 'input', ()=> update_color());
$event(container, 'click', (e)=>{ const x = e.target;
    if (x.matches('.color_add') || x.matches('.color_remove')) update_color();
});

$add('div', {class: 'efy_hr_div'}, [ ['details', {efy_help: 'custom_colors'}, [
    ['summary', [['p', {efy_lang: 'custom_colors'}], ['hr']]], ['div', {efy_lang: 'custom_colors_help'}]
]]], b);


$add('div', {class: 'efy_custom_colors', efy_color: `Text 0.5 0.2 0 1 efy_color_text, Background 0.7 0.2 100 1 efy_color_bg, Border 0.7 0.2 100 1 efy_color_border, Card 0.7 0.2 100 1 efy_color_card, Button 0.7 0.2 100 1 efy_color_button`}, [], b);

$ready(`[for=efy_color_button]`, ()=>{

    ['text', 'bg', 'border', 'card', 'button'].map((a,i)=>{
        const j = i + 1, id = `efy_${a}_status`, begin = [[], $(`.efy_custom_colors [efy_content="${j}"]`), 'afterbegin'];
        $add('label', {for: id, efy_lang: 'active'}, ...begin); $add('input', {id: id, type: 'checkbox'}, ...begin);
        if (efy[a] !== undefined) $css_prop(`---color_${a}`, efy[a]);
    });

    /*Checkbox Toggles*/  'text_status bg_status border_status card_status button_status'.split(' ').forEach(x =>{
        if (efy[x]){ $(`#efy_${x}`).setAttribute('checked', '')}
        $event($(`#efy_${x}`), 'click', ()=>{
            efy[x] ? delete efy[x] : efy[x] = true; $save()
        })
    });
    /*Custom Text Color*/ if (efy.text_status){ $root.setAttribute('efy_color_text', '')} $('#efy_text_status').onchange =()=>{ $root.toggleAttribute('efy_color_text')}
    /*Custom BG Color*/ if (efy.bg_status){ $root.setAttribute('efy_color_bg', '')} $('#efy_bg_status').onchange =()=>{ $root.toggleAttribute('efy_color_bg')}
    /*Custom BG Color*/ if (efy.border_status){ $root.setAttribute('efy_color_border', '')} $('#efy_border_status').onchange =()=>{ $root.toggleAttribute('efy_color_border')}
    /*Custom Card Color*/ if (efy.card_status){ $root.setAttribute('efy_color_card', '')} $('#efy_card_status').onchange =()=>{ $root.toggleAttribute('efy_color_card')}
    /*Custom Button Color*/ if (efy.button_status){ $root.setAttribute('efy_color_button', '')} $('#efy_button_status').onchange =()=>{ $root.toggleAttribute('efy_color_button')}

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
    $add('div', {class: 'efy_hr_div'}, [['p', `Shadows: ${type.charAt(0).toUpperCase() + type.slice(1)}`], ['hr']], efy_shadows);
    $add('div', {class: `efy_shadows_${type}`, efy_color: `${(colors.length === 0) ? '' : `${colors}, `}range:0-10`}, [], efy_shadows);

    $ready(`${shadows} .alpha`, ()=>{
        const set_css =(style, style_button)=>{
            $css_prop(`---${key}`, style); if (type === 'button') $css_prop(`---${key}_trans`, style_button);
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
    const range_hide = (!range_status) ? ' efy_hide_i' : '', range_status_index = (!range_status) ? {tabindex: '-1'} : null;
    bg = 'background: linear-gradient(to right,';
    [['add', 'plus'], ['remove', 'remove']].map(a =>{
        $add('button', {class: `color_${a[0]}${range_hide}`, ...range_status_index}, [['i', {efy_icon: a[1]}]], previews);
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
        $add('input', {id: id, efy_tab: j, type: 'radio', name: now}, [], add, 'beforebegin');
        $add('label', {for: id, style: `background: ${color}`}, names[i] || nr, add, 'beforebegin');

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
        else if (match.remove && (nr > min)){
            $$all(a, `[efy_tab], [efy_content], input[type=radio][name*=colors], input[type=radio][name*=colors] + label`).forEach(x => x.remove());
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

    $event(a, 'input', (d)=>{
        let active = $$(a, '[efy_content]'); const target = d.target;

        if (target.matches('[efy_tab]')){
            $$all(a, '[efy_tab]').forEach(x => x.removeAttribute('efy_active'));
            $$all(a, '[efy_content]').forEach(x => x.removeAttribute('efy_active'));
            target.setAttribute('efy_active', '');
            $$(a, `[efy_content="${target.getAttribute('efy_tab')}"]`).setAttribute('efy_active', '');
        }

        if ($$(a, '[efy_content][efy_active]')){ active = $$(a, '[efy_content][efy_active]')}
        else { ['tab', 'content'].map(x => $$(a, `[efy_${x}]`).setAttribute('efy_active', ''))}

        const current = active.getAttribute('efy_content'), current_tab = $$(a, `[efy_tab="${current}"] + label`),
        l = $$(active, '.lightness').value, c = $$(active, '.chroma').value, h = $$(active, '.hue').value,
        alpha = $$(active, '.alpha').value, ok = `${l} ${c} ${h}`,
        style = [`.5 0 0), oklch(${l} ${c} ${h}))`, `0 0 0), oklch(.5 ${c} ${h}), oklch(1 0 0))`, `0 0 0 / 0), oklch(${l} ${c} ${h}))`];

        /*Update Design*/ ['.chroma', '.lightness', '.alpha'].map((x,i)=>{
            $$(active, x).style.background = 'linear-gradient(to right, oklch(' + style[i]
        }); current_tab.style.background = `oklch(${ok} / ${alpha})`;

        [lightnesses[current-1], chromas[current-1], hues[current-1], alphas[current-1]] = [l, c, h, alpha];

        ['text', 'bg', 'border', 'card', 'button'].map(x =>{
            if (current_tab.getAttribute('for') == `efy_color_${x}`){
                $css_prop(`---color_${x}`, ok); efy[x] = ok; $save()
        }});
    });

});


/*Mode*/ (()=>{ const content = $('#efy_sbtheme [efy_content=mode]'),
    themes = [['div', {class: 'defaults'}], ['p', {efy_lang: 'custom'}], ['div', {class: 'custom'}]];
    content.classList.add('efy_shadow_trans_off');
    $add('div', {class: 'current_mode efy_shadow_trans'}, [
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
        ['summary', [['p', {efy_lang: 'type'}], ['hr']]],
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
        ['summary', [['p', {efy_lang: 'images'}], ['hr']]], ['div', {efy_lang: 'sidebar_images_warning_help'}]
    ]]]],
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: 'idb_addimg_bg', type: 'file', accept: 'image/*, video/*', style: 'display: none'}],
        ['label', {for: 'idb_addimg_bg', title: 'Add file', class: 'efy_color', type:'button', role: 'button'}, [['i', {efy_icon: 'plus'}]]],
        ['input', {id: 'idb_remove_toggle', type: 'checkbox', style: 'display: none'}],
        ['label', {for: 'idb_remove_toggle', title: 'Remove', class: 'efy_color', type:'button', role: 'button'}, [['i', {efy_icon: 'remove'}]]],
        ['button', {class: 'efy_images_reset efy_hide_i', title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
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
    ['p', [
        'Find & Share more themes at ',
        ['a', {href: 'https://efy.ooo#themes'}, 'efy.ooo#themes']
    ]]
], selector);


/*IndexedDB*/ let themes_load_nr = 0, efy_idb = '', idb_themes = '', idb_themes_system = '';

open_idb =(name = 'efy')=>{
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
    $notify('short', `Add Themes - ${x.target.checked ? 'ON' : 'OFF'}`);
});

$event($('#efy_themes .edit'), 'click', (x)=>{ const checked = x.target.checked;
    $all('#efy_themes .themes > button').forEach(a => a.contentEditable = checked);
    $notify('short', `Rename Themes - ${checked ? 'ON' : 'OFF'}`, '');
});

$event($('#efy_themes .remove'), 'click', (x)=>{
    $notify('short', `Remove Themes - ${x.target.checked ? 'ON' : 'OFF'}`);
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
    $notify('long', 'WARNING - Unstable Experiment', 'Toggle off "Confirm Changes" if it breaks');
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
   if (b){ d.value = b.replace(e[i], ''); $css_prop(`---${n}`, b)}
   $event(d, 'input', ()=>{ let c = d.value + e[i]; $css_prop(`---${n}`, c); efy[n] = c; $save()})
});


/*Max Width*/ let input2 = $('.efy_maxwidth_input'), y, zz = '[efy_range_text*="Max Width"] select', z = $(zz), width = efy.max_width;
if (width){ y = width.replace('rem', '').replace('%', ''); input2.value = y; $css_prop('---body_width', width) } else {y = 1200}
input2.oninput =()=>{ let y = input2.value; z = $(zz).value; $css_prop('---body_width', y + z); efy.max_width = y + z; $save()}
z.oninput =()=>{ if (z.value == '%'){ input2.setAttribute('min', '10'); input2.setAttribute('max', '100'); input2.setAttribute('value', '100')} if (z.value == 'rem'){ input2.setAttribute('min', '500'); input2.setAttribute('max', '5000'); input2.setAttribute('value', '1200')}
 let y = input2.value; z = $(zz).value; $css_prop('---body_width', y + z); efy.max_width = y + z; $save()}


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

$wait(.1, ()=>{ // Temporary fix, Make it work without a timeout
    let sd_btn = $css_prop('---sidebar_button').replaceAll(' ', '').split(','),
    a = 'efy_sidebar_btn_hide', c = $('#efy_btn_align'), d = 'beforeend', e = $('[efy_sidebar_btn*=absolute]');

    $add('input', {type: 'checkbox', name: a, id: a, checked: ''}, [], c, d);
    $add('label', {for: a, efy_lang: 'floating_button'}, [], c, d);
    if (!(efy.sidebar_btn_status) && (sd_btn.includes('off'))){
        e.classList.add('efy_hide_i'); $('#'+a).removeAttribute('checked')
    }
    $event($('#'+a), 'click', ()=>{
        if (e.classList.contains('efy_hide_i')){efy.sidebar_btn_status = 'on'; $save()}
        else {delete efy.sidebar_btn_status; $save()}
        e.classList.toggle('efy_hide_i')
    });

    a = $('[efy_sidebar_btn=absolute]'); b = 'efy_btn_align';

    if (efy.btn_align){ let c = efy.btn_align; $("#" + c).setAttribute('checked', ''); a.setAttribute(b, c)}
    else { let y = sd_btn[0]; $('#'+y).setAttribute('checked', ''); a.setAttribute(b, y)}
    $all("[name=efy_btn_align]").forEach(x =>{ x.onclick =()=>{ a.setAttribute(b, x.id); efy.btn_align = x.id; $save() }});

    /*Toggle Sidebar*/ $event($body, 'click', ()=>{ let x = event.target;
        if (x.matches('[efy_sidebar_btn]')){ let final = 'on';
            if (x.matches('[efy_sidebar_btn*=absolute]')) a.classList.toggle('efy_hide_i');
            if ($root.hasAttribute('efy_sidebar')){
                let d = $root.getAttribute('efy_sidebar'), e = '';
                if (['left', 'right'].some(s => d.includes(s))) e = d.replace('on_', '');
                final = d.includes('on') ? e : 'on_' + e;
                $('.efy_sidebar [efy_sidebar_btn="close"]').focus();
            }; $root.setAttribute('efy_sidebar', final)
        }
        if (x.matches('.efy_sidebar [efy_sidebar_btn*=close]')){
            if (sd_btn.includes('on') || efy.sidebar_btn_status === 'on') a.classList.toggle('efy_hide_i');
            $wait(1, ()=> $('body [efy_sidebar_btn]:not(.efy_sidebar [efy_sidebar_btn])').focus());
        }
    })
});

 /*EFY Notifications*/ $add('details', {id: 'efy_notifications', efy_select: ''}, [
    ['summary', {efy_lang: 'notifications'}, [['mark', {efy_lang: 'alpha'}]]],
    ['div', {id: 'efy_notify_status'}], ['p', 'Position'], ['div', {id: 'efy_notify_align'}]
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


/*3D Layer Input*/
['bg', 'front', 'back'].map(a =>{ let b = `efy_css_${a}`;
    $add('style', {class: b}, [], $head); efy_css[a] = $('.' + b);
    $event($body, 'change', (x) =>{
        if (x.target.matches(`#idb_addimg_${a}`)) efy_add_bgimg(a, x)
    });
});


/*Load Modules*/ ['quick', 'filters', 'audio', ['accessibility', ['virtual_keyboard', 'click_effects']], 'languages', 'backup', 'gamepads'].map(x =>{
    let [module, submodules] = Array.isArray(x) ? x : [x, false];
    if (efy.modules.includes(`efy_${module}`)){
        $add('script', {src: `${efy.folder}/module_${module}.js`}, [], $head);
        if (module === 'gamepads'){
            $add('link', {href: `${efy.folder}/module_${module}.css`, rel: 'stylesheet'}, [], $head);
        }
    }
    if (submodules){ submodules.map(submodule =>{ if (efy.modules.includes(`efy_${submodule}`)){
        $add('link', {href: `${efy.folder}/module_${submodule}.css`, rel: 'stylesheet'}, [], $head);
        $add('script', {src: `${efy.folder}/module_${submodule}.js`}, [], $head);
    }})}
});

/*Sidebar Modules - End*/

/*Upload Input: id, accept, efy_lang or 'small', multiple, icon*/ $ready('[efy_upload]', (a)=>{
    let value = a.getAttribute('efy_upload'), accept_array = value.match(/\[(.*?)\]/), accept, b = value.replaceAll(' ','').split(','), c = 'plus';
    if (accept_array){ accept = accept_array[1]; b = value.replace(`[${accept}],`, ',').replaceAll(' ','').split(',')} else {accept = b[1]}
    if (b[2]){ if (b[2] !== 'small'){ a.setAttribute('efy_lang', b[2]) } } else {a.setAttribute('efy_lang', 'add_file')} if (b[4]){ c = b[4]}
    a.setAttribute('role', 'button'); $add('input', {type: 'file', id: b[0], accept: accept}, [], a); $add('i', {efy_icon: c}, [], a);
    if (b[3] == 'multiple'){ $all(`#${b[0]}`).forEach(a=>{ a.setAttribute('multiple', '')})}
});


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
                /*Restore Background*/ $text(efy_css[type], `.efy_3d_${type} {background: url(${file})}`);
                /*Add Preview*/ $add('button', {efy_bg_nr: count_img, style: `background: url(${thumbnail})`}, [], $(previews));
                const preview = $(`${previews} [efy_bg_nr="${count_img}"]`);
                $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active'));
                preview.setAttribute('efy_active','');
                /*Preview Click*/ $event(preview, 'click', ()=>{
                    $text(efy_css[type], `.efy_3d_${type} {background: url(${file})}`);
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
                $text(efy_css[type], `.efy_3d_${type} {background: url(${x.image})!important; background-size: var(---bg_size)!important} html {background: var(---bg)!important; background-size: cover!important}`);
                efy[`nr_${type}`] = current; $save();
                $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active')); y.target.setAttribute('efy_active', '')
            });
            cursor.continue();
        } else { /*Check bg_nr*/
            /*Restore Background*/ if (count_img > 0){ store.get(current_id).onsuccess = e =>{
                $text(efy_css[type], `.efy_3d_${type} {background: url(${e.target.result.image})!important; background-size: var(---bg_size)!important}`);
                $(`#efy_images_${type} .efy_img_previews [efy_bg_nr]:nth-of-type(${efy[`nr_${type}`] + 1})`).setAttribute('efy_active', '')
            }}
            /*Reset iDB*/ $all('.efy_images_reset').forEach(a =>{ $event(a, 'click', () =>{
                const transaction = efy_idb.transaction(['bg'], 'readwrite'),
                store = transaction.objectStore('bg');
                store.clear().onsuccess =(event)=>{
                    $all('.efy_img_previews [efy_bg_nr]').forEach(a => a.remove());
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
        img_previews.classList.toggle('efy_remove'); $('.efy_images_reset').classList.toggle('efy_hide_i');
        const status = e.target.checked;
        $notify('short', status ? 'Remove Media' : 'Set Background', status ? 'Select what to remove' : 'Select your background');
    }
});

/*Run Functions*/ (async ()=>{
    await count_images('bg');
    if (efy.modules.includes('efy_filters')){
        await count_images('front'); count_images('back')
    }
})();




/*Tabs*/ $ready('[efy_tabs]', (a)=>{
    $event(a, 'click', event =>{ const tab = event.target;
        if (!tab.matches(`[efy_tab]`)) return; event.stopPropagation();
        const name = `[efy_tabs="${tab.closest('[efy_tabs]').getAttribute('efy_tabs')}"]`, active = tab.hasAttribute('efy_active'),
        tabs = `:is(${name}, ${name} > div, ${name} > div > div) >`, content = $(`${tabs} [efy_content="${tab.getAttribute('efy_tab')}"]`),
        toggle =(a,b)=> a[b ? 'removeAttribute' : 'setAttribute']('efy_active', '');
        $all(`${tabs} :is([efy_tab], [efy_content])[efy_active]`).forEach(x => toggle(x, true));
        [tab, content].forEach(x=> toggle(x, active))
    })
});

/*Code*/ $ready('[efy_code]', (a)=>{ let b = a.getAttribute('efy_code').split(',');
    $add('div', {class: 'efy_bar'}, [ ['mark', b[0]], ['div', [
        ['button', {class: 'efy_code_trans'}, 'transparent'],
        ['button', {class: 'efy_fs'}, [ ['i', {efy_icon: 'fullscreen'}] ]],
        ['button', {class: 'efy_copy'}, [ ['i', {efy_icon: 'copy'}] ]]
    ]]], a, 'afterbegin');

    $event(a, 'click', (x)=>{ x = x.target;
        if (x.matches('.efy_fs')){ document.fullscreenElement ? document.exitFullscreen() : a.requestFullscreen()}
        else if (x.matches('.efy_code_trans')){ $body.classList.toggle('efy_code_trans_on')}
        else if (x.matches('.efy_copy')){
            let c = a.textContent.replace($$(a, '.efy_bar').textContent, ''); navigator.clipboard.writeText(c);
            if (efy.notify_clipboard != false){ $notify('short', 'Copied to clipboard', c)}
        }
    });
});

/*EFY Range Text*/ $ready('[efy_range_text]', (a)=>{
    const c = $$(a, 'input[type=range]'),
    [name, lang] = [a.getAttribute('efy_range_text'), a.getAttribute('efy_lang')],
    p = $add('input', {
        class: 'efy_range_text_p', type: 'number', name: 'efy_name',
        value: c.value, step: c.step, min: c.min, max: c.max
    }, [], a, 'afterbegin');
    c.setAttribute('aria-hidden', ''); c.setAttribute('tabindex', '-1');

    if (!lang){ a.insertAdjacentText(
        $$(a, '[efy_icon]') ? 'beforeend' : 'afterbegin', `${name}:`
    )}

    $event(p, 'input', (x)=>{
        c.value = x.target.value; c.dispatchEvent(new Event('input', {'bubbles': true }));
    });
    $event(c, 'input', (x)=> p.value = x.target.value);
});

$all('form[class*=efy]').forEach(x =>{ $event(x,'reset', ()=>{
        $$all(x, '[efy_range_text]').forEach(y =>{
            $$(y, '.efy_range_text_p').value = $$(y, 'input').value
        })
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
    $event(z, 'input', ()=>{ let val = z.value.toLowerCase();
        $all(container +' '+ search).forEach(x =>{
            if ((x.textContent.toLowerCase().includes(val)) || (x.title.toLowerCase().includes(val))){ x.classList.remove('efy_hide_i')}
            else {x.classList.add('efy_hide_i')}
})})});

/*EFY Toggle*/ $ready('[efy_toggle]', (a)=>{
    let b = a.getAttribute('efy_toggle');
    $event(a, 'click', ()=>{ $all(b).forEach(c =>{
        c.classList.toggle('efy_hide_i');
        c.classList.contains('efy_hide_i') ? c.setAttribute('tabindex', '-1') : c.removeAttribute('tabindex');
})})});

/*Alerts*/ $add('div', {efy_alerts: '', class: 'efy_sidebar_width'}, [], $body, 'afterbegin');
$event($body, 'pointerup', ()=>{ let a = event.target;
    if (a.matches('[efy_alert]')){
        let b = a.classList[0], icon_fn =()=>{
            let active = $all('.efy_quick_notify_content [efy_alert]').length > 0 ? '_active' : '';
            $('.efy_quick_notify i').setAttribute('efy_icon', 'notify' + active);
        };
        a.classList.add('efy_anim_remove');
        $wait($css_prop('---anim_speed') * 0.05, ()=>{
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
    /*No Notifications*/ $add('style', `.efy_quick_notify_content:empty:before {content: '${efy_lang.no_notifications}'}`, $head);

    /*Online Status*/ ['offline', 'online'].map((a,i)=>{ $event(window, a, ()=>{ if (efy.notify_offline !== false){
        const lang = ['', $('[efy_lang]')], n = `--${a}_notify`; $notify('short', $css_prop(n, ...lang), $css_prop(`${n}_text`, ...lang))
    }})});

}

// ASSET Navigation (Arrows, Space, Shift, Enter, Tab)

$event(document, 'keydown', ()=>{
    const x = event.target, key = event.key,
    up_left = key === 'ArrowUp' || key === 'ArrowLeft';
    if ((x.matches('input:is([type=radio], [type=checkbox]):not(.efy_asset_off input)'))
    && (up_left || key === 'ArrowDown' || key === 'ArrowRight')){
        event.preventDefault();
        const inputs = Array.from($all(`[name="${x.name}"]`));
        let i = inputs.indexOf(x) + (up_left ? -1 : 1);
        if (i < 0) i = inputs.length - 1;
        else if (i >= inputs.length) i = 0;
        inputs[i].focus();
    }

    if ((x.matches('.efy_asset_off input'))
        && (up_left || key === 'ArrowDown' || key === 'ArrowRight')){
        const inputs = Array.from($all(`[name="${x.name}"]`));
        let i = inputs.indexOf(x) + (up_left ? -1 : 1);
        if (i < 0) i = inputs.length - 1;
        else if (i >= inputs.length) i = 0;

        if (inputs[i].matches('.efy_asset')){
            console.log('test');
            event.preventDefault();
            inputs[i].focus();
        }
        else {
            event.preventDefault();
            inputs[i].focus();
        }
    }
}, false);

$event(document, 'keyup', ()=>{
  const x = event.target, key = event.key;
  if ((key === ' ' || key === 'Enter') && (x.matches('input[efy_tab]') || x.matches('button'))){
    event.preventDefault();
    x.dispatchEvent(new Event('click', {'bubbles': true})); x.focus();
  }
}, false);

}