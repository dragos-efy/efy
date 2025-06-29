(()=>{

let c = 'afterend', toggled = [];
const effects = [
    ['brightness', 'blur', 'saturation', 'contrast', 'hue', 'sepia', 'invert'],
    ['brightness', 'blur', 'saturate', 'contrast', 'hue-rotate', 'sepia', 'invert'],
    [4, 150, 4, 4, 360, 1, 1], [1, 0, 1, 1, 0, 0, 0], [.05, 1, .05, .05, 1, .05, .05]
];

$add('details', {id: 'efy_vfilters', efy_select: ''}, [
    ['summary', {efy_lang: 'filters'}, [['i', {efy_icon: 'dots'}]]],
    ['div', {efy_tabs: 'efyui_filters'}, [['div', {class: 'efy_tabs'}]]]
], $('.efy_sidebar'));

/*Tabs & Form*/ 'bg content trans front back button'.split(' ').map(a=>{
    const lang = (a == 'bg') ? 'background' : a,
    id = `efy_vf_${a}`, parent = [[], $('[efy_tabs=efyui_filters] .efy_tabs')],
    tab = $add('input', {efy_tab: a, type: 'radio', id: id, name: 'efy_vf_tabs'}, ...parent);
    $add('label', {efy_lang: lang, for: id}, ...parent);

    /*Temporary*/ if (a == 'button'){ $add('div', {efy_card: '', efy_lang: 'coming_soon', efy_content: a, style: 'margin: 0'}, [], $('[efy_tabs=efyui_filters]'))}
    else {
        const content = $add('form', {efy_content: a, efy_select: '', class: `efy_${a}_filter`, onsubmit: 'return false'}, [
            ['button', {type: 'reset', efy_lang: 'reset'}, [['i', {efy_icon: 'reload'}]]]
        ], $('[efy_tabs=efyui_filters]'));

        effects[0].map((item, i)=>{ $add('div', {efy_lang: item, efy_range_text: item}, [
            ['input', {class: `efy_${a}_${effects[1][i]}`, type: 'range', min: 0, max: effects[2][i], value: effects[3][i], step: effects[4][i]}]
        ], content)});
        /*Active*/ if (a == 'bg'){ [tab, content].map(b => b.setAttribute('efy_active', ''))}
    }
});

/*Trans Menu*/ a = $('[efy_tabs=efyui_filters] [efy_content=trans] [type=reset]'), b = 'efy_trans_filter_menu';
$add('label', {for: b, efy_lang: 'menu'}, [], a, 'afterend'); $add('input', {id: b, type: 'checkbox'}, [], a, 'afterend');


/*BG Size & Position*/ a = $('[efy_tabs=efyui_filters] [efy_content=bg] [type=reset]'); b = 'efy_bg_size';
[
    ['size', 'bg_size', b, 10, 3000, 300, 10],
    ['left', 'bg_position_x', 'bg_position_x', -3000, 3000, 0, 1],
    ['up', 'bg_position_y', 'bg_position_y', -3000, 3000, 0, 1]
].map((x,i) =>{ toggled.push(`[efy_range_text=${x[1]}]`);
    $add('div', {efy_lang: x[0], efy_range_text: x[1], class: 'efy_hide_i'}, [
        ['input', {class: x[2], type:'range', min: x[3], max: x[4], value: x[5], step: x[6]}]
    ], a, c);
});

$add('label', {for: b, efy_lang: 'size'}, [], a, c);
$add('input', {id: b, type: 'checkbox', efy_toggle: String(toggled)}, [], a, c);

$event($('.' + b), 'input', (a)=> $css_prop(`---bg_size`, `${a.target.value}rem`))
$event($('.bg_position_x'), 'input', (a)=> $css_prop(`---bg_x`, `${a.target.value}rem`))
$event($('.bg_position_y'), 'input', (a)=> $css_prop(`---bg_y`, `${a.target.value}rem`))

for (let a = ['bg', 'content', 'trans', 'front', 'back'], j = [
    '[efy_mode*=trans] .efy_3d_bg {filter: ',
    'img, video:not(.efy_3d_bg, .efy_3d_front, .efy_3d_back) {filter: ',
    ':is(.efy-card-back, details:not([efy_help]), select, input, textarea, blockquote, pre, article, table, audio, button, [efy_card], [efy_tabs] [efy_content], [efy_timer], [efy_clock], [efy_tabs] [efy_tab], [efy_keyboard], [efy_sidebar_btn*=absolute], [efy_select] label, .efy_trans_filter, .efy_btn_trans, .efy_trans):not(html.svg_filters .efy-glass, .efy_trans_filter_off, .efy_trans_filter_off_all, .efy_trans_filter_off_all *, .efy_sidebar *, [efy_range_text] input, html.svg_filters [efy_card]), html.svg_filters .efy_sidebar .efy-card-back {backdrop-filter: ',
    '.efy_3d_front {filter: ',
    '.efy_3d_back {filter: '
], k = '!important}', i = 0; i < a.length; i++){

    const parent = `.efy_${a[i]}_filter`;

    $add('style', {class: `efy_css_${a[i]}_filter`}, [], $head);
    let css = $(`.efy_css_${a[i]}_filter`), f = {}, g = `${a[i]}_filter`, h = `${g}_css`, fn = async ()=>{
        let string = '';

        effects[1].forEach(x =>{
            f[x] = $(`.efy_${a[i]}_${x}`).value;
            if (x == 'blur'){ f[x] += 'px'} else if (x == 'hue-rotate'){ f[x] += 'deg'}
        });

        Object.keys(f).forEach(x =>{ string += ` ${x}(${f[x]})` });
        let y = j[i] + string + k;
        if (a[i] == 'trans'){ let m = '';
            if ($('#efy_trans_filter_menu').checked){ m = ', .efy_sidebar'; efy.trans_filter_menu = true}
            y += string + ' ::-webkit-progress-bar, ::-webkit-meter-bar' + m + '{backdrop-filter: ' + string + k;
        } else { delete efy.trans_filter_menu}
        $text(css, y); efy[g] = JSON.stringify(f); efy[h] = y; $save()
    };

    if (efy[g]){
        $text(css, efy[h]); let f = JSON.parse(efy[g]);
        Object.keys(f).forEach(x => $(`.efy_${a[i]}_${x}`).value = f[x].replace('px','').replace('deg',''));
    }
    $all(`${parent} input`).forEach(x =>{ $event(x, 'input', fn)});
    $all(`${parent} [type=reset]`).forEach(x =>{
        $event(x, 'click', (event)=>{ event.preventDefault();
            effects[0].map((y, j)=>{
                $all(`${parent} [efy_range_text=${y}] .efy_range_text_p`).forEach((z, i)=>{
                    z.value = effects[3][j]; z.dispatchEvent(new Event('input', {'bubbles': true }));
            })});
            delete efy[g]; delete efy[h]; $save(); $text(css, '');
        })
    })
}

/*3D Layers*/ ['front', 'back'].map(a =>{
  $add('video', {class: `efy_3d_${a}`, autoplay: '', loop: '', muted: '', playsinline: ''});

  $add('div', {id: `efy_images_${a}`, style: 'display: grid'}, [
    ['div', {class: 'efy_img_previews'}, [
        ['input', {id: `idb_addimg_${a}`, type: 'file', accept: 'image/*, video/*', style: 'display: none'}],
        ['label', {for: `idb_addimg_${a}`, title: 'Add file', class: 'efy_color', type:'button', role: 'button'}, [ ['i', {efy_icon: 'plus'}] ]],
        ['button', {class: `idb_reset_${a}`, title: 'reset'}, [['i', {efy_icon: 'reload'}]]]
  ]], ['hr']], $(`[efy_tabs=efyui_filters] [efy_content=${a}]`), 'afterbegin')
});

/*Checkbox Toggles*/  ['trans_filter_menu'].forEach(x =>{
    if (efy[x]){ $(`#efy_${x}`).setAttribute('checked', '')}
    $event($(`#efy_${x}`), 'click', ()=>{
        efy[x] ? delete efy[x] : efy[x] = true; $save()
    })
});

if (efy.distortion){
    $root.classList.add('svg_filters');
    $add('div', {class: 'efy-filters-dom'}, [
        $ns('svg', {xmlns: 'http://www.w3.org/2000/svg', style: 'display: none'}, [
            $ns('filter', {id: 'lensFilter', x: '0%', y: '0%', width: '100%', height: '100%', filterUnits: 'objectBoundingBox'}, [
                $ns('feComponentTransfer', {in: 'SourceAlpha', result: 'alpha'}, [
                    $ns('feFuncA', {type: 'identity'})
                ]),
                $ns('feGaussianBlur', {in: 'alpha', stdDeviation: '50', result: 'blur'}),
                $ns('feDisplacementMap', {in: 'SourceGraphic', in2: 'blur', scale: '100', xChannelSelector: 'A', yChannelSelector: 'A'})
            ]),
            $ns('filter', {id: 'noiseFilter', x: '0%', y: '0%', width: '100%', height: '100%'}, [
                $ns('feTurbulence', {type: 'fractalNoise', baseFrequency: '0.8'}),
                $ns('feColorMatrix', {type: 'saturate', values: '0'}),
                $ns('feBlend', {mode: 'multiply', in: 'SourceGraphic'})
            ]),
            $ns('filter', {id: 'noiseFilter2', x: '0%', y: '0%', width: '100%', height: '100%'}, [
                $ns('feTurbulence', {type: 'fractalNoise', baseFrequency: '0.8'}),
                $ns('feColorMatrix', {type: 'saturate', values: '0'}),
                $ns('feBlend', {mode: 'overlay', in: 'SourceGraphic'})
            ]),
            $ns('filter', {id: 'chromatic_abberation', x: '0%', y: '0%', width: '100%', height: '100%', filterUnits: 'objectBoundingBox'}, [
                $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'red_', values: `1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0`}),
                $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'green_', values: `0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0`}),
                $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'blue_', values: `0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0`}),

                $ns('feOffset', {in: 'red_', dx: '0', dy: '1', result: 'red'}),
                $ns('feOffset', {in: 'green_', dx: '-1', dy: '1', result: 'green'}),
                $ns('feOffset', {in: 'blue_', dx: '2.5', dy: '-3', result: 'blue'}),

                $ns('feBlend', {mode: 'screen', in: 'SourceGraphic', in2: 'red'}),
                $ns('feBlend', {mode: 'screen', in: 'green'}),
                $ns('feBlend', {mode: 'screen', in: 'blue'}),
            ])
        ]),
    ]);
    $ready(':is(.efy-glass, .efy_sidebar, [efy_card], details:not([efy_help])):not(.efy_sidebar *, .efy-glass-off)', (x)=>{
        $add('div', {class: 'efy-card-back'}, null, x);
    });
    $add('div', {class: 'efy-card-back'}, null, $('.efy_sidebar'));

    $ready('[efy_tabs=efyui_filters] [efy_content=trans]', (menu)=>{
        $add('div', {class: 'svg_filters', style: 'border-top: var(---border); margin-top: 10rem'}, [
            ['p', {}, 'SVG Filters']
        ], $('[efy_tabs=efyui_filters] [efy_content=trans]'));
    }, 1);
}

})();