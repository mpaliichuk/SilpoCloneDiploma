document.addEventListener('DOMContentLoaded', function () {
    const panels = document.querySelectorAll('.panel');

    panels.forEach(panel => {
        panel.addEventListener('mouseenter', function () {
            const img = panel.querySelector('img');
            if (img) {
                if (!img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                }
                img.src = img.src.replace(/icons\//, 'icons/Hover');
            }
        });

        panel.addEventListener('mouseleave', function () {
            const img = panel.querySelector('img');
            if (img && img.dataset.originalSrc) {
                img.src = img.dataset.originalSrc;
            }
        });
    });
});