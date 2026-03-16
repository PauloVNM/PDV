// Responsabilidade: Comunicação blindada com o back-end para produtos.

const APIProdutos = {
    consultarEAN: async function(ean) {
        try {
            const response = await fetch(`/api/consulta-ean/${ean}`);
            return await response.json();
        } catch (error) {
            console.error("Erro na consulta do EAN:", error);
            return { sucesso: false, mensagem: "Erro de ligação." };
        }
    }
};