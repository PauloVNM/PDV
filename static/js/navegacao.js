// Responsabilidade: Motor global de navegação matricial (Keyboard-only).
// Intercepta eventos de teclado para mover o foco entre seções e itens, garantindo operação 100% sem mouse.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mapeia apenas as seções que contêm algo interagível
    const sections = Array.from(document.querySelectorAll('section')).filter(sec => {
        return sec.querySelectorAll('a, input, button').length > 0;
    });

    // Se a página não tiver seções válidas, o script aborta silenciosamente para não quebrar nada
    if (sections.length === 0) return;

    let secIndex = 0;
    let itemIndex = 0;

    // 2. Define o ponto de partida (foco inicial)
    const focoInicial = document.querySelector('[autofocus]');
    if (focoInicial) {
        // Se achou um autofocus (tipo o seu leitor de EAN), descobre em qual section ele tá
        const parentSection = focoInicial.closest('section');
        if (parentSection) {
            secIndex = sections.indexOf(parentSection);
            const items = Array.from(parentSection.querySelectorAll('a, input, button'));
            itemIndex = items.indexOf(focoInicial);
            focoInicial.focus();
        }
    } else {
        // Se não tiver autofocus, trava a mira no primeiro item da primeira section
        const items = Array.from(sections[0].querySelectorAll('a, input, button'));
        if(items.length > 0) items[0].focus();
    }

    // 3. O cérebro da operação: Escuta do Teclado
    document.addEventListener('keydown', (e) => {
        const activeEl = document.activeElement;
        const isTextInput = activeEl.tagName === 'INPUT' && (activeEl.type === 'text' || activeEl.type === 'number');

        // BOTÃO DE PÂNICO: ESC
        if (e.key === 'Escape') {
            e.preventDefault();
            // Em ambiente de produção de PDV, voltar a página anterior do histórico costuma ser o padrão pra tecla ESC
            // Você pode trocar para window.location.href = '/' se preferir forçar a ida pro menu principal sempre.
            window.history.back(); 
            return;
        }

  
        // Pega todos os itens focáveis da seção atual
        let currentItems = Array.from(sections[secIndex].querySelectorAll('a, input, button'));

        // NAVEGAÇÃO HORIZONTAL: Dentro da mesma Section (Itens)
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            itemIndex = (itemIndex + 1) % currentItems.length;
            currentItems[itemIndex].focus();
        }
        else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            itemIndex = (itemIndex - 1 + currentItems.length) % currentItems.length;
            currentItems[itemIndex].focus();
        }
        // NAVEGAÇÃO VERTICAL: Pula de Section
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            secIndex = (secIndex + 1) % sections.length;
            currentItems = Array.from(sections[secIndex].querySelectorAll('a, input, button'));
            itemIndex = 0; // Toda vez que muda de bloco, o foco vai pro primeiro item dele
            currentItems[itemIndex].focus();
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            secIndex = (secIndex - 1 + sections.length) % sections.length;
            currentItems = Array.from(sections[secIndex].querySelectorAll('a, input, button'));
            itemIndex = 0;
            currentItems[itemIndex].focus();
        }
        // ENTER: Comportamento de salto rápido em formulários
        else if (e.key === 'Enter') {
            // Se estiver num input normal (que não seja o leitor de EAN), o Enter pula pro próximo campo
            if (isTextInput && activeEl.id !== 'codigo_ean' && activeEl.id !== 'barcode') {
                e.preventDefault();
                itemIndex = (itemIndex + 1) % currentItems.length;
                currentItems[itemIndex].focus();
            }
        }
    });
});