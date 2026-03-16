// Responsabilidade: Comunicação blindada com o back-end (Python)
const APIVenda = {
    consultarProduto: async function(ean) {
        try {
            const response = await fetch(`/api/consulta-ean/${ean}`);
            return await response.json();
        } catch (error) {
            console.error("Erro na consulta do EAN:", error);
            return { sucesso: false, mensagem: "Erro de ligação." };
        }
    },

    salvarVendaPaga: async function(payload) {
        try {
            const response = await fetch('/api/salvar_venda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (error) {
            console.error("Erro ao guardar venda:", error);
            return { sucesso: false, mensagem: "Falha na rede ao guardar a venda." };
        }
    }
};