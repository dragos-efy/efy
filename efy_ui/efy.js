/*EFY UI 2022.08.19*/ let e$ = document.querySelector.bind(document), e$all = document.querySelectorAll.bind(document), e$create = document.createElement.bind(document), e$body, e$root; window.onload =()=>{ e$root = e$(":root"), e$body = e$("body"); /*Add Sidebar*/ e$('body').insertAdjacentHTML('beforeend', `
<div class="efy_sidebar"><details efy_logo efy_help><summary><a href="https://efy.ooo">EFY</a> UI</summary>The page uses a css/js framework that allows all of these nice customisation features, called EFY UI. We aim to bring the future closer & give users, developers, businesses real power. All of that while using as little code as possible.<br /><br />If you'd like to learn how it works or support the project, check it out here:<br /><a href="https://efy.ooo/ui">https://efy.ooo/ui</a></details><div efy_sidebar_btn_close></div>

    <details class="efy_quick_shortcuts"><summary><i class="efy_icon_star"></i>Quick Shortcuts</summary>
        <div class="efy_quick_buttons">
            <button class="efy_quick_reload"><i class="efy_icon_reload"></i></button>
            <button class="efy_quick_fullscreen"><i class="efy_icon_fullscreen"></i></button>
            <button class="efy_quick_back"><i class="efy_icon_chevron"></i></button>
            <button class="efy_quick_forward"><i class="efy_icon_chevron"></i></button>
        </div>

        <div efy_clock></div>

        <div efy_timer="efy_ui0">
            <div efy_text>00:00:00</div>
            <button efy_start></button>
            <button efy_reset></button>
        </div>

    </details>

        <details open><summary><i class="efy_icon_star"></i>Theme</summary>

        <div efy_tabs="efyui_0">
            <button efy_tab="1" efy_active>Mode</button>
            <button efy_tab="2">Colors</button>
            <button efy_tab="3">Images</button>
            <button efy_tab="4">Border</button>

            <div efy_content="1" efy_active class="efy_el_select" id="efy_theme">
                 <input type="radio" name="efy_theme" id="light_light"><label for="light_light">Light</label>
                <input type="radio" name="efy_theme" id="light_grey"><label for="light_grey">Grey</label>
                <input type="radio" name="efy_theme" id="light_sepia"><label for="light_sepia">Sepia</label>
                <input type="radio" name="efy_theme" id="dark_dark"><label for="dark_dark">Dark</label>
                <input type="radio" name="efy_theme" id="dark_nord"><label for="dark_nord">Nord</label>
                <input type="radio" name="efy_theme" id="dark_black"><label for="dark_black">Black</label>
                <details efy_help><summary>Transparency</summary>If your operating system or window manager supports transparency, the background becomes transparent. Otherwise just import your own images and turn this on.</details>
                <input type="radio" name="efy_theme" id="light_trans"><label for="light_trans">Light</label>
                <input type="radio" name="efy_theme" id="dark_trans"><label for="dark_trans">Dark</label>
            </div>
            <div efy_content="2" class="efy_el_select">
                <label for="efy_color1">Color 1<input id="efy_color1" type="color" value="#77aa00"></label>
                <label for="efy_color2">Color 2<input id="efy_color2" type="color" value="#ffcc00"></label>
                <details efy_help><summary>Custom Colors</summary>These colors override the default ones</details>
                <label for="efy_color_text">Text<input id="efy_color_text" type="color" value="#555555"></label>
                <input name="efy_text_color_status" id="efy_text_status" type="checkbox"><label for="efy_text_status">On / Off</label>
            </div>
            <div efy_content="3" class="efy_custom_bgimage">
                <input type="file" id="pictureTest" accept="image/*">
                <div class="efy_img_previews"></div>
                <details efy_help><summary>Warning! Bigger = Slower</summary>Keep them bellow 1MB per image, unless your device has a powerful CPU / GPU. You can also convert png, jpg etc to webp to reduce the size</details>
                <button class="efy_idb_reset" type="reset"><i class="efy_icon_reload"></i>Reset</button>
            </div>
            <div efy_content="4" class="efy_el_select">
                <p>Radius</p><div class="efy_sidebar_range"></div>
                <input class="efy_sidebar_selectRadius" type="range" min="0" max="25" value="12" step="1">
            </div>
        </div>
    </details>

    <details class="efy_el_select"><summary><i class="efy_icon_dots"></i>Visual Filters</summary>
        <div efy_tabs="efyui_filters">
            <button efy_tab="1" efy_active>Background</button>
            <button efy_tab="2">Content</button>
            <button efy_tab="3">Trans Elements</button>
            <div efy_content="1" efy_active class="efy_el_select" id="efy_theme"><form class="efy_bg_filter"><button type="reset"><i class="efy_icon_reload"></i>Reset</button>
                    <p>Brightness</p><input class="efy_bg_brightness" type="range" min="0" max="3" value="1" step="0.1">
                    <p>Blur</p><input class="efy_bg_blur" type="range" min="0" max="100" value="0" step="1">
                    <p>Saturation</p><input class="efy_bg_saturate" type="range" min="0" max="3" value="1" step="0.1">
                    <p>Contrast</p><input class="efy_bg_contrast" type="range" min="0.1" max="3" value="1" step="0.1">
                    <p>Hue</p><input class="efy_bg_hue-rotate" type="range" min="0" max="360" value="0" step="1">
                    <p>Sepia</p><input class="efy_bg_sepia" type="range" min="0" max="1" value="0" step="0.1">
                </form></div>
            <div efy_content="2" class="efy_el_select" id="efy_theme"><form class="efy_content_filter">
                <details efy_help><summary>What's Content?</summary>Currently images and videos, excluding the background image</details>
                <button type="reset"><i class="efy_icon_reload"></i>Reset</button>
                <p>Brightness</p><input class="efy_content_brightness" type="range" min="0" max="3" value="1" step="0.1">
                <p>Blur</p><input class="efy_content_blur" type="range" min="0" max="100" value="0" step="1">
                <p>Saturation</p><input class="efy_content_saturate" type="range" min="0" max="3" value="1" step="0.1">
                <p>Contrast</p><input class="efy_content_contrast" type="range" min="0.1" max="3" value="1" step="0.1">
                <p>Hue</p><input class="efy_content_hue-rotate" type="range" min="0" max="360" value="0" step="1">
                <p>Sepia</p><input class="efy_content_sepia" type="range" min="0" max="1" value="0" step="0.1">
            </form></div>
            <div efy_content="3" class="efy_el_select" id="efy_theme"><form class="efy_trans_filter">
            <details efy_help><summary>What are Trans Elements?</summary>Transparent elements that can filter what's behind them</details>
                <button type="reset"><i class="efy_icon_reload"></i>Reset</button>
                <p>Brightness</p><input class="efy_trans_brightness" type="range" min="0" max="3" value="1" step="0.1">
                <p>Blur</p><input class="efy_trans_blur" type="range" min="0" max="100" value="0" step="1">
                <p>Saturation</p><input class="efy_trans_saturate" type="range" min="0" max="3" value="1" step="0.1">
                <p>Contrast</p><input class="efy_trans_contrast" type="range" min="0.1" max="3" value="1" step="0.1">
                <p>Hue</p><input class="efy_trans_hue-rotate" type="range" min="0" max="360" value="0" step="1">
                <p>Sepia</p><input class="efy_trans_sepia" type="range" min="0" max="1" value="0" step="0.1">
            </form></div>
    </details>

    <details><summary><i class="efy_icon_arrow"></i>Save & Restore</summary>
        <p>EFY Settings</p>
        <a href="#" class="efy_localStorage_export" download="efy_preferences.json"><button><i class="efy_icon_arrow_down"></i>Save</button></a>
        <button class="efy_localstorage_reset" type="reset"><i class="efy_icon_reload"></i>Reset</button>
        <input type="file" class="efy_localstorage_import" accept=".json" />
        <p>EFY Images</p>
        <a href="#" class="efy_idb_export" download="efy_images.json"><button><i class="efy_icon_arrow_down"></i>Save</button></a>
        <button class="efy_idb_reset" type="reset"><i class="efy_icon_reload"></i>Reset</button>
        <input type="file" class="efy_idb_import" accept=".json" />
    </details>

    <details class="efy_el_select" id="efy_accessibility"><summary><i class="efy_icon_accessibility"></i>Accessibility</summary>

        <details class="efy_el_select" id="efy_btn_align"><summary>Menu Button Position</summary><div>
            <input type="radio" name="efy_btn_align" id="left_top">
            <input type="radio" name="efy_btn_align" id="middle_top">
            <input type="radio" name="efy_btn_align" id="right_top">
            <input type="radio" name="efy_btn_align" id="left_middle">
            <input type="radio" name="efy_btn_align" id="middle_middle" disabled>
            <input type="radio" name="efy_btn_align" id="right_middle">
            <input type="radio" name="efy_btn_align" id="left_bottom">
            <input type="radio" name="efy_btn_align" id="middle_bottom">
            <input type="radio" name="efy_btn_align" id="right_bottom">
        </div></details>

        <details class="efy_el_select"><summary>Text Size</summary>
            <form class="efy_text_accessibility"><button type="reset"><i class="efy_icon_reload"></i>Reset</button>
                <p>Zoom</p><input class="efy_ui_zoom" type="range" min="1" max="2" value="1" step="0.01">
                <p>Text Spacing</p><input class="efy_text_spacing" type="range" min="0" max="15" value="0" step="1">
            </form>
        </details>

        <input type="checkbox" name="efy_accessibility" id="efy_outline"><label for="efy_outline">Focus Outline</label>
        <input type="checkbox" name="efy_accessibility" id="efy_cursor"><label for="efy_cursor">Custom Cursor (hidden on touchscreen)</label>

    </details>

    <details class="efy_el_select" id="efy_audio"><summary><i class="efy_icon_audio"></i>Audio Effects</summary>
        <input type="checkbox" name="efy_audio" id="efy_audio_status"><label for="efy_audio_status">On / Off</label>
        <input type="checkbox" name="efy_audio" id="efy_audio_click"><label for="efy_audio_click">Click & Tap</label>
        <input type="checkbox" name="efy_audio" id="efy_audio_hover"><label for="efy_audio_hover">Mouse Hover</label>
        <p>You might have to click / tap on the ssl / lock icon on your browser & allow sounds, to hear them automatically.</p>
        <img src="./efy_ui/img/allow_audio.webp"></img>
    </details>

</div><div efy_sidebar_btn_open></div>

<div efy_cursor></div>
`);

/*Variables*/ let efy_radius_input = e$(".efy_sidebar_selectRadius"),
efy_sidebar_range = e$(".efy_sidebar_range");
// efy_radius_steps = (efy_radius_input.max - efy_radius_input.min) , - use this instead of width
// efy_radius = localStorage.efy_radius,


/*Theme*/ if (localStorage.efy_theme) {e$root.setAttribute("efy_theme", localStorage.efy_theme); e$("#" + localStorage.efy_theme).setAttribute("checked", "1")}
else {e$root.setAttribute('efy_theme', 'light_light'); e$("#light_light").setAttribute("checked", "1")}
e$all("[name=efy_theme]").forEach(x => { x.onclick = () => { e$root.setAttribute("efy_theme", x.id); localStorage.efy_theme = x.id; }; });

/*Colors*/ let efy_color = {'color1': 'efy_color', 'color2': 'efy_color2', 'color_text': 'efy_text'}, rgb2hex = c => "#" + c.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0)).join``;
Object.keys(efy_color).forEach(z =>{ e$(`#efy_${z}`).oninput = ev => {
let x = ev.target.value, r = parseInt(x.substr(1, 2), 16), g = parseInt(x.substr(3, 2), 16), b = parseInt(x.substr(5, 2), 16); x = `${r},${g},${b}`; localStorage.setItem(efy_color[z], x); e$root.style.setProperty(`--efy_${z}_var`, x); }
let y = getComputedStyle(e$root).getPropertyValue(`--efy_${z}_var`);
if (localStorage.getItem(efy_color[z])) {y = localStorage.getItem(efy_color[z]); e$root.style.setProperty(`--efy_${z}_var`, y)}
e$(`#efy_${z}`).value = rgb2hex("rgb(" + y + ")"); });

/*Radius*/ async function efy_radius_fn(){ let x, radius = localStorage.efy_radius; if (radius) { x = radius.replace('rem', ''); efy_radius_input.value = x; e$root.style.setProperty("--efy_radius", radius); } else {x = 12;}

/*Radius: Input*/ e$('[efy_tabs=efyui_0] [efy_tab="4"]').addEventListener('pointerup', ()=>{ setTimeout( ()=>{ let za = e$('.efy_sidebar_selectRadius'), z = getComputedStyle(za).getPropertyValue('width').replace('px','');  efy_sidebar_range.innerText = x; efy_sidebar_range.style.left = (x * (z - 32) / efy_radius_input.max) + 'rem'; }, 100); }, {once: true}); } efy_radius_fn();

efy_radius_input.oninput = () => { let za = e$('.efy_sidebar_selectRadius'), z = getComputedStyle(za).getPropertyValue('width').replace('px',''), x = efy_radius_input.value; e$root.style.setProperty("--efy_radius", x + "rem"); localStorage.efy_radius = x + "rem"; efy_sidebar_range.style.left = (x * (z - 32) / efy_radius_input.max) + 'rem'; efy_sidebar_range.innerText = x; };
/*Radius: Window Resize*/ window.addEventListener('resize', () => { let za = e$('.efy_sidebar_selectRadius'), z = getComputedStyle(za).getPropertyValue('width').replace('px',''), x = efy_radius_input.value; efy_sidebar_range.style.left = (x * (z - 32) / efy_radius_input.max) + 'rem'; });


/*EFY Button Position*/ if (localStorage.efy_btn_align) { e$("#" + localStorage.efy_btn_align).setAttribute("checked", "1"); } else { e$("#right_top").setAttribute("checked", "1");}
e$("[efy_sidebar_btn_open]").setAttribute("efy_btn_align", localStorage.efy_btn_align); e$all("[name=efy_btn_align]").forEach(x => { x.onclick = () => { e$("[efy_sidebar_btn_open]").setAttribute("efy_btn_align", x.id); localStorage.efy_btn_align = x.id; }; });

/*BgImg Filter*/ let efy_bg_filter = {}, efy_css_bg_filter = e$create("style"); efy_css_bg_filter.classList.add("efy_css_bg_filter"); document.head.appendChild(efy_css_bg_filter); async function efy_bg_filter_fn(){
    ['blur','brightness','saturate','contrast','hue-rotate','sepia'].forEach(x => { efy_bg_filter[x] = e$(`.efy_bg_${x}`).value; if (x == 'blur') { efy_bg_filter[x] = efy_bg_filter[x] + 'px' } else if (x == 'hue-rotate') { efy_bg_filter[x] = efy_bg_filter[x] + 'deg' } });

    let string = ''; Object.keys(efy_bg_filter).forEach(x =>{ string = string + ` ${x}(${efy_bg_filter[x]})` });
    let y = `html:before, html:after {filter: ${string} !important}`;
    efy_css_bg_filter.innerHTML = y; localStorage.efy_bg_filter = JSON.stringify(efy_bg_filter); localStorage.efy_bg_filter_css = y }

if (localStorage.efy_bg_filter) { efy_css_bg_filter.innerHTML = localStorage.efy_bg_filter_css; let efy_bg_filter = JSON.parse(localStorage.efy_bg_filter); Object.keys(efy_bg_filter).forEach(x => e$(`.efy_bg_${x}`).value = efy_bg_filter[x].replace('px','').replace('deg','') ) }
e$all('.efy_bg_filter input').forEach(x =>{ x.addEventListener("input", ()=>{ efy_bg_filter_fn() })  });
e$all('.efy_bg_filter [type=reset]').forEach(x =>{ x.addEventListener("pointerup", ()=>{ efy_bg_filter_fn(); localStorage.removeItem('efy_bg_filter'); localStorage.removeItem('efy_bg_filter_css'); efy_css_bg_filter.innerHTML = '' })  });

/*Content Filter*/ let efy_content_filter = {}, efy_css_content_filter = e$create("style"); efy_css_content_filter.classList.add("efy_css_content_filter"); document.head.appendChild(efy_css_content_filter); async function efy_content_filter_fn(){
    ['blur','brightness','saturate','contrast','hue-rotate','sepia'].forEach(x => { efy_content_filter[x] = e$(`.efy_content_${x}`).value; if (x == 'blur') { efy_content_filter[x] = efy_content_filter[x] + 'px' } else if (x == 'hue-rotate') { efy_content_filter[x] = efy_content_filter[x] + 'deg' } });

    let string = ''; Object.keys(efy_content_filter).forEach(x =>{ string = string + ` ${x}(${efy_content_filter[x]})` });
    let y = `img, video {filter: ${string} !important}`;
    efy_css_content_filter.innerHTML = y; localStorage.efy_content_filter = JSON.stringify(efy_content_filter); localStorage.efy_content_filter_css = y }

if (localStorage.efy_content_filter) { efy_css_content_filter.innerHTML = localStorage.efy_content_filter_css; let efy_content_filter = JSON.parse(localStorage.efy_content_filter); Object.keys(efy_content_filter).forEach(x => e$(`.efy_content_${x}`).value = efy_content_filter[x].replace('px','').replace('deg','') ) }
e$all('.efy_content_filter input').forEach(x =>{ x.addEventListener("input", ()=>{ efy_content_filter_fn() })  });
e$all('.efy_content_filter [type=reset]').forEach(x =>{ x.addEventListener("pointerup", ()=>{ efy_content_filter_fn(); localStorage.removeItem('efy_content_filter'); localStorage.removeItem('efy_content_filter_css'); efy_css_content_filter.innerHTML = '' })  });

/*Trans Filter*/ let efy_trans_filter = {}, efy_css_trans_filter = e$create("style"); efy_css_trans_filter.classList.add("efy_css_trans_filter"); document.head.appendChild(efy_css_trans_filter); async function efy_trans_filter_fn(){
    ['blur','brightness','saturate','contrast','hue-rotate','sepia'].forEach(x => { efy_trans_filter[x] = e$(`.efy_trans_${x}`).value; if (x == 'blur') { efy_trans_filter[x] = efy_trans_filter[x] + 'px' } else if (x == 'hue-rotate') { efy_trans_filter[x] = efy_trans_filter[x] + 'deg' } });

    let string = ''; Object.keys(efy_trans_filter).forEach(x =>{ string = string + ` ${x}(${efy_trans_filter[x]})` });
    let y = `details:not([efy_help]), select, input, textarea, blockquote, pre, article, table, [efy_tabs] [efy_content], [efy_timer], [efy_clock] {backdrop-filter: ${string} !important}`;
    efy_css_trans_filter.innerHTML = y; localStorage.efy_trans_filter = JSON.stringify(efy_trans_filter); localStorage.efy_trans_filter_css = y }

if (localStorage.efy_trans_filter) { efy_css_trans_filter.innerHTML = localStorage.efy_trans_filter_css; let efy_trans_filter = JSON.parse(localStorage.efy_trans_filter); Object.keys(efy_trans_filter).forEach(x => e$(`.efy_trans_${x}`).value = efy_trans_filter[x].replace('px','').replace('deg','') ) }
e$all('.efy_trans_filter input').forEach(x =>{ x.addEventListener("input", ()=>{ efy_trans_filter_fn() })  });
e$all('.efy_trans_filter [type=reset]').forEach(x =>{ x.addEventListener("pointerup", ()=>{ efy_trans_filter_fn(); localStorage.removeItem('efy_trans_filter'); localStorage.removeItem('efy_trans_filter_css'); efy_css_trans_filter.innerHTML = '' })  });

/* Text Size*/ let efy_text_accessibility = e$create("style"); efy_text_accessibility.classList.add("efy_text_accessibility"); document.head.appendChild(efy_text_accessibility); e$all('.efy_text_accessibility input').forEach(x => x.oninput =()=>{ efy_text_accessibility.innerHTML = `:root {--efy_font_size: ${e$('.efy_ui_zoom').value}px!important;} html {letter-spacing: ${e$('.efy_text_spacing').value}px!important;}`; });

/*Checkbox Toggles*/  ["efy_audio_status", "efy_audio_click", "efy_audio_hover", "efy_outline", 'efy_cursor','efy_text_status'].forEach(x => { if (localStorage.getItem(x) == "on") {e$("#" + x).setAttribute("checked", "1");} e$("#" + x).onclick = () => { if (localStorage.getItem(x) == "on") { localStorage.setItem(x, "off"); } else { localStorage.setItem(x, "on"); } };});

/*Focus Outline*/ if (localStorage.efy_outline == 'on') {e$root.setAttribute('efy_outline', '1');}  e$('#efy_outline').onchange = () => {e$root.toggleAttribute('efy_outline')}
/*Cursor*/ if (localStorage.efy_cursor == 'on') {e$root.setAttribute('efy_cursor_on', '1');}  e$('#efy_cursor').onchange = () => {e$root.toggleAttribute('efy_cursor_on')}
/*Custom Text Color*/ if (localStorage.efy_text_status == 'on') {e$root.setAttribute('efy_color_text', '1')}  e$('#efy_text_status').onchange = () => {e$root.toggleAttribute('efy_color_text')}


/*EFY Menu Toggles*/ e$("[efy_sidebar_btn_open]").onclick = () => { e$("[efy_sidebar_btn_open]").style.display = "none"; e$("[efy_sidebar_btn_close]").style.display = "block"; e$(".efy_sidebar").classList.toggle("efy_toggle_efy_sidebar_panel"); e$("body").classList.toggle("efy_toggle_efy_sidebar"); };
/*Close*/ e$("[efy_sidebar_btn_close]").onclick = () => { e$(".efy_sidebar").classList.toggle("efy_toggle_efy_sidebar_panel"); e$("body").classList.toggle("efy_toggle_efy_sidebar"); e$("[efy_sidebar_btn_open]").style.display = "block"; e$("[efy_sidebar_btn_close]").style.display = "none"; };



/*Change bg image*/ let efy_css_bgimg = e$create("style"); efy_css_bgimg.classList.add("efy_css_bgimg"); document.head.appendChild(efy_css_bgimg);

/*Background image*/ let db; e$("#pictureTest").addEventListener("change", efy_add_bgimg);
let request = indexedDB.open('efy');
request.onerror = () => console.error("efy: Can't open db");
request.onsuccess = e => (db = e.target.result);
request.onupgradeneeded = e => { let db = e.target.result; db.createObjectStore("images", { keyPath: "id", autoIncrement: true }); db.createObjectStore("settings", { keyPath: "id", autoIncrement: true }); };

async function efy_add_bgimg(e) { let reader = new FileReader(); reader.readAsDataURL(e.target.files[0]); reader.onload = e => { let ob = { data: e.target.result };
    db.transaction(["images"], "readwrite").objectStore("images").add(ob).onerror = e => { console.error(e); };

async function efy_bg_update_fn2(){ let request2 = indexedDB.open('efy');
request2.onsuccess = () => { let efy_count_img2 = 0, transaction2 = request2.result.transaction(["images"], "readonly"), invoiceStore2 = transaction2.objectStore("images"), getCursorRequest2 = invoiceStore2.openCursor();
    getCursorRequest2.onerror = () => console.error("efy: no db entries");
    getCursorRequest2.onsuccess = e => { let cursor2 = e.target.result;
        if (cursor2) { efy_count_img2++; cursor2.continue(); }
        else { /*Set bgimg nr*/ localStorage.efy_bg_nr = efy_count_img2;
            /*Add Preview*/ let efy_bg_item2 = e$create("div"); efy_bg_item2.style.background = 'url('+reader.result+')'; efy_bg_item2.setAttribute("efy_bg_nr", efy_count_img2); e$(".efy_img_previews").appendChild(efy_bg_item2); e$all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active'));
            /*Restore Background*/ efy_css_bgimg.innerHTML = `html:before, html:after {background: url(${reader.result})!important; background-size: cover!important} html {background: var(--efy_text2)!important}`; e$('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]').setAttribute('efy_active',1);
             /*Preview Click*/ let y = e$('.efy_img_previews [efy_bg_nr="'+efy_count_img2+'"]'); y.onclick = () => { efy_css_bgimg.innerHTML = `html:before, html:after {background: url(${reader.result})!important; background-size: cover!important} html {background: var(--efy_text2)!important}`; localStorage.efy_bg_nr = efy_count_img2; e$all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active',1); };
        }
    };};
} efy_bg_update_fn2();

};}

/*Count images*/ async function efy_bg_update_fn(){ request = indexedDB.open('efy');
request.onsuccess = () => { let efy_count_img = 0, transaction = request.result.transaction(["images"], "readonly"), invoiceStore = transaction.objectStore("images"), getCursorRequest = invoiceStore.openCursor();
    getCursorRequest.onerror = () => console.error("efy: no db entries");
    getCursorRequest.onsuccess = e => { let cursor = e.target.result;
        if (cursor) { efy_count_img++; let req = invoiceStore.get(efy_count_img);
            req.onsuccess = e => { let x = e.target.result.data;
                /*Preview Click*/ let efy_bg_item = e$create("div"); efy_bg_item.style.background = 'url('+x+')'; efy_bg_item.setAttribute("efy_bg_nr", efy_count_img); e$(".efy_img_previews").appendChild(efy_bg_item); let y = e$('.efy_img_previews [efy_bg_nr="'+efy_count_img+'"]'); y.onclick = () => { efy_css_bgimg.innerHTML = `html:before, html:after {background: url(${x})!important; background-size: cover!important} html {background: var(--efy_text2)!important; background-size: cover!important}`; localStorage.efy_bg_nr = e.target.result.id; e$all('.efy_img_previews [efy_bg_nr]').forEach(z => z.removeAttribute('efy_active')); y.setAttribute('efy_active',1); };
            }; cursor.continue();
        } else { /*Check bgimg number*/ let bgnr; if (localStorage.efy_bg_nr) { bgnr = JSON.parse(localStorage.efy_bg_nr); } else { bgnr = 1; }

            /*Restore Background*/ if (efy_count_img > 0) { invoiceStore.get(bgnr).onsuccess = e => { let x = e.target.result.data, y = e.target.result.id; efy_css_bgimg.innerHTML = `html:before, html:after {background: url(${x})!important; background-size: cover!important}`; e$('.efy_img_previews [efy_bg_nr="'+y+'"]').setAttribute('efy_active',1); }; }

            /*Remove BG - Button*/ e$all(".efy_idb_reset").forEach(z =>{ z.onclick = () => { indexedDB.deleteDatabase("efy"); location.reload()}});
        }
    };};
} efy_bg_update_fn();

/*Export IndexedDB*/ (async () => { try {
    let dbExists = await new Promise(resolve => { let request = window.indexedDB.open('efy');
        request.onupgradeneeded = e => { e.target.transaction.abort(); resolve(false); };
        request.onerror = () => resolve(true); request.onsuccess = () => resolve(true); });
    if (!dbExists) { throw new Error("efy: db doesn't exist"); }

    let idbDatabase = await new Promise((resolve, reject) => { let request = window.indexedDB.open('efy');
        request.onerror = () => reject("efy: Can't open db");
        request.onsuccess = () => resolve(request.result); });
    let json = await new Promise((resolve, reject) => { let exportObject = {};
        if (idbDatabase.objectStoreNames.length === 0) { resolve(JSON.stringify(exportObject)); }
        else { let transaction = idbDatabase.transaction(idbDatabase.objectStoreNames, "readonly");
            transaction.addEventListener("error", reject);

            for (let storeName of idbDatabase.objectStoreNames) { let allObjects = [];
                transaction.objectStore(storeName).openCursor().addEventListener("success", event => { let cursor = event.target.result;
                    if (cursor) { /*Store data*/ allObjects.push(cursor.value); cursor.continue();}
                    else { /*Store completed*/ exportObject[storeName] = allObjects;
                        if (idbDatabase.objectStoreNames.length === Object.keys(exportObject).length) { resolve(JSON.stringify(exportObject)); } } }); } } });

    e$(".efy_idb_export").onclick = () => { efyaudio.ok4.cloneNode().play(); e$(".efy_idb_export").href = "data:application/json," + json; };
} catch (error) { console.error(error); } })();

/*Import indexedDB*/ let efy_idb_import = e$(".efy_idb_import");
efy_idb_import.addEventListener("change", () => { let file = efy_idb_import.files[0], reader = new FileReader();
    reader.onload = async () => { let data = JSON.parse(reader.result);
        function importIDB(storename = "images", storename2 = "settings", arr = data["images"], arr2 = data["settings"]) {
            return new Promise(resolve => { let r = window.indexedDB.open("efy");
                r.onupgradeneeded = () => { let idb = r.result; idb.createObjectStore(storename, { keyPath: "id", autoIncrement: true }); idb.createObjectStore(storename2, { keyPath: "id", autoIncrement: true }); };
                r.onsuccess = () => { let idb = r.result, store = idb.transaction(storename, "readwrite").objectStore(storename), store2 = idb.transaction(storename2, "readwrite").objectStore(storename2);
                    for (let obj of arr) { store.put(obj); }
                    for (let obj of arr2) { store2.put(obj); }
                    resolve(idb);
                }; r.onerror = e => console.log(e.target.errorCode); }); }
await importIDB(); }; reader.readAsText(file); });


/*Save & Restore Preferences*/ e$('.efy_localStorage_export').onclick =()=>{ let x='', xzy = Object.entries(localStorage).forEach(([k,v])=>{ if (k.includes('efy')){ x=x+ JSON.stringify(k, null, 2)+' :'+JSON.stringify(v, null, 2) +',\n'; } }); e$('.efy_localStorage_export').href = "data:application/json," + '{\n'+x.slice(0,-2)+'\n}'; console.log(x)};

/*Import Settings*/ let efy_localstorage_import = e$('.efy_localstorage_import'); efy_localstorage_import.addEventListener('change', function(e) {
	let file = efy_localstorage_import.files[0], reader = new FileReader();
	reader.onload = function(e) { Object.entries(JSON.parse(reader.result)).forEach(([k,v])=>localStorage.setItem(k,v)); location.reload() }
	reader.readAsText(file); });

/*Reset Settings*/ e$all(".efy_localstorage_reset").forEach(x =>{ x.onclick = () => { Object.entries(localStorage).forEach(([k,v])=>{ if (k.includes('efy')){ localStorage.removeItem(k)} }); location.reload() }});


/*Audio*/ let efyaudio = {}; ['pop','ok','ok2','ok3','ok4','hover','slide','squish','step','error','disabled'].forEach(x => { efyaudio[x] = new Audio(`./efy_ui/audio/${x}.mp3`) }); e$body.addEventListener("pointerdown", efyaudio_fn, {once: true});

async function efyaudio_fn() { if (localStorage.efy_audio_status == 'on' ){ if (localStorage.efy_audio_click == 'on') {
    /*Ok*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('button:not([disabled], [type=submit], [type=reset], [efy_tab], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button), .video-grid>div')) { efyaudio.ok.cloneNode().play() }});
    /*Ok2*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('.efy_img_previews [efy_bg_nr]')) { efyaudio.ok2.cloneNode().play() }});
    /*Ok4*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('[type=submit]')) { efyaudio.ok4.cloneNode().play() }});
    /*Ok: on Change*/ e$body.addEventListener("change", ()=>{ if (event.target.matches('input, textarea')) { efyaudio.ok.cloneNode().play() }});
    /*Pop*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('summary, select:not([multiple], [disabled]), [efy_tabs] [efy_tab], .shaka-overflow-menu button, .shaka-overflow-menu-button, .shaka-back-to-overflow-button')) { efyaudio.pop.cloneNode().play() }});
    /*Slide*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('[efy_sidebar_btn_open], [efy_sidebar_btn_close]')) { efyaudio.slide.cloneNode().play() }});
    /*Error*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('[type=reset]')) { efyaudio.error.cloneNode().play() }});
    /*Disabled*/ e$body.addEventListener("pointerup", ()=>{ if (event.target.matches('[disabled]')) { efyaudio.disabled.cloneNode().play() }});
    /*Step*/ e$body.addEventListener("pointerdown", ()=>{ if (event.target.matches('input:not([type=radio], [type=checkbox], [type=reset], [disabled]), textarea:not([disabled])')) { efyaudio.step.cloneNode().play() }});
} /*Hover*/ if (localStorage.efy_audio_hover == "on") { e$all("summary, select:not([multiple], [disabled]), [type=submit], [type=reset], [efy_sidebar_btn_open], [efy_sidebar_btn_close], .video-grid>div").forEach(x => x.addEventListener("mouseenter",()=> efyaudio.hover.cloneNode().play() ));}}}

/*Quick Shortcuts*/
e$(".efy_quick_reload").onclick =()=> location.reload();
e$(".efy_quick_fullscreen").onclick =()=> { document.exitFullscreen(); document.documentElement.requestFullscreen(); };
e$(".efy_quick_back").onclick =()=> window.history.go(-1);
e$(".efy_quick_forward").addEventListener('pointerup', async ()=> window.history.go(1));

/*Tabs*/ e$all('[efy_tabs]').forEach(z => { let x = '[efy_tabs='+z.getAttribute('efy_tabs')+'] ';
    e$all(x+'[efy_tab]').forEach(y => { y.onclick = e => { let efy_tab = e.target.getAttribute('efy_tab');
        e$all(x+'[efy_tab]').forEach(y => y.removeAttribute('efy_active') ); e.target.setAttribute('efy_active', '1');
        e$all(x+'[efy_content]').forEach(y => y.removeAttribute('efy_active') ); e$(x+' [efy_content="'+efy_tab+'"]').setAttribute('efy_active', '1');
} }); });

/*Clock & Timer*/ function efy_time_0(i) { if (i < 10) {i = '0' + i} return i; }

/*Clock*/ function efy_clock() {let t = new Date(), h = t.getHours(), m = t.getMinutes(); m = efy_time_0(m);
e$all('[efy_clock]').forEach(x =>{ x.innerHTML =  h+':'+m; }); setTimeout(efy_clock, 10000); } efy_clock();

/*Timer*/ e$all('[efy_timer]').forEach(y => { let x = '[efy_timer='+y.getAttribute('efy_timer')+'] ', play = e$(x+'[efy_start]'), reset= e$(x+'[efy_reset]'), timer_text = e$(x+'[efy_text]'), interval, [hour,minute,second,h,m,s] = [0,0,0,'00','00','00'];
play.addEventListener("click", () => {clearInterval(interval); play.toggleAttribute('efy_active'); if (play.hasAttribute('efy_active')) { interval = setInterval(() => { second++;
    s = efy_time_0(second); if (second > 59) {s = '00'; second = 0; minute++;
    m = efy_time_0(minute); if (minute > 59) {m = '00'; minute = 0; hour++;
    h = efy_time_0(hour);
}} timer_text.innerText = h+':'+m+':'+s; }, 1000); } else { clearInterval(interval); } });
reset.addEventListener("click", () => {clearInterval(interval); [hour,minute,second,h,m,s] = [0,0,0,'00','00','00']; timer_text.innerText = "00:00:00"; play.removeAttribute('efy_active');}); });

/*Cursor*/ async function efy_cursor_fn(){ let x = e$('[efy_cursor]'), efy_css_cursor = e$create("style"); efy_css_cursor.classList.add("efy_css_cursor");  efy_css_cursor.innerHTML = `[efy_cursor_on], [efy_cursor_on] * {cursor: none!important} [efy_cursor_on] [efy_cursor] { height: 16rem; width: 16rem; position: absolute; background: linear-gradient(165deg, var(--efy_color), var(--efy_color2)); background-clip: padding-box; border-radius: var(--efy_radius0); pointer-events: none; opacity: 0; transition: opacity 0.5s linear; box-shadow: 0 0 5rem #0003; z-index: 999999!important}`; document.head.appendChild(efy_css_cursor); document.addEventListener('pointermove', (e)=>{ x.style.left = e.pageX - 8 + 'px'; x.style.top = e.pageY - 8 + 'px';  x.style.opacity = 1;}); document.addEventListener('touchstart', ()=>{ x.style.opacity = 0;}); document.addEventListener('touchmove', ()=>{ x.style.opacity = 0;}); document.addEventListener('touchend', ()=>{ x.style.opacity = 0;}); }; efy_cursor_fn();

/*End*/};