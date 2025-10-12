(()=>{ $root.setAttribute('efy_lights', '');

const bg_light = $add('div', {class: 'efy_bg_light'}),
selectorList = [
    '[efy_tab][efy_active] + label',
    'button:not([efy_bg_nr], [efy_card], .efy_card_filter)',
    'a[role=button]'
];

const {lightness, chroma, hue} = (() => {
    const [,l='0.5', c='0', h='0'] = efy.colors[0]?.split(' ') || [];
    return {lightness: Number(l), chroma: Number(c), hue: h};
})();

let mouseX = 0, mouseY = 0, all_rects = [], rafId = null,
shouldUpdate = false, frameCounter = 0, currentSelector = 0;

function isInViewport(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 && rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function update_rect(rect) {
    const { x, y, width, height } = rect.getBoundingClientRect(),
    diffX = mouseX - x, diffY = mouseY - y,
    centerDiffX = mouseX - (x + width * 0.5),
    centerDiffY = mouseY - (y + height * 0.5),
    len = Math.hypot(centerDiffX, centerDiffY),
    ch = `${chroma} ${hue}`,
    colInner = `oklch(${lightness * 1.16} ${ch})`,
    colOuter = `oklch(${lightness / 1.5} ${chroma / 2} ${hue})`,
    shadow = `oklch(${lightness / 4} ${chroma / 1.5} ${hue} / 0.6)`,
    glow = `oklch(${lightness * 1.16} ${ch} / 0.2)`;

    rect.style.cssText = `
        background-image: radial-gradient(circle at ${diffX}rem ${diffY}rem, ${colInner}, ${colOuter});
        box-shadow:
            ${-centerDiffX * 0.06}rem ${-centerDiffY * 0.06}rem ${len * 0.1}rem ${shadow},
            0 0 40rem ${glow},
            inset ${centerDiffX * 0.06}rem ${centerDiffY * 0.06}rem ${len * 0.1}rem oklch(0 0 0 / .3),
            inset 0 0 50rem oklch(0 0 0 / .3)
    `;
}

function animateRects() {
    all_rects = all_rects.filter(x => document.contains(x)); /*Remove unused*/
    if (shouldUpdate) {
        // Distribute rendering across frames
        const batchSize = Math.ceil(all_rects.length / 4),
        start = (frameCounter % 4) * batchSize,
        end = start + batchSize;

        // Update 1/4 of elements per frame
        all_rects.slice(start, end).forEach(x =>{
          if (isInViewport(x)) update_rect(x);
        });
        // Update every 2 frames
        if (frameCounter % 2 === 0) {
            bg_light.style.backgroundImage = `radial-gradient(ellipse at ${mouseX}rem ${mouseY}rem, oklch(1 0 0 / .5), transparent)`;
        }
        shouldUpdate = false; frameCounter++;
    }
    rafId = requestAnimationFrame(animateRects);
}

function registerSelectorsInBatches() {
    // Register a few selectors per frame
    const batchSize = 2,
    end = Math.min(currentSelector + batchSize, selectorList.length);

    for (let i = currentSelector; i < end; i++) {
        $ready(selectorList[i], (newElement) => {
            all_rects.push(newElement);
        });
    }
    currentSelector = end;

    // Restart if all selectors registered
    if (currentSelector >= selectorList.length) currentSelector = 0;
}

registerSelectorsInBatches();

$event(window, 'pointermove', (ev) => {
    [mouseX, mouseY] = [ev.clientX, ev.clientY];
    shouldUpdate = true;

    // Periodically register more selectors
    if (frameCounter % 30 === 0) registerSelectorsInBatches();
});

animateRects();
return ()=>{ if (rafId) cancelAnimationFrame(rafId)};

})();