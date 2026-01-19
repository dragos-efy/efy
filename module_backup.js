$add('details', {id: 'efy_backup', name: 'efy_sidebar_modules'}, [
    ['summary', {efy_lang: 'backup'}, [['i', {efy_icon: 'arrow_down'}]]],
], $('.efy_sidebar'));
for (let a = ['localstorage', 'idb'], b = ['theme', 'efy_database'], c = '#efy_backup', i = 0; i < a.length; i++){
    let aa = `efy_${a[i]}`;
    const copy_paste = (i === 1) ? [null] : [
        ['button', {class: `${aa}_copy`, efy_lang: 'copy'}, [ ['i', {efy_icon: 'copy'}]]],
        ['button', {class: `${aa}_paste`, efy_lang: 'paste'}, [ ['i', {efy_icon: 'paste'}]]]
    ];
    $add('p', {efy_lang: b[i]}, [], $(c));
    $add('div', {class: 'efy_backup_div'}, [
        ['a', {href: '#', class: `${aa}_export`, download: `${b[i]}.json`, role: 'button', efy_lang: 'export'}, [ ['i', {efy_icon: 'arrow_down'}]]],
        ['label', {efy_upload: `${aa}_import, .json, import, null, arrow_up`}],
        ['button', {type: 'reset', class: `${aa}_reset`, efy_lang: 'reset'}, [['i', {efy_icon: 'reload'}]]],
        ...copy_paste
    ], $(c))
}
$event($('.efy_idb_reset'), 'click', ()=>{ indexedDB.deleteDatabase('efy'); location.reload()});

/*Export iDB*/ (async ()=>{ try { let db = await open_idb(),
    json = await new Promise((resolve, reject)=>{ let export_object = {};
        let transaction = db.transaction(db.objectStoreNames, "readonly");
        $event(transaction, 'error', reject);

        for (let store_name of db.objectStoreNames){ let objects = [];
            $event(transaction.objectStore(store_name).openCursor(), 'success', event =>{
            let cursor = event.target.result;
            if (cursor){ objects.push(cursor.value); cursor.continue()}
            else { export_object[store_name] = objects;
                if (db.objectStoreNames.length === Object.keys(export_object).length){
                    resolve(JSON.stringify(export_object))
        }}})}})

        $event($('.efy_idb_export'), 'click', async ()=>{ let e = event.target; $audio_play(efy_audio.ok3);
            e.href = URL.createObjectURL(new Blob([json], {type: 'application/json'}));
            e.setAttribute('download', 'efy_database.json');
        })
} catch (err){ console.error(err)}})();

/*Import IndexedDB*/ $event($body, 'change', async (e)=>{
    if (e.target.matches('#efy_idb_import')){
        let file = e.target.files[0], read = new FileReader();
        read.onload = async ()=>{ $audio_play(efy_audio.ok3);
            let data = JSON.parse(read.result), keys = Object.keys(data),
            importIDB = async (data)=>{
                let db = await open_idb(), transaction = db.transaction(keys, "readwrite");
                transaction.oncomplete =()=> location.reload();
                for (let name of keys){
                    let store = transaction.objectStore(name);
                    for (let obj of data[name]){ store.put(obj)}
            }}; await importIDB(data);
        };
        read.readAsText(file)
    }
    else if (e.target.matches('#efy_localstorage_import')){
        let file = e.target.files[0], read = new FileReader();
        read.onload =()=>{ localStorage.efy = read.result.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}'); location.reload()};
        read.readAsText(file)
    }
});

/*Export & Export localStorage*/

$event($('#efy_backup'), 'click', (e)=>{
    const x = e.target, [is_export, copy] =
    [x.matches('.efy_localstorage_export'), x.matches('.efy_localstorage_copy')];
    if (localStorage.efy && (is_export || copy)){
        efy.version = efy_version; $save();
        const result = JSON.stringify(JSON.parse(localStorage.efy), null, 2);
        $audio_play(efy_audio.ok3);
        if (is_export){
            x.href = URL.createObjectURL(new Blob([result], {type: 'application/json'}));
            x.download = 'efy_settings.json';
        }
        else if (copy){
            navigator.clipboard.writeText(result);
            if (efy.notify_clipboard != false) $notify('short', 'Copied to clipboard', result);
        }
    }
    else if (x.matches('.efy_localstorage_paste')){
        navigator.clipboard.readText().then(clipboard =>{
            localStorage.efy = clipboard.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}');
            location.reload();
        }).catch();
    }
});

// $event($('#efy_localstorage_import'), 'change', (e)=>{
//     let file = e.target.files[0], read = new FileReader();
// 	read.onload =()=>{ localStorage.efy = read.result.replaceAll(',\n"', ',"').replaceAll('{\n"', '{"').replaceAll('"\n}', '"}'); location.reload()};
// read.readAsText(file)});

/*Reset localStorage*/ $all(".efy_localstorage_reset").forEach(x =>{ $event(x, 'click', ()=>{ localStorage.removeItem('efy'); location.reload() })});