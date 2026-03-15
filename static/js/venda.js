document.addEventListener('DOMContentLoaded', () => {
    const inputBarcode = document.getElementById('barcode');
    const tabelaCorpo = document.querySelector('#tabela-itens tbody');
    const displayTotal = document.getElementById('valor-total');
    const btnVendaPaga = document.querySelector('.btn-acao.pago');
    
    let itensVenda = [];
    
    inputBarcode.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ean = inputBarcode.value.trim();
            if (!ean) return;

            try {
                const response = await fetch(`/api/consulta-ean/${ean}`);
                const data = await response.json();

                if (data.sucesso && data.origem === 'local') {
                    adicionarItem(data, ean);
                } else {
                    alert("Produto não cadastrado ou não encontrado localmente.");
                }
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
            
            inputBarcode.value = ''; 
            inputBarcode.focus();
        }
    });

    function adicionarItem(produto, ean) {
        const itemExistente = itensVenda.find(item => item.ean === ean);

        if (itemExistente) {
            itemExistente.qtd += 1;
            itemExistente.total = itemExistente.qtd * itemExistente.preco;
        } else {
            itensVenda.push({
                ean: ean,
                nome: produto.nome,
                preco: parseFloat(produto.preco),
                qtd: 1,
                total: parseFloat(produto.preco)
            });
        }
        renderizarTabela();
    }

    // O "Freio" do operador
    function diminuirItem(ean) {
        const index = itensVenda.findIndex(item => item.ean === ean);
        
        if (index !== -1) {
            if (itensVenda[index].qtd > 1) {
                itensVenda[index].qtd -= 1;
                itensVenda[index].total = itensVenda[index].qtd * itensVenda[index].preco;
            } else {
                itensVenda.splice(index, 1);
            }
            renderizarTabela();
            inputBarcode.focus(); 
        }
    }

    // NOVA FUNÇÃO: O "Acelerador" do operador
    function aumentarItem(ean) {
        const index = itensVenda.findIndex(item => item.ean === ean);
        
        if (index !== -1) {
            itensVenda[index].qtd += 1;
            itensVenda[index].total = itensVenda[index].qtd * itensVenda[index].preco;
            renderizarTabela();
            inputBarcode.focus(); 
        }
    }

    // INTERCEPTADOR DE CLIQUES NA TABELA (Delegação de Eventos expandida)
    tabelaCorpo.addEventListener('click', (e) => {
        // Captura o clique no botão de menos
        if (e.target.classList.contains('btn-menos')) {
            const ean = e.target.getAttribute('data-ean');
            diminuirItem(ean);
        }
        // Captura o clique no botão de mais
        else if (e.target.classList.contains('btn-mais')) {
            const ean = e.target.getAttribute('data-ean');
            aumentarItem(ean);
        }
    });

    function renderizarTabela() {
        tabelaCorpo.innerHTML = '';
        let totalGeral = 0;

        itensVenda.forEach(item => {
            totalGeral += item.total;
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

        displayTotal.innerText = `R$ ${totalGeral.toFixed(2)}`;
    }
    btnVendaPaga.addEventListener('click', async () => {
        if (itensVenda.length === 0) {
            alert("Caixa vazio. Bipe algum produto.");
            inputBarcode.focus();
            return;
        }

        // Soma total confiável do front-end
        const valorTotal = itensVenda.reduce((acc, item) => acc + item.total, 0);

        const payload = {
            itens: itensVenda,
            valor_total: valorTotal
        };

        try {
            // Desabilita o botão temporariamente para evitar clique duplo (ansiedade de operador)
            btnVendaPaga.disabled = true;
            btnVendaPaga.innerText = "SALVANDO...";

            const response = await fetch('/api/salvar_venda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.sucesso) {
                // Tiro curto: Salva e volta pro menu para o próximo cliente
                window.location.href = '/'; 
            } else {
                alert("Erro no servidor: " + data.mensagem);
                btnVendaPaga.disabled = false;
                btnVendaPaga.innerText = "FINALIZAR VENDA";
                inputBarcode.focus();
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro de conexão. A venda não foi salva.");
            btnVendaPaga.disabled = false;
            btnVendaPaga.innerText = "FINALIZAR VENDA";
            inputBarcode.focus();
        }
    });
});

