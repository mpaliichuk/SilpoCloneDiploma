document.addEventListener('DOMContentLoaded', function () {
    const panels = document.querySelectorAll('.panel');
    var acc = document.querySelectorAll('.custonAccordion');

    acc.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('active');

            var text = this.nextElementSibling;
            if (text.style.maxHeight) {
                text.style.maxHeight = null;
            } else {
                text.style.maxHeight = text.scrollHeight + "px";
            }
          
        });
        const img = item.querySelector('.accordionButton img');
        img.addEventListener('mouseenter', function () {
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            img.src = img.src.replace(/icons\//, 'icons/Hover');
        });

        img.addEventListener('mouseleave', function () {
            if (item.classList.contains('active')) {
                img.src = '/icons/Minus.png';
            } else {
                img.src = img.dataset.originalSrc;
            }
        });
    });

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