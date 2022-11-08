import {$, $body, $add, $append, $insert, $css_prop, $audio_play, efy_audio} from './efy.js';

(()=>{ $append($('.efy_sidebar'), $add('details', {id: 'efy_nature', efy_select: ''}, [$add('summary', {}, [ $add('i', {efy_icon: 'dots'}), 'Nature Effects (Alpha, Extra)']), $add('div', {efy_tabs: 'efy_nature'})]));

/*Tabs*/ for (let a = ['visual', 'audio'], b = ['Visual', 'Audio'], c = $('[efy_tabs=efy_nature]'), i = 0; i < a.length; i++) {
    $append(c, $add('button', {efy_tab: a[i]}, [b[i]]));
}
for (let a = ['visual', 'audio'], c = $('[efy_tabs=efy_nature]'), i = 0; i < a.length; i++) {
    $append(c, $add('div', {efy_content: a[i], efy_select: '', id: `efy_${a[i]}`}))
}

/*Active*/ for (let a = ['[efy_tab=visual]', '[efy_content=visual]'], b = '[efy_tabs=efy_nature] > ', i = 0; i < a.length; i++){$(b + a[i]).setAttribute('efy_active', '')}

for (let a = ['snow', 'rain', 'leaf', 'flower', 'bubble'], b = ['Snow', 'Rain', 'Leaves', 'Flowers', 'Bubbles'], c = $('[efy_tabs=efy_nature] [efy_content=visual]'), i = 0; i < a.length; i++) {
  $append(c, $add('input', {type: 'checkbox', name: 'efy_nature_visual', id: `efy_nature_visual_${a[i]}`}));
  $append(c, $add('label', {for: `efy_nature_visual_${a[i]}`}, [b[i]]));
  $insert($body, 'afterbegin', $add('div', {efy_anim: a[i], 'aria-hidden': 'true'}));
}

for (let a = 'forest rain waves underwater people fireworks dreamy'.split(' '), b = 'Forest Rain Waves Underwater People Fireworks Dreamy'.split(' '), c = $('[efy_tabs=efy_nature] [efy_content=audio]'), i = 0; i < a.length; i++) {
  $append(c, $add('input', {type: 'checkbox', name: 'efy_nature_audio', id: `efy_nature_audio_${a[i]}`}));
  $append(c, $add('label', {for: `efy_nature_audio_${a[i]}`}, [b[i]]));
}


$('#efy_nature_visual_rain').addEventListener('click', (x)=>{ if (x.target.checked == true){
  for (let i = 0; i < 100; i++){
      $append($('[efy_anim*=rain]'), $add('div', {class: 'efy_anim_child', style: `left: ${Math.floor(Math.random() * window.innerWidth)}px; animation-duration: ${0.2 + Math.random() * 3.9}s; animation-delay: ${Math.random() * 5}s`}));
}} else {$('[efy_anim*=rain]').textContent = ''} })

for (let e = ['snow', 'leaf', 'flower', 'bubble'], ax = ['❅ ❅ ❆ ❄ ❅ ❆ ❄ ❅ ❆ ❄', '🍂 🍁 🍂 🍁 🍂 🍁 🍂 🍁 🍂 🍁', '🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼 🌸 🌼', '᳃ ⸰ ᪤ ᳃ ⸰ ᪤ ᳃ ⸰ ᪤ ᳃'], j = 0; j < e.length; j++){ let f = $(`[efy_anim*=${e[j]}]`); f.setAttribute('efy_anim', f.getAttribute('efy_anim')+' falling');
  $(`#efy_nature_visual_${e[j]}`).addEventListener('click', (x)=>{ if (x.target.checked == true){
    for (let a = ax[j].split(' '), b = '1 10 20 30 40 50 60 70 80 90'.split(' '), c = '0 1 6 4 2 8 6 2.5 1 3'.split(' '), d = '0 1 .5 2 2 3 2 1 0 1.5'.split(' '), i = 0; i < a.length; i++) {
      $append($(`[efy_anim*=${e[j]}]`), $add('div', {class: 'efy_anim_child', style: `left: ${b[i]}%; animation-delay: ${c[i]}s, ${d[i]}s`}, [a[i]]))
}} else {$(`[efy_anim*=${e[j]}]`).textContent = ''} })}


/*Audio*/ let a = 'forest rain waves underwater people fireworks dreamy'.split(' '); let efy_audio_path = $css_prop('--efy_audio_path'); a.forEach(x => { efy_audio[x] = new Audio(`${efy_audio_path}/${x}.mp3`) });
if (localStorage.efy_audio_status == 'on' ){ for (let i = 0; i < a.length; i++){
  $(`#efy_nature_audio_${a[i]}`).addEventListener('click', (x)=>{ if (x.target.checked == true){ $audio_play(efy_audio[a[i]]); efy_audio[a[i]].loop = true; }
  else {efy_audio[a[i]].pause(); efy_audio[a[i]].currentTime = 0;} })}}
})();