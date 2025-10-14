/**
 * Carrega HTML externo mesmo em modo offline (file://)
 * Compatível com navegadores modernos (Chrome, Edge, Firefox).
 */
function loadHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    const filePath = `./includes/${file}`;

    // Cria um iframe oculto para contornar bloqueios de CORS
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
            iframe.remove(); // limpa o iframe depois de ler o conteúdo
        }
    };

    document.body.appendChild(iframe);
}

/**
 * Inicializa o carregamento das seções
 */
function initPage() {
    loadHTML('header', 'header.html');
    loadHTML('topo', 'section-topo.html');
    loadHTML('evento', 'section-evento.html');
    loadHTML('sobre', 'section-sobre.html');
    loadHTML('footer', 'footer.html');

    // Ativa o modo de contraste após carregamento
    document.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-contraste')) {
            document.body.classList.toggle('alto-contraste');
        }
    });
}

document.addEventListener('DOMContentLoaded', initPage);
