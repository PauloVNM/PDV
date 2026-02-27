document.addEventListener('DOMContentLoaded', () => {
    const inputEan = document.getElementById('codigo_ean');
    const inputNome = document.getElementById('nome_produto');
    const inputMarca = document.getElementById('marca_produto');
    const statusEan = document.getElementById('status_ean');
    
    // Captura os novos campos de venda
    const inputVendaReais = document.getElementById('venda_reais');
    const inputVendaCents = document.getElementById('venda_cents');
    const inputPrecoOculto = document.getElementById('preco_final_oculto');

    // Captura os campos que vamos LIMPAR pra não confundir o operador
    const inputMargem = document.getElementById('margem_lucro');
    const inputCustoReais = document.getElementById('custo_reais');
    const inputCustoCents = document.getElementById('custo_cents');

    inputEan.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ean = inputEan.value.trim();
            if (!ean) return;

            statusEan.innerText = "Buscando...";
            statusEan.style.color = "#f39c12";

            try {
                const response = await fetch(`/api/consulta-ean/${ean}`);
                const data = await response.json();

                if (data.sucesso) {
                    inputNome.value = data.nome;
                    inputMarca.value = data.marca;

                    if (data.origem === "local") {
                        // ACHOU NO BANCO: Preenche o preço e limpa a matemática
                        statusEan.innerText = "Produto Local Encontrado";
                        statusEan.style.color = "#27ae60"; // Verde

                        // Fatiando o preço que veio do banco (Ex: 10.50 -> 10 e 50)
                        const precoFatiado = parseFloat(data.preco).toFixed(2).split('.');
                        inputVendaReais.value = precoFatiado[0];
                        inputVendaCents.value = precoFatiado[1];
                        inputPrecoOculto.value = data.preco;

                        // A SUA REGRA AQUI: Limpando a poluição visual e o cache
                        inputMargem.value = "";
                        inputCustoReais.value = "";
                        inputCustoCents.value = "";
                        localStorage.removeItem('mercado_margem_padrao');

                        // Joga a mira pro campo de venda caso ele queira reajustar o preço na mão
                        inputVendaReais.focus();
                    } else {
                        // NÃO ACHOU EM LUGAR NENHUM
                        statusEan.innerText = "Não cadastrado.";
                        statusEan.style.color = "#e74c3c"; // Vermelho
                        inputNome.focus(); // Joga a mira pro Nome pra ele digitar do zero
                    }

                } 
    
            } catch (error) {
                statusEan.innerText = "Erro de conexão.";
                statusEan.style.color = "#e74c3c";
                inputNome.focus();
            }
        }
    });
});