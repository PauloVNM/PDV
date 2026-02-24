document.addEventListener('DOMContentLoaded', () => {
    const inputMargem = document.getElementById('margem_lucro');
    const inputCustoReais = document.getElementById('custo_reais');
    const inputCustoCents = document.getElementById('custo_cents');
    const inputVendaReais = document.getElementById('venda_reais');
    const inputVendaCents = document.getElementById('venda_cents');
    const inputPrecoOculto = document.getElementById('preco_final_oculto');
    const formCadastro = document.getElementById('form-cadastro');

    // 1. CARREGA A "MARCHA ENGATADA" (localStorage)
    const margemSalva = localStorage.getItem('mercado_margem_padrao');
    if (margemSalva) {
        inputMargem.value = margemSalva;
    }

    // 2. FUNÇÃO: A Regra da Dezena ("5" vira "50", "05" fica "05")
    function formatarCentavos(valorStr) {
        if (!valorStr) return '00';
        if (valorStr.length === 1) return valorStr + '0';
        return valorStr.slice(0, 2); // Garante que não passe de 2 dígitos
    }

    // 3. O MOTOR DE CÁLCULO AUTOMÁTICO
    function recalcularVenda() {
        const margem = parseFloat(inputMargem.value) || 0;
        const reais = parseFloat(inputCustoReais.value) || 0;
        const centsStr = formatarCentavos(inputCustoCents.value);
        
        // Junta custo R$ e Centavos num float só
        const custoTotal = parseFloat(`${reais}.${centsStr}`);
        
        if (custoTotal > 0) {
            // Aplica a porcentagem
            const precoVendaTotal = custoTotal * (1 + (margem / 100));
            
            // Fatiando o resultado para cuspir nos inputs de venda
            const vendaStr = precoVendaTotal.toFixed(2).split('.');
            inputVendaReais.value = vendaStr[0];
            inputVendaCents.value = vendaStr[1];
        }
        
        atualizarPrecoOculto();
    }

    // 4. FUNÇÃO: Alimenta o campo invisível que vai pro Banco de Dados
    function atualizarPrecoOculto() {
        const vReais = parseInt(inputVendaReais.value) || 0;
        const vCents = formatarCentavos(inputVendaCents.value);
        inputPrecoOculto.value = `${vReais}.${vCents}`;
    }

    // GATILHOS: Quando o operador digitar Custo ou Margem, roda o cálculo
    inputMargem.addEventListener('input', recalcularVenda);
    inputCustoReais.addEventListener('input', recalcularVenda);
    inputCustoCents.addEventListener('input', recalcularVenda);

    // GATILHOS DA "MENTIRA": Se ele alterar a Venda na mão, só atualiza o oculto
    inputVendaReais.addEventListener('input', atualizarPrecoOculto);
    inputVendaCents.addEventListener('input', atualizarPrecoOculto);

    // 5. INTERCEPTADOR DO BOTÃO SALVAR
    formCadastro.addEventListener('submit', (e) => {
        // Antes de enviar pro Python, salva a margem atual no navegador
        if (inputMargem.value) {
            localStorage.setItem('mercado_margem_padrao', inputMargem.value);
        }
        // Aplica a formatação final pra garantir que não vai lixo pro banco
        atualizarPrecoOculto();
        
        // Se o preço final for 0 ou vazio, bloqueia o envio
        if (!inputPrecoOculto.value || parseFloat(inputPrecoOculto.value) === 0) {
            e.preventDefault();
            alert("Erro: O preço de venda não pode ser zero.");
            inputVendaReais.focus();
        }
    });
});