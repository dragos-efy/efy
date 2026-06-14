(()=>{
    let a = ['en', 'ar', 'zh', 'fr', 'de', 'el', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'pl', 'ro', 'ru', 'es', 'sv', 'tr'],
    b = [
        'English (US)',
        'Arabic · العربية',
        'Chinese (Simplified) · 简体中文',
        'French · Français',
        'German · Deutsch',
        'Greek · Ελληνικά',
        'Hindi · हिन्दी',
        'Hungarian · Magyar',
        'Indonesian · Bahasa Indonesia',
        'Italian · Italiano',
        'Japanese · 日本語',
        'Korean · 한국어',
        'Polish · Polski',
        'Romanian · Română',
        'Russian · Русский',
        'Spanish (Spain) · Español',
        'Swedish · Svenska',
        'Turkish · Türkçe'
    ];

    $add('details', {id: 'efy_language', name: 'efy_sidebar_modules'}, [
        ['summary', {efy_lang: 'efy_language'}, [ ['i', {efy_icon: 'globe'}]]],
        ['div', {efy_select: ''}, [
            ['p', {efy_lang: 'lang_info'}, [['a', {href: 'https://translate.codeberg.org/projects/efy'}, ' Weblate']]]
    ]]], $('.efy_sidebar'));

    let c = $('#efy_language > div'); a.map((a,i) =>{ let d = `efy_language_${a}`;
        $add('input', {type: 'radio', name: 'efy_language', id: d}, [], c);
        $add('label', {for: d, class: 'efy_shadow_accent_x_off'}, [
            ['p', {class: 'flag'}, a.toUpperCase()],
            ['p', b[i]]
        ], c);
        $event($('#' + d), 'click', ()=>{ efy.lang_code = a; $save(); location.reload()})
    });
    if (efy.lang_code){ $(`#efy_language_${efy.lang_code}`).setAttribute('checked', '')}
    else {$('#efy_language_en').setAttribute('checked', '')}
})();