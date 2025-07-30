if (!efy.svg_filters){ efy.svg_filters = {
    distortion: 100, blur: 50,
    noise_frequency: 1, noise_intensity: 10,
    noise_size: 0, noise_octaves: 1,
    red_x: 0, red_y: 1,
    green_x: -1, green_y: 1,
    blue_x: 2.5, blue_y: -3
}}

$root.classList.add('svg_filters');
$add('div', {class: 'efy-filters-dom'}, [
    $ns('svg', {xmlns: 'http://www.w3.org/2000/svg', style: 'display: none'}, [
        $ns('filter', {id: 'distortion_filter', x: '0%', y: '0%', width: '100%', height: '100%', filterUnits: 'objectBoundingBox'}, [
            $ns('feComponentTransfer', {in: 'SourceAlpha', result: 'alpha'}, [
                $ns('feFuncA', {type: 'identity'})
            ]),
            // Distortion
            $ns('feGaussianBlur', {in: 'alpha', stdDeviation: efy.svg_filters.blur, result: 'blur'}),
            $ns('feDisplacementMap', {in: 'SourceGraphic', in2: 'blur', scale: efy.svg_filters.distortion, xChannelSelector: 'A', yChannelSelector: 'A', result: 'displaced1'}),
            // Noise
            $ns('feTurbulence', {type: 'turbulence', baseFrequency: efy.svg_filters.noise_frequency, numOctaves: efy.svg_filters.noise_octaves, result: 'turbulence'}),
            $ns('feColorMatrix', {type: 'saturate', in: 'turbulence', values: efy.svg_filters.noise_intensity, result: 'coloredTurbulence'}),
            $ns('feDisplacementMap', {in: 'displaced1', in2: 'coloredTurbulence', scale: efy.svg_filters.noise_size, xChannelSelector: 'R', yChannelSelector: 'G', result: 'final'})
        ]),
        $ns('filter', {id: 'chromatic_abberation', x: '0%', y: '0%', width: '100%', height: '100%', filterUnits: 'objectBoundingBox'}, [
            $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'red_', values: `1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0`}),
            $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'green_', values: `0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0`}),
            $ns('feColorMatrix', {type: 'matrix', in: 'SourceGraphic', result: 'blue_', values: `0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0`}),

            $ns('feOffset', {in: 'red_', dx: efy.svg_filters.red_x, dy: efy.svg_filters.red_y, result: 'red'}),
            $ns('feOffset', {in: 'green_', dx: efy.svg_filters.green_x, dy: efy.svg_filters.green_y, result: 'green'}),
            $ns('feOffset', {in: 'blue_', dx: efy.svg_filters.blue_x, dy: efy.svg_filters.blue_y, result: 'blue'}),

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

$ready('[efy_tabs=efyui_filters] [efy_content=card]', (menu)=>{
    const container = $add('div', {class: 'svg_filters'}, [
        ['p', {style: 'border-top: var(---border); border-bottom: var(---border); margin-top: 10rem; padding: 10rem 0'}, 'SVG Filters']
    ], $('[efy_tabs=efyui_filters] [efy_content=card]'));

    const keys = [
        'distortion', 'blur',
        'noise_frequency', 'noise_intensity', 'noise_size', 'noise_octaves',
        'red_x', 'red_y', 'green_x', 'green_y', 'blue_x', 'blue_y'
    ],
    effects = [
        keys,
        [-2000, 0, 0, -50, -250, 1, -100, -100, -100, -100, -100, -100],
        [2000, 400, 10, 50, 250, 5, 100, 100, 100, 100, 100, 100],
        keys.map(x => efy.svg_filters[x]),
        [1, 1, .025, 1, 1, 1, .5, .5, .5, .5, .5, .5]
    ];

    effects[0].map((item, i)=>{
        $add('div', {
            efy_range_text: item.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }, [
            ['input', {
                class: `efy_svg_${item}`, type: 'range',
                min: effects[1][i], max: effects[2][i],
                value: effects[3][i], step: effects[4][i]
            }]
        ], container);
    });

}, 1);

$event(document, 'input', ()=>{ const x = event.target;
    const filters = {
        distortion: ['#distortion_filter feDisplacementMap[result=displaced1]', 'scale'],
        blur: ['#distortion_filter feGaussianBlur', 'stdDeviation'],
        red_x: ['#chromatic_abberation feOffset[result=red]', 'dx'],
        red_y: ['#chromatic_abberation feOffset[result=red]', 'dy'],
        green_x: ['#chromatic_abberation feOffset[result=green]', 'dx'],
        green_y: ['#chromatic_abberation feOffset[result=green]', 'dy'],
        blue_x: ['#chromatic_abberation feOffset[result=blue]', 'dx'],
        blue_y: ['#chromatic_abberation feOffset[result=blue]', 'dy'],
        noise_frequency: ['#distortion_filter feTurbulence', 'baseFrequency'],
        noise_intensity: ['#distortion_filter feColorMatrix', 'values'],
        noise_size: ['#distortion_filter feDisplacementMap[result=final]', 'scale'],
        noise_octaves: ['#distortion_filter feTurbulence', 'numOctaves']
    },
    key = x.className.replace('efy_svg_', ''), match = filters[key];
    if (match){
        const [y, z] = match, value = x.value; $(y).setAttribute(z, value);
        efy.svg_filters[key] = value; $save();
    }
})