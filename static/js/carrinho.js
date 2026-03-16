// Responsabilidade: Gerenciar exclusivamente os dados da venda em memória.

const Carrinho = {
    itens: [],

    adicionar: function(produto, ean) {
        const itemExistente = this.itens.find(item => item.ean === ean);

        if (itemExistente) {
            itemExistente.qtd += 1;
            itemExistente.total = itemExistente.qtd * itemExistente.preco;
        } else {
            this.itens.push({
                ean: ean,
                nome: produto.nome,
                preco: parseFloat(produto.preco),
                qtd: 1,
                total: parseFloat(produto.preco)
            });
        }
    },

    diminuir: function(ean) {
        const index = this.itens.findIndex(item => item.ean === ean);
        
        if (index !== -1) {
            if (this.itens[index].qtd > 1) {
                this.itens[index].qtd -= 1;
                this.itens[index].total = this.itens[index].qtd * this.itens[index].preco;
            } else {
                // Remove o item se a quantidade chegar a zero
                this.itens.splice(index, 1);
            }
        }
    },

    aumentar: function(ean) {
        const index = this.itens.findIndex(item => item.ean === ean);
        
        if (index !== -1) {
            this.itens[index].qtd += 1;
            this.itens[index].total = this.itens[index].qtd * this.itens[index].preco;
        }
    },

    obterTotal: function() {
        return this.itens.reduce((acc, item) => acc + item.total, 0);
    },

    limpar: function() {
        this.itens = [];
    }
};