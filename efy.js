export let efy_version = '23.06.28 Beta', $ = document.querySelector.bind(document), $all = document.querySelectorAll.bind(document), $create = document.createElement.bind(document), $head, $body, $root, $efy_module, efy = {}, efy_lang = {}, efy_audio = {volume: 1}, $save =()=>{},
/*Add: Selector, optional: {Attributes}, [Text, Children], Parent, Position*/ $add = (a, b = {}, c = [], d = document.body, e = 'beforeend')=>{ const f = document.createElement(a); for (const [g, h] of Object.entries(b)){ f.setAttribute(g, h)}; c.forEach(i =>{ if (typeof i === 'string'){ f.textContent += i} else {f.appendChild(i)}}); d.insertAdjacentElement(e, f); return f}
/*Append: Where, Element*/ $append = (a,b) =>{ a.appendChild(b)},
/*Insert: Where, Position, Element*/ $insert = (a,b,c) =>{ a.insertAdjacentElement(b,c)}, $insert_text = (a,b,c) =>{ a.insertAdjacentText(b,c)},
/*Get CSS Property*/ $css_prop = (a) =>{ return getComputedStyle($(':root')).getPropertyValue(a).replaceAll(' ','')},
/*Text*/ $text = (a,b)=>{a.textContent = b},
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
/*Audio Play*/ $audio_play = async (a)=>{ a.pause(); a.currentTime = 0; a.play()},
/*Wait: Seconds, FN*/ $wait =(a,b)=> setTimeout(b,a*1000),
/*Custom QuerySelectors*/ $$ =(a,b)=> a.querySelector(b), $$all =(a,b)=> a.querySelectorAll(b),
/*Notify*/ $notify =(a,b,c,lang)=>{ let d = 'alert' + Date.now(); if (lang == 'lang'){ b = efy_lang[b]; c = efy_lang[c] }
    ['[efy_alerts]', '.efy_quick_notify_content'].map(e=>{
        $add('div', {efy_alert: '', class: d}, [$add('div', {}, [$add('h6', {}, [b]), $add('p', {}, [c])]), $add('button', {efy_btn_square: ''}, [$add('i', {efy_icon: 'remove'})])], $(e));
    });
$wait(a, ()=>{ try { $$($('[efy_alerts]'), '.' + d).remove()} catch {} })},
/*Language*/ $efy_lang_start =()=>{ $all('[efy_lang]').forEach(a=>{ let b = a.getAttribute('efy_lang'); efy_lang[b] = getComputedStyle($('[efy_lang]')).getPropertyValue(`--${b}`);
if ($$(a, '[efy_icon]') !== null){ $insert_text(a, 'beforeend', efy_lang[b])} else {$insert_text(a, 'afterbegin', efy_lang[b])} a.removeAttribute('efy_lang')})},
/*Convert seconds to (hh:mm:ss)*/ $sec_time =(a)=>{ const h = Math.floor(a / 3600).toString().padStart(2,'0'), m = Math.floor(a % 3600 / 60).toString().padStart(2,'0'), s = Math.floor(a % 60).toString().padStart(2,'0'); return `${h}:${m}:${s}`};

/*After Page Loads*/ window.onload = async ()=>{ $root = $(":root"), $head = document.head, $body = document.body; $efy_module = (a) =>{ let b = $css_prop('--efy_modules').split(',').includes(a) ? true : false; return b}; let a, b;

/*Check LocalStorage*/ try { if (localStorage.efy){ efy = JSON.parse(localStorage.efy)} $save =()=>{localStorage.efy = JSON.stringify(efy)}}
catch {$wait(2, ()=>{ $add('div', {class: 'efy_no_ls', efy_card: ''}, [$add('h6', {efy_lang: 'localstorage_off'}), $add('p', {efy_lang: 'localstorage_off_text'})], $('.efy_sidebar > [efy_about]'), 'afterend')})}

/*Translations*/ efy.folder = $css_prop('--efy_folder'); if (efy.lang_code == undefined){ efy.lang_code = $css_prop('--efy_lang_code')}
$add('link', {href: `${efy.folder}/lang/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: ''}, [], $head);
$add('link', {href: `${$css_prop('--efy_lang_folder')}/${efy.lang_code}.css`, rel: 'stylesheet', efy_lang: '', class: 'efy_lang_app_file'}, [], $head);

/*Sidebar Modules*/ $add('div', {id: 'efy_sidebar', class: 'efy_sidebar', efy_search: 'details:not(.efy_quick_shortcuts, [efy_logo]), .efy_sidebar [efy_tabs] > *'}, [ $add('div', {efy_about: ''}, [ $add('div', {class: 'efy_flex'}, [
    $add('button', {class: 'efy_about', efy_toggle: '.efy_about_div', efy_logo: ''}, [ $add('p', {}, ['EFY']), $add('p', {}, [' UI']) ]),
    $add('button', {class: 'efy_quick_notify efy_square_btn', efy_toggle: '.efy_quick_notify_content'}, [$add('i', {efy_icon: 'notify'})]),
    $add('button', {class: 'efy_quick_search efy_square_btn', efy_toggle: '#efy_sidebar [efy_search_input]'}, [$add('i', {efy_icon: 'search'})]),
    $add('button', {id: 'efy_quick_toggle', efy_toggle: '#efy_quick', class: 'efy_square_btn', title: 'Quick shortcuts'}, [$add('i', {efy_icon: 'star'})])
]),
    $add('button', {efy_sidebar_btn: 'close', class: 'efy_square_btn'}, [$add('i',{efy_icon: 'remove'})])
]), $add('div', {id: 'efy_modules'})
], $body); $add('div', {efy_sidebar_btn: 'absolute'}, [], $body); $add('video', {class: 'efy_3d_back', autoplay: '', loop: '', muted: '', playsinline: ''}, [], $body);

/*Buttons*/ $add('div', {efy_card: '', class: 'efy_about_div efy_hide_i'}, [
    $add('mark', {efy_lang: 'version'}, [`: ${efy_version}`]),
    $add('p', {efy_lang: 'sidebar_about_text'}), $add('div', {class: 'efy_flex'}, [
    $add('a', {href: 'https://efy.ooo', role: 'button', efy_lang: 'website'}),
    $add('a', {href: 'https://matrix.to/#/#efy_ui:matrix.org', role: 'button', efy_lang: 'matrix'}),
    $add('a', {href: 'https://github.com/dragos-efy/efy', role: 'button', efy_lang: 'github'}),
    $add('a', {href: 'https://translate.codeberg.org/projects/efy', role: 'button', efy_lang: 'translations'}),
    $add('a', {href: 'https://liberapay.com/efy', role: 'button', efy_lang: 'donate'})
]) ], $('[efy_about]'), 'afterend');


/*Quick Shortcuts*/ if ($efy_module('efy_quick')){ let a = $('[efy_about]');
    $add('input', {type: 'text', efy_search_input: '', class: 'efy_hide_i', placeholder: 'Search through menu...'}, [], a, 'afterend');
    $add('div', {class: 'efy_quick_notify_content efy_hide_i', efy_card: ''}, [], a, 'afterend');

$add('div', {id: 'efy_quick', class: 'efy_quick_shortcuts efy_hide_i', efy_card: ''}, [
    $add('div', {class: 'efy_quick_buttons efy_flex'}), $add('div', {efy_clock: ''}), $add('div', {efy_timer: 'efy_ui0'})
], a, 'afterend');
for (let a = ['reload', 'fullscreen', 'back', 'forward'], b = ['reload', 'fullscreen', 'chevron', 'chevron'], i = 0; i < a.length; i++){
    $add('button', {'class': `efy_quick_${a[i]} efy_square_btn`}, [$add('i', {efy_icon: b[i]})], $('.efy_quick_buttons'))
}

$(".efy_quick_reload").addEventListener('click', ()=> location.reload());
$(".efy_quick_fullscreen").addEventListener('click', ()=>{ if (document.fullscreenElement){ document.exitFullscreen()} else {document.documentElement.requestFullscreen()}});
for (let a = ['back', 'forward'], b = ['-1', '1'], i = 0; i<a.length; i++){ $(`.efy_quick_${a[i]}`).addEventListener('click', ()=> window.history.go(b[i]))}
}

/*Theme*/ if ($efy_module('efy_mode')){ $add('details', {id: 'efy_sbtheme', efy_select: ''}, [$add('summary', {efy_lang: 'theme'}, [ $add('i', {efy_icon: 'star'}) ]), $add('div', {efy_tabs: 'efyui_0'})], $('.efy_sidebar'));

/*Tabs*/ for (let a = ['mode', 'colors', 'size', 'menu'], b = ['mode', 'colors', 'size', 'menu'], c = $('[efy_tabs=efyui_0]'), i = 0; i < a.length; i++){ $add('button', {efy_tab: a[i], efy_lang: `${b[i]}` }, [], c)}
for (let a = ['mode', 'colors', 'size', 'menu'], c = $('[efy_tabs=efyui_0]'), i = 0; i < a.length; i++){ $add('div', {efy_content: a[i], efy_select: '', id: `efy_${a[i]}`}, [], c) }
/*Active*/ for (let a = ['[efy_tab=mode]', '[efy_content=mode]'], b = '[efy_tabs=efyui_0] > ', i = 0; i < a.length; i++){$(b + a[i]).setAttribute('efy_active', '')}

/*Colors*/ b = $('#efy_sbtheme [efy_content=colors]');
$add('div', {id: 'efy_pickers'}, [], b); let ba = $$(b, '#efy_pickers');

    if (efy.gradient){ $root.style.setProperty(`--efy_color`, efy.gradient); $root.style.setProperty(`--efy_color_trans`, efy.gradient_trans);
        for (let i=1; i < efy.color_nr + 1; i++){ let j = i, x = efy[`color${j}`], y = x.split(' '), h =  y[0], s = y[1].replace('%', ''), l = y[2].replace('%', ''); $root.style.setProperty(`--efy_color1_var`, efy.color1); $root.style.setProperty(`--efy_color2_var`, efy.color2);
        $add('div', {efy_color: `${j},${x},efy_color${j}`}, [], ba);

        $ready(`[efy_color*="efy_color${j}"] [efy_range_text=hue] p`, ()=>{ let ca = $(`[efy_color*="efy_color${j}"]`); $$(ca, '.hue').value = h; $$(ca, `.sat`).value = s; $$(ca, `.lgt`).value = l; $$(ca, `.efy_color_picker_hsl`).value = `${h} ${s}% ${l}%`;
        $$(ca, '[efy_range_text=hue] p').textContent = ': ' + h; $$(ca, '[efy_range_text=saturation] p').textContent = ': ' + s; $$(ca, '[efy_range_text=brightness] p').textContent = ': ' + l;
                let style = [`linear-gradient(to right, hsl(0 0% 50%), hsl(${h} 100% ${l}%))`, `linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`]; [$$(ca, `.sat`), $$(ca, `.lgt`)].map((b,k)=>{ b.style.background = style[k] });
            });
        }
    }
    else {
    /*Get Colors from css*/ a = getComputedStyle($(':root')).getPropertyValue('--efy_color').replaceAll(', ',',').replaceAll(' ,',','); if (a.slice(0,1) == ' '){a = a.replace(' ','')} efy.gradient = efy.gradient_trans = '';

    a.split(',').map((a,i)=>{ i++; efy[`color${i}`] = a; $add('div', {efy_color: `${i},${a},efy_color${i}`}, [], ba);
        /*Convert to Gradient*/ efy.gradient += `, hsl(${a})`; efy.gradient_trans += `, hsla(${a} / .3)`;
        efy.color_nr = i;

        let j = i, x = a, y = x.split(' '), h =  y[0], s = y[1].replace('%', ''), l = y[2].replace('%', '');

        $ready(`[efy_color*="efy_color${j}"] [efy_range_text=hue] p`, ()=>{ let ca = $(`[efy_color*="efy_color${j}"]`); $$(ca, '.hue').value = h; $$(ca, `.sat`).value = s; $$(ca, `.lgt`).value = l; $$(ca, `.efy_color_picker_hsl`).value = `${h} ${s}% ${l}%`;
        $$(ca, '[efy_range_text=hue] p').textContent = ': ' + h; $$(ca, '[efy_range_text=saturation] p').textContent = ': ' + s; $$(ca, '[efy_range_text=brightness] p').textContent = ': ' + l;
                let style = [`linear-gradient(to right, hsl(0 0% 50%), hsl(${h} 100% ${l}%))`, `linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`]; [$$(ca, `.sat`), $$(ca, `.lgt`)].map((b,k)=>{ b.style.background = style[k] });
        });

    });
    /*Set CSS*/ ['', '_trans'].map(a=>{ let b = `linear-gradient(var(--efy_color_angle), ${efy[`gradient${a}`].replace(', h', 'h')})`; efy[`gradient${a}`] = b; $root.style.setProperty(`--efy_color${a}`, b) });
    $root.style.setProperty(`--efy_color1_var`, efy.color1); $root.style.setProperty(`--efy_color2_var`, efy.color2);
    }

/*Add / RM Buttons*/ $add('button', {class: 'efy_color_add'}, [$add('i', {efy_icon: 'plus'})], ba); $add('button', {class: 'efy_color_remove'}, [$add('i', {efy_icon: 'remove'})], ba);

/*Var*/ let c = $$(ba, '.efy_color_add'), d = $$(ba, '.efy_color_remove');let ec = $$all(ba, '[efy_color]').length;
/*Disabled*/ if (ec == 2){d.setAttribute('disabled','')} else if (ec == 12){c.setAttribute('disabled','')}

$$(ba, '.efy_color_add').addEventListener('click', ()=>{ let a = $$all(ba, '[efy_color]').length + 1; let c = $$(ba, '.efy_color_add'), d = $$(ba, '.efy_color_remove');
    if (a < 13){ $add('div', {efy_color: `${a},${efy[`color${a-1}`]},efy_color${a}`}, c, 'beforebegin');
    /*Update*/ let x = efy[`color${a}`] = efy[`color${a-1}`], hsl = [`hsl(${x})`, `hsla(${x} / .3)`]; efy.color_nr++;
    ['', '_trans'].map((a,i)=>{ let b = efy[`gradient${a}`].replace('))', `), ${hsl[i]})`); efy[`gradient${a}`] = b; $root.style.setProperty(`--efy_color${a}`, b) }); $save();

    c.removeAttribute('disabled'); d.removeAttribute('disabled'); if (a == 12){c.setAttribute('disabled','')}
        /*trigger efy_lang*/ $add('div', {efy_lang: '0', class: 'efy_temp'}, [], $body); $wait(.3, ()=>{ $('.efy_temp').remove()});

     let j = a, y = efy[`color${a-1}`].split(' '), h =  y[0], s = y[1].replace('%', ''), l = y[2].replace('%', '');

        $ready(`[efy_color*="efy_color${j}"] [efy_range_text=hue] p`, ()=>{ let ca = $(`[efy_color*="efy_color${j}"]`); $$(ca, '.hue').value = h; $$(ca, `.sat`).value = s; $$(ca, `.lgt`).value = l; $$(ca, `.efy_color_picker_hsl`).value = `${h} ${s}% ${l}%`;
        $$(ca, '[efy_range_text=hue] p').textContent = ': ' + h; $$(ca, '[efy_range_text=saturation] p').textContent = ': ' + s; $$(ca, '[efy_range_text=brightness] p').textContent = ': ' + l;
                let style = [`linear-gradient(to right, hsl(0 0% 50%), hsl(${h} 100% ${l}%))`, `linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`]; [$$(ca, `.sat`), $$(ca, `.lgt`)].map((b,k)=>{ b.style.background = style[k] });
        });
    }
    else {c.setAttribute('disabled',''); d.removeAttribute('disabled')}
});

$$(ba, '.efy_color_remove').addEventListener('click', ()=>{ let a = $$all(ba, '[efy_color]').length; let c = $$(ba, '.efy_color_add'), d = $$(ba, '.efy_color_remove');
    if(a > 2){ $$(ba, `[efy_color*="efy_color${a}"]`).remove(); c.removeAttribute('disabled'); d.removeAttribute('disabled');

        /*Update*/ let x = efy[`color${a}`], hsl = [`hsl(${x})`, `hsla(${x} / .3)`];
        ['', '_trans'].map((a,i)=>{ efy[`gradient${a}`] = efy[`gradient${a}`].replace(`), ${hsl[i]})`, '))'); $root.style.setProperty(`--efy_color${a}`, efy[`gradient${a}`]) });
        efy.color_nr--; delete efy[`color${a}`];$save();

    }
    else {d.setAttribute('disabled','')}
    if (a == 3){d.setAttribute('disabled','')}
});


/*Angle*/ $add('div', {efy_lang: 'angle', efy_range_text: 'Angle'}, [ $add('input', {class: 'efy_color_angle_input', type: 'range', min: '0', max: '360', value: '165', step: '1'})], b);

$add('details', {efy_help: ''}, [$add('summary', {efy_lang: 'custom_colors'}), $add('div', {efy_lang: 'custom_colors_help'})], b);


c = ['text', 'bgcol', 'bordercol']; ['text,0 100% 50%,efy_color_text', 'background,0 0% 0%,efy_color_bgcol', 'border, 0 0% 50%,efy_color_bordercol'].map((a,i)=>{
    $add('div', {efy_color: a+',lang'}, [ $add('input', {type: 'checkbox', name: `efy_${c[i]}_color_status`, id: `efy_${c[i]}_status`}), $add('label', {for: `efy_${c[i]}_status`}) ], b);
});

$add('br', {}, [], $$(b, '[efy_color*=efy_color_text]'), 'afterend'); $add('br', {}, [], $$(b, '[efy_color*=efy_color_bgcol]'), 'afterend');


for (let x = ['1', '2', '_text', '_bgcol', '_bordercol'], y = ['color1', 'color2', 'text', 'bgcol', 'bordercol'], i=0; i < x.length; i++){
    if (efy[y[i]] !== undefined){ let z = efy[y[i]]; $root.style.setProperty(`--efy_color${x[i]}_var`, z) }}





/*HSL to / from RGB & HEX*/ const hsl2rgb=((t,i,a)=>{a/=100;const h=i=>(i+t/30)%12,n=(i/=100)*Math.min(a,1-a),e=t=>a-n*Math.max(-1,Math.min(h(t)-3,Math.min(9-h(t),1)));return (255*e(0)).toFixed(0)+' '+(255*e(8)).toFixed(0)+' '+(255*e(4)).toFixed(0)}),
hsl2hex=((t,n,a)=>{a/=100;const r=n*Math.min(a,1-a)/100,h=n=>{const h=(n+t/30)%12,o=a-r*Math.max(Math.min(h-3,9-h,1),-1);return Math.round(255*o).toString(16).padStart(2,"0")};return`${h(0)}${h(8)}${h(4)}`}),
hex2hsl=(a=>{let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a),[t,r,s]=[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)];t/=255,r/=255,s/=255;let h,n,d=Math.max(t,r,s),c=Math.min(t,r,s),l=(d+c)/2;if(d==c)h=n=0;else{let a=d-c;switch(n=l>.5?a/(2-d-c):a/(d+c),d){case t:h=(r-s)/a+(r<s?6:0);break;case r:h=(s-t)/a+2;break;case s:h=(t-r)/a+4}h/=6}return n*=100,n=Math.round(n),l*=100,l=Math.round(l),[h=Math.round(360*h),n,l]}),
rgb2hsl=(t=>{let[a,h,r]=[t[0]/255,t[1]/255,t[2]/255],n=Math.max(a,h,r),M=Math.min(a,h,r),u=(n+M)/2,d=0,o=0;return n!=M&&(d=u<.5?(n-M)/(n+M):(n-M)/(2-n-M),o=a==n?(h-r)/(n-M):h==n?2+(r-a)/(n-M):4+(a-h)/(n-M)),[u,d,o]=[100*u,100*d,60*o],o<0&&(o+=360),[Math.round(o),Math.round(d),Math.round(u)]});

/*Color Picker: text or lang, hsl, id, lang*/ $ready('[efy_color]', (a)=>{ let g = a.getAttribute('efy_color').replaceAll(', ', ',').split(','), h = '', j = g[0]; if (g[3] == 'lang'){ h = g[0]; j = ''};
    $add('button', {efy_color_preview: '', style: `background: hsl(${g[1]})`, efy_lang: h}, [j], a);
    $add('div', {efy_color_picker: '', class: 'efy_hide'}, [$add('div', {class: 'efy_cp_switch'}, [ $add('button', {class: 'efy_color_picker_switch'}, ['HSL']) ])], a);
    $event($$(a, '[efy_color_preview]'), 'click', ()=>{ $$(a, '[efy_color_picker]').classList.toggle('efy_hide'); a.toggleAttribute('efy_active')});

let cp = $$(a, '.efy_cp_switch'), c = ['hue', 'sat', 'lgt'], d = ['360', '100', '100'], e = ['0', '100', '50']; ['hue', 'saturation', 'brightness'].map((b,i)=>{
    $add('div', {efy_lang: b, efy_range_text: b}, [ $add('input', {class: c[i], type: 'range', step: '1', min: '0', max: d[i], value: e[i]}) ], cp, 'beforebegin')
});

let val = ['0 100 50', '255 0 0', 'ff0000'], min = [13,5,3], max = [13,11,6], hide = ['', 'efy_hide', 'efy_hide']; ['hsl', 'rgb', 'hex'].map((b,i)=>{
    $add('input', {class: `efy_color_picker_${b} ${hide[i]}`, type: 'text', value: val[i], minlength: min[i], maxlength: max[i]}, [], cp);
});

$add('div', {class: 'copy_btn'}, [
    $add('button', {class: 'efy_color_picker_copy', title: 'copy'}, [$add('i', {efy_icon: 'copy'})]),
    $add('button', {class: 'efy_color_picker_paste', title: 'paste'}, [$add('i', {efy_icon: 'paste'})])
], cp);

let efy_swc = 1, cs = $$(cp, '.efy_color_picker_switch');

$$(cp, '.efy_color_picker_copy').addEventListener('click', ()=>{ let b = cs.textContent.toLowerCase(); let d = $$(a,`.efy_color_picker_${b}`).value; navigator.clipboard.writeText(d); $notify(3, 'Copied to clipboard', d)});
$$(cp, '.efy_color_picker_paste').addEventListener('click', ()=>{ let b = cs.textContent.toLowerCase(), x = $$(a,`.efy_color_picker_${b}`);
    navigator.clipboard.readText().then(cb =>{ x.value = cb; x.dispatchEvent(new Event('input', { 'bubbles': true })) }).catch();
});

cs.addEventListener('click', ()=>{ if (efy_swc == 1){ $text(cs, 'RGB')} else if (efy_swc == 2){ $text(cs, 'HEX')} else if (efy_swc == 3){efy_swc = 0; $text(cs, 'HSL')} efy_swc++;
    $$all(cp, 'input').forEach(a=> a.classList.add('efy_hide')); $$(cp, `input:nth-of-type(${efy_swc})`).classList.remove('efy_hide');
});

    a.addEventListener('input', (d)=>{ let [h,s,l] = [$$(a, '.hue').value, $$(a, '.sat').value, $$(a, '.lgt').value], hsl = `${h} ${s}% ${l}%`, rgb = hsl2rgb(h,s,l), hex = hsl2hex(h,s,l);

    if (d.target.classList.contains('efy_color_picker_hsl')){ let c = $$(a, '.efy_color_picker_hsl').value.split(' '); [h,s,l] = [c[0], c[1].replace('%', ''), c[2].replace('%', '')]}
    else if (d.target.classList.contains('efy_color_picker_rgb')){ let c = $$(a, '.efy_color_picker_rgb').value.split(' '), e = rgb2hsl(c); [h,s,l] = [e[0], e[1], e[2]]}
    else if (d.target.classList.contains('efy_color_picker_hex')){ let c = '#' + $$(a, '.efy_color_picker_hex').value; try {let e = hex2hsl(c); [h,s,l] = [e[0], e[1], e[2]] } catch {/**/}}
    else { let cvt = [hsl,rgb,hex]; ['hsl', 'rgb', 'hex'].map((b,i)=>{$$(a,`.efy_color_picker_${b}`).value = cvt[i]})}
    hsl = `${h} ${s}% ${l}%`; [$$(a, '.hue').value, $$(a, '.sat').value, $$(a, '.lgt').value] = [h,s,l];
    let style = [`hsl(${hsl})`, `linear-gradient(to right, hsl(0 0% 50%), hsl(${h} 100% ${l}%))`, `linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`]; ['[efy_color_preview]', '.sat', '.lgt'].map((b,i)=>{$$(a,b).style.background = style[i] });

    efy[`color${$$(a,'[efy_color_preview]').textContent}`] = hsl;

    let y = ['text', 'bgcol', 'bordercol']; ['_text', '_bgcol', '_bordercol'].map((x,i)=>{ if (a.getAttribute('efy_color').includes(`color${x}`)){ $root.style.setProperty(`--efy_color${x}_var`, hsl); efy[y[i]] = hsl; $save() }});

    /*Reset gradient*/ let x  = {y: '', y_trans: ''};
    /*Convert to Gradient*/ for (let i=1; i < efy.color_nr + 1; i++){ x.y += `, hsl(${efy[`color${i}`]})`; x.y_trans += `, hsla(${efy[`color${i}`]} / .3)`}

    if (a.getAttribute('efy_color').includes(`color`)){
        /*Set CSS*/ ['', '_trans'].map(a=>{ efy[`gradient${a}`] = `linear-gradient(var(--efy_color_angle), ${x[`y${a}`].replace(', h', 'h')})`; $root.style.setProperty(`--efy_color${a}`, efy[`gradient${a}`]) });
        $save()
    }
    $root.style.setProperty(`--efy_color1_var`, efy.color1); $root.style.setProperty(`--efy_color2_var`, efy.color2);
    });

});


/*Mode*/ for (let a = ['default', 'light_light', 'light_sepia', 'dark_dark', 'dark_nord', 'dark_black', 'light_trans', 'dark_trans'], b = ['default', 'light', 'sepia', 'dark', 'nord', 'black', 'light', 'dark'], c = $('#efy_sbtheme [efy_content=mode]'), i = 0; i < a.length; i++){ $add('input', {type: 'radio', name: 'efy_mode', id: `efy_mode_${a[i]}`}, [], c); $add('label', {for: `efy_mode_${a[i]}`, efy_lang: b[i]}, [], c) }

$add('details', {efy_help: ''}, [$add('summary', {efy_lang: 'transparency'}), $add('div', {efy_lang: 'sidebar_transparency_help'})], $('#efy_mode_light_trans'), 'beforebegin');
$add('div', {class: 'trans_window_div'}, [
    $add('input', {type: 'checkbox', name: 'trans_window', id: `trans_window`}), $add('label', {for: `trans_window`, efy_lang: 'window'})
], $('[for="efy_mode_dark_trans"]'), 'afterend')

/*Images*/ $add('div', {id: 'efy_trans_images'}, [
    $add('details', {efy_help: ''}, [$add('summary', {efy_lang: 'images'}), $add('div', {efy_lang: 'sidebar_images_warning_help'})]),
    $add('label', {efy_upload: 'idb_addimg, image/*'}),
    $add('button', {class: 'efy_idb_reset', efy_lang: 'reset'}, [$add('i', {efy_icon: 'reload'})]),
    $add('div', {class: 'efy_img_previews'})
], $('#efy_sbtheme [efy_content=mode]'));

/*Mode*/ if (efy.mode){ a = efy.mode; $root.setAttribute('efy_mode', a); $('#efy_mode_'+a).setAttribute('checked', '')}
else {$root.setAttribute('efy_mode', 'default'); $('#efy_mode_default').setAttribute('checked', '')}
$all("[name=efy_mode]").forEach(x => { let y = x.id.replace('efy_mode_', ''); x.onclick =()=>{ $root.setAttribute('efy_mode', y); efy.mode = y; $save() }});

/*Transparent Window*/ if (efy.trans_window){ a = efy.trans_window; $root.classList.add('trans_window'); $('#trans_window').setAttribute('checked', '')}
$event($("#trans_window"), 'change', ()=>{ $root.classList.toggle('trans_window'); efy.trans_window = $("#trans_window").checked; $save() });

/*Radius & Gap*/ a = $('#efy_sbtheme [efy_content=size]'); $add('div', {efy_lang: 'radius', efy_range_text: 'Radius'}, [ $add('input', {class: 'efy_radius_input', type: 'range', min: '0', max: '25', value: '12', step: '1'})], a);
$add('div', {efy_lang: 'border', efy_range_text: 'Border'}, [ $add('input', {class: 'efy_border_size_input', type: 'range', min: '0', max: '8', value: '1.5', step: '0.1'})], a);
$add('div', {efy_lang: 'gap', efy_range_text: 'Gap alpha'}, [ $add('input', {class: 'efy_gap_input', type: 'range', min: '0', max: '30', value: '15', step: '1'})], a);
$add('div', {efy_lang: 'max_width', efy_range_text: 'Max Width alpha'}, [ $add('div', {class: 'efy_max_width_div'}, [
    $add('input', {class: 'efy_maxwidth_input', type: 'number', min: '500', max: '5000', value: '1200', step: '1'}), $add('select', {}, [$add('option', {value: 'rem'}, ['REM']), $add('option', {value: '%'}, ['%'])] )
]) ], a);

/*Radius, Gap & Color Angle*/ for (let a = ['radius', 'border_size', 'gap', 'color_angle'], e = ['rem', 'rem', 'rem', 'deg'], i = 0; i < a.length; i++){ let b = efy[a[i]], d = $(`.efy_${a[i]}_input`);
    if (efy[a[i]]){ d.value = b.replace(e[i], ''); $root.style.setProperty(`--efy_${a[i]}`, b)}
    d.oninput =()=>{ let c = d.value + e[i]; $root.style.setProperty(`--efy_${a[i]}`, c); efy[a[i]] = c; $save()}}

/*Max Width*/ let input2 = $('.efy_maxwidth_input'), y, zz = '[efy_range_text*="Max Width"] select', z = $(zz), width = efy.max_width;
if (width){ y = width.replace('rem', '').replace('%', ''); input2.value = y; $root.style.setProperty('--efy_body_width', width) } else {y = 1200}
input2.oninput =()=>{ let y = input2.value; z = $(zz).value; $root.style.setProperty('--efy_body_width', y + z); efy.max_width = y + z; $save()}
z.oninput =()=>{ if (z.value == '%'){ input2.setAttribute('min', '10'); input2.setAttribute('max', '100'); input2.setAttribute('value', '100')} if (z.value == 'rem'){ input2.setAttribute('min', '500'); input2.setAttribute('max', '5000'); input2.setAttribute('value', '1200')}
 let y = input2.value; z = $(zz).value; $root.style.setProperty('--efy_body_width', y + z); efy.max_width = y + z; $save()}


 /*EFY Sidebar Button*/ $add('details', {id: 'efy_btn_align', efy_select: ''}, [$add('summary', {efy_lang: 'button_position'}), $add('div', {})], $('#efy_sbtheme [efy_content=menu]'));
  $add('details', {id: 'efy_sidebar_align', efy_select: ''}, [$add('summary', {efy_lang: 'menu'}), $add('div', {})], $('#efy_sbtheme [efy_content=menu]'));

/*EFY Sidebar*/ for (let i = 0, a = ['left', 'right']; i < a.length; i++){ $add('input', {type: 'radio', name: 'efy_sidebar_align', id: `efy_sidebar_align_${a[i]}`}, [], $('#efy_sidebar_align > div'));
   $add('label', {name: 'efy_sidebar_align', for: `efy_sidebar_align_${a[i]}`, efy_lang: a[i]}, [], $('#efy_sidebar_align > div'))}

/*Align Sidebar*/ if (efy.sidebar_align){ a = efy.sidebar_align; $root.setAttribute('efy_sidebar', a); $('#efy_sidebar_align_'+a).setAttribute('checked', '')} else {$('#efy_sidebar_align_right').setAttribute('checked', '')}
$all("[name=efy_sidebar_align]").forEach(x => { let y = x.id.replace('efy_sidebar_align_', ''); x.onclick =()=>{ let z = ''; if ($root.getAttribute('efy_sidebar').includes('on')){z = 'on_'} $root.setAttribute('efy_sidebar', z+y); efy.sidebar_align = y; $save() }});

 /*Align & Toggle Button*/ for (let i = 0, a = ['left_top', 'middle_top', 'right_top', 'left_middle', 'middle_middle', 'right_middle', 'left_bottom', 'middle_bottom', 'right_bottom']; i < a.length; i++){ $add(['input'], {type: 'radio', name: 'efy_btn_align', id: a[i]}, [], $('#efy_btn_align > div'))} $('#middle_middle[name=efy_btn_align]').setAttribute('disabled','');

(()=>{ let sd_btn = $css_prop('--efy_sidebar_button').replaceAll(' ').split(','), a = 'efy_sidebar_btn_hide', c = $('#efy_btn_align'), d = 'beforeend', e = $('[efy_sidebar_btn*=absolute]');
    $add('input', {type: 'checkbox', name: a, id: a, checked: ''}, [], c, d); $add('label', {for: a, efy_lang: 'floating_button'}, [], c, d);
    if (!(efy.sidebar_btn_status) && (sd_btn.includes('off'))){ e.classList.add('efy_hide_i'); $('#'+a).removeAttribute('checked')}
    $('#'+a).addEventListener('click', ()=>{ if (e.classList.contains('efy_hide_i')){efy.sidebar_btn_status = 'on'; $save()} else {delete efy.sidebar_btn_status; $save()} e.classList.toggle('efy_hide_i') });

    a = $('[efy_sidebar_btn=absolute]'); b = 'efy_btn_align';

    if (efy.btn_align){ let c = efy.btn_align; $("#" + c).setAttribute('checked', ''); a.setAttribute(b, c)}
    else { let y = sd_btn[0]; $('#'+y).setAttribute('checked', ''); a.setAttribute(b, y)}
    $all("[name=efy_btn_align]").forEach(x => { x.onclick =()=>{ a.setAttribute(b, x.id); efy.btn_align = x.id; $save() }});

/*Toggle Sidebar*/ $body.addEventListener("click", ()=>{ if (event.target.matches('[efy_sidebar_btn]')){ a.classList.toggle('efy_hide'); if ($root.hasAttribute('efy_sidebar')){ let d = $root.getAttribute('efy_sidebar'), e = '';
    if ((d.includes('left')) || (d.includes('right'))){e = d.replace('on_', '')}
    if (d.includes('on')){ $root.setAttribute('efy_sidebar', e)} else {$root.setAttribute('efy_sidebar', 'on_'+e)}
    } else {$root.setAttribute('efy_sidebar', 'on')}
}})})()
}

/*Visual Filters*/ if ($efy_module('efy_filters')){ $add('details', {id: 'efy_vfilters', efy_select: ''}, [$add('summary', {efy_lang: 'visual_filters'}, [ $add('i', {efy_icon: 'dots'})]), $add('div', {efy_tabs: 'efyui_filters'})], $('.efy_sidebar'));

/*Tabs*/ for (let a = ['bg', 'content', 'trans'], b = ['background', 'content', 'trans_elements'], c = $('[efy_tabs=efyui_filters]'), i = 0; i < a.length; i++){ $add('button', {efy_tab: a[i], efy_lang: b[i]}, [], c) }
for (let a = ['bg', 'content', 'trans'], c = $('[efy_tabs=efyui_filters]'), i = 0; i < a.length; i++){ $add('form', {efy_content: a[i], efy_select: '', class: `efy_${a[i]}_filter`}, [], c) }
/*Active*/ for (let a = ['[efy_tab=bg]', '[efy_content=bg]'], b = '[efy_tabs=efyui_filters] >', i = 0; i < a.length; i++){ $(b +' '+ a[i]).setAttribute('efy_active', '')}

$all('[efy_tabs=efyui_filters] form').forEach(y =>{ let z = y.getAttribute('efy_content');
  $add('button', {type: 'reset', efy_lang: 'reset'}, [$add('i', {efy_icon: 'reload'})], y);
  for (let a = ['brightness', 'blur', 'saturation', 'contrast', 'hue', 'sepia', 'invert'], b = ['brightness', 'blur', 'saturate', 'contrast', 'hue-rotate', 'sepia', 'invert'], c = ['0', '0', '0', '0.1', '0', '0', '0'], d = ['3', '100', '3', '3', '360', '1', '1'], e = ['1', '0', '1', '1', '0', '0', '0'], f = ['0.05', '1', '0.05', '0.05', '1', '0.05', '0.05'], i = 0; i < a.length; i++){ $add('div', {efy_lang: a[i], efy_range_text: a[i]}, [ $add('input', {class: `efy_${z}_${b[i]}`, type: 'range', min: c[i], max: d[i], value: e[i], step: f[i]}) ], y)}
});
/*Trans Menu*/ a = $('[efy_tabs=efyui_filters] [efy_content=trans] [type=reset]'), b = 'efy_trans_filter_menu';
$add('label', {for: b, efy_lang: 'menu'}, [], a, 'afterend'); $add('input', {id: b, type: 'checkbox'}, [], a, 'afterend');

/*BG Size & Position*/ a = $('[efy_tabs=efyui_filters] [efy_content=bg] [type=reset]'), b = 'efy_bg_size', c = 'afterend';
$add('div', {efy_lang: 'size', efy_range_text: 'bg_size', class: 'efy_hide_i'}, [ $add('input', {class: `efy_bg_size`, type: 'range', min: 10, max: 3000, value: 300, step: 10}) ], a, c);
$add('div', {efy_lang: 'left', efy_range_text: 'bg_position_x', class: 'efy_hide_i'}, [ $add('input', {class: `bg_position_x`, type: 'range', min: -3000, max: 3000, value: 0, step: 1}) ], a, c);
$add('div', {efy_lang: 'up', efy_range_text: 'bg_position_y', class: 'efy_hide_i'}, [ $add('input', {class: `bg_position_y`, type: 'range', min: -3000, max: 3000, value: 0, step: 1}) ], a, c);

$add('label', {for: b, efy_lang: 'size'}, [], a, c); $add('input', {id: b, type: 'checkbox', efy_toggle: '[efy_range_text=bg_size], [efy_range_text=bg_position_x], [efy_range_text=bg_position_y]'}, [], a, c);

$event($('.'+b), 'input', (a)=>{ $root.style.setProperty(`--efy_bg_size`, `${a.target.value}rem`)})
$event($('.bg_position_x'), 'input', (a)=>{ $root.style.setProperty(`--efy_bg_x`, `${a.target.value}rem`)})
$event($('.bg_position_y'), 'input', (a)=>{ $root.style.setProperty(`--efy_bg_y`, `${a.target.value}rem`)})


for (let a = ['bg', 'content', 'trans'], j = ['[efy_mode*=trans] .efy_3d_back {filter: ', 'img, video:not(.efy_3d_back) {filter: ', ':is(details:not([efy_help]), select, input, textarea, blockquote, pre, article, table, audio, button, [efy_card], [efy_tabs] [efy_content], [efy_timer], [efy_clock], [efy_tabs] [efy_tab], [efy_color_picker], [efy_keyboard], [efy_sidebar_btn*=absolute], [efy_select] label, .efy_trans_filter):not(.efy_trans_filter_off, .efy_trans_filter_off *, .efy_sidebar *){backdrop-filter: '], k = ['!important}', '!important}', '!important; -webkit-backdrop-filter: '], l = ['', '', '!important}'], i = 0; i < a.length; i++){

$add('style', {class: `efy_css_${a[i]}_filter`}, [], $head); let css = $(`.efy_css_${a[i]}_filter`), f = {}, g = `${a[i]}_filter`, h = `${g}_css`,  fn = async ()=>{
    ['blur','brightness','saturate','contrast','hue-rotate','sepia','invert'].forEach(x => { f[x] = $(`.efy_${a[i]}_${x}`).value; if (x == 'blur'){ f[x] = f[x] + 'px' } else if (x == 'hue-rotate'){ f[x] = f[x] + 'deg' }});

    let string = ''; Object.keys(f).forEach(x =>{ string = string + ` ${x}(${f[x]})` });
    let y; if (a[i] == 'trans'){ let m = ''; if ($('#efy_trans_filter_menu').checked){ m = ', .efy_sidebar'; efy.trans_filter_menu = 'on'} y = j[i] + string + k[i] + string + l[i] + ' ::-webkit-progress-bar, ::-webkit-meter-bar' + m + '{backdrop-filter: ' + string + k[i] + string + l[i]} else {y= y = j[i] + string + k[i]; delete efy.trans_filter_menu}
    $text(css, y); efy[g] = JSON.stringify(f); efy[h] = y; $save() };

if (efy[g]){ $text(css, efy[h]); let f = JSON.parse(efy[g]); Object.keys(f).forEach(x => $(`.efy_${a[i]}_${x}`).value = f[x].replace('px','').replace('deg','') ) }
$all(`.efy_${a[i]}_filter input`).forEach(x =>{ x.addEventListener("input", fn )});
$all(`.efy_${a[i]}_filter [type=reset]`).forEach(x =>{ x.addEventListener("pointerup", ()=>{ delete efy[g]; delete efy[h]; $save(); $text(css, ''); x.click() }) })
}}

/*Backup*/ if ($efy_module('efy_backup')){ $add('details', {id: 'efy_backup'}, [$add('summary', {efy_lang: 'backup'}, [ $add('i', {efy_icon: 'arrow_down'})])], $('.efy_sidebar'));
for (let a = ['localstorage', 'idb'], b = ['settings', 'images'], c = '#efy_backup', i = 0; i < a.length; i++){
    $add('p', {efy_lang: `efy_${b[i]}`}, [], $(c));
    $add('div', {class: 'efy_backup_div', style: 'display: flex; flex-wrap: wrap; gap: var(--efy_gap0)'}, [
        $add('a', {href: '#', class: `efy_${a[i]}_export`, download: `efy_${b[i]}.json`, role: 'button', efy_lang: 'save'}, [ $add('i', {efy_icon: 'arrow_down'})]),
        $add('button', {type: 'reset', class: `efy_${a[i]}_reset`, efy_lang: 'reset'}, [$add('i', {efy_icon: 'reload'})]),
                $add('label', {efy_upload: `efy_${a[i]}_import, .json`})
], $(c))}}

/*Language*/ if ($efy_module('efy_language')){ let a = 'en id ro ru'.split(' '), b = 'English Indonesia Română Русский'.split(' '), a2 = 'de pl sv'.split(' '), b2 = 'Deutsch Polski Svenska'.split(' ');
    $add('details', {id: 'efy_language'}, [$add('summary', {efy_lang: 'efy_language'}, [ $add('i', {efy_icon: 'globe'})]), $add('div', {efy_select: ''})], $('.efy_sidebar'));

    let c = $('#efy_language > div'); a.map((a,i) =>{ let d = `efy_language_${a}`;
        $add('input', {type: 'radio', name: 'efy_language', id: d}, [], c); $add('label', {for: d}, [b[i]], c);
        $('#' + d).addEventListener('click', ()=>{ efy.lang_code = a; $save(); location.reload()})
    });
    $add('p', {efy_lang: 'unfinished'}, [], c); a2.map((a,i) =>{ let d = `efy_language_${a}`, b = b2[i];
        $add('input', {type: 'radio', name: 'efy_language', id: d}, [], c); $add('label', {for: d}, [b], c);
        $('#' + d).addEventListener('click', ()=>{ efy.lang_code = a; $save(); location.reload()})
    });
    if (efy.lang_code){ $(`#efy_language_${efy.lang_code}`).setAttribute('checked', '')} else {$('#efy_language_en').setAttribute('checked', '')}
}

/*Accessibility*/ if ($efy_module('efy_accessibility')){ $add('details', {id: 'efy_accessibility', efy_select: ''}, [$add('summary', {efy_lang: 'accessibility'}, [ $add('i', {efy_icon: 'accessibility'})]),
  $add('details', {id: 'efy_accessibility_outline', efy_select: ''}, [$add('summary', {efy_lang: 'outline'}), $add('p', {efy_lang: 'sidebar_outline_text'}), $add('input', {id: 'efy_outline', type: 'checkbox', name: 'efy_accessibility'}), $add('label', {for: 'efy_outline', efy_lang: 'focus_outline'})]),
  $add('details', {id: 'efy_accessibility_animations', efy_select: ''}, [$add('summary', {efy_lang: 'animations'}),
       $add('div', {efy_lang: 'speed', efy_range_text: 'Speed'}, [ $add('input', {class: 'efy_anim_speed', type: 'range', min: '0', max: '20', value: '1', step: '0.1'})])
  ]),
  $add('details', {id: 'efy_accessibility_text', efy_select: ''}, [$add('summary', {efy_lang: 'text_size'}), $add('form', {class: 'efy_text_accessibility'}, [
    $add('div', {efy_lang: 'zoom', efy_range_text: 'Zoom'}, [ $add('input', {class: 'efy_ui_zoom', type: 'range', min: '1', max: '2', value: '1', step: '0.01'})]),
    $add('div', {efy_lang: 'text_spacing', efy_range_text: 'Text Spacing'}, [ $add('input', {class: 'efy_text_spacing', type: 'range', min: '0', max: '15', value: '0', step: '1'})])
  ])]),
  $add('details', {id: 'efy_accessibility_cursor', efy_select: ''}, [$add('summary', {efy_lang: 'cursor'}), $add('div', {efy_lang: 'sidebar_cursor_text'})])
], $('.efy_sidebar'));

for (let a = ['efy_cursor_default', 'efy_cursor_custom', 'efy_cursor_none'], b = ['default', 'custom', 'hide_touchscreen'], c = $('#efy_accessibility_cursor'), i = 0; i < a.length; i++){
  $add('input', {type: 'radio', name: 'efy_accessibility_cursor', id: a[i]}, [], c);
  $add('label', {for: a[i], efy_lang: b[i]}, [], c);
} $('#efy_cursor_default').setAttribute('checked', '');

/*Cursor*/ $add('div', {efy_cursor: ''}, [], $body); /*Storage*/ if (efy.cursor == 'custom'){$root.setAttribute('efy_cursor_custom', ''); document.addEventListener('pointermove', cursor_fn); $('#efy_cursor_custom').setAttribute('checked','')} else if (efy.cursor == 'none'){$root.setAttribute('efy_cursor_none', ''); $('#efy_cursor_none').setAttribute('checked','')}

/*Custom*/ $('#efy_cursor_custom').addEventListener('change', ()=>{ if ($('#efy_cursor_custom').checked){$root.removeAttribute('efy_cursor_none'); $root.setAttribute('efy_cursor_custom', ''); document.addEventListener('pointermove', cursor_fn); efy.cursor = 'custom'; $save()}});

/*None*/ $('#efy_cursor_none').addEventListener('change', ()=>{ if ($('#efy_cursor_none').checked){$root.removeAttribute('efy_cursor_custom'); $root.setAttribute('efy_cursor_none',''); document.removeEventListener('pointermove', cursor_fn); efy.cursor = 'none'; $save()}});

/*Default*/ $('#efy_cursor_default').addEventListener('change', ()=>{ if ($('#efy_cursor_default').checked){$root.removeAttribute('efy_cursor_custom'); $root.removeAttribute('efy_cursor_none'); document.removeEventListener('pointermove', cursor_fn); delete efy.cursor; $save()}});


/*Animations*/ (()=>{ let a = 'efy_anim_status', b = '--efy_anim_state', x = $('.efy_anim_speed'); $add('style', {class: 'efy_anim_accessibility'}, [], $head);
    if (efy.anim_speed){ $text($('.efy_anim_accessibility'), `:root {--efy_anim_speed: ${efy.anim_speed}!important}`); x.value = efy.anim_speed;
        if (efy.anim_speed == '0'){$body.style.setProperty('--'+a, '0'); $body.style.setProperty(b, 'paused')}
    }
    x.addEventListener('change', ()=>{ efy.anim_speed = x.value; $save();
        if (efy.anim_speed == '0'){ $body.style.setProperty('--'+a, '0'); $body.style.setProperty(b, 'paused')}
        else {$body.style.setProperty('--'+a, '1'); $body.style.setProperty(b, 'running')}
        $text($('.efy_anim_accessibility'), `:root {--efy_anim_speed: ${x.value}!important}`)
}) })();

/* Text Size*/ $add('style', {class: 'efy_text_accessibility'}, [], $head); if (efy.text_zoom){ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${efy.text_zoom}px!important} html {letter-spacing: ${efy.text_spacing}px!important}`)
    $('.efy_ui_zoom').value = efy.text_zoom; $('.efy_text_spacing').value = efy.text_spacing;
}
$all('.efy_text_accessibility input').forEach(x => x.addEventListener('input', ()=>{ $text($('.efy_text_accessibility'), `:root {--efy_font_size: ${$('.efy_ui_zoom').value}px!important} html {letter-spacing: ${$('.efy_text_spacing').value}px!important}`); efy.text_zoom = $('.efy_ui_zoom').value; efy.text_spacing = $('.efy_text_spacing').value; $save() }));
}

/*Audio*/ if ($efy_module('efy_audio')){ $add('details', {efy_select: '', id: 'efy_audio'}, [
    $add('summary', {}, [ $add('i', {efy_icon: 'audio'}), $add('p', {efy_lang: 'audio_effects'}), $add('mark', {efy_lang: 'alpha'})]),
    $add('div', {efy_lang: 'efy_volume', efy_range_text: 'EFY Volume'}, [ $add('input', {class: 'efy_audio_volume', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}) ]),
    $add('div', {efy_lang: 'page_volume', efy_range_text: 'Page Volume'}, [ $add('input', {class: 'efy_audio_volume_page', type: 'range', min: '0', max: '1', value: '1', step: '0.01'}) ]),
    $add('p', {efy_lang: 'sidebar_audio_text'})
], $('.efy_sidebar'));
for (let a = ['status', 'click', 'hover'], b = ['active', 'click_tap', 'mouse_hover'], c = '#efy_audio > summary', d = 'beforebegin', i = 0; i < a.length; i++){
    $add('input', {type: 'checkbox', name: 'efy_audio', id:`efy_audio_${a[i]}`}, [], $(c), d); $add('label', {for: `efy_audio_${a[i]}`, efy_lang: b[i]}, [], $(c), d)
}}

/*Effects*/ if (efy.audio_status == 'on' ){
    efy_audio.folder = $css_prop('--efy_audio_folder'); ['pop','ok','ok2','ok3','ok4','hover','slide','squish','step','error','disabled'].forEach(x => { efy_audio[x] = new Audio(`${efy_audio.folder}/${x}.webm`); efy_audio[x].volume = efy_audio.volume }); $body.addEventListener("pointerdown", ()=>{ if (efy.audio_click == 'on'){
    for (let a = ['ok', 'ok' /*change*/, 'ok2', 'ok4', 'pop', 'slide', 'error', 'disabled', 'step', 'step' /*input*/], b = ['pointerup', 'change', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerup', 'pointerdown', 'input'], c = ['button:not([disabled], [type=submit], [type=reset], [efy_tab], [efy_sidebar_btn], [efy_toggle], [efy_keyboard] [efy_key], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button, [tabindex="-1"], [efy_audio_mute*=ok]), .video-grid>div', 'input, textarea', '.efy_img_previews [efy_bg_nr]', '[type=submit]', 'summary, [efy_toggle], select:not([multiple], [disabled]), [efy_tabs] [efy_tab], [efy_alert], [efy_alert] *, .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button', '[efy_sidebar_btn]', '[type=reset]', '[disabled]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled]), [efy_keyboard] [efy_key]', 'input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])'], i = 0; i < a.length; i++){ $body.addEventListener(b[i], ()=>{ if (event.target.matches(c[i])){ $audio_play(efy_audio[a[i]]) }})}}
    /*Hover*/ if (efy.audio_hover == "on"){ $all("summary, select:not([multiple], [disabled]), [type=submit], [type=reset], [efy_sidebar_btn], .video-grid>div").forEach(x => x.addEventListener("mouseenter",()=> $audio_play(efy_audio.hover) ))}
    /*Online Status*/ for (let a = ['online', 'offline'], b = ['ok', 'error'], i = 0; i < a.length; i++){ window.addEventListener(a[i], ()=>{ $audio_play(efy_audio[b[i]])})}
}, {once: true});

/*Volume*/ $all('.efy_audio_volume').forEach(a => a.oninput =()=>{ for (let b = Object.keys(efy_audio), i = 0; i < b.length; i++){ efy_audio[b[i]].volume = a.value }});
$all('.efy_audio_volume_page').forEach(a => a.oninput =()=>{ $all('audio, video').forEach(b => b.volume = a.value) })

} /*Sidebar Modules - End*/

/*Checkbox Toggles*/  'audio_status audio_click audio_hover outline text_status bgcol_status bordercol_status trans_filter_menu'.split(' ').forEach(x =>{ if (efy[x] == 'on'){ $(`#efy_${x}`).setAttribute('checked', '')} $(`#efy_${x}`).addEventListener('click', () =>{ if (efy[x] == 'on'){delete efy[x]} else {efy[x] = 'on'} $save() }) });

/*Focus Outline*/ if (efy.outline == 'on'){$root.setAttribute('efy_outline', '')}  $('#efy_outline').onchange =()=>{$root.toggleAttribute('efy_outline')}
/*Custom Text Color*/ if (efy.text_status == 'on'){$root.setAttribute('efy_color_text', '')}  $('#efy_text_status').onchange =()=>{$root.toggleAttribute('efy_color_text')}
/*Custom BG Color*/ if (efy.bgcol_status == 'on'){$root.setAttribute('efy_color_bgcol', '')}  $('#efy_bgcol_status').onchange =()=>{$root.toggleAttribute('efy_color_bgcol')}
/*Custom BG Color*/ if (efy.bordercol_status == 'on'){$root.setAttribute('efy_color_bordercol', '')}  $('#efy_bordercol_status').onchange =()=>{$root.toggleAttribute('efy_color_bordercol')}

/*Change bg image*/ $add('style', {class: 'efy_css_bgimg'}, [], $head); let efy_css_bgimg = $('.efy_css_bgimg');

/*Upload Input: id, accept, efy_lang or 'small', multiple, icon*/ $ready('[efy_upload]', (a)=>{ let b = a.getAttribute('efy_upload').replaceAll(' ','').split(','), c = 'plus';
    if (b[2]){ if (b[2] !== 'small'){ a.setAttribute('efy_lang', b[2]) } } else {a.setAttribute('efy_lang', 'add_file')}; if (b[4]){ c = b[4]}
    a.setAttribute('role', 'button'); $add('input', {type: 'file', id: b[0], accept: b[1]}, [], a); $add('i', {efy_icon: c}, [], a);
    if (b[3] == 'multiple'){ $all(`#${b[0]}`).forEach(a=>{ a.setAttribute('multiple', '')})}
});

/*Background image*/ let db; $wait(3, ()=>{ $('#idb_addimg').addEventListener('change', efy_add_bgimg) });
let request = indexedDB.open('efy');
request.onerror =()=> console.error("efy: Can't open db");
request.onsuccess = e => (db = e.target.result);
request.onupgradeneeded = e => { let db = e.target.result; db.createObjectStore('images', { keyPath: 'id', autoIncrement: true }); db.createObjectStore("settings", { keyPath: "id", autoIncrement: true }) };

let efy_add_bgimg = async (e)=>{ let read = new FileReader(); read.readAsDataURL(e.target.files[0]); read.onload = e => {
    let img = new Image(), a = 'efy_temp_canvas', thumbnail; img.onload = ()=>{
        /*Thumbnail*/ $add('canvas', {id: a}, [], $('.efy_img_previews')); let c = $(`#${a}`); c.width = (img.width / img.height) * 80; c.height = 80; c.getContext('2d').drawImage(img,0,0, c.width, c.height); thumbnail = $(`#${a}`).toDataURL('image/webp'); c.remove();
        /*Update*/ db.transaction(["images"], "readwrite").objectStore("images").add({image: e.target.result, thumbnail: thumbnail}).onerror = e =>{ console.error(e)};
    }; img.src = e.target.result;

(async ()=>{ let request2 = indexedDB.open('efy');
request2.onsuccess =()=>{ let efy_count_img2 = 0, transaction2 = request2.result.transaction(["images"], "readonly"), invoiceStore2 = transaction2.objectStore("images"), getCursorRequest2 = invoiceStore2.openCursor();
    getCursorRequest2.onerror =()=> console.error("efy: no db entries");
    getCursorRequest2.onsuccess = e => { let cursor2 = e.target.result;
        if (cursor2){ efy_count_img2++; cursor2.continue()}
        else { /*Set bgimg nr*/ efy.bg_nr = efy_count_img2; $save();
             /*Restore Background*/ $text(efy_css_bgimg, `.efy_3d_back {background: url(${read.result})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important}`);
            /*Add Preview*/ $add('button', {efy_bg_nr: efy_count_img2, style: `background: url(${thumbnail})`}, [], $('.efy_img_previews')); $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); $('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]').setAttribute('efy_active','');
             /*Preview Click*/ let y = $('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]'); y.onclick =()=>{ $text(efy_css_bgimg, `.efy_3d_back {background: url(${read.result})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important}`); efy.bg_nr = efy_count_img2; $save(); $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active','')};

             if (read.result.includes('video')){
                $('.efy_3d_back').setAttribute('src', read.result); $('.efy_3d_back').volume = 0;
                $event(document, 'visibilitychange', ()=>{ let a = $('.efy_3d_back'); if (document.hidden){ a.pause()} else {a.play()} });
                // console.log(read.result);
             }
        }
    }}
})()

}}

/*Count images*/ (async ()=>{ request = indexedDB.open('efy');
request.onsuccess =()=>{ let efy_count_img = 0, transaction = request.result.transaction(["images"], "readonly"), invoiceStore = transaction.objectStore("images"), getCursorRequest = invoiceStore.openCursor();
    getCursorRequest.onerror =()=> console.error("efy: no db entries");
    getCursorRequest.onsuccess = e => { let cursor = e.target.result;
        if (cursor){ efy_count_img++; let req = invoiceStore.get(efy_count_img);
            req.onsuccess = e => { let x = e.target.result.image, thumbnail = e.target.result.thumbnail;
                /*Preview Click*/ $add('button', {efy_bg_nr: efy_count_img, style: `background: url(${thumbnail})`, efy_audio_mute: 'ok'}, [], $('.efy_img_previews'));
                let y = $('.efy_img_previews [efy_bg_nr="'+efy_count_img+'"]'); y.onclick =()=>{
                    $text(efy_css_bgimg, `.efy_3d_back {background: url(${x})!important; background-size: var(--efy_bg_size)!important} html {background: var(--efy_text2)!important; background-size: cover!important}`);
                    efy.bg_nr = e.target.result.id; $save(); $all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active','')};
            }; cursor.continue();
        } else { /*Check bgimg number*/ let bgnr; if (efy.bg_nr){ bgnr = JSON.parse(efy.bg_nr)} else {bgnr = 1}
            /*Restore Background*/ if (efy_count_img > 0){ invoiceStore.get(bgnr).onsuccess = e => { let x = e.target.result.image, y = e.target.result.id; $text(efy_css_bgimg, `.efy_3d_back {background: url(${x})!important; background-size: var(--efy_bg_size)!important}`); $('.efy_img_previews [efy_bg_nr="'+y+'"]').setAttribute('efy_active','')}}
            /*Remove BG - Button*/ $all(".efy_idb_reset").forEach(z =>{ z.onclick =()=>{ indexedDB.deleteDatabase("efy"); location.reload()}});
}}}})();

/*Export IndexedDB*/ (async () => { try {
    let dbExists = await new Promise(resolve => { let request = window.indexedDB.open('efy');
        request.onupgradeneeded = e => { e.target.transaction.abort(); resolve(false)};
        request.onerror =()=> resolve(true); request.onsuccess =()=> resolve(true)});
    if (!dbExists){ throw new Error("efy: db doesn't exist")}

    let idbDatabase = await new Promise((resolve, reject) => { let request = window.indexedDB.open('efy');
        request.onerror =()=> reject("efy: Can't open db");
        request.onsuccess =()=> resolve(request.result)});
    let json = await new Promise((resolve, reject) => { let exportObject = {};
        if (idbDatabase.objectStoreNames.length === 0){ resolve(JSON.stringify(exportObject))}
        else { let transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readonly");
            transaction.addEventListener("error", reject);

            for (let storeName of idbDatabase.objectStoreNames){ let allObjects = [];
                transaction.objectStore(storeName).openCursor().addEventListener("success", event => { let cursor = event.target.result;
                    if (cursor){ /*Store data*/ allObjects.push(cursor.value); cursor.continue() }
                    else { /*Store completed*/ exportObject[storeName] = allObjects;
                        if (idbDatabase.objectStoreNames.length === Object.keys(exportObject).length){ resolve(JSON.stringify(exportObject))}} })}} });

    $(".efy_idb_export").addEventListener('click', async () => { $audio_play(efy_audio.ok4); let e = event.target; e.href = URL.createObjectURL(new Blob([json], {type: 'application/json'})); e.setAttribute('download', 'efy_images.json') });
} catch (err){ console.error(err) }})();

/*Import indexedDB*/ let efy_idb_import = $('#efy_idb_import');
efy_idb_import.addEventListener("change", () => { let file = efy_idb_import.files[0], read = new FileReader();
    read.onload = async ()=>{ let data = JSON.parse(read.result); $audio_play(efy_audio.ok3);
        let importIDB =(storename = "images", storename2 = "settings", arr = data["images"], arr2 = data["settings"])=>{
            return new Promise(resolve => { let r = window.indexedDB.open("efy");
                r.onupgradeneeded =()=>{ let idb = r.result; idb.createObjectStore(storename, { keyPath: "id", autoIncrement: true }); idb.createObjectStore(storename2, { keyPath: "id", autoIncrement: true })};
                r.onsuccess =()=>{ let idb = r.result, store = idb.transaction(storename, "readwrite").objectStore(storename), store2 = idb.transaction(storename2, "readwrite").objectStore(storename2);
                    for (let obj of arr){ store.put(obj)} for (let obj of arr2){ store2.put(obj)} resolve(idb);
                }; r.onerror = e => console.log(e.target.errorCode) })}
await importIDB(); $wait(3, ()=>{ location.reload()}) }; read.readAsText(file)});


/*Export Settings*/ $event($('.efy_localstorage_export'), 'click', ()=>{ let e = $('.efy_localstorage_export'), f = localStorage.efy.replaceAll('  ', '').replaceAll(',"', ',\n"').replaceAll('{"', '{\n"').replaceAll('"}', '"\n}');
    e.href = URL.createObjectURL(new Blob([f], {type: 'application/json'})); e.setAttribute('download', 'efy_settings.json'); audio_play(efy_audio.ok4) });

/*Import Settings*/ let efy_ls_import = $('#efy_localstorage_import'); $event(efy_ls_import, 'change', ()=>{ let file = efy_ls_import.files[0], read = new FileReader();
	read.onload =()=>{ localStorage.efy = read.result.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}'); location.reload()}; read.readAsText(file)});

/*Reset Settings*/ $all(".efy_localstorage_reset").forEach(x =>{ x.onclick =()=>{ Object.entries(localStorage).forEach(([k])=>{ if (k.includes('efy')){ localStorage.removeItem(k)}}); location.reload()}});


/*Tabs*/ $ready('[efy_tabs]', (a)=>{ let f = a.getAttribute('efy_tabs'), b = ':is([efy_tabs='+ f +'], [efy_tabs='+ f +'] > div) ', g = b+'[efy_tab]';
    $ready(g, (d)=>{ d.onclick = e => { let c = e.target.getAttribute('efy_tab');
        $all(b+':is([efy_tab], [efy_content])').forEach(d => d.removeAttribute('efy_active'));
        $all(`${b}:is([efy_tab="${c}"], [efy_content="${c}"])`).forEach(d => d.setAttribute('efy_active', ''));
}})});

/*Code*/ $ready('[efy_code]', (a)=>{ let b = a.getAttribute('efy_code').split(',');
    $add('div', {class: 'efy_bar'}, [
        $add('mark', {}, [b[0]]), $add('div', {}, [$add('button', {class: 'efy_code_trans'}, ['transparent']), $add('button', {class: 'efy_fs'}, ['fullscreen']), $add('button', {class: 'efy_copy'}, ['copy'])])
    ], a, 'afterbegin');
    $$(a,'.efy_fs').addEventListener('click', ()=>{ if (document.fullscreenElement){ document.exitFullscreen()} else {a.requestFullscreen()}});
    $$(a,'.efy_code_trans').addEventListener('click', ()=>{$body.classList.toggle('efy_code_trans_on')});
    $$(a,'.efy_copy').addEventListener('click', ()=>{ let c = a.innerText, d = c.substring(c.indexOf('copy') + 5); navigator.clipboard.writeText(d);
         $notify(5, 'Copied to clipboard', d);
    });
});

/*EFY Range Text*/ (async ()=>{ $ready('[efy_range_text]', (a)=>{ let c = $$(a, 'input');
    $add('p', {class: 'efy_range_text_p'}, [`: ${c.value}`], a, 'afterbegin');
    c.addEventListener('input', ()=>{ $text($$(a, '.efy_range_text_p'), `: ${event.target.value}`) });
}); $all('form[class*=efy], [efy_content=colors] [efy_color_picker]').forEach(x =>{ x.addEventListener('reset', ()=>{
        $$all(x, '[efy_range_text]').forEach(y =>{ $text($$(y, '.efy_range_text_p'), `: ${$$(y, 'input').value}`) })
})})})();


/*Number Input*/ $all('input[type="number"]').forEach(t =>{ let n = $add('div', {efy_number: ''}); t.parentNode.replaceChild(n,t); $append(n, t); let s, h, f, i = t, step;
i.hasAttribute("step") ? step = parseInt(i.getAttribute("step"),10) : step=1; i.hasAttribute("pattern")||i.setAttribute("pattern","[0-9]");
h = i.hasAttribute("min") ? parseInt(i.getAttribute("min"),10) : 0; s = i.hasAttribute("max") ? parseInt(i.getAttribute("max"),10) : 99999;
(new DOMParser).parseFromString(n,"text/html");

for (let a = ['plus', 'minus'], b = [step, -step], c, d = ['afterend','beforebegin'], e = ['+','-'], x = 0; x < a.length; x++){ let g =()=>{f = parseInt(i.value,10) + b[x], (f <= s) && (f >= h) && (i.value = f); i.dispatchEvent(new Event("click"))}, j = `.${a[x]}-btn`;
$add('button', {class: `${a[x]}-btn`, type: 'button'}, [e[x]], t, d[x]);
$$(n, j).addEventListener('pointerdown', ()=>{c = setInterval(g, 100)}); $$(n, j).addEventListener('click', g); i.addEventListener('change', g); $$(n, j).addEventListener('pointerleave', ()=> clearInterval(c))}
});

/*Clock & Timer*/ let efy_time_0 =(i)=>{ if (i < 10){i = '0' + i} return i}

/*Clock*/ setInterval(()=>{let t = new Date(), h = t.getHours(), m = t.getMinutes(); m = efy_time_0(m); $all('[efy_clock]').forEach(x =>{ $text(x, h+':'+m)}) }, 2000);

/*Timer: ID, Time, Reverse (optional)*/ $ready('[efy_timer]', (y) => { let tm = y.getAttribute('efy_timer').split(','), time = '00:00:00'; if (tm[1]  !== undefined){ time = $sec_time(tm[1])}
    $add('div', {efy_text: ''}, [time], y); $add('button', {efy_start: '', title: 'Start or Pause'}, [], y); $add('button', {efy_reset: '', title: 'Reset'}, [], y);

    let play = $$(y, '[efy_start]'), reset= $$(y, '[efy_reset]'), timer_text = $$(y, '[efy_text]'), interval, i = 0;
    const time_reset =()=>{clearInterval(interval); i = 0; if (tm[2] == 'reverse'){ $text(timer_text, $sec_time(tm[1]) )} else {$text(timer_text, "00:00:00")}; play.removeAttribute('efy_active')};

    $event(play, 'click', ()=>{ clearInterval(interval); play.toggleAttribute('efy_active'); if (play.hasAttribute('efy_active')){ interval = setInterval(()=>{
        /*Reverse*/ if (tm[2] == 'reverse'){ i++; $text(timer_text, $sec_time(tm[1] - i))}
        /*Normal*/ else { i++; $text(timer_text, $sec_time(i))}
        /*Reset & Notify*/ if (i == tm[1]){ $notify(3, 'done', 'time is up'); time_reset()}
    }, 1000)} else { clearInterval(interval) }});
    $event(reset, 'click', time_reset);
});

/*Search Filter */ $ready('[efy_search]', (sc)=>{ let a = sc, search = a.getAttribute('efy_search'), container = `#${a.id}[efy_search="${search}"]`, z = $(container +' [efy_search_input]');
z.addEventListener('keyup', ()=>{ let val = z.value.toLowerCase(); $all(container +' '+ search).forEach(x =>{ if (x.textContent.toLowerCase().includes(val) == 0){x.classList.add('efy_hide_i')} else {x.classList.remove('efy_hide_i')}})})});

/*EFY Toggle*/ $ready('[efy_toggle]', (a)=>{ let b = a.getAttribute('efy_toggle'); a.addEventListener('click', ()=>{ $all(b).forEach(c =>{ c.classList.toggle('efy_hide_i')})})});

/*Alerts*/ $add('div', {efy_alerts: ''}, [], $body, 'afterbegin'); $body.addEventListener("pointerup", ()=>{ if (event.target.matches('[efy_alert]')){ let a = event.target; a.classList.add('efy_anim_remove'); $wait($css_prop('--efy_anim_speed') * 0.05, ()=>{ a.remove() }) }});

/*Online Status*/ for (let a = ['offline', 'online'], i = 0; i <a.length; i++){
    /*Fix This, it loads translations*/ let style = 'opacity: 0; pointer-events: none; position: absolute'; $add('i', {efy_lang: `${a[i]}_notify`, style: style}, [], $('.efy_sidebar')); $add('i', {efy_lang: `${a[i]}_notify_text`, style: style}, [], $('.efy_sidebar'));
    window.addEventListener(a[i], () =>{ $notify(5, `${a[i]}_notify`, `${a[i]}_notify_text`, 'lang') })
}

/*Lang Pseudo Trigger (Temporary)*/ $add('i', {efy_lang: 'no_notifications', style: 'opacity: 0; pointer-events: none; position: absolute'}, [], $('.efy_sidebar'));
/*Prevent Default*/ $all('input[type="range"], .plus-btn, .minus-btn').forEach(a => a.addEventListener('contextmenu', ()=> event.preventDefault()));

/*Lang files loaded*/ $('.efy_lang_app_file').onload =()=>{
    /*Translations*/ $ready('[efy_lang]', async (a)=>{ let b = a.getAttribute('efy_lang');
        efy_lang[b] = getComputedStyle($('[efy_lang]')).getPropertyValue(`--${b}`);
        if ($$(a, '[efy_icon]') !== null){ $insert_text(a, 'beforeend', efy_lang[b])}
        else {$insert_text(a, 'afterbegin', efy_lang[b])}
    a.removeAttribute('efy_lang')}); $efy_lang_start()
    /*Alpha*/ for (let a =['"Max Width"'], i=0; i<a.length; i++){ $add('mark', {efy_lang: 'alpha'}, [], $(`[efy_content=size] [efy_range_text*=${a[i]}] p`), 'afterend')}
    /*No Notifications*/ $add('style', {}, [`.efy_quick_notify_content:empty:before {content: '${efy_lang.no_notifications}'}`], $head);
    /*Extra Modules*/ for (let a =['extra'], i=0; i<a.length; i++){
        if ($efy_module(`efy_${a[i]}`)){ $add('link', {href: `${efy.folder}/${a[i]}.css`, rel: 'stylesheet'}, [], $head);
            if ($css_prop('--efy_protocol') == 'http'){ $add('script', {src: `${efy.folder}/${a[i]}.js`, type: 'module'}, [], $head)}
            else { $add('script', {src: `${efy.folder}/${a[i]}_local.js`}, [], $head)}
    }}
}}