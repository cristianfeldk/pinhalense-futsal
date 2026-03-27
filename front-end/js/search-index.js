const searchIndex = {
    home: [
        { page: 'index.html', section: 'Início', keywords: 'inicio home apeb pinhalense futsal esporte espinosa paulista' },
        { page: 'index.html', section: 'Conquistas', keywords: 'conquistas titulos campeao trofeus premios vitorias historico' },
        { page: 'index.html', section: 'Galeria', keywords: 'galeria fotos imagens eventos jogos partidas' },
        { page: 'index.html', section: 'FAQ', keywords: 'faq perguntas frequentes duvidas ajuda informacoes' },
        { page: 'index.html', section: 'Horários', keywords: 'horarios treinos treinamentos agenda calendario' }
    ],
    
    transparencia: [
        { page: 'transparencia.html', section: 'Transparência', keywords: 'transparencia portal prestacao contas financeiro administrativo gestao' },
        { page: 'transparencia.html', section: 'Documentação Institucional', keywords: 'documentacao institucional estatuto ata eleicao diretoria organograma' },
        { page: 'transparencia.html', section: 'Estatuto', keywords: 'estatuto apeb documento regimento normas regras' },
        { page: 'transparencia.html', section: 'Diretoria', keywords: 'diretoria ata eleicao posse 2022 2024 2025 organograma' },
        { page: 'transparencia.html', section: 'Recursos Públicos', keywords: 'recursos publicos lei incentivo esporte lie programa pie' },
        { page: 'transparencia.html', section: 'Financeiro 2025', keywords: '2025 financeiro dre demonstracao resultado balanco patrimonial orcamento execucao parecer conselho fiscal prestacao contas' },
        { page: 'transparencia.html', section: 'Gestão 2025', keywords: '2025 gestao relatorio atividades' },
        { page: 'transparencia.html', section: 'Financeiro 2024', keywords: '2024 financeiro dre demonstracao resultado balanco patrimonial orcamento execucao parecer conselho fiscal prestacao contas' },
        { page: 'transparencia.html', section: 'Gestão 2024', keywords: '2024 gestao relatorio atividades' }
    ]
};

function searchInIndex(query) {
    const queryLower = query.toLowerCase().trim();
    const results = [];
    
    for (const pageKey in searchIndex) {
        searchIndex[pageKey].forEach(item => {
            const matches = item.keywords.toLowerCase().includes(queryLower) || 
                           item.section.toLowerCase().includes(queryLower);
            
            if (matches) {
                results.push({
                    page: item.page,
                    section: item.section,
                    isCurrentPage: isCurrentPage(item.page)
                });
            }
        });
    }
    
    return results;
}

function isCurrentPage(pageName) {
    const currentPath = window.location.pathname;
    if (pageName === 'index.html') {
        return currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.endsWith('index.html');
    }
    return currentPath.includes(pageName);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { searchIndex, searchInIndex, isCurrentPage };
}
