// Responsabilidade: Controlar o DOM (Ecrã) e escutar eventos do operador.

document.addEventListener('DOMContentLoaded', () => {
    const inputBarcode = document.getElementById('barcode');
    const tabelaCorpo = document.querySelector('#tabela-itens tbody');
    const displayTotal = document.getElementById('valor-total');
    const btnVendaPaga = document.querySelector('.btn-acao.pago');
    
    // 1. ATUALIZAÇÃO DO ECRÃ
    function renderizarTabela() {
        tabelaCorpo.innerHTML = '';
        
        Carrinho.itens.forEach(item => {
            const row = `
                <tr>
                    <td>${item.ean}</td>
                    <td>${item.nome}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="btn-menos" data-ean="${item.ean}" tabindex="-1">-</button>
                            <span style="min-width: 20px; text-align: center; font-weight: bold;">${item.qtd}</span>
                            <button class="btn-mais" data-ean="${item.ean}" tabindex="-1">+</button>
                        </div>
                    </td>
                    <td>R$ ${item.preco.toFixed(2)}</td>
                    <td>R$ ${item.total.toFixed(2)}</td>
                </tr>
            `;
            tabelaCorpo.innerHTML += row;
        });

        displayTotal.innerText = `R$ ${Carrinho.obterTotal().toFixed(2)}`;
    }

    // 2. OUVINTES DE EVENTOS (Teclado e Rato)
    inputBarcode.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ean = inputBarcode.value.trim();
            if (!ean) return;

            // Delega para a API
            const data = await APIVenda.consultarProduto(ean);

            if (data.sucesso && data.origem === 'local') {
                // Delega para o Carrinho e atualiza o ecrã
                Carrinho.adicionar(data, ean);
                renderizarTabela();
            } else {
                alert("Produto não registado ou não encontrado localmente.");
            }
            
            inputBarcode.value = ''; 
            inputBarcode.focus();
        }
    });

    tabelaCorpo.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-menos')) {
            Carrinho.diminuir(e.target.getAttribute('data-ean'));
            renderizarTabela();
            inputBarcode.focus();
        }
        else if (e.target.classList.contains('btn-mais')) {
            Carrinho.aumentar(e.target.getAttribute('data-ean'));
            renderizarTabela();
            inputBarcode.focus();
        }
    });

    btnVendaPaga.addEventListener('click', async () => {
        if (Carrinho.itens.length === 0) {
            alert("Caixa vazio. Bipe algum produto.");
            inputBarcode.focus();
            return;
        }

        const payload = {
            itens: Carrinho.itens,
            valor_total: Carrinho.obterTotal()
        };

        btnVendaPaga.disabled = true;
        btnVendaPaga.innerText = "A GUARDAR...";

        // Delega para a API
        const data = await APIVenda.salvarVendaPaga(payload);

        if (data.sucesso) {
            window.location.href = '/'; 
        } else {
            alert("Erro no servidor: " + (data.mensagem || "Desconhecido"));
            btnVendaPaga.disabled = false;
            btnVendaPaga.innerText = "FINALIZAR VENDA";
            inputBarcode.focus();
        }
    });
});