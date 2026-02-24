document.addEventListener('DOMContentLoaded', () => {
    const inputEan = document.getElementById('codigo_ean');
    const inputNome = document.getElementById('nome_produto');
    const inputMarca = document.getElementById('marca_produto');
    const inputPreco = document.getElementById('preco_produto');
    const statusEan = document.getElementById('status_ean');

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
                    statusEan.innerText = "Encontrado!";
                    statusEan.style.color = "#27ae60";
                    inputPreco.focus();
                } else {
                    statusEan.innerText = "Não cadastrado.";
                    statusEan.style.color = "#e74c3c";
                    inputNome.focus();
                }
            } catch (error) {
                statusEan.innerText = "Erro de conexão.";
                inputNome.focus();
            }
        }
    });
});