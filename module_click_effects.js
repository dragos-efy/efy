$event($body, 'click', (event) => {
    const x = event.target;
    if (x.matches('button') || x.matches('input')) {
        const rect = x.getBoundingClientRect(),
        offsetX = rect.width / 2, offsetY = rect.height / 2;
        particle_effect(x, offsetX, offsetY, rect.width, rect.height, x.matches('input') ? 'input' : undefined);
    }
});

const particle_effect = (selector, offset_x = 0, offset_y = 0, w = 75, h = 75, bg) => {
    const a = selector.getBoundingClientRect(),
    x = a.left + offset_x, y = a.top + offset_y;
    for (let i = 0; i < 30; i++) create_particle(x, y, w, h, bg);
};

create_particle = (x, y, w = 75, h = 75, bg) => {
    const particle = document.createElement('particle');
    if (bg) particle.classList.add(bg);
    const size = `${Math.floor(Math.random() * 1 + 5)}px`,
    destination = [
        x + (Math.random() - 0.5) * 2 * w,
        y + (Math.random() - 0.5) * 2 * h
    ];

    $body.appendChild(particle);
    [particle.style.width, particle.style.height] = [size, size];

    const animation = particle.animate([
        {transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`, opacity: 1},
        {transform: `translate(${destination[0]}px, ${destination[1]}px)`, opacity: 0}
    ], {
        duration: (Math.random() * 1000 + 500) * (efy.anim_speed || 1),
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: Math.random() * 200
    });
    animation.onfinish = () => particle.remove();
};
