(()=>{

const container = $('#efy_sbtheme [efy_content=size]'),
range = $add('div', {efy_lang: 'corner_shape', efy_range_text: 'Corner Shape'}, [
    ['input', {class: 'efy_radius_input', type: 'range', min: -5, max: 5, value: 0, step: 0.25}]
], container),
input = $$(range, '.efy_radius_input'), gap = $('.efy_gap_input');

if (efy.corner_shape){
    const value = efy.corner_shape;
    $css_prop(`---corner_shape`, `superellipse(${value})`);
    input.value = value;
}

$event(input, 'input', ()=>{
    const value = input.value;
    $css_prop(`---corner_shape`, `superellipse(${value})`);
    efy.corner_shape = value; $save();
});

// Fix CSS Rendering Browser Bug
$event(input, 'change', ()=>{
    const fix = gap.value; gap.value = fix - 1;
    gap.dispatchEvent(new Event('input', {'bubbles': true}));
    $wait(.05, ()=>{ gap.value = fix;
        gap.dispatchEvent(new Event('input', {'bubbles': true}));
    });
});

})();