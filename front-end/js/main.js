function loadHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    const filePath = `./includes/${file}`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = filePath;

    iframe.onload = function () {
        try {
            const content = iframe.contentDocument.body.innerHTML;
            el.innerHTML = content;
        } catch (err) {
            el.innerHTML = `<p style="color:red;">Erro ao carregar ${file}</p>`;
        } finally {
            iframe.remove();
        }
    };

    document.body.appendChild(iframe);
}

function initPage() {
    loadHTML('header', 'header.html');
    loadHTML('topo', 'section-topo.html');
    loadHTML('evento', 'section-evento.html');
    loadHTML('horario', 'section-horarios.html');
    loadHTML('footer', 'footer.html');


    document.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-contraste')) {
            document.body.classList.toggle('alto-contraste');
        }
    });
}

document.addEventListener('DOMContentLoaded', initPage);
