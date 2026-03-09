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
            
            if (file === 'section-apresentacao.html') {
                setTimeout(initPDFViewer, 100);
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
    loadHTML('conquistas', 'section-conquistas.html');
    loadHTML('galeria', 'section-evento.html');
    loadHTML('apresentacao', 'section-apresentacao.html');
    loadHTML('apoio', 'section-apoio.html');
    loadHTML('como-apoiar', 'section-como-apoiar.html');
    loadHTML('faq', 'section-faq.html');
    loadHTML('horario', 'section-horarios.html');
    loadHTML('footer', 'footer.html');

    setTimeout(initSearch, 100);

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
    
    const searchableElements = document.querySelectorAll('h1, h2, h3, h4, p, li, span, a');
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
                text: text.trim()
            });
        }
    });

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

    searchResults.innerHTML = limitedResults.map(result => `
        <div class="search-result-item" data-element-id="${result.element.id || ''}">
            <div class="search-result-title">${result.section}</div>
            <div class="search-result-text">${result.snippet}</div>
        </div>
    `).join('');

    searchResults.classList.add('show');

    searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const element = limitedResults[index].element;
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            element.style.transition = 'background-color 0.3s';
            element.style.backgroundColor = 'rgba(0, 158, 16, 0.2)';
            
            setTimeout(() => {
                element.style.backgroundColor = '';
            }, 2000);

            searchResults.classList.remove('show');
        });
    });
}

function initPDFViewer() {
    console.log('=== Iniciando PDF Viewer ===');
    
    if (typeof window.pdfjsLib === 'undefined') {
        console.log('PDF.js não carregado, aguardando...');
        setTimeout(initPDFViewer, 500);
        return;
    }
    
    console.log('PDF.js encontrado!');
    
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const canvas = document.getElementById('pdfCanvas');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const resetZoomButton = document.getElementById('resetZoom');

    if (!canvas || !loadingSpinner || !currentPageSpan || !totalPagesSpan || 
        !prevButton || !nextButton || !zoomInButton || !zoomOutButton || !resetZoomButton) {
        console.log('Elementos DOM não encontrados, aguardando...');
        setTimeout(initPDFViewer, 500);
        return;
    }

    console.log('Todos os elementos DOM encontrados!');
    const ctx = canvas.getContext('2d');

    let pdfDoc = null;
    let currentPage = 1;
    let totalPages = 0;
    let currentScale = 0.5;
    let isRendering = false;

    const pdfUrl = './assets/Apresenta%C3%A7%C3%A3o%20%20Pinhalense%20Futsal%20-%20atualizada.pdf';

    async function loadPDF() {
        try {
            console.log('=== Tentando carregar PDF ===');
            console.log('URL:', pdfUrl);
            
            const loadingTask = window.pdfjsLib.getDocument({
                url: pdfUrl,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
                cMapPacked: true,
            });
            
            pdfDoc = await loadingTask.promise;
            totalPages = pdfDoc.numPages;
            totalPagesSpan.textContent = totalPages;
            console.log('✅ PDF carregado com sucesso! Total de páginas:', totalPages);
            await renderPage(currentPage);
        } catch (error) {
            console.error('❌ Erro detalhado ao carregar PDF:', error);
            console.error('Tipo de erro:', error.name);
            console.error('Mensagem:', error.message);
            loadingSpinner.innerHTML = '<i class="bi bi-exclamation-triangle"></i><p>Erro ao carregar a apresentação. Verifique o console.</p>';
        }
    }

    async function renderPage(pageNum) {
        if (isRendering || !pdfDoc) return;
        
        isRendering = true;
        loadingSpinner.classList.remove('hidden');
        
        try {
            console.log('Renderizando página', pageNum);
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: currentScale });
            
            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';
            
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
            
            const renderContext = {
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            currentPageSpan.textContent = pageNum;
            updateButtons();
            console.log('✅ Página', pageNum, 'renderizada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao renderizar página:', error);
        } finally {
            loadingSpinner.classList.add('hidden');
            isRendering = false;
        }
    }

    function updateButtons() {
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages;
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    zoomInButton.addEventListener('click', () => {
        currentScale += 0.25;
        renderPage(currentPage);
    });

    zoomOutButton.addEventListener('click', () => {
        if (currentScale > 0.5) {
            currentScale -= 0.25;
            renderPage(currentPage);
        }
    });

    resetZoomButton.addEventListener('click', () => {
        currentScale = 0.6;
        renderPage(currentPage);
    });

    document.addEventListener('keydown', (e) => {
        const section = document.querySelector('.apresentacao-section');
        if (!section) return;
        
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isInView) return;
        
        if (e.key === 'ArrowLeft' && currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    loadPDF();
}

document.addEventListener('DOMContentLoaded', initPage);
