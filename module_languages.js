(()=>{
    let a = 'en id ro ru de pl sv'.split(' '), b = 'English Indonesia Română Русский Deutsch Polski Svenska'.split(' ');
    $add('details', {id: 'efy_language', name: 'efy_sidebar_modules'}, [
        ['summary', {efy_lang: 'efy_language'}, [ ['i', {efy_icon: 'globe'}]]],
        ['div', {efy_select: ''}, [
            ['p', {efy_lang: 'lang_info'}, [['a', {href: 'https://translate.codeberg.org/projects/efy'}, ' Weblate']]]
    ]]], $('.efy_sidebar'));

    let c = $('#efy_language > div'); a.map((a,i) =>{ let d = `efy_language_${a}`;
        $add('input', {type: 'radio', name: 'efy_language', id: d}, [], c); $add('label', {for: d}, [b[i]], c);
        $event($('#' + d), 'click', ()=>{ efy.lang_code = a; $save(); location.reload()})
    });
    if (efy.lang_code){ $(`#efy_language_${efy.lang_code}`).setAttribute('checked', '')}
    else {$('#efy_language_en').setAttribute('checked', '')}
})();