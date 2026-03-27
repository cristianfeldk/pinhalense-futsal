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

const routes = {
    '/': { section: 'topo', title: 'APEB - Pinhalense Futsal' },
    '/conquistas': { section: 'conquistas', title: 'Conquistas - APEB' },
    '/galeria': { section: 'galeria', title: 'Galeria - APEB' },
    '/faq': { section: 'faq', title: 'FAQ - APEB' },
};

function navigate(path, addToHistory = true) {
    const route = routes[path];
    
    if (route) {
        if (addToHistory) {
            window.history.pushState({ path }, '', path);
        }
        
        document.title = route.title;
        
        const section = document.getElementById(route.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function initRouter() {
    document.addEventListener('click', (e) => {
        const hashLink = e.target.closest('a[href^="#"]');
        if (hashLink) {
            e.preventDefault();
            const targetId = hashLink.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        const link = e.target.closest('a[href^="/"]');
        if (link && !link.getAttribute('href').includes('transparencia')) {
            e.preventDefault();
            const path = link.getAttribute('href');
            navigate(path);
            return;
        }
    });
    
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.path) {
            navigate(e.state.path, false);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    const currentPath = window.location.pathname;
    if (routes[currentPath]) {
        setTimeout(() => {
            navigate(currentPath, false);
        }, 500);
    }
}

function initPage() {
    loadHTML('header', 'header.html');
    loadHTML('topo', 'section-topo.html');
    loadHTML('conquistas', 'section-conquistas.html');
    loadHTML('galeria', 'section-evento.html');
    loadHTML('faq', 'section-faq.html');
    loadHTML('horario', 'section-horarios.html');
    loadHTML('footer', 'footer.html');

    setTimeout(initSearch, 100);
    setTimeout(initRouter, 200);

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

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput) {
        console.log('Elementos de busca não encontrados, tentando novamente...');
        return;
    }

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.busca-container')) {
            searchResults.classList.remove('show');
        }
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    const results = [];
    
    const searchableElements = document.querySelectorAll('h1, h2, h3, h4, p, li, span, a, .btn-download');
    const queryLower = query.toLowerCase();

    searchableElements.forEach(element => {
        const text = element.textContent;
        const textLower = text.toLowerCase();
        
        if (textLower.includes(queryLower) && text.trim().length > 0) {
            const index = textLower.indexOf(queryLower);
            const start = Math.max(0, index - 40);
            const end = Math.min(text.length, index + query.length + 40);
            let snippet = text.substring(start, end);
            
            if (start > 0) snippet = '...' + snippet;
            if (end < text.length) snippet = snippet + '...';

            const regex = new RegExp(`(${query})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');

            let section = 'Página';
            const closestSection = element.closest('section');
            if (closestSection) {
                const sectionTitle = closestSection.querySelector('h2, h3');
                if (sectionTitle) {
                    section = sectionTitle.textContent.trim();
                }
            }

            results.push({
                element: element,
                section: section,
                snippet: snippet,
                text: text.trim(),
                isCurrentPage: true
            });
        }
    });

    if (typeof searchInIndex === 'function') {
        const indexResults = searchInIndex(query);
        indexResults.forEach(indexResult => {
            if (!indexResult.isCurrentPage) {
                results.push({
                    element: null,
                    section: indexResult.section,
                    snippet: `Encontrado em: ${indexResult.section}`,
                    text: indexResult.section,
                    isCurrentPage: false,
                    targetPage: indexResult.page
                });
            }
        });
    }

    displayResults(results, query);
}

function displayResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="bi bi-search" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                Nenhum resultado encontrado para "${query}"
            </div>
        `;
        searchResults.classList.add('show');
        return;
    }

    const uniqueResults = [];
    const seenTexts = new Set();
    
    results.forEach(result => {
        const key = result.text.substring(0, 100);
        if (!seenTexts.has(key)) {
            seenTexts.add(key);
            uniqueResults.push(result);
        }
    });

    const limitedResults = uniqueResults.slice(0, 10);

    searchResults.innerHTML = limitedResults.map((result, index) => {
        const pageIndicator = result.isCurrentPage ? '' : '<span class="other-page-badge"><i class="bi bi-box-arrow-up-right"></i> Outra página</span>';
        return `
            <div class="search-result-item" data-index="${index}" data-target-page="${result.targetPage || ''}">
                <div class="search-result-title">${result.section} ${pageIndicator}</div>
                <div class="search-result-text">${result.snippet}</div>
            </div>
        `;
    }).join('');

    searchResults.classList.add('show');

    searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const result = limitedResults[index];
            
            if (result.isCurrentPage && result.element) {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                result.element.style.transition = 'background-color 0.3s';
                result.element.style.backgroundColor = 'rgba(0, 158, 16, 0.2)';
                
                setTimeout(() => {
                    result.element.style.backgroundColor = '';
                }, 2000);
            } else if (result.targetPage) {
                window.location.href = './' + result.targetPage;
            }

            searchResults.classList.remove('show');
        });
    });
}

document.addEventListener('DOMContentLoaded', initPage);
