const efy_mood = {};

$ready('.efy_confetti', ()=>{
  efy_mood.confetti = $add('video', {id: 'efy_confetti', src: './assets/confetti.webm'});
})