let efy_version = '23.12.22 Beta', efy_performance = performance.now(),
$ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document),
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
/*Event*/ $event = (a,b,c,d) =>{ d ? a.addEventListener(b,c,d) : a.addEventListener(b,c) },
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
/*Notify*/ $notify =(a,b,c,lang)=>{ let d = 'alert' + Date.now(), i = $('.efy_quick_notify i'),
    icon_fn =()=>{ let icon = ($all('.efy_quick_notify_content [efy_alert]').length > 0) ? 'notify_active' : 'notify'; i.setAttribute('efy_icon', icon)};
    if (lang == 'lang'){ b = efy_lang[b]; c = efy_lang[c]}
    ['[efy_alerts]', '.efy_quick_notify_content'].map(e =>{
        $add('div', {efy_alert: '', class: d}, [ ['div', {}, [ ['h6', {}, b], ['p', {}, c] ]], ['button', {efy_btn_square: ''}, [['i', {efy_icon: 'remove'}]]] ], $(e));
    }); icon_fn();
$wait(a, ()=>{ try { $$($('[efy_alerts]'), '.' + d).remove()} catch {/**/} icon_fn() })},
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
    ]], ['div', {id: 'efy_modules'}]
]);
$add('div', {efy_sidebar_btn: 'absolute'});
$add('video', {class: 'efy_3d_bg', autoplay: '', loop: '', muted: '', playsinline: ''});


/*Quick Shortcuts*/ if ($efy_module('efy_quick')){ let a = $('[efy_about]');
    $add('input', {type: 'text', efy_search_input: '', class: 'efy_hide_i', placeholder: 'Search through menu...'}, [], a, 'afterend');
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

/*Theme*/ if ($efy_module('efy_mode')){

    $add('details', {id: 'efy_sbtheme', efy_select: ''}, [
        ['summary', {efy_lang: 'theme'}, [['i', {efy_icon: 'star'}]]],
        ['div', {efy_tabs: 'efyui_0'}, [['div', {class: 'efy_tabs'}]]]
    ], $('.efy_sidebar'));

    /*Tabs*/ let ui = [$('[efy_tabs=efyui_0]'), $('[efy_tabs=efyui_0] .efy_tabs')];
    ['mode', 'colors', 'size', 'menu'].map(a =>{
        const tab = $add('button', {efy_tab: a, efy_lang: a}, [], ui[1]),
        content = $add('div', {efy_content: a, efy_select: '', id: `efy_${a}`}, [], ui[0]);
        if (a == 'mode'){ tab.setAttribute('efy_active', ''); content.setAttribute('efy_active', '')}
    });

    /*Colors*/ b = $('#efy_sbtheme [efy_content=colors]');

    $add('div', {efy_tabs: 'container'}, [
        ['div', {class: 'previews', efy_select: ''}, [
            ['button', {id: 'add-color'}, [ ['i', {efy_icon: 'plus'}] ]],
            ['button', {id: 'remove-color'}, [ ['i', {efy_icon: 'remove'}] ]]
        ]]
    ], b);

    const container = $('[efy_tabs=container]'), add = $('#add-color'), remove = $('#remove-color'),
    bg = 'background: linear-gradient(to right,'; let count = 1;

const inputs =(i, color, light, chroma, hue, alpha)=>{ i = String(i); const inputs = [
        ['hue', 'hue', 360, 1, hue],
        ['saturation', 'chroma', 0.37, 0.01, chroma, `${bg} oklch(50% 0 0), ${color})`],
        ['brightness', 'lightness', 100, 1, light, `${bg} oklch(0% 0 0), ${color}, oklch(100% 0 0))`],
        ['alpha', 'alpha', 1, 0.01, alpha]
    ].map(p =>{ return ['div', { efy_lang: p[0], efy_range_text: p[0] }, [
        ['input', { class: p[1], type: 'range', min: 0, max: p[2], step: p[3], value: p[4], style: p[5] }]
    ]]});
    $add('div', {efy_content: i}, inputs, container);
    $add('input', {id: `color${i}`, type: 'radio', name: 'efy_color_gradient'}, [], add, 'beforebegin');
    $add('label', {for: `color${i}`, efy_tab: i, style: `background: ${color}`}, i, add, 'beforebegin');
}

const add_color =(nr, colors)=>{ for (let i = 1; i < nr+1; i++){
    let color = colors ? colors[i-1] : efy[`color${i}`];
    let [light, chroma, hue, alpha] = color.replace(`oklch(`, '').replace('%','').replace('/ ', '').split(' ');
    inputs(i, color, light, chroma, hue, alpha);
}};

if (efy.color_nr){ count = efy.color_nr; add_color(count)}
else { let colors = $css_prop(`--efy_color`).split(','), gradient = [], gradient_trans = []; count = colors.length; const angle = $css_prop(`--efy_color_angle`);
    colors.map((a, i) =>{ if (a.startsWith(' ')){ colors[i] = a.slice(1)}
        const color = colors[i].replace('/ ', '').split(' ');
        gradient.push(`oklch(${colors[i]})`);
        gradient_trans.push(`oklch(${color[0]} ${color[1]} ${color[2]} / ${ (color[3] / 3).toFixed(2) })`);
    });
    efy.gradient = `linear-gradient(${angle}deg, ${gradient})`;
    efy.gradient_trans = `linear-gradient(${angle}, ${gradient_trans})`;
    add_color(count, colors); update_color(angle); efy.color_nr = count; $save()
}

$css_prop(`--efy_color`, efy.gradient); $css_prop(`--efy_color_trans`, efy.gradient_trans)
if (count == 1){ remove.setAttribute('disabled', '')} else if (count == 12){ add.setAttribute('disabled', '')}

const toggle_disabled =()=>{
    count == 1 ? remove.setAttribute('disabled', '') : remove.removeAttribute('disabled');
    count == 12 ? add.setAttribute('disabled', '') : add.removeAttribute('disabled');
}

$event($('#add-color'), 'click', ()=>{ if (count < 12){
    const color = $$(container, `[efy_content="${count}"]`),
    light = $$(color, `.lightness`).value, chroma = $$(color, '.chroma').value, hue = $$(color, '.hue').value, alpha = $$(color, '.alpha').value;
    count++; inputs(count, color, light, chroma, hue, alpha);
    efy.color_nr = count; $save()
}; toggle_disabled()});

$event($('#remove-color'), 'click', (a)=>{ if (count > 1){
    $$(container, `[efy_content="${count}"]`).remove(); $$(container, `[efy_tab="${count}"]`).remove();
    delete efy[`color${count}`]; count--; efy.color_nr = count; $save()
}; toggle_disabled()});

function update_color(angle){ let [light, chroma, hue, alpha, gradient, gradient_trans] = [[], [], [], [], [], []], colors = 1;
    const content_colors = $$all(container, '[efy_content]');

    if (!angle){ angle = $('.efy_color_angle_input').value + 'deg'}

    content_colors.forEach((form, i) => {
        light.push($$(form, '.lightness').value); chroma.push($$(form, '.chroma').value);
        hue.push($$(form, '.hue').value); alpha.push($$(form, '.alpha').value);
        const c = `oklch(${light[i]}% ${chroma[i]} ${hue[i]}`;

        $$(form, '.lightness').style = `${bg} oklch(0% 0 0), ${c}), oklch(100% 0 0))`;
        $$(form, '.chroma').style = `${bg} oklch(50% 0 0), ${c}))`;
        $$(form, '.alpha').style = `${bg} oklch(0% 0 0 / 0), ${c}))`;

        gradient.push(`${c} / ${alpha[i]})`);
        gradient_trans.push(`${c} / ${ (alpha[i] / 3).toFixed(2) })`);
        $$(container, `[efy_tab="${i+1}"]`).style.background = gradient[i];
        efy[`color${i+1}`] = `${c} / ${alpha[i]}`;
    });
    if (content_colors.length > 1){
        efy.gradient = `linear-gradient(${angle}, ${gradient})`;
        efy.gradient_trans = `linear-gradient(${angle}, ${gradient_trans})`;
    } else {
        efy.gradient = `linear-gradient(${angle}, ${gradient}, ${gradient})`;
        efy.gradient_trans = `linear-gradient(${angle}, ${gradient_trans}, ${gradient_trans})`;
    };
    $css_prop(`--efy_color`, efy.gradient); $css_prop(`--efy_color_trans`, efy.gradient_trans); $save()
}

$event(container, 'input', (e)=>{ if (e.target.matches('input')){ update_color() }});
$event(container, 'click', (e)=>{ if (e.target.matches('#add-color') || e.target.matches('#remove-color')){ update_color() }});

/*Angle*/ $add('div', {efy_lang: 'angle', efy_range_text: 'Angle'}, [['input', {class: 'efy_color_angle_input', type: 'range', min: '0', max: '360', value: '165', step: '1'}]], b);

$add('details', {efy_help: ''}, [['summary', {efy_lang: 'custom_colors'}], ['div', {efy_lang: 'custom_colors_help'}]], b);

$add('div', {efy_tabs: 'efy_custom_colors', class: 'efy_custom_colors'}, [
    ['div', {class: 'tabs'}]
], b);

let cc = $('.efy_custom_colors'); c = ['bgcol', 'text', 'bordercol', 'buttoncol'];

['background,0 0% 0%,efy_color_bgcol', 'text,0 100% 50%,efy_color_text', 'border, 0 0% 50%,efy_color_bordercol', 'button, 0 0% 50%,efy_color_buttoncol'].map((a,i)=>{
    $add('div', {class: 'efy_tab'}, [
        ['input', {type: 'checkbox', name: `efy_custom_colors`, id: `efy_${c[i]}_status`}],
        ['label', {for: `efy_${c[i]}_status`}],
        ['input', {type: 'radio', efy_tab: c[i], id: 'efy_custom_' + c[i], name: 'efy_custom_colors'}],
        ['label', {for: 'efy_custom_' + c[i], efy_lang: a.split(',')[0]}],
    ], $('[efy_tabs=efy_custom_colors] .tabs'));

    $add('div', {efy_content: c[i], efy_color: a+',lang', class: 'show'}, [], $('[efy_tabs=efy_custom_colors]'));
});
$all(`[efy_tab=bgcol], [efy_content=bgcol]`).forEach(a=> a.setAttribute('efy_active', ''));

c.map(a =>{
    if (efy[a] !== undefined){ $css_prop(`--efy_color_${a}_var`, efy[a]) }
});

/*Keyboard Accessibility*/
$event($('.efy_custom_colors .tabs'), 'keydown', (event)=>{
    const inputs = Array.from($all('.efy_tab input')), index = inputs.indexOf(document.activeElement);

    if (event.key === 'Tab'){ event.shiftKey ? inputs[0].focus() : index !== inputs.length - 1 ? inputs[inputs.length - 1].focus() : null}
    if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key)) { event.preventDefault();
        const index2 = (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + inputs.length) % inputs.length; inputs[index2].focus();
    }
});

/*Shadows*/ $add('p', {style: 'margin: 15rem 0 10rem 0'}, [ 'Shadows: Trans', ['mark', {efy_lang: 'alpha', style: 'margin-left: 8rem'}] ], b);

$add('div', {class: 'efy_shadows'}, [ ['div'] ], b); let ss = $('.efy_shadows div');
['trans1, 0 0% 50%, 1', 'trans2, 0 0% 50%, 2', 'trans3, 0 0% 50%, 3', 'trans4, 0 0% 50%, 4', 'btn1, 0 0% 50%,1',  'btn2, 0 0% 50%, 2',  'btn3, 0 0% 50%, 3',  'btn4, 0 0% 50%, 4'].map((a,i)=>{
    $add('div', {efy_color: a, efy_select: ''}, [], ss);
    $ready(`.efy_shadows [efy_color="${a}"] [efy_color_picker]`, (x)=>{
        $add('div', {efy_range_text: 'transparency', efy_lang: 'transparency'}, [$add('input', {class: `transparency`, type: 'range', min: '0', max: '1', value: '1', step: '0.05'})], $$(x, '[efy_range_text=brightness]'));
        $add('div', {efy_range_text: 'spread', efy_lang: 'spread'}, [$add('input', {class: `spread`, type: 'range', min: '-20', max: '30', value: '0', step: '1'})], x, 'afterbegin');
        $add('div', {efy_range_text: 'blur', efy_lang: 'blur'}, [$add('input', {class: `blur`, type: 'range', min: '0', max: '50', value: '5', step: '1'})], x, 'afterbegin');
        ['y', 'x'].map(a => $add('div', {efy_range_text: a, efy_lang: a}, [$add('input', {class: a, type: 'range', min: '-30', max: '30', value: '0', step: '1'})], x, 'afterbegin'));
        $add('label', {efy_lang: 'inset', for: `inset${i}`, name: `efy_shadow_trans${i}`}, [], x, 'afterbegin');
        $add('input', {id: `inset${i}`, name: `efy_shadow_trans${i}`, type: 'checkbox'}, [], x, 'afterbegin');
        $add('label', {efy_lang: 'status', for: `status${i}`, name: `efy_shadow_trans_status${i}`}, [], x, 'afterbegin');
        $add('input', {id: `status${i}`, name: `efy_shadow_trans_status${i}`, type: 'checkbox'}, [], x, 'afterbegin');
})});
$ready(`.efy_shadows [efy_color*=btn1] .spread`, ()=>{
    $add('p', {style: 'width: 100%'}, ['Shadows: Button', ['mark', {efy_lang: 'alpha', style: 'margin-left: 8rem'}] ], $('.efy_shadows [efy_color*=trans4]'), 'afterend');
    [0,4].map(a=> $(`.efy_shadows #status${a}`).checked = true);
},1);

let efy_shadow = '', keys = 'shadow_trans shadow_button shadow_button_trans'.split(' '), values = ['trans', 'button', ''], a3 = [0,1,2,3], a4 = [0,1,2,3,4];

const restore_shadow =(key, value)=>{
    if (efy[key] !== undefined){ $css_prop(`--efy_${key}`, efy[key]); let b = ['trans', 'btn'];
        if (value !== ''){ efy_shadow += `${value},`}
        ['shadow_trans', 'shadow_button'].map((x,y) =>{
        if (key == x){ let sp = efy[key].split(',');
            $wait(3, ()=>{
                sp.map((a,i)=>{ let hsla = sp[i].split(' hsla(')[1].slice(0,-1), alpha = hsla.split(' / ')[1].replace(')', ''), hsl = hsla.split(' / ')[0].split(' '), h =  hsl[0], s = hsl[1].replace('%', ''), l = hsl[2].replace('%', ''),
                    j = '.efy_shadows [efy_color*="' + b[y] + String(i + 1) + '"]';
                    $(`${j} [efy_color_preview]`).style.background = `hsla(${hsla})`;
                    $(`${j} .hue`).value = h;
                    $(`${j} .sat`).value = s; $(`${j} .sat`).style.background = `linear-gradient(to right, hsl(0 0% 50%), hsl(${hsl}))`;
                    $(`${j} .lgt`).value = l; $(`${j} .lgt`).style.background = `linear-gradient(to right, #000, hsl(${hsl}), #fff)`;
                    $(`${j} .transparency`).value = alpha; $(`${j} .transparency`).style.background = `linear-gradient(to right, transparent, hsl(${hsl}))`;
                })
        })}})
}},
shadow =(i, efy_color, adjust, type)=>{
    let g = `.efy_shadows [efy_color*=${efy_color}`, d = `${g}${i}]`, c = [], e = [];
    a3.map(i =>{ e[i] = `${g}] #status${i}`; c[i] = `${g}${i + 1}] .` });
    $ready(`${d} .spread`, ()=>{
        $text($(`${d} [efy_color_preview]`), i);
        $event($(d), 'input', ()=>{
            if (event.target.matches('input')) { let inset = [], b = [], b2 = [];
                a3.map(x =>{ let a = c[x]; if ($(`${g}] #status${x + adjust}`).checked){
                    inset[x] = $(`${g}] #inset${x + adjust}`).checked ? 'inset ' : '';
                    let f = `${inset[x] + $(a + 'x').value}rem ${$(a + 'y').value}rem ${$(a + 'blur').value}rem ${$(a + 'spread').value}rem hsla(${$(a + 'efy_color_picker_hsl').value} /`, tsp = $(a + 'transparency').value;
                    b[x] = `${f} ${tsp})`;
                    if (type == 'button'){ b2[x] = `${f} ${ (tsp / 3).toFixed(2) })` }
                } else { delete b[x]; delete b2[x] }});
                b = String(b).replaceAll(',,', ',').replaceAll(',,', ','); if (b.slice(-1) == ',') b = b.slice(0, -1); if (b.slice(0,1) == ',') b = b.slice(1);
                $css_prop(`--efy_shadow_${type}`, b); if (b == []){ delete efy[`shadow_${type}`]} else { efy[`shadow_${type}`] = b};
                if (type == 'button'){
                    b2 = String(b2).replaceAll(',,', ',').replaceAll(',,', ','); if (b2.slice(-1) == ',') b2 = b2.slice(0, -1); if (b2.slice(0,1) == ',') b2 = b2.slice(1);
                    $css_prop('--efy_shadow_button_trans', b2);
                    if (b2 == []){ delete efy.shadow_button_trans} else { efy.shadow_button_trans = b2};
                    efy_shadow = efy_shadow.replaceAll('button,', '')
                } else { efy_shadow = efy_shadow.replaceAll('trans,', '')};
                $save(); efy_shadow += `${type},`;
                if (b == []){ efy_shadow = efy_shadow.replaceAll(`${type},`, '')}
                if (b2 == []){ efy_shadow = efy_shadow.replaceAll('button,', '')}
                $root.setAttribute('efy_shadow', efy_shadow.slice(0,-1))
}})}, 1)};

keys.forEach((key, i) => restore_shadow(key, values[i]));
if (efy_shadow !== ''){ $root.setAttribute('efy_shadow', efy_shadow.slice(0,-1))}
a4.map(i => shadow(i, 'trans', 0, 'trans')); a4.map(i => shadow(i, 'btn', 4, 'button'));


/*HSL to / from RGB & HEX*/ const hsl2rgb=((t,i,a)=>{a/=100;const h=i=>(i+t/30)%12,n=(i/=100)*Math.min(a,1-a),e=t=>a-n*Math.max(-1,Math.min(h(t)-3,Math.min(9-h(t),1)));return (255*e(0)).toFixed(0)+' '+(255*e(8)).toFixed(0)+' '+(255*e(4)).toFixed(0)}),
hsl2hex=((t,n,a)=>{a/=100;const r=n*Math.min(a,1-a)/100,h=n=>{const h=(n+t/30)%12,o=a-r*Math.max(Math.min(h-3,9-h,1),-1);return Math.round(255*o).toString(16).padStart(2,"0")};return`${h(0)}${h(8)}${h(4)}`}),
hex2hsl=(a=>{let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a),[t,r,s]=[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)];t/=255,r/=255,s/=255;let h,n,d=Math.max(t,r,s),c=Math.min(t,r,s),l=(d+c)/2;if(d==c)h=n=0;else{let a=d-c;switch(n=l>.5?a/(2-d-c):a/(d+c),d){case t:h=(r-s)/a+(r<s?6:0);break;case r:h=(s-t)/a+2;break;case s:h=(t-r)/a+4}h/=6}return n*=100,n=Math.round(n),l*=100,l=Math.round(l),[h=Math.round(360*h),n,l]}),
rgb2hsl=(t=>{let[a,h,r]=[t[0]/255,t[1]/255,t[2]/255],n=Math.max(a,h,r),M=Math.min(a,h,r),u=(n+M)/2,d=0,o=0;return n!=M&&(d=u<.5?(n-M)/(n+M):(n-M)/(2-n-M),o=a==n?(h-r)/(n-M):h==n?2+(r-a)/(n-M):4+(a-h)/(n-M)),[u,d,o]=[100*u,100*d,60*o],o<0&&(o+=360),[Math.round(o),Math.round(d),Math.round(u)]});

/*Color Picker: text or lang, hsl, id, lang*/ $ready('[efy_color]', (a)=>{ let g = a.getAttribute('efy_color').replaceAll(', ', ',').split(','), h = '', j = g[0]; if (g[3] == 'lang'){ h = g[0]; j = ''}
    $add('button', {efy_color_preview: '', style: `background: hsl(${g[1]})`, efy_lang: h}, [j], a);
    $add('div', {efy_color_picker: ''}, [['div', {class: 'efy_cp_switch'}, [ ['button', {class: 'efy_color_picker_switch'}, 'HSL'] ]]], a);

    if (!a.classList.contains('show')){
        $$(a, '[efy_color_picker]').classList.add('efy_hide');
        $event($$(a, '[efy_color_preview]'), 'click', ()=>{
            $$(a, '[efy_color_picker]').classList.toggle('efy_hide');
            a.toggleAttribute('efy_active')
        });
    }

let cp = $$(a, '.efy_cp_switch'), c = ['hue', 'sat', 'lgt'], d = ['360', '100', '100'], e = ['0', '100', '50']; ['hue', 'saturation', 'brightness'].map((b,i)=>{
    $add('div', {efy_lang: b, efy_range_text: b}, [ ['input', {class: c[i], type: 'range', step: '1', min: '0', max: d[i], value: e[i]}] ], cp, 'beforebegin')
});

let val = ['0 100 50', '255 0 0', 'ff0000'], min = [13,5,3], max = [13,11,6], hide = ['', 'efy_hide', 'efy_hide']; ['hsl', 'rgb', 'hex'].map((b,i)=>{
    $add('input', {class: `efy_color_picker_${b} ${hide[i]}`, type: 'text', value: val[i], minlength: min[i], maxlength: max[i]}, [], cp)
});

$add('div', {class: 'copy_btn'}, [
    ['button', {class: 'efy_color_picker_copy', title: 'copy'}, [['i', {efy_icon: 'copy'}]]],
    ['button', {class: 'efy_color_picker_paste', title: 'paste'}, [['i', {efy_icon: 'paste'}]]]
], cp);

let efy_swc = 1, cs = $$(cp, '.efy_color_picker_switch');

$$(cp, '.efy_color_picker_copy').addEventListener('click', ()=>{ let b = cs.textContent.toLowerCase(); let d = $$(a,`.efy_color_picker_${b}`).value; navigator.clipboard.writeText(d); if (efy.notify_clipboard != false){ $notify(3, 'Copied to clipboard', d)}});
$$(cp, '.efy_color_picker_paste').addEventListener('click', ()=>{ let b = cs.textContent.toLowerCase(), x = $$(a,`.efy_color_picker_${b}`);
    navigator.clipboard.readText().then(cb =>{ x.value = cb; x.dispatchEvent(new Event('input', { 'bubbles': true })) }).catch();
});

cs.addEventListener('click', ()=>{ if (efy_swc == 1){ $text(cs, 'RGB')} else if (efy_swc == 2){ $text(cs, 'HEX')} else if (efy_swc == 3){efy_swc = 0; $text(cs, 'HSL')} efy_swc++;
    $$all(cp, 'input').forEach(a=> a.classList.add('efy_hide')); $$(cp, `input:nth-of-type(${efy_swc})`).classList.remove('efy_hide');
});

    a.addEventListener('input', (d)=>{ let [h,s,l] = [$$(a, '.hue').value, $$(a, '.sat').value, $$(a, '.lgt').value], hsl = `${h} ${s}% ${l}%`, rgb = hsl2rgb(h,s,l), hex = hsl2hex(h,s,l), classes = d.target.classList;

        if (classes.contains('efy_color_picker_hsl')){ let c = $$(a, '.efy_color_picker_hsl').value.split(' '); [h,s,l] = [c[0], c[1].replace('%', ''), c[2].replace('%', '')]}
        else if (classes.contains('efy_color_picker_rgb')){ let c = $$(a, '.efy_color_picker_rgb').value.split(' '), e = rgb2hsl(c); [h,s,l] = [e[0], e[1], e[2]]}
        else if (classes.contains('efy_color_picker_hex')){ let c = '#' + $$(a, '.efy_color_picker_hex').value; try {let e = hex2hsl(c); [h,s,l] = [e[0], e[1], e[2]] } catch {/**/}}
        else { let cvt = [hsl,rgb,hex]; ['hsl', 'rgb', 'hex'].map((b,i)=>{$$(a,`.efy_color_picker_${b}`).value = cvt[i]})}
        hsl = `${h} ${s}% ${l}%`; [$$(a, '.hue').value, $$(a, '.sat').value, $$(a, '.lgt').value] = [h,s,l];
        let style = [`hsl(${hsl})`, `linear-gradient(to right, hsl(0 0% 50%), hsl(${h} 100% ${l}%))`, `linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`]; ['[efy_color_preview]', '.sat', '.lgt'].map((b,i)=>{$$(a,b).style.background = style[i] });

        efy[`color${$$(a,'[efy_color_preview]').textContent}`] = hsl;

        ['text', 'bgcol', 'bordercol', 'buttoncol'].map(x =>{
            if (a.getAttribute('efy_color').includes(`color_${x}`)){ $css_prop(`--efy_color_${x}_var`, hsl); efy[x] = hsl; $save() }
        });
    });
});


/*Mode*/ 'default light_light light_sepia dark_dark dark_nord dark_black light_trans dark_trans'.split(' ').map(a =>{
    const c = $('#efy_sbtheme [efy_content=mode]'), id = `efy_mode_${a}`;
    ['_trans', 'light_', 'dark_'].forEach(b => a = a.replace(new RegExp(b, 'g'), ''));
    $add('input', {type: 'radio', name: 'efy_mode', id}, [], c); $add('label', {for: id, efy_lang: a}, [], c);
});

$add('details', {efy_help: ''}, [
    ['summary', {efy_lang: 'transparency'}],
    ['div', {efy_lang: 'sidebar_transparency_help'}]
], $('#efy_mode_light_trans'), 'beforebegin');

$add('div', {class: 'trans_window_div'}, [
    ['input', {type: 'checkbox', name: 'trans_window', id: `trans_window`}],
    ['label', {for: `trans_window`, efy_lang: 'window'}]
], $('[for="efy_mode_dark_trans"]'), 'afterend');

/*Images*/ $add('div', {id: 'efy_images_bg'}, [
    ['details', {efy_help: ''}, [ ['summary', {efy_lang: 'images'}], ['div', {efy_lang: 'sidebar_images_warning_help'}] ]],
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: 'idb_addimg_bg', type: 'file', accept: 'image/*, video/*', style: 'display: none'}],
        ['label', {for: 'idb_addimg_bg', title: 'Add file', class: 'efy_color', type:'button', role: 'button'}, [['i', {efy_icon: 'plus'}]]],
        ['button', {class: 'efy_idb_reset', title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
    ]]
], $('#efy_sbtheme [efy_content=mode]'));

/*Mode*/ if (efy.mode){ a = efy.mode; $root.setAttribute('efy_mode', a); $('#efy_mode_'+a).setAttribute('checked', '')}
else {$root.setAttribute('efy_mode', 'default'); $('#efy_mode_default').setAttribute('checked', '')}
$all("[name=efy_mode]").forEach(x =>{ let y = x.id.replace('efy_mode_', ''); x.onclick =()=>{ $root.setAttribute('efy_mode', y); efy.mode = y; $save() }});

/*Transparent Window*/ if (efy.trans_window){ a = efy.trans_window; $root.classList.add('trans_window'); $('#trans_window').setAttribute('checked', '')}
$event($("#trans_window"), 'change', ()=>{ $root.classList.toggle('trans_window'); efy.trans_window = $("#trans_window").checked; $save() });

/*Radius & Gap*/ a = $('#efy_sbtheme [efy_content=size]');
$add('div', {efy_lang: 'radius', efy_range_text: 'Radius'}, [['input', {class: 'efy_radius_input', type: 'range', min: '0', max: '25', value: '12', step: '1'}]], a);
$add('div', {efy_lang: 'border', efy_range_text: 'Border'}, [['input', {class: 'efy_border_size_input', type: 'range', min: '0', max: '8', value: '1.5', step: '0.1'}]], a);
$add('div', {efy_lang: 'gap', efy_range_text: 'Gap alpha'}, [['input', {class: 'efy_gap_input', type: 'range', min: '0', max: '30', value: '15', step: '1'}]], a);
$add('div', {efy_lang: 'max_width', efy_range_text: 'Max Width alpha'}, [
    ['div', {class: 'efy_max_width_div'}, [
        ['input', {class: 'efy_maxwidth_input', type: 'range', min: '500', max: '5000', value: '1200', step: '1'}],
        ['select', {}, [ ['option', {value: 'rem'}, 'REM'], ['option', {value: '%'}, '%'] ]]
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
    $('#'+a).addEventListener('click', ()=>{ if (e.classList.contains('efy_hide_i')){efy.sidebar_btn_status = 'on'; $save()} else {delete efy.sidebar_btn_status; $save()} e.classList.toggle('efy_hide_i') });

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

}

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
$all(`.efy_${a[i]}_filter input`).forEach(x =>{ x.addEventListener("input", fn )});
$all(`.efy_${a[i]}_filter [type=reset]`).forEach(x =>{ x.addEventListener("pointerup", ()=>{ delete efy[g]; delete efy[h]; $save(); $text(css, ''); x.click() }) })
}}

/*Backup*/ if ($efy_module('efy_backup')){
    $add('details', {id: 'efy_backup'}, [ ['summary', {efy_lang: 'backup'}, [['i', {efy_icon: 'arrow_down'}]]] ], $('.efy_sidebar'));
    for (let a = ['localstorage', 'idb'], b = ['settings', 'images'], c = '#efy_backup', i = 0; i < a.length; i++){
        let aa = `efy_${a[i]}`, bb = `efy_${b[i]}`;
        $add('p', {efy_lang: bb}, [], $(c));
        $add('div', {class: 'efy_backup_div'}, [
            ['a', {href: '#', class: `${aa}_export`, download: `${bb}.json`, role: 'button', efy_lang: 'save'}, [ ['i', {efy_icon: 'arrow_down'}]]],
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

for (let a = ['efy_cursor_default', 'efy_cursor_custom', 'efy_cursor_none'], b = ['default', 'custom', 'hide_touchscreen'], c = $('#efy_accessibility_cursor'), i = 0; i < a.length; i++){
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
    input.addEventListener('change', ()=>{ let speed = input.value; efy.anim_speed = speed; $save();
        if (speed == '0'){ $body.style.setProperty(status, '0'); $body.style.setProperty(state, 'paused'); $body.setAttribute('efy_animations', 'off')}
        else { $body.style.setProperty(status, '1'); $body.style.setProperty(state, 'running'); $body.removeAttribute('efy_animations')}
        $text($('.efy_anim_accessibility'), `:root {--efy_anim_speed: ${speed}!important}`)
}) })();

/* Text Size*/ $add('style', {class: 'efy_text_accessibility'}, [], $head); if (efy.text_zoom){ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${efy.text_zoom}px!important} html {letter-spacing: ${efy.text_spacing}px!important}`)
    $('.efy_ui_zoom').value = efy.text_zoom; $('.efy_text_spacing').value = efy.text_spacing;
}
$all('.efy_text_accessibility input').forEach(x => x.addEventListener('input', ()=>{ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${$('.efy_ui_zoom').value}px!important} html {letter-spacing: ${$('.efy_text_spacing').value}px!important}`); efy.text_zoom = $('.efy_ui_zoom').value; efy.text_spacing = $('.efy_text_spacing').value; $save() }));
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

/*Effects*/ if (efy.audio_status == 'on' ){
    efy_audio.folder = $css_prop('--efy_audio_folder'); 'pop ok ok2 ok3 hover slide step error disabled call wind'.split(' ').forEach(x =>{ efy_audio[x] = new Audio(`${efy_audio.folder}/${x}.webm`); efy_audio[x].volume = efy_audio.volume }); $body.addEventListener("pointerdown", ()=>{ if (efy.audio_click == 'on'){
    for (let a = 'ok ok ok2 ok3 pop slide error disabled step step wind'.split(' '), b = 'pointerup change pointerup pointerup pointerup pointerup pointerup pointerup pointerdown input click'.split(' '), c = ['button:not([disabled], [type=submit], [type=reset], [efy_tab], [efy_sidebar_btn], [efy_toggle], [efy_keyboard] [efy_key], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button, .efy_quick_fullscreen, [tabindex="-1"], [efy_audio_mute*=ok]), .video-grid>div', 'input, textarea', '.efy_img_previews [efy_bg_nr]', '[type=submit]', 'summary, [efy_toggle], select:not([multiple], [disabled]), [efy_tabs] [efy_tab], [efy_alert], [efy_alert] *, .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button', '[efy_sidebar_btn]', '[type=reset]', '[disabled]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled]), [efy_keyboard] [efy_key]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])', '.efy_quick_fullscreen'], i = 0; i < a.length; i++){ $body.addEventListener(b[i], ()=>{ if (event.target.matches(c[i])){ $audio_play(efy_audio[a[i]]) }})}}
    /*Hover*/ if (efy.audio_hover == "on"){ $all("summary, select:not([multiple], [disabled]), [type=submit], [type=reset], [efy_sidebar_btn], .video-grid>div").forEach(x => x.addEventListener("mouseenter",()=> $audio_play(efy_audio.hover) ))}
    /*Online Status*/ for (let a = ['online', 'offline'], b = ['ok', 'error'], i = 0; i < a.length; i++){ window.addEventListener(a[i], ()=>{ $audio_play(efy_audio[b[i]])})}
}, {once: true});

/*Volume*/ $all('.efy_audio_volume').forEach(a => a.oninput =()=>{ for (let b = Object.keys(efy_audio), i = 0; i < b.length; i++){ efy_audio[b[i]].volume = a.value }});
$all('.efy_audio_volume_page').forEach(a => a.oninput =()=>{ $all('audio, video').forEach(b => b.volume = a.value) })

} /*Sidebar Modules - End*/

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

/*IndexedDB*/ let open_idb =(name = 'efy')=>{
    const stores = 'bg settings front back button trans'.split(' ');
    return new Promise((resolve, reject)=>{
        let request = indexedDB.open(name);
        request.onerror = e => reject("efy: Can't open db");
        request.onsuccess = e => resolve(request.result);
        request.onupgradeneeded = e =>{ const db = e.target.result;
        stores.map(a => db.createObjectStore(a, { keyPath: "id", autoIncrement: true }))
}})}; open_idb()

const efy_add_bgimg = async (type, e)=>{ let db = await open_idb(), read = new FileReader(); read.readAsDataURL(e.target.files[0]); read.onload = e =>{
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

/*Count images*/ const count_images = async (type) =>{
    const db = await open_idb('efy'), transaction = db.transaction([type], "readonly"),
    store = transaction.objectStore(type), cursor_request = store.openCursor(); let count_img = 0;

    cursor_request.onsuccess = (event) =>{ const cursor = event.target.result;
        if (cursor){ count_img++; const req = store.get(count_img);
            req.onsuccess = e =>{ const x = e.target.result, image = x.image, thumbnail = x.thumbnail, previews = `#efy_images_${type} .efy_img_previews`;
                /*Preview Click*/ $add('button', {efy_bg_nr: count_img, style: `background: url(${thumbnail})`, efy_audio_mute: 'ok'}, [], $(previews));
                $event($(`${previews} [efy_bg_nr="${count_img}"]`), 'click', (y) =>{
                    $text(efy_css[type], `.efy_3d_${type} {background: url(${e.target.result.image})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important; background-size: cover!important}`);
                    efy[`nr_${type}`] = x.id; $save();
                    $all(`${previews} [efy_bg_nr]`).forEach(a => a.removeAttribute('efy_active')); y.target.setAttribute('efy_active', '')
                });
            cursor.continue();
        }} else { /*Check bg_nr*/ let nr = efy[`nr_${type}`] ? JSON.parse(efy[`nr_${type}`]) : 1;
            /*Restore Background*/ if (count_img > 0){ store.get(nr).onsuccess = e =>{
                const res = e.target.result;
                $text(efy_css[type], `.efy_3d_${type} {background: url(${res.image})!important; background-size: var(--efy_bg_size)!important}`);
                $(`#efy_images_${type} .efy_img_previews [efy_bg_nr="${res.id}"]`).setAttribute('efy_active', '')
            }}
            /*Reset iDB*/ $all('.efy_idb_reset').forEach(a =>{ $event(a, 'click', () =>{ indexedDB.deleteDatabase("efy"); location.reload() }) });
        }
    };
    cursor_request.onerror = () => console.error("efy: no db entries");
};
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
            e.setAttribute('download', 'efy_images.json');
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
    else { $notify(3, 'Nothing to export', "You're using default settings")}
});

/*Import Settings*/ let efy_ls_import = $('#efy_localstorage_import'); $event(efy_ls_import, 'change', ()=>{ let file = efy_ls_import.files[0], read = new FileReader();
	read.onload =()=>{ localStorage.efy = read.result.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}'); location.reload()}; read.readAsText(file)});

/*Reset Settings*/ $all(".efy_localstorage_reset").forEach(x =>{ $event(x, 'click', ()=>{ localStorage.removeItem('efy'); location.reload() })});


/*Tabs*/ $ready('[efy_tabs]', (a)=>{ $event(a, 'click', (a)=>{ tab = a.target; if (tab.matches(`[efy_tab]`)){
    const active = `"${tab.getAttribute('efy_tab')}"`, name = `[efy_tabs="${tab.closest('[efy_tabs]').getAttribute('efy_tabs')}"]`,
    tabs = `:is(${name}, ${name} > div, ${name} > div > div) >`;
    $all(`${tabs} :is([efy_tab], [efy_content])[efy_active]`).forEach(x => x.removeAttribute('efy_active'));
    $all(`${tabs} :is([efy_tab=${active}], [efy_content=${active}])`).forEach(x => x.setAttribute('efy_active', ''));
}})});

/*Code*/ $ready('[efy_code]', (a)=>{ let b = a.getAttribute('efy_code').split(',');
    $add('div', {class: 'efy_bar'}, [ ['mark', {}, b[0]], ['div', {}, [
        ['button', {class: 'efy_code_trans'}, 'transparent'],
        ['button', {class: 'efy_fs'}, [ ['i', {efy_icon: 'fullscreen'}] ]],
        ['button', {class: 'efy_copy'}, [ ['i', {efy_icon: 'copy'}] ]]
    ]]], a, 'afterbegin');
    $$(a,'.efy_fs').addEventListener('click', ()=>{ if (document.fullscreenElement){ document.exitFullscreen()} else {a.requestFullscreen()}});
    $$(a,'.efy_code_trans').addEventListener('click', ()=>{ $body.classList.toggle('efy_code_trans_on')});
    $$(a,'.efy_copy').addEventListener('click', ()=>{ let c = a.innerText, d = c.substring(c.indexOf('copy') + 5); navigator.clipboard.writeText(d);
         if (efy.notify_clipboard != false){ $notify(3, 'Copied to clipboard', d)}
    });
});

/*EFY Range Text*/ let p; $ready('[efy_range_text]', (a)=>{ let c = $$(a, 'input[type=range]');
    $add('input', {class: 'efy_range_text_p', type: 'number', value: c.value, step: c.step, min: c.min, max: c.max}, [], a, 'afterbegin'); p = $$(a, '.efy_range_text_p');
    $event(p, 'input', (x)=>{ c.value = x.target.value; c.dispatchEvent(new Event('input', {'bubbles': true }))});
    $event(c, 'input', (x)=>{ $$(a, '.efy_range_text_p').value = x.target.value });
}); $all('form[class*=efy], [efy_content=colors] [efy_color_picker]').forEach(x =>{ $event(x,'reset', ()=>{
        $$all(x, '[efy_range_text]').forEach(y =>{ $$(y, '.efy_range_text_p').value = $$(y, 'input').value })
})});


/*Number Input*/ $all('input[type="number"]').forEach(t =>{ let n = $add('div', {efy_number: ''}); t.parentNode.replaceChild(n,t); n .appendChild(t); let s, h, f, i = t, step;
i.hasAttribute("step") ? step = parseInt(i.getAttribute("step"),10) : step=1; i.hasAttribute("pattern")||i.setAttribute("pattern","[0-9]");
h = i.hasAttribute("min") ? parseInt(i.getAttribute("min"),10) : 0; s = i.hasAttribute("max") ? parseInt(i.getAttribute("max"),10) : 99999;
(new DOMParser).parseFromString(n,"text/html");

if (t.hasAttribute('efy_number')) {for (let a = ['plus', 'minus'], b = [step, -step], c, d = ['afterend','beforebegin'], e = ['+','-'], x = 0; x < a.length; x++){ let g =()=>{f = parseInt(i.value,10) + b[x], (f <= s) && (f >= h) && (i.value = f); i.dispatchEvent(new Event("click"))}, j = `.${a[x]}-btn`;
$add('button', {class: `${a[x]}-btn`, type: 'button'}, [e[x]], t, d[x]);
$$(n, j).addEventListener('pointerdown', ()=>{c = setInterval(g, 100)}); $$(n, j).addEventListener('click', g); i.addEventListener('change', g); $$(n, j).addEventListener('pointerleave', ()=> clearInterval(c))}}
});

/*Clock & Timer*/ let time_0 =(i)=>{ if (i < 10){i = '0' + i} return i},

/*Clock*/ efy_clock =()=>{ let t = new Date(), h = t.getHours(), m = time_0(t.getMinutes()), s = ''; $all('[efy_clock]').forEach(x =>{ let f = '';
    if (x.getAttribute('efy_clock').includes('12')){ f = h < 12 ? ' AM' : ' PM'}
    if (x.getAttribute('efy_clock').includes('hms')){ s = time_0(t.getSeconds())}
    let z = 'hour s1 minute s2 second format'.split(' '); [h,':',m,':',s,f].map((a,i)=>{ $$(x, '.' + z[i]).textContent = a });
 })};
$ready('[efy_clock]', (x)=>{ 'hour s1 minute s2 second format'.split(' ').map(a =>{ $add('p', {class: a}, [], x)});
    $wait(.1, efy_clock); setInterval(efy_clock, 1000)
});

/*Timer: ID, Time, Reverse (optional)*/ $ready('[efy_timer]', (y) =>{ let tm = y.getAttribute('efy_timer').split(','), time = '00:00:00'; if (tm[1]  !== undefined){ time = $sec_time(tm[1])}
    $add('div', {efy_text: ''}, [time], y); $add('button', {efy_start: '', title: 'Start or Pause'}, [], y); $add('button', {efy_reset: '', title: 'Reset'}, [], y);

    let play = $$(y, '[efy_start]'), reset= $$(y, '[efy_reset]'), timer_text = $$(y, '[efy_text]'), interval, i = 0;
    const time_reset =()=>{clearInterval(interval); i = 0; if (tm[2] == 'reverse'){ $text(timer_text, $sec_time(tm[1]) )} else {$text(timer_text, "00:00:00")} play.removeAttribute('efy_active')}

    $event(play, 'click', ()=>{ clearInterval(interval); play.toggleAttribute('efy_active'); if (play.hasAttribute('efy_active')){ interval = setInterval(()=>{
        /*Reverse*/ if (tm[2] == 'reverse'){ i++; $text(timer_text, $sec_time(tm[1] - i))}
        /*Normal*/ else { i++; $text(timer_text, $sec_time(i))}
        /*Reset & Notify*/ if (i == tm[1]){ $notify(600, 'Done!', 'Time is up!'); $audio_play(efy_audio.call, 'loop'); time_reset(); $event($('[efy_alert]'), 'click', ()=>{ try {efy_audio.call.pause()} catch {/**/} })}
    }, 1000)} else { clearInterval(interval) }});
    $event(reset, 'click', time_reset);
});

/*Search Filter */ $ready('[efy_search]', (sc)=>{ let a = sc, search = a.getAttribute('efy_search'), container = `#${a.id}[efy_search="${search}"]`, z = $(container +' [efy_search_input]');
z.addEventListener('keyup', ()=>{ let val = z.value.toLowerCase(); $all(container +' '+ search).forEach(x =>{ if (x.textContent.toLowerCase().includes(val) == 0){x.classList.add('efy_hide_i')} else {x.classList.remove('efy_hide_i')}})})});

/*EFY Toggle*/ $ready('[efy_toggle]', (a)=>{ let b = a.getAttribute('efy_toggle'); a.addEventListener('click', ()=>{ $all(b).forEach(c =>{ c.classList.toggle('efy_hide_i')})})});

/*Alerts*/ $add('div', {efy_alerts: '', class: 'efy_sidebar_width'}, [], $body, 'afterbegin'); $body.addEventListener("pointerup", ()=>{ if (event.target.matches('[efy_alert]')){ let a = event.target, b = a.classList[0], i = $('.efy_quick_notify i'), icon_fn =()=>{ if ($all('.efy_quick_notify_content [efy_alert]').length > 0){ i.setAttribute('efy_icon', 'notify_active')} else {i.setAttribute('efy_icon', 'notify')}};
    a.classList.add('efy_anim_remove'); $wait($css_prop('--efy_anim_speed') * 0.05, ()=>{ a.remove(); try { $(`.efy_quick_notify_content [efy_alert].${b}`).remove()} catch {/**/} icon_fn() })
}});

/*Online Status*/ for (let a = ['offline', 'online'], i = 0; i <a.length; i++){
    /*Fix This, it loads translations*/ let style = 'opacity: 0; pointer-events: none; position: absolute'; $add('i', {efy_lang: `${a[i]}_notify`, style: style}, [], $('.efy_sidebar')); $add('i', {efy_lang: `${a[i]}_notify_text`, style: style}, [], $('.efy_sidebar'));
    $event(window, a[i], () =>{ if (efy.notify_offline !== false){ $notify(5, `${a[i]}_notify`, `${a[i]}_notify_text`, 'lang') }})
}

/*Lang Pseudo Trigger (Temporary)*/ $add('i', {efy_lang: 'no_notifications', style: 'opacity: 0; pointer-events: none; position: absolute'}, [], $('.efy_sidebar'));
/*Prevent Default*/ $all('input[type="range"], .plus-btn, .minus-btn').forEach(a => a.addEventListener('contextmenu', ()=> event.preventDefault()));

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

    /*Alpha*/ for (let a =['"Max Width"'], i=0; i<a.length; i++){ $add('mark', {efy_lang: 'alpha'}, [], $(`[efy_content=size] [efy_range_text*=${a[i]}] .efy_range_text_p`), 'afterend')}
    /*No Notifications*/ $add('style', {}, [`.efy_quick_notify_content:empty:before {content: '${efy_lang.no_notifications}'}`], $head);
    /*Extra Modules*/ for (let a =['extra'], i=0; i<a.length; i++){
        if ($efy_module(`efy_${a[i]}`)){ $add('link', {href: `${efy.folder}/${a[i]}.css`, rel: 'stylesheet'}, [], $head);
            if ($css_prop('--efy_protocol') == 'http'){ $add('script', {src: `${efy.folder}/${a[i]}.js`, type: 'module'}, [], $head)}
            else { $add('script', {src: `${efy.folder}/${a[i]}_local.js`}, [], $head)}
    }}
}
    // $notify(3, 'EFY Load', `${performance.now() - efy_performance}ms`);
}