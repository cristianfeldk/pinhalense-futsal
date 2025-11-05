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
            
            // Se carregou o FAQ, inicializa a funcionalidade
            if (file === 'section-faq.html') {
                setTimeout(initFAQ, 50); // Pequeno delay para garantir que o DOM foi atualizado
            }
        } catch (err) {
            el.innerHTML = `<p style="color:red;">Erro ao carregar ${file}</p>`;
        } finally {
            iframe.remove();
        }
    };

    document.body.appendChild(iframe);
}

// Função para inicializar a funcionalidade do FAQ
function initFAQ() {
    const q = document.querySelectorAll(".q");
    const a = document.querySelectorAll(".a");
    const arr = document.querySelectorAll(".arrow");

    console.log("FAQ inicializado - elementos encontrados:", q.length, a.length, arr.length);

    for(let i = 0; i < q.length; i++) {
        q[i].addEventListener("click", () => {
            console.log("Clique na pergunta", i);
            a[i].classList.toggle("a-opened");
            arr[i].classList.toggle("arrow-rotated");
        });
    }
}

function initPage() {
    loadHTML('header', 'header.html');
    loadHTML('topo', 'section-topo.html');
    loadHTML('galeria', 'section-evento.html');
    loadHTML('faq', 'section-faq.html');
    loadHTML('horario', 'section-horarios.html');
    loadHTML('footer', 'footer.html');


    document.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-contraste')) {
            document.body.classList.toggle('alto-contraste');
        }
    });
}

document.addEventListener('DOMContentLoaded', initPage);
