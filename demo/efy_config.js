$ready_once('.efy_sidebar').then(()=>{

    /*Custom Menu*/ $append($('#efy_modules'), $add('div', {id: 'custom_sidebar_menu'}));
    for (let a = ['./index.html', './empty.html', '#'], b = ['Demo', 'Empty Page',  'Link 3'], c = $('#custom_sidebar_menu'), i = 0; i < a.length; i++){ $append(c, $add('a', {href: a[i]}, [b[i]]))}

    /*Custom Settings*/ $append($('#efy_modules'), $add('details', {id: 'demo_sidebar_settings'}, [
        $add('summary', {}, [$add('i', {efy_icon: 'dots'}), 'Demo Settings']), $add('div', {})]),
    );
    for (let a = ['option1', 'option2', 'option3'], c = $('#demo_sidebar_settings > div'), i = 0; i < a.length; i++) {
        $append(c, $add('button', {}, [a[i]]));
    }
});