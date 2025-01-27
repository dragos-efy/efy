(()=>{ let output = [['div', {efy_clock: ''}]];
    [['back', 'chevron'], ['forward', 'chevron'], ['reload', 'reload'], ['fullscreen', 'fullscreen']].map(x =>{
        output.push(['button', {'class': `efy_quick_${x[0]} efy_square_btn`}, [['i', {efy_icon: x[1]}]]]);
    });

    $add('button', {id: 'efy_quick_toggle', efy_toggle: '#efy_quick', class: 'efy_square_btn', title: 'Quick shortcuts'}, [
        ['i', {efy_icon: 'star'}]
    ], $('.efy_sidebar_top_buttons'));

    $add('div', {id: 'efy_quick', class: 'efy_quick_shortcuts efy_hide_i', efy_card: ''}, [
        ['div', {class: 'efy_quick_buttons efy_flex'}, output]
    ], $('[efy_about]'), 'afterend');

    $event($(".efy_quick_reload"), 'click', ()=> location.reload());

    $ready('.efy_quick_fullscreen', (x)=>{
        $event(x, 'click', ()=> document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
    });

    ['back', 'forward'].map(a =>{ $event($(`.efy_quick_${a}`), 'click', ()=> window.history.go(a === 'back' ? -1 : 1)) });
})();