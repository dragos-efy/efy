let efy_version = '26.06.14 Beta', $ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document),
$head, $body, $root, $efy_module, efy = {}, efy_lang = {}, efy_audio = {volume: 1}, $save =()=>{}, open_idb, efy_css = {},
/*Add: Selector, optional: {Attributes}, [Text, Children], Parent, Position*/
$add =(tag, attrs = {}, children = [], parent = document.body, position = 'beforeend')=>{ const p2 = parent;
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
$css_prop =(prop, value, position = $root)=>{
    if (value){ position.style.setProperty(prop, value)}
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
$audio_play = async (a,b)=>{ try { if (document.hasFocus()){
    a.pause(); a.currentTime = 0; a.play();
    if (b == 'loop'){ $event(a, 'ended', ()=>{ a.pause(); a.currentTime = 0; a.play()}, false)}
}} catch (error) {/**/}},
/*Wait: Seconds, FN*/ $wait =(a,b)=> setTimeout(b,a*1000),
$$ =(a,b)=> a.querySelector(b), $$all =(a,b)=> a.querySelectorAll(b),

$notify =(seconds, title, info, lang, icon, callback, device_info)=>{ let selectors = [];
    const presets = {'short': 5, 'long': 30, 'infinite': 600},
    startTime = Date.now(), id = 'alert' + startTime, i = $('.efy_quick_notify i'),
    lang_true = (lang === 'lang');
    seconds = presets[seconds] !== undefined ? presets[seconds] : seconds; let current = seconds;
    const icon_fn =()=>{ let icon = ($all('.efy_quick_notify_content [efy_alert]').length > 0) ? 'notify_active' : 'notify'; i.setAttribute('efy_icon', icon)};
    const channel = efy.notify_channel || 'page', show_page = (channel !== 'device');

    if (lang_true) title = efy_lang[title];
    if ($efy_module('audio')) $audio_play(efy_audio.ok3)

    if ((channel !== 'page') && 'Notification' in window) {
        let final_info = device_info ? device_info : info;
        if (lang_true) final_info = efy_lang[final_info];
        const options = { body: final_info, icon: '/icon.png'};

        if (Notification.permission === 'granted'){ new Notification(title, options)}
        else if (Notification.permission !== 'denied'){
            Notification.requestPermission().then(p => {
                if (p === 'granted') new Notification(title, options);
        })}
    }
    if (show_page) {
        if (lang_true){ info = efy_lang[info]}
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

        efy_timer_interval = setInterval(()=>{ const element = $(`.${id} .time_left`);
            current = seconds - (Math.floor((Date.now() - startTime) / 1000));
            element ? element.textContent = current : clearInterval(efy_timer_interval);
        }, 1000);
    }

    if (callback) callback(selectors);

    $wait(seconds, ()=>{ if (show_page) clearInterval(efy_timer_interval);
        try {$(`[efy_alerts] .${id}`).remove()} catch {/**/}
        if (show_page) icon_fn()
    });
},

/*Convert seconds to hh:mm:ss*/ $sec_time =(a)=>{
    const h = Math.floor(a / 3600).toString().padStart(2,'0'), m = Math.floor(a % 3600 / 60).toString().padStart(2,'0'), s = Math.floor(a % 60).toString().padStart(2,'0'); return `${h}:${m}:${s}`
},

$fetch = async (file, data, fn) =>{
    const res = await fetch(file); return await res.json();
},

efy_scheme_update =(x = 'x')=>{
    const lightness = (x === 'x') ? efy.bg.split(' ')[0] : x,
    efy_scheme = (lightness > 0.5) ? 'light' : 'dark';
    $css_prop(`---scheme`, efy_scheme);
    $root.setAttribute('efy_scheme', efy_scheme);
};;

const load_efy = async (efy)=>{
    if (localStorage.efy && localStorage.efy !== '{}'){
        const data = JSON.parse(localStorage.efy);
        Object.assign(efy, data);
    }
    else {
        const config_url = '../global/efy_config.json';
        const data = await $fetch(config_url);
        Object.assign(efy, data);
    }
    return efy;
};

/*After Page Loads*/ window.onload = async ()=>{
    let a, b; $root = $(":root"), $head = document.head, $body = document.body,
    efy_themes_loaded = false;

load_efy(efy).then(efy => {

$save =()=> localStorage.efy = JSON.stringify(efy);
$efy_module =(a)=>{ return efy.modules.includes(a)};

/* efy defaults if undefined */ Object.entries({
  text: '1 0 0', bg: '0.1 0.05 90', border_color: '1 0 0 / 0.11',
  card: '1 0 0 / 0.07', accent_text: '0.1 0.05 90', accent_text_x: '0.1 0.05 90'
}).forEach(([key, value]) =>{
   if (!efy[key]) efy[key] = value;
   const css_name = (key === 'border_color') ? 'border-color' : key;
    $css_prop(`---${css_name}`, `oklch(${efy[key]})`);
});

efy.lang_code ??= 'en';
efy.folder ??= './efy';
efy.lang_folder ??= './lang';
efy.audio_folder ??= './efy/audio';
efy.modules ??= ["quick", "filters", "backup", "accessibility", "languages", "mood_effects"];
efy.mode ??= 'solid';
efy.font_family ??= 'nunito, sans-serif, emoji',
efy.accent ??= [".7 .15 70 1"];
efy.accentx ??= [".67 .37 134 1"];
efy_scheme_update();

const efy_lang_start =()=>{
    const processed = new WeakSet(),
    observer = new MutationObserver(mutations =>{
        for (let mutation of mutations){ if (mutation.type === 'childList'){
            $$all(mutation.target, '[efy_lang]').forEach(element =>{
                if (!processed.has(element)){
                    const name = element.getAttribute('efy_lang'), value = efy_lang[name];
                    element.insertAdjacentText(
                        $$(element, '[efy_icon]') ? 'beforeend' : 'afterbegin',
                        element.hasAttribute('efy_range_text') ? `${value}:` : value
                    );
                    processed.add(element);
                }
            });
            mutation.removedNodes.forEach(node =>{
                if (node.nodeType === 1) processed.delete(node);
            });
        }}
    }); observer.observe(document.body, { childList: true, subtree: true });

    /*No Notifications*/ $wait(1, ()=>{
        $add('style', `.efy_quick_notify_content:empty:before {content: '${efy_lang.no_notifications}'}`, $head);
    });

    /*Online Status*/ ['offline', 'online'].map((a,i)=>{ $event(window, a, ()=>{ if (efy.notify_offline !== false){
        const n = `${a}_notify`;
        $notify('short', efy_lang[n], efy_lang[`${n}_text`]);
    }})});
};

try {[`${efy.folder}/lang`, `${efy.lang_folder}`].map((url,i)=>{
    url += `/${efy.lang_code}.json`;
    $fetch(url).then(data =>{
        Object.keys(data).forEach(key => efy_lang[key] = data[key]);
        if (i === 1) efy_lang_start();
})})} catch { $notify('short', 'Error', "Can't Load Translations")}


/*Sidebar Modules*/ $add('div', {id: 'efy_sidebar', class: 'efy_sidebar'}, [
    ['div', {efy_about: ''}, [
        ['button', {class: 'efy_about efy_shadow_accent_off efy_shadow_card', efy_toggle: '.efy_about_div', efy_logo: ''}, [ ['p', 'EFY'], ['p', ' UI'] ]],
        ['div', {class: 'efy_flex efy_sidebar_top_buttons'}, [
            ['button', {class: 'efy_quick_notify efy_square_btn', efy_toggle: '.efy_quick_notify_content', title: 'Notifications'}, [['i', {efy_icon: 'notify'}]]],
            ['button', {class: 'efy_quick_search efy_square_btn', efy_toggle: '#efy_sidebar [efy_search]', title: 'Search'}, [['i', {efy_icon: 'search'}]]]
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
    ['details', {id: 'efy_sbtheme', efy_select: '', name: 'efy_sidebar_modules'}, [
        ['summary', {efy_lang: 'themes'}, [['i', {efy_icon: 'star'}]]],
        ['div', {efy_tabs: 'efy_theme'}, [['div', {class: 'efy_tabs'}]]]
    ]],
    ['details', {id: 'efy_modules_menu', efy_select: '', name: 'efy_sidebar_modules'}, [
        ['summary', {efy_lang: 'modules'}, [['i', {efy_icon: 'group'}]]],
        ['div', {id: 'efy_modules_menu_div'}, [
            ['div', {class: 'efy_flex'}, [
                ['p', {efy_lang: 'modules_info'}],
                ['button', {efy_lang: 'reset', onClick: 'delete efy.modules; $save(); location.reload();'}, [['i', {efy_icon: 'reload'}]]]
            ]],
            ['div', {class: 'efy_modules_menu_reload efy_hide_i', efy_card: ''}, [
                ['p','Refresh the page to see the changes'],
                ['button', {efy_lang: 'reload', onClick: 'location.reload();'}, [['i', {efy_icon: 'reload'}]]]
            ]]
        ]]
    ]]
]);
$add('div', {class: 'efy_sidebar_back'});
$add('video', {class: 'efy_3d_bg', autoplay: '', loop: '', muted: '', playsinline: ''});

['accessibility', 'virtual_keyboard', 'audio', 'backup', 'click_effects', 'corner_shape', 'lights', 'filters', 'health', 'page_corners', 'svg_filters', 'gamepads', 'languages', 'mood_effects', 'quick', 'wallpaper'].map(x => {
    const name = 'efy_module_toggles', id = `${name}_${x}`;
    // hide = (x === 'virtual_keyboard' || x === 'svg_filters') ? {disabled: ''} : null;
    $add('input', {id: id, type: 'checkbox', name: 'efy_module_toggles', /*...hide*/}, [], $('#efy_modules_menu_div'));
    $add('label', {for: id, class: 'efy-module-label', /*...hide*/}, [
        ['div', {class: 'efy-text'}, [
            ['h6', {efy_lang: x}],
            ['p', {efy_lang: `${x}_info`}]
        ]],
        ['i', {efy_icon: 'remove'}]
    ], $('#efy_modules_menu_div'));
});

efy.modules.map(x =>{
    $(`#efy_module_toggles_${x}`).checked = true;
    $(`[for="efy_module_toggles_${x}"] i`).setAttribute('efy_icon', 'check');
});

$event($body, 'change', ()=>{ const x = event.target;
    if (x.matches('#efy_modules_menu_div input')){
        efy.modules = Array.from($all('#efy_modules_menu_div input:checked'))
            .map(y => y.id.replace('efy_module_toggles_', ''));
        $save();
        $(`[for="${x.id}"] i`).setAttribute('efy_icon', x.checked ? 'check' : 'remove');
        $('.efy_modules_menu_reload').classList.remove('efy_hide_i');
    }
});

// Quick Module
let about = $('[efy_about]');
$add('input', {
    type: 'text', class: 'efy_hide_i', tabindex: '-1',
    placeholder: 'Search through menu...', name: 'efy_name',
    efy_search: 'details:not(.efy_quick_shortcuts, [efy_logo]), .efy_sidebar [efy_tabs] > *'
}, [], about, 'afterend');
$add('div', {class: 'efy_quick_notify_content efy_hide_i', efy_card: ''}, [], about, 'afterend');

/*Theme*/

/*Tabs*/ ['saved', 'colors', 'size', 'layout'].map(a =>{
    const id = `efy_theme_${a}`, parent = [[], $('[efy_tabs=efy_theme] .efy_tabs')];
    const tab = $add('input', {efy_tab: a, type: 'radio', id: id, name: 'efy_theme_tabs'}, ...parent),
    content = $add('div', {efy_content: a, efy_select: '', id: `efy_${a}`}, [], $('[efy_tabs=efy_theme]'));
    $add('label', {efy_lang: a, for: id}, ...parent);
    if (a == 'saved'){ tab.setAttribute('efy_active', ''); content.setAttribute('efy_active', '')}
});

/*Colors*/ b = $('#efy_sbtheme [efy_content=colors]');

$add('input', {type: 'checkbox', id: 'accent_duo_toggle', name: 'accent_duo_toggle', efy_toggle: '.efy_accentx_show'}, null, $('#efy_colors'));

if (!efy.accentx) efy.accentx = [];
if (!efy.accentx_angle) efy.accentx_angle = '0deg';

if (efy.accent_duo){
    $root.classList.add('efy_accent_duo');
    $('#accent_duo_toggle').checked = true;
    $all('.efy_accentx_show').forEach(x => x.classList.add('efy_hide_i'));
}

['accent', 'accentx'].map(accent =>{
    let colors = efy[accent], colors_dom = [],
    hide = (accent === 'accentx' && !efy.accent_duo) ? ' efy_hide_i' : '';
    colors.map((a,i)=> colors_dom[i] = `${i+1} ${a}`);

    if (accent === 'accent'){
        $add('div', {class: `efy_hr_div efy_${accent}_show${hide}`}, [ ['details', {efy_help: `${accent}_gradient`}, [
            ['summary', [
                ['p', {efy_lang: `${accent}_gradient`}],
                ['label', {for: `accent_duo_toggle`, efy_lang: `duo`}], ['hr']
            ]],
            ['div', {efy_lang: `${accent}_gradient_info`}]
        ]]], b);
    }
    else {
        $add('div', {class: `efy_hr_div efy_${accent}_show${hide}`}, [
            ['p', {efy_lang: `${accent}_gradient`}], ['hr']
        ], b);
    }

    let container = $add('div', {
        id: 'efy_gradient', efy_tabs: 'container', class: `efy_${accent}_show${hide}`,
        efy_color: `${String(colors_dom)}, range:1-20`
    }, [], b);
    $add('div', {efy_lang: 'angle', efy_range_text: 'Angle', class: `efy_${accent}_show${hide}`}, [
        ['input', {class: `efy_${accent}_angle_input`, type: 'range', min: '0', max: '360', value: '165', step: '1'}]
    ], b);

    const update_color =(angle)=>{
        let [alpha, gradient, gradient_x, gradients, colors, colors_dom] = [[],[],[],[],[],[]],
        longer_hue = efy[`${accent}_longer_hue`] ? ' in oklch longer hue' : '';
        const contents = $$all(container, '[efy_content]');

        contents.forEach((form, i)=>{ alpha.push($$(form, `.alpha`).value);
            const ok = `${$$(form, '.lightness').value} ${$$(form, '.chroma').value} ${$$(form, '.hue').value}`;
            colors.push(`${ok} ${alpha[i]}`);
            colors_dom.push(`${i+1} ${ok} ${alpha[i]}`);
            gradient.push(`oklch(${ok} / ${alpha[i]})`);
            gradient_x.push(`oklch(${ok} / ${ (alpha[i] / 3).toFixed(2) })`);
        });

        gradients = (contents.length > 1) ? [gradient, gradient_x] : [`${gradient}, ${gradient}`, `${gradient_x}, ${gradient_x}`];
        efy[accent] = colors; $save();

        if (efy.accent_duo){
            const name = (accent === 'accent') ? '' : '-x';
            $css_prop(`---accent${name}`, `linear-gradient(var(---${accent}_angle)${longer_hue}, ${gradients[0]})`)
        }
        else if (accent === 'accent'){
            ['', '-x'].map((a,i)=> $css_prop(`---accent${a}`, `linear-gradient(var(---accent_angle)${longer_hue}, ${gradients[i]})` ));
        }
    };

    /*Restore Gradient*/ if (efy[accent]){
        let gradient = [[],[]],
        longer_hue = efy[`${accent}_longer_hue`] ? ' in oklch longer hue' : '';
        efy[accent].forEach(a=>{ a = a.split(' '); for (let i = 0; i < 2; i++){
            gradient[i].push(`oklch(${a[0]} ${a[1]} ${a[2]} / ${i === 0 ? a[3] : (a[3] / 3).toFixed(2)})`);
            if (efy[accent].length < 2) gradient[i].push(...gradient[i]);
        }});

        if (efy.accent_duo){
            const name = (accent === 'accent') ? '' : '-x';
            $css_prop(`---accent${name}`, `linear-gradient(var(---${accent}_angle)${longer_hue}, ${gradient[0]})`)
        }
        else if (accent === 'accent'){
            ['', '-x'].map((a,i)=> $css_prop(`---accent${a}`, `linear-gradient(var(---accent_angle)${longer_hue}, ${gradient[i]})` ));
        }
    } else { $ready('#efy_gradient .alpha', update_color, 1)}

    $event($(`.efy_${accent}_angle_input`), 'input', ()=> update_color());
    $event(container, 'input', ()=> update_color());
    $event(container, 'click', (e)=>{ const x = e.target;
        if (x.matches('.color_add') || x.matches('.color_remove')) update_color();
    });
});

$event($(`#accent_duo_toggle`), 'click', ()=>{
    const x = event.target;
    $root.classList.toggle('efy_accent_duo', x.checked);
    efy.accent_duo = x.checked;
    ['', 'x'].forEach(x =>{
        $(`.efy_accent${x}_angle_input`).dispatchEvent(new Event('input', { 'bubbles': true }))
    });
    $save();
});

// Custom Colors

$add('div', {class: 'efy_hr_div'}, [ ['p', {efy_lang: 'custom_colors'}], ['hr']], b);

$add('div', {class: 'efy_custom_colors', efy_color: `Text ${efy.text} 1 efy_color_text, Background ${efy.bg} 1 efy_color_bg, Border ${efy.border_color.replace(' / ', ' ')} efy_color_border_color, Card ${efy.card.replace(' / ', ' ')} efy_color_card, lang:accent_text ${efy.accent_text} 1 efy_color_accent_text, lang:accent_text2 ${efy.accent_text_x} 1 efy_color_accent_text_x`}, [], b);

$ready(`[for=efy_color_accent_text_x]`, ()=>{
    const nr = ['5', '6']; ['accent_text', 'accent_text_x'].map((x,i) =>{
        const id = `efy_${x}_status`,
        begin = [[], $(`.efy_custom_colors [efy_content="${nr[i]}"]`), 'afterbegin'];

        $add('label', {for: id, efy_lang: 'active'}, ...begin);
        $add('input', {id: id, type: 'checkbox'}, ...begin);
        if (efy[x] !== undefined) $css_prop(`---${x.replaceAll('_', '-')}`, `oklch(${efy[x]})`);

        /*Status Toggle*/
        const selector = $('#' + id), y = x + '_status';
        if (efy[y]){
            selector.setAttribute('checked', '');
            $root.setAttribute(`efy_color_${x}`, '');
        }
        $event(selector, 'click', ()=>{
            efy[y] ? delete efy[y] : efy[y] = true; $save();
            $root.toggleAttribute(`efy_color_${x}`);
        });
    });

    /*Keyboard Accessibility*/
    $event($('.efy_custom_colors .efy_tabs'), 'keydown', (event)=>{
        const inputs = Array.from($all('.efy_custom_colors .efy_tabs .efy_tab input')), index = inputs.indexOf(document.activeElement);

        if (event.key === 'Tab'){ event.shiftKey ? inputs[0].focus() : index !== inputs.length - 1 ? inputs[inputs.length - 1].focus() : null}
        if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) { event.preventDefault();
            const index2 = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + inputs.length) % inputs.length; inputs[index2].focus();
        }
    });

    const add_quick =(nr, tab, colors)=>{
        const card = $(`.efy_custom_colors [efy_content="${nr}"]`);
        const items = [];
        colors.forEach((color, i) => {
            const name = 'efy_colors_quick_' + tab;
            const id = `${name}_${i}`;
            items.push(['input', { type: 'radio', id, name, efy_oklch: color.replace(' / ', ' ') }]);
            items.push(['label', { for: id, style: `background: oklch(${color})` }]);
        });
        $add('div', { class: 'quick_colors' }, [
            ['p', { class: 'title' }, 'Quick Colors'],
            ['div', { id: 'quick_colors' }, items]
        ], card, 'afterbegin');
    };

    add_quick('1', 'text', [
        '1 0 0 / 1', '0.94 0.03 89 / 1', '1 0.1 85 / 1', '0.85 0.02 265',
        '1 0.37 170 / 1', '1 0.37 0 / 1', '0.41 0.04 59 / 1', '0 0 0 / 1'
    ]);
    add_quick('2', 'bg', [
        '1 0 0 / 1', '0.94 0.03 89 / 1', '0.9 0.1 0 / 1', '0.25 0 0 / 1',
        '0.28 0.02 265 / 1', '0.2 0.15 120 / 1', '0.1 0.05 90 / 1', '0 0 0 / 1'
    ]);
    add_quick('3', 'border_color', ['1 0 0 / 0.11', '0 0 0 / 0.11', '1 0 0 / 1', '0 0 0 / 1',]);
    add_quick('4', 'card', ['1 0 0 / 0.07', '0 0 0 / 0.07']);

    $event(document, 'click', ()=>{
        const target = event.target, content = target.closest('[efy_content]');
        if (target.matches('.quick_colors input')){
            const lch = target.getAttribute('efy_oklch').split(' ');
            ['lightness', 'chroma', 'hue', 'alpha'].map((x,i)=>{
            const selector = $$(content, `.${x}`);
            selector.value = lch[i];
            selector.dispatchEvent(new Event('input', { 'bubbles': true }));
            });
        }
    });

},1);

/*Shadows*/ const efy_shadows = $add('div', {class: 'efy_shadows'}, [], b); let efy_shadow = [];

/*Set*/ ['accent', 'accent_x', 'card'].map(type =>{ const key = `shadow_${type}`,
    shadows = `.efy_shadows .efy_shadows_${type}`; let b = [], colors = [];

    if (efy[key]){ efy_shadow.push(type);
        efy[key].map((a,i)=> colors.push(`${i+1} ${a.lightness} ${a.chroma} ${a.hue} ${a.alpha}`))
    }

    $add('div', {class: 'efy_hr_div'}, [['p', {efy_lang: `shadows_${type}`}], ['hr']], efy_shadows);
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

        let final_name = names[i] || nr, lang = null;
        if (names[i].includes('lang:')){
            lang = {efy_lang: names[i].replace('lang:', '')}
            final_name = null;
        }

        $add('input', {id: id, efy_tab: j, type: 'radio', name: now}, [], add, 'beforebegin');
        $add('label', {for: id, style: `background: ${color}`, ...lang}, final_name, add, 'beforebegin');

        /*Add Shadows*/ ['accent', 'accent_x', 'card'].map(type =>{ if (a.classList.contains(`efy_shadows_${type}`)){
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
            else { ['accent', 'accent_x' , 'card'].map(type =>{ if (a.classList.contains(`efy_shadows_${type}`)){
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
        alpha = $$(active, '.alpha').value,
        style = [`.5 0 0), oklch(${l} ${c} ${h}))`, `0 0 0), oklch(.5 ${c} ${h}), oklch(1 0 0))`, `0 0 0 / 0), oklch(${l} ${c} ${h}))`];
        let ok = `${l} ${c} ${h}`;

        /*Update Design*/ ['.chroma', '.lightness', '.alpha'].map((x,i)=>{
            $$(active, x).style.background = 'linear-gradient(to right, oklch(' + style[i]
        }); current_tab.style.background = `oklch(${ok} / ${alpha})`;

        [lightnesses[current-1], chromas[current-1], hues[current-1], alphas[current-1]] = [l, c, h, alpha];

        ['text', 'bg', 'border_color', 'card', 'accent_text', 'accent_text_x'].map(x =>{
            if (current_tab.getAttribute('for') == `efy_color_${x}`){
                if (x === 'border_color' || x === 'card') ok = `${ok} / ${alpha}`;

                const css_name = (x === 'border_color') ? 'border-color' : x;

                if (x === 'accent_text' || x === 'accent_text_x'){ $css_prop(`---${x.replaceAll('_', '-')}`, `oklch(${ok})`)}
                else { $css_prop(`---${css_name}`, `oklch(${ok})`)}

                if (x === 'bg') efy_scheme_update(l);

                efy[x] = ok; $save()
        }});
    });

});


(()=>{ const content = $('#efy_sbtheme [efy_content=colors]');
    content.classList.add('efy_shadow_card_off');
    $add('div', {class: 'efy_mode_div'}, [], $('.efy_custom_colors'), 'afterend');
})();

$add('div', {class: 'efy_hr_div'}, [
    ['details', {efy_help: 'page_background'}, [
        ['summary', [['p', {efy_lang: 'page_background'}], ['hr']]],
        ['div', {efy_lang: 'page_background_info'}]
    ]]
], $('#efy_sbtheme [efy_content=colors] .efy_mode_div'), 'beforebegin');

'solid trans window'.split(' ').map(x =>{
    const id = `efy_mode_${x}`, content = [[], $('#efy_sbtheme .efy_mode_div')];
    let lang = 'window';
    if (x === 'solid'){ lang = 'color'} else if (x === 'trans'){ lang = 'files'}
    $add('input', {type: 'radio', name: 'efy_mode_type', id}, ...content);
    $add('label', {for: id, efy_lang: lang}, ...content);
});

/*Images*/ $add('div', {id: 'efy_images_bg'}, [
    ['div', {class: 'efy_hr_div'}, [ ['details', {efy_help: 'images'}, [
        ['summary', [['p', {efy_lang: 'files'}], ['hr']]], ['div', {efy_lang: 'sidebar_images_warning_help'}]
    ]]]],
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: 'idb_addimg_bg', type: 'file', accept: 'image/*, video/*', style: 'display: none', multiple: ''}],
        ['label', {for: 'idb_addimg_bg', title: 'Add file', class: 'efy_accent', type:'button', role: 'button'}, [['i', {efy_icon: 'plus'}]]],
        ['input', {id: 'idb_remove_toggle', type: 'checkbox', style: 'display: none'}],
        ['label', {for: 'idb_remove_toggle', title: 'Remove', class: 'efy_accent', type:'button', role: 'button'}, [['i', {efy_icon: 'remove'}]]],
        ['button', {class: 'efy_images_reset efy_hide_i', title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
    ]]
], $('#efy_sbtheme [efy_content=colors] .efy_mode_div'), 'afterend');

const saved_themes = $('#efy_sbtheme [efy_content=saved]');
saved_themes.id = 'efy_themes';
saved_themes.classList.add('efy_shadow_card_off');

[
    ['div', {class: 'themes_actions efy_shadow_card'}, [
        ['div', {class: 'actions', efy_select: ''}, [
            ['input', {type: 'checkbox', id: 'efy_theme_add', name: 'efy_theme_add', class: 'add'}],
            ['label', {for: 'efy_theme_add', class: 'add', efy_lang: 'save'}, [['i', {efy_icon: 'plus'}]]],
            ['input', {type: 'text', class: 'name efy_square_btn efy_hide_i', placeholder: 'Theme Name...', name: 'efy_themes_name'}],
            // Temporary - I'll show them in the next update
            // ['input', {type: 'checkbox', id: 'efy_theme_import', name: 'efy_theme_import', class: 'import'}],
            // ['label', {for: 'efy_theme_import', class: 'import', efy_lang: 'import'}, [['i', {efy_icon: 'arrow_up'}]]],
            // ['input', {type: 'checkbox', id: 'efy_theme_copy', name: 'efy_theme_copy', class: 'copy'}],
            // ['label', {for: 'efy_theme_copy', class: 'copy', efy_lang: 'copy'}, [['i', {efy_icon: 'copy'}]]],
            // ['input', {type: 'checkbox', id: 'efy_theme_paste', name: 'efy_theme_paste', class: 'paste'}],
            // ['label', {for: 'efy_theme_paste', class: 'paste', efy_lang: 'paste'}, [['i', {efy_icon: 'paste'}]]],
            ['button', {class: 'reset', efy_lang: 'reset'}, [['i', {efy_icon: 'reload'}]]]
        ]],
        ['p', {}, [
            'Find & Share more themes at ',
            ['a', {href: 'https://efy.ooo#themes'}, 'efy.ooo#themes']
        ]]
    ]],
    ['div', {class: 'themes'}, []]
].forEach(x =>{ let test = $add(...x, saved_themes) });


/*IndexedDB*/ let themes_load_nr = 0, efy_idb = '', idb_themes = '';

open_idb =(name = 'efy')=>{
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open(name);
        request.onerror = e => reject("efy: Can't open db");
        request.onsuccess = e =>{
            efy_idb = request.result; resolve(efy_idb);
            if (themes_load_nr === 0) load_themes(efy_idb); themes_load_nr++;
        }
        request.onupgradeneeded = e =>{ const db = e.target.result;
            'bg settings themes front back button card'.split(' ').map(a =>{
                const objectStore = db.createObjectStore(a, { keyPath: "id", autoIncrement: true }).createIndex("nr", "nr", { unique: true });
        })}
})};


const load_themes =(db)=>{
    const transaction = db.transaction(['themes'], 'readonly');
    transaction.objectStore('themes').getAll().onsuccess =(event)=>{
        idb_themes = event.target.result;
        idb_themes.forEach(a => theme_ui(a));
    };
},

theme_ui =(theme)=>{
    let actions = ['div', {class: 'actions'}, [
        ['button', {class: 'efy_square_btn download', title: 'Download'}, [['i', {efy_icon: 'arrow_down'}]]],
        ['button', {class: 'efy_square_btn copy', title: 'Copy'}, [['i', {efy_icon: 'copy'}]]],
        ['button', {class: 'efy_square_btn remove', title: 'Remove'}, [['i', {efy_icon: 'remove'}]]]
    ]];
    if (theme.name === 'default') actions = null;
    const edit = $('#efy_theme_edit'),
    card = $add('div', {
        efy_theme: theme.name, 'data-id': theme.id, spellcheck: false,
        class: 'efy_card_filter efy-glass efy_shadow_card', efy_searchable: theme.name
    }, [
        ['div',  {efy_preview: '', style: `background-image: url('${theme.image}')`}],
        ['input', {type: 'text', class: 'title efy_shadow_card_off', value: theme.name}], actions
    ], $$(saved_themes, '.themes'));

    $event(card, 'click', ()=>{ const x = event.target;
        if (x.matches('[efy_preview]')){
            localStorage.efy = theme.info; location.reload();
        }
        else if (x.matches('.remove')){
            theme_actions('remove', Number(card.getAttribute('data-id'))); card.remove();
        }
        else if (x.matches('.copy')){
            const result = theme.info;
            navigator.clipboard.writeText(result);
            if (efy.notify_clipboard != false){
                $notify('short', 'Copied to clipboard', result, null, 'heart');
            }
        }
        else if (x.matches('.download')){
            const blob = new Blob([theme.info], { type: 'application/json' });
            const link = $add('a', {href: URL.createObjectURL(blob), download: 'efy_theme_' + theme.name.replaceAll(' ', '_')});
            link.click(); link.remove(); URL.revokeObjectURL(link.href);
        }
    });
    /*Rename*/ $event($$(card, '.title'), 'input', (x)=>{ const btn = x.target;
        theme_actions('edit', Number(card.getAttribute('data-id')), btn.value);
    });
},

theme_actions =(type, name, val)=>{
    const transaction = efy_idb.transaction(['themes'], 'readwrite'),
    store = transaction.objectStore('themes');

    if (type === 'remove'){ store.delete(name)}
    else if (type === 'edit'){
        store.get(name).onsuccess =(event)=>{
            const theme = event.target.result;
            theme.name = val; store.put(theme);
        }
    }
    else if (type === 'reset'){
        $$all(saved_themes, '.themes [data-id]').forEach(a => a.remove());
        const url = `${efy.folder}/themes/${name}.json`,
        image = `${efy.folder}/themes/images/${name}.avif`;
        $fetch(url).then(data =>{
            const transaction = efy_idb.transaction(['themes'], 'readwrite'),
            store = transaction.objectStore('themes'),
            options = JSON.stringify(data.options),
            request = store.add({ name: name, info: options, image: image });
            if (val) {
                request.onsuccess = (event) =>{
                    load_themes(efy_idb);
                    $notify('short', 'Themes Got Reset', null, null, 'heart');
                }
            }
        }).catch(() => { console.log(url); $notify('short', 'Error', "Can't fetch") });
    }
    else {
        $$all(saved_themes, '.themes [data-id]').forEach(a => a.remove());
        const info = localStorage.efy, request = store.add({name, info});
        request.onsuccess =(event)=> load_themes(efy_idb);
    }
};

let current_bg_src = '';

$event($('#efy_themes .add'), 'click', (x)=>{
    const name = $('#efy_themes .name'), value = name.value;
    name.classList.toggle('efy_hide_i');
    if (value){ theme_actions('add', value); name.value = ''}
    $notify('short', `Add Themes - ${x.target.checked ? 'ON' : 'OFF'}`);
});

$event($('#efy_themes .reset'), 'click', ()=>{
    const transaction = efy_idb.transaction(['themes'], 'readwrite'),
    store = transaction.objectStore('themes'); store.clear();
    const themes = [
        'default', 'blue_round_light', 'bw_contrast_light', 'bw_contrast_dark',
        'nord_trans', 'teal_blue_duo', 'burgundy_pastel', 'avocado_pastel'
    ];
    themes.map((name, i)=>{
        const time = '.' + i,
        val = i === themes.length - 1;
        $wait(time, ()=>{ theme_actions('reset', name, val) })
    });
});

/*Restore*/ if (efy.mode){ let mode = efy.mode;
    $ready('#efy_mode_' + mode, (x)=>{
        const selector = $('#efy_mode_' + mode);
        $root.setAttribute('efy_mode', mode); selector.checked = true;
        selector.dispatchEvent(new Event('click', {'bubbles': true }));
    }, 1);
}

$event(document.body, 'click', ()=>{
    const x = event.target;
    if (x.matches('.efy_mode_div > input')){
        const mode = x.id.replace('efy_mode_', '');
        $root.setAttribute('efy_mode', mode); efy.mode = mode; $save()
    }
    else if (x.matches('.efy_mode_div input, .efy_img_previews [efy_bg_nr]')){
        $('.efy_3d_bg').src = ($('#efy_mode_trans').checked) ? current_bg_src : '';
    }
});

/*Radius & Gap*/ a = $('#efy_sbtheme [efy_content=size]');
$add('div', {id: 'efy_radius_container'}, [
    ['input', {id: 'efy_radius_type', type: 'checkbox'}],
    ['label', {for: 'efy_radius_type'}, [
        ['p', {efy_lang: 'roundness'}],
        ['p', {efy_lang: 'equal'}],
        ['i', {efy_icon: 'chevron'}]
    ]],
    ['div', {id: 'efy_radius_types'}, [
        ['input', {id: 'efy_radius_equal', type: 'radio', name: 'efy_radius_type', checked: true}],
        ['label', {for: 'efy_radius_equal', efy_lang: 'equal'}],
        ['input', {id: 'efy_radius_corners', type: 'radio', name: 'efy_radius_type'}],
        ['label', {for: 'efy_radius_corners', efy_lang: 'corners'}],
        ['input', {id: 'efy_radius_custom_css', type: 'radio', name: 'efy_radius_type'}],
        ['label', {for: 'efy_radius_custom_css', efy_lang: 'custom_css'}]
    ]],
    ['div', {efy_range_text: 'Radius'}, [['input', {
        id: 'efy_radius_all_input', class: 'efy_radius_input',
        type: 'range', min: '0', max: '25', value: '12', step: '1'
    }]]],
    ['div', {id: 'efy_radius_corners_container'}],
    ['input', {id: 'efy_radius_custom_css_input', type: 'text'}]
], a);

const ercc = $('#efy_radius_corners_container');

[1, 2, 4, 3].map(x =>{
    $add('div', {efy_range_text: ''}, [['input', {
        id: `efy_radius_${x}_input`, class: 'efy_radius_input',
        type: 'range', min: '0', max: '25', value: '12', step: '1'
    }]], ercc);
});

[1, 2, 3, 4].map(x =>{
    $add('div', {efy_corner: x}, [], ercc);
});

$add('div', {efy_lang: 'border', efy_range_text: 'Border'}, [['input', {class: 'efy_border_size_input', type: 'range', min: '0', max: '8', value: '1.5', step: '0.1'}]], a);
$add('div', {efy_lang: 'gap', efy_range_text: 'Gap alpha'}, [['input', {class: 'efy_gap_input', type: 'range', min: '0', max: '30', value: '15', step: '1'}]], a);
$add('div', {efy_lang: 'max_width', efy_range_text: 'Max Width alpha'}, [
    ['div', {class: 'efy_max_width_div'}, [
        ['input', {class: 'efy_maxwidth_input', type: 'range', min: '500', max: '5000', value: '1200', step: '1'}],
        ['select', {name: 'efy_name'}, [ ['option', {value: 'rem'}, 'REM'], ['option', {value: '%'}, '%'] ]]
]] ], a);

/*Radius*/ (()=>{
    let radius = efy.radius, equal_input = $(`#efy_radius_all_input`);
    const type_check = $('#efy_radius_type'), type_check_label = $('[for=efy_radius_type] p:last-of-type'),
    corners_check = '#efy_radius_corners',
    custom_check = '#efy_radius_custom_css', custom_input = $('#efy_radius_custom_css_input'),
    radius_math = (s, d) => String(s).split('/').map(p => p.trim().split(/\s+/).map(t => {const m = t.match(/[\d.]+/); return m ? parseFloat(m[0]) / d + t.slice(m[0].length) : t}).join(' ')).join(' / ');
    if (radius){
        let values = radius.replaceAll('rem', '').split(' '),
        array = [], array_o = [], array_x = [], array_xx = [], array_xxx = [];
        if (efy.radius_type === 'custom_css'){
            custom_input.value = efy.radius;
            $(custom_check).checked = true;
            $css_prop(`---radius-o`, radius_math(efy.radius, 0.75));
            $css_prop(`---radius-x`, radius_math(efy.radius, 1.25));
            $css_prop(`---radius-xx`, radius_math(efy.radius, 1.5));
            $css_prop(`---radius-xxx`, radius_math(efy.radius, 3));
        }
        else if (efy.radius_type === 'corners'){
            values.map((x,i)=>{
                $(`#efy_radius_${i + 1}_input`).value = x;
                array.push(x + 'rem'); array_o.push((x * 1.5) + 'rem');
                array_x.push((x / 1.25) + 'rem');
                array_xx.push((x / 1.5) + 'rem');
                array_xxx.push((x / 3) + 'rem');
            });
            $(corners_check).checked = true; radius = array.join(' ');
            let c_o = array_o.join(' '), c_x = array_x.join(' '),
            c_xx = array_xx.join(' '), c_xxx = array_xx.join(' ');
            $css_prop(`---radius-o`, c_o); $css_prop(`---radius-x`, c_x);
            $css_prop(`---radius-xx`, c_xx); $css_prop(`---radius-xxx`, c_xx);
        }
        else { equal_input.value = values}
        $css_prop(`---radius`, radius);
    }
    $event($body, 'input', ()=>{
        let array = [], array_o = [], array_x = [], array_xx = [], array_xxx = [];
        const x = event.target,
        corner_inputs = '.efy_radius_input:not(#efy_radius_all_input)',
        render_update =()=>{
            // const gap = $('.efy_gap_input'), fix = gap.value; gap.value = fix - 1;
            // gap.dispatchEvent(new Event('input', {'bubbles': true}));
            // $wait(.05, ()=>{ gap.value = fix;
            //     gap.dispatchEvent(new Event('input', {'bubbles': true}));
            // });
        };
        if (x.matches('#efy_radius_all_input')){
            let c = x.value + 'rem';
            $all(corner_inputs).forEach(y =>{
                y.value = x.value;
                y.dispatchEvent(new Event('input', {'bubbles': true }));
            });
            $css_prop(`---radius`, c); efy.radius = c; $save(); render_update();
        }
        if (x.matches('#efy_radius_custom_css_input')){
            let c = x.value;
            $css_prop(`---radius-o`, radius_math(c, 0.75));
            $css_prop(`---radius-x`, radius_math(c, 1.25));
            $css_prop(`---radius-xx`, radius_math(c, 1.5));
            $css_prop(`---radius-xxx`, radius_math(c, 3));
            $css_prop(`---radius`, c); efy.radius = c; $save(); render_update();
        }
        else if (x.matches(corner_inputs)){
            $all(corner_inputs).forEach(y =>{
                array.push(y.value + 'rem');
                array_o.push((y.value * 1.5) + 'rem');
                array_x.push((y.value / 1.25) + 'rem');
                array_xx.push((y.value / 1.5) + 'rem');
                array_xxx.push((y.value / 3) + 'rem');
            });
            let c = array.join(' '), c_o = array_o.join(' '), c_x = array_x.join(' '),
            c_xx = array_xx.join(' '), c_xxx = array_xxx.join(' ');
            $css_prop(`---radius`, c); efy.radius = c; $save(); render_update();
            $css_prop(`---radius-o`, c_o); $css_prop(`---radius-x`, c_x);
            $css_prop(`---radius-xx`, c_xx); $css_prop(`---radius-xxx`, c_xxx);
        }
        else if (x.matches(corners_check) && x.checked !== true) {
            $('#efy_radius_all_input').dispatchEvent(new Event('input', {'bubbles': true }));
            render_update();
        }
        else if (x.matches('#efy_radius_types input')){
            type_check.checked = false; type_check.focus();
            efy.radius_type = x.id.replace('efy_radius_', '');
            type_check_label.textContent = efy_lang[efy.radius_type];
        }
        // else if (x.matches(custom_check) && x.checked === true) {
            // $('#efy_radius_all_input').dispatchEvent(new Event('input', {'bubbles': true }));
            // render_update();
        // }
    });
})();

/*Gap & Color Angle*/ let e = ['rem', 'rem', 'deg', 'deg'];
['border_size', 'gap', 'accent_angle', 'accentx_angle'].forEach((n, i)=>{
    let b = efy[n], d = $(`.efy_${n}_input`), css_var = `---${n}`;
    if (n === 'border_size') css_var = css_var.replaceAll('_', '-');
    if (b){ d.value = b.replace(e[i], ''); $css_prop(css_var, b)}
    $event(d, 'input', ()=>{
        let c = d.value + e[i];
        $css_prop(css_var, c); efy[n] = c; $save();
    })
});


/*Max Width*/ let input2 = $('.efy_maxwidth_input'), y, zz = '[efy_range_text*="Max Width"] select', z = $(zz), width = efy.max_width;
if (width){ y = width.replace('rem', '').replace('%', ''); input2.value = y; $css_prop('---body_width', width) } else {y = 1920}
input2.oninput =()=>{ let y = input2.value; z = $(zz).value; $css_prop('---body_width', y + z); efy.max_width = y + z; $save()}
z.oninput =()=>{ if (z.value == '%'){ input2.setAttribute('min', '10'); input2.setAttribute('max', '100'); input2.setAttribute('value', '100')} if (z.value == 'rem'){ input2.setAttribute('min', '500'); input2.setAttribute('max', '5000'); input2.setAttribute('value', '1920')}
 let y = input2.value; z = $(zz).value; $css_prop('---body_width', y + z); efy.max_width = y + z; $save()}

if (efy.font_family) $css_prop('---font_family', efy.font_family);


/*Layout*/ const layout = $('#efy_sbtheme [efy_content=layout]');
$add('div', {class: 'efy_hr_div'}, [['p', {efy_lang: 'sidebar_menu'}], ['hr']], layout);
$add('div', {id: 'efy_sidebar_align', efy_select: ''}, [
    ['div']
], layout);
$add('div', {efy_range_text: 'menu_width', efy_lang: 'max_width'}, [['input', {
    id: 'efy_sidebar_width_input', type: 'range',
    min: '400', max: '2000', value: '450', step: '1'
}]], layout);
$add('div', {class: 'efy_hr_div'}, [['p', {efy_lang: 'notification_position'}], ['hr']], layout);

/*EFY Sidebar*/ ['left', 'right'].map(a =>{ const id = `efy_sidebar_align_${a}`, parent = $('#efy_sidebar_align > div');
    $add('input', {type: 'radio', name: 'efy_sidebar_align', id: id}, [], parent);
    $add('label', {for: id}, [
        ['div'], ['p', {efy_lang: a}, [['i', {efy_icon: 'check'}]]]
    ], parent)
});

/*Align Sidebar*/ let align = efy.sidebar_align || 'right';
if (efy.sidebar_align) $root.setAttribute('efy_sidebar', align);
$(`#efy_sidebar_align_${align}`).setAttribute('checked', '');

$all("[name=efy_sidebar_align]").forEach(x =>{ const y = x.id.replace('efy_sidebar_align_', '');
    $event(x, 'click', ()=>{ const z = $root.getAttribute('efy_sidebar').includes('on') ? 'on_' : '';
        $root.setAttribute('efy_sidebar', z + y); efy.sidebar_align = y; $save();
})});

/*Notifications*/
$add('div', {}, [['div', {id: 'efy_notify_align', class: 'efy_p0'}]], layout);
$add('div', {class: 'efy_hr_div'}, [
    ['p', {efy_lang: 'active_notifications'}], ['hr']
], layout);
$add('div', {}, [['div', {id: 'efy_notify_status', class: 'efy_p0'}]], layout);
$add('div', {class: 'efy_hr_div'}, [
    ['p', {efy_lang: 'notification_channel'}], ['hr']
], layout);
$add('div', {}, [['div', {id: 'efy_notify_channel', class: 'efy_p0'}]], layout);

'Offline Clipboard Gamepads'.split(' ').map(a =>{
    let b = `notify_${a.toLowerCase()}`, c = $('#efy_notify_status');
    $add('input', {type: 'checkbox', name: 'efy_notify_status', id: a, checked: ''}, [], c);
    $add('label', {for: a}, a, c);
    let d = $$(c, `#${a}`); if (efy[b] == false){ d.removeAttribute('checked')}
    $event(d, 'change', ()=>{ efy[b] = d.checked; $save()})
});

'page device all'.split(' ').map(option =>{
    const container = $('#efy_notify_channel'), id = 'efy_notify_channel_' + option,
    checked = option === 'page' ? {checked: ''} : null;

    $add('input', {type: 'radio', name: 'efy_notify_channel', id: id, ...checked}, [], container);
    $add('label', {for: id, efy_lang: option}, [], container);

    let selector = $(`#${id}`);

    if (efy.notify_channel === option){ selector.checked = true}
    $event(selector, 'change', ()=>{
        if (option === 'page'){ delete efy.notify_channel}
        else { efy.notify_channel = option}
        $save()
    })
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
['bg', 'front', 'back', 'button'].map(a =>{ let b = `efy_css_${a}`;
    $add('style', {class: b}, [], $head); efy_css[a] = $('.' + b);
    $event($body, 'change', (x) =>{
        if (x.target.matches(`#idb_addimg_${a}`)) efy_add_bgimg(a, x)
    });
});


/*Load Modules*/ [
    'quick', ['filters', ['svg_filters']], 'audio', 'click_effects',
    ['accessibility', ['virtual_keyboard', 'css']],
    'languages', 'backup', 'gamepads', 'health', 'corner_shape', 'lights', 'page_corners', 'mood_effects', 'wallpaper'
].map(x =>{
    let [module, submodules] = Array.isArray(x) ? x : [x, false];
    if (efy.modules.includes(module)){
        $add('script', {src: `${efy.folder}/module_${module}.js`}, [], $head);
        if ([
                'gamepads', 'corner_shape', 'lights', 'page_corners', 'click_effects',
                'health', 'mood_effects', 'wallpaper', 'languages'
            ].includes(module)){
            $add('link', {href: `${efy.folder}/module_${module}.css`, rel: 'stylesheet'}, [], $head);
        }
    }
    if (submodules){ submodules.map(submodule =>{ if (efy.modules.includes(submodule)){
        if (submodules[submodules.length] === 'css'){
            $add('link', {href: `${efy.folder}/module_${submodule}.css`, rel: 'stylesheet'}, [], $head);
        }
        $add('script', {src: `${efy.folder}/module_${submodule}.js`}, [], $head);
    }})}
});

/*Sidebar Modules - End*/

/*Upload Input: id, accept, efy_lang or 'small', multiple, icon*/ $ready('[efy_upload]', (a)=>{
    let value = a.getAttribute('efy_upload'), accept_array = value.match(/\[(.*?)\]/), accept,
    b = value.replaceAll(' ','').split(','), c = (b[4] === undefined) ? b[4] : 'plus';
    if (accept_array){
        accept = accept_array[1]; b = value.replace(`[${accept}],`, ',').replaceAll(' ','').split(',');
    } else {accept = b[1]}
    if (b[2]){ if (b[2] !== 'small'){ a.setAttribute('efy_lang', b[2])}}
    else {a.setAttribute('efy_lang', 'add_file')}
    a.setAttribute('role', 'button');
    $add('input', {type: 'file', id: b[0], accept: accept}, [], a); $add('i', {efy_icon: c}, [], a);
    if (b[3] == 'multiple'){ $all(`#${b[0]}`).forEach(a=>{ a.setAttribute('multiple', '')})}
});

/*Add Images/Videos*/
let bg_sizes = [];
const bg_size_update =(type)=>{
    if (type === 'bg'){ $wait(1, ()=>{
        const sum = (bg_sizes.reduce((x, i) => x + parseFloat(i), 0) / 1048576).toFixed(2);
        $('#efy_images_bg summary p').textContent = `Files - ${sum} MB`;
    })}
};

const efy_add_bgimg = async (type, e) => {
    const db = await open_idb();
    if (!e.target.files?.length) return;

    Object.values(e.target.files).forEach(file => {
        const size = file.size, mb_size = (file.size / 1048576).toFixed(2) + ' MB';
        bg_sizes.push(size);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const src = reader.result;
            const nr = Date.now() + Math.random().toString(36).substring(2);
            const mediaType = src.includes('image') ? 'image' : 'video';
            let media = mediaType === 'image' ? new Image() : document.createElement('video');

            const processMedia = (thumbnail) => {
                const previews = `#efy_images_${type} .efy_img_previews`;
                $add('button', {
                    efy_bg_nr: nr,
                    style: `background: url(${thumbnail})`,
                    'data-type': mediaType
                }, [['p', {class: 'size'}, mb_size]], $(previews));

                const preview = $(`${previews} [efy_bg_nr="${nr}"]`);
                $event(preview, 'click', () => {
                    loadAndSetBackground(type, src, mediaType, nr, size);
                    efy[`nr_${type}`] = nr; $save();
                });

                db.transaction([type], "readwrite").objectStore(type).add({
                    nr: nr, type: mediaType, size: size,
                    image: src, thumbnail: thumbnail
                }).onsuccess = () => {
                    loadAndSetBackground(type, src, mediaType, nr, size);
                    efy[`nr_${type}`] = nr; $save();
                };
            };

            const generateThumbnail = () => {
                const canvas = document.createElement('canvas');
                canvas.width = mediaType === 'image' ? (media.width / media.height) * 80 : 80;
                canvas.height = 80;
                canvas.getContext('2d').drawImage(media, 0, 0, canvas.width, canvas.height);
                const thumbnail = canvas.toDataURL('image/webp');
                return thumbnail;
            };

            media.onload = media.onloadedmetadata = () => {
                if (mediaType === 'video') {
                    media.currentTime = 1;

                    media.onseeked = () => {
                        const thumbnail = generateThumbnail();
                        processMedia(thumbnail);
                    };

                } else {
                    const thumbnail = generateThumbnail();
                    processMedia(thumbnail);
                }
            };
            media.src = src;
        };
    });
    bg_size_update(type);
};

const count_images = async (type) => {
    const db = await open_idb('efy');
    const transaction = db.transaction([type], "readonly");
    const store = transaction.objectStore(type);
    const cursor_request = store.openCursor(null, 'next');

    cursor_request.onsuccess = (event) => {
        const cursor = event.target.result;
        const previews = `#efy_images_${type} .efy_img_previews`;

        if (cursor) {
            const { nr, type: mediaType, size, thumbnail, image } = cursor.value;
            const mb_size = (size / 1048576).toFixed(2) + ' MB';
            $add('button', {efy_bg_nr: nr, 'data-type': mediaType}, [
                ['p', {class: 'size'}, mb_size],
                ['div', {class: 'efy_preview', style: `background-image: url(${thumbnail})`}]
            ], $(previews));

            $event($(`${previews} [efy_bg_nr="${nr}"]`), 'click', () => {
                if (!$(previews).classList.contains('efy_remove')) {
                    loadAndSetBackground(type, image, mediaType, nr, size);
                    efy[`nr_${type}`] = nr; $save();
                }
            });

            bg_sizes.push(size);
            cursor.continue();
        } else {
            const nr = efy[`nr_${type}`] || null;
            if (nr) {
                store.index('nr').get(nr).onsuccess = e => {
                    const result = e.target.result;
                    if (result) loadAndSetBackground(type, result.image, result.type, nr, result.size);
                };
            }
        }
    };
    cursor_request.onerror = () => console.error("efy: no db entries");
    bg_size_update(type);
};

const loadAndSetBackground = (type, src, mediaType, nr, size) => {
    const bg = $(`.efy_3d_${type}`), bg_set =()=>{ bg.src = src; bg.volume = 0},
    previews = `#efy_images_${type} .efy_img_previews`;

    $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active'));
    const activePreview = $(`${previews} [efy_bg_nr="${nr}"]`);
    activePreview.setAttribute('efy_active', '');

    if (mediaType === 'image') {
        efy_css[type].textContent = `.efy_3d_${type} {background: url(${src})}`;
        current_bg_src = '';
    }
    else if (mediaType === 'video') {
        if (type === 'bg'){
            current_bg_src = src;
            (!efy.mode.includes('trans')) ? bg.src = '' : bg_set();
        }
        else { bg_set()}
    }

    if (type === 'button'){
        efy_css[type].textContent = `html :is(
            button:not(
                .efy_card_filter, .efy_accent_x, [efy_bg_nr], [efy_card],
                .efy_sidebar_top_buttons button, .efy_about
            ),
            [efy_tabs] [efy_tab][efy_active] + label,
            .efy_accent, [efy_select] input:checked + label,
            &[efy_color_accent_text] [efy_select] input:checked + label
        ){
            background: url(${src})!important; background-size: cover !important;
            background-position: center !important; background-clip: border-box!important;
            background-origin: border-box!important;
        }
        ::-webkit-slider-thumb {
            background: url(${src})!important; background-size: cover !important;
            background-position: center !important; background-clip: border-box!important;
            background-origin: border-box!important;
        }`;
    }
};

/*Remove Images/Videos*/
const img_previews = $('.efy_img_previews');
$event(img_previews, 'click', (e)=>{

    const x = e.target, toggle_remove =()=>{
        img_previews.classList.toggle('efy_remove');
        $('.efy_images_reset').classList.toggle('efy_hide_i');
    };

    if (x.matches('.efy_remove [efy_bg_nr]')){
        nr = x.getAttribute('efy_bg_nr');

        indexedDB.open('efy').onsuccess =(res)=>{
            const db = res.target.result,
            trans = db.transaction(['bg'], 'readwrite'),
            store = trans.objectStore('bg');
            store.index('nr').get(nr).onsuccess = e => {
                const result = e.target.result;
                if (result) store.delete(result.id);
            };
            x.remove();
        }
    } else if (x.matches('#idb_remove_toggle')){
        toggle_remove(); const status = x.checked;
        $notify('short',
            (status ? 'Remove' : 'Set') + ' Background',
            'Select to ' + (status ? 'remove' : 'apply'),
            null, status ? 'remove' : 'check',
        );
    } else if (x.matches('.efy_images_reset')){
        indexedDB.open('efy').onsuccess = (res) => {
            const db = res.target.result,
            trans = db.transaction(['bg'], 'readwrite');
            trans.objectStore('bg').clear(); db.close();
            $all('.efy_img_previews [efy_bg_nr]').forEach(x => x.remove());
            bg_sizes = []; bg_size_update('bg');
            $notify('short', 'All Files Removed', null, null, 'check');
            toggle_remove(); $('#idb_remove_toggle').checked = false;
        }
    }
});

/*Run Functions*/ (async ()=>{
    await count_images('bg');
    if (efy.modules.includes('efy_filters')){
        await count_images('front');
        await count_images('back');
        await count_images('button');
    }
})();

// Pause Video on Inactive Tab
// TODO: Extend this to Front + Back Layers
const video_test = $('.efy_3d_bg');
function handleVisibilityChange(){
    try {if (video_test.getAttribute('src').startsWith('data')){
        video_test.paused ? video_test.play() : video_test.pause();
    }} catch {}
}
$event(window, 'focus', handleVisibilityChange);
$event(window, 'blur', handleVisibilityChange);

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

    if (!lang && name !== ''){ a.insertAdjacentText(
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

/*Clock & Timer*/ let time_0 =(i)=>{ if (i < 10){i = '0' + i} return i};

const clock_selectors = 'hour s1 minute s2 second format'.split(' ');

/*Clock*/ efy_clock =()=>{
    let t = new Date(), h = t.getHours(), m = time_0(t.getMinutes()), s = '';
    $all('[efy_clock]').forEach(x =>{
        let f = ''; const atb = x.getAttribute('efy_clock');
        if (atb.includes('12')){ f = h < 12 ? ' AM' : ' PM'}
        if (atb.includes('hms')){ s = time_0(t.getSeconds())}
        [h,':',m,':',s,f].map((a,i)=>{ $$(x, '.' + clock_selectors[i]).textContent = a });
})};
$ready('[efy_clock]', (x)=>{
    clock_selectors.map(a =>{ $add('p', {class: a}, null, x)});
    setInterval(efy_clock, 1000)
});

/*Timer: ID, Time, Reverse (optional)*/ $ready('[efy_timer]', (y) =>{ let tm = y.getAttribute('efy_timer').replaceAll(' ', '').split(','), time = '00:00:00'; if (tm[1]  !== undefined){ time = $sec_time(tm[1])}
    $add('div', {efy_text: ''}, [time], y); $add('button', {efy_start: '', title: 'Start or Pause'}, [], y); $add('button', {efy_reset: '', title: 'Reset'}, [], y);

    let play = $$(y, '[efy_start]'), reset= $$(y, '[efy_reset]'), timer_text = $$(y, '[efy_text]'), interval, i = 0;
    const time_reset =()=>{
        clearInterval(interval); i = 0;
        timer_text.textContent = (tm[2] === 'reverse') ? $sec_time(tm[1]) : "00:00:00";
        play.removeAttribute('efy_active');
    }

    $event(play, 'click', ()=>{
        clearInterval(interval); play.toggleAttribute('efy_active');
        if (play.hasAttribute('efy_active')){
            interval = setInterval(()=>{ i++;
                /*Reverse/Normal*/ timer_text.textContent = (tm[2] == 'reverse') ? $sec_time(tm[1] - i) : $sec_time(i);
                /*Reset & Notify*/ if (i == tm[1]){
                    $notify('infinite', 'Done!', 'Time is up!');
                    $audio_play(efy_audio.call, 'loop'); time_reset();
                    $event($('[efy_alert]'), 'click', ()=>{ try {efy_audio.call.pause()} catch {}})
                }
            }, 1000)}
        else { clearInterval(interval) }});
        $event(reset, 'click', time_reset);
});

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

/*Prevent Default*/ $all('input[type="range"], .plus-btn, .minus-btn').forEach(a => $event(a, 'contextmenu', ()=> event.preventDefault()));

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

// Events

$event($body, 'input', ()=>{ const x = event.target;
    if (x.matches('[efy_search]')){
        const search = x.value.toLowerCase();
        $all(x.getAttribute('efy_search')).forEach(x =>{
            if (
                (x.textContent.toLowerCase().includes(search)) ||
                (x.title.toLowerCase().includes(search))
            ){ x.classList.remove('efy_hide_i')}
            else {x.classList.add('efy_hide_i')}
        });
    }
});

$event($body, 'click', ()=>{ let x = event.target;
    /*Toggle Sidebar*/
    if (x.matches('[efy_sidebar_btn]')){ let final = 'on';
        if ($root.hasAttribute('efy_sidebar')){
            let d = $root.getAttribute('efy_sidebar'), e = '';
            if (['left', 'right'].some(s => d.includes(s))) e = d.replace('on_', '');
            final = d.includes('on') ? e : 'on_' + e;
            $('.efy_sidebar [efy_sidebar_btn="close"]').focus();
        }; $root.setAttribute('efy_sidebar', final)
    }
    if (x.matches('.efy_sidebar [efy_sidebar_btn*=close]')){
        $wait(1, ()=> $('body [efy_sidebar_btn]:not(.efy_sidebar [efy_sidebar_btn])').focus());
    }
    // Temporary - In the next update I'll probably do something related to generating theme preview screenshots here
    // if (x.matches('#efy_sbtheme summary') && !efy_themes_loaded){
    //     efy_themes_loaded = true;
    //     something else...
    // }
});

})};