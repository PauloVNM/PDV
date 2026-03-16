// static/js/produtos_ui.js
// Responsabilidade: Controlar o DOM e orquestrar a API e a Precificação.

document.addEventListener('DOMContentLoaded', () => {
    const inputs = {
        ean: document.getElementById('codigo_ean'),
        nome: document.getElementById('nome_produto'),
        marca: document.getElementById('marca_produto'),
        margem: document.getElementById('margem_lucro'),
        custoReais: document.getElementById('custo_reais'),
        custoCents: document.getElementById('custo_cents'),
        vendaReais: document.getElementById('venda_reais'),
        vendaCents: document.getElementById('venda_cents'),
        precoOculto: document.getElementById('preco_final_oculto')
    };
    const statusEan = document.getElementById('status_ean');
    const formCadastro = document.getElementById('form-cadastro');

    // 1. Setup inicial da margem guardada
    const margemSalva = localStorage.getItem('mercado_margem_padrao');
    if (margemSalva) inputs.margem.value = margemSalva;

    // 2. Controladores de Ecrã
    function atualizarPrecoVendaDOM(reais, centavos) {
        inputs.vendaReais.value = reais;
        inputs.vendaCents.value = centavos;
        atualizarPrecoOcultoDOM();
    }

    function atualizarPrecoOcultoDOM() {
        inputs.precoOculto.value = Precificacao.obterPrecoFinalOculto(
            inputs.vendaReais.value,
            inputs.vendaCents.value
        );
    }

    function executarCalculo() {
        const margem = parseFloat(inputs.margem.value) || 0;
        const reais = parseFloat(inputs.custoReais.value) || 0;
        const resultado = Precificacao.calcularVenda(margem, reais, inputs.custoCents.value);
        
        if (resultado) {
            atualizarPrecoVendaDOM(resultado.reais, resultado.centavos);
        } else {
            atualizarPrecoOcultoDOM();
        }
    }

    // 3. Ouvintes de Cálculo Financeiro
    inputs.margem.addEventListener('input', executarCalculo);
    inputs.custoReais.addEventListener('input', executarCalculo);
    inputs.custoCents.addEventListener('input', executarCalculo);
    inputs.vendaReais.addEventListener('input', atualizarPrecoOcultoDOM);
    inputs.vendaCents.addEventListener('input', atualizarPrecoOcultoDOM);

    // 4. Ouvinte do Leitor de Códigos
    inputs.ean.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const ean = inputs.ean.value.trim();
            if (!ean) return;

            statusEan.innerText = "A procurar...";
            statusEan.style.color = "#f39c12";

            const data = await APIProdutos.consultarEAN(ean);

            if (data.sucesso) {
                inputs.nome.value = data.nome;
                inputs.marca.value = data.marca;

                if (data.origem === "local") {
                    statusEan.innerText = "Produto Local Encontrado";
                    statusEan.style.color = "#27ae60";

                    const precoFatiado = parseFloat(data.preco).toFixed(2).split('.');
                    atualizarPrecoVendaDOM(precoFatiado[0], precoFatiado[1]);

                    inputs.margem.value = "";
                    inputs.custoReais.value = "";
                    inputs.custoCents.value = "";
                    localStorage.removeItem('mercado_margem_padrao');

                    inputs.vendaReais.focus();
                } else {
                    statusEan.innerText = "Não registado.";
                    statusEan.style.color = "#e74c3c";
                    inputs.nome.focus();
                }
            } else {
                statusEan.innerText = "Erro ou não encontrado.";
                statusEan.style.color = "#e74c3c";
                inputs.nome.focus();
            }
        }
    });

    // 5. Blindagem de Submissão
    formCadastro.addEventListener('submit', (e) => {
        if (inputs.margem.value) {
            localStorage.setItem('mercado_margem_padrao', inputs.margem.value);
        }
        atualizarPrecoOcultoDOM();
        
        if (!inputs.precoOculto.value || parseFloat(inputs.precoOculto.value) === 0) {
            e.preventDefault();
            inputs.vendaReais.focus();
        }
    });
});