function loadHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    const filePath = `./includes/${file}`;

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            el.innerHTML = content;
            
            if (file === 'section-faq.html') {
                setTimeout(initFAQ, 50); 
            }
        })
        .catch(err => {
            console.error(`Erro ao carregar ${file}:`, err);
            el.innerHTML = `<p style="color:red;">Erro ao carregar ${file}</p>`;
        });
}

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
        if (e.target.closest('#btn-acessibilidade')) {
            const menuAcessibilidade = e.target.closest('.menu-acessibilidade');
            menuAcessibilidade.classList.toggle('active');
            console.log('Menu de acessibilidade toggled');
        }
        
        if (e.target.closest('#toggle-contraste')) {
            document.body.classList.toggle('alto-contraste');
            console.log('Alto contraste ativo:', document.body.classList.contains('alto-contraste'));
            
            const menuAcessibilidade = document.querySelector('.menu-acessibilidade');
            if (menuAcessibilidade) {
                menuAcessibilidade.classList.remove('active');
            }
        }
        
        if (!e.target.closest('.menu-acessibilidade')) {
            const menuAcessibilidade = document.querySelector('.menu-acessibilidade');
            if (menuAcessibilidade) {
                menuAcessibilidade.classList.remove('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initPage);
