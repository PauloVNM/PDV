import os
import requests
from flask import Flask, render_template, jsonify, request, redirect, url_for
from database import (
    init_db,
    buscar_todos_produtos,
    buscar_produto_por_ean,
    inserir_ou_atualizar_produto,
    registrar_venda_paga
)

app = Flask(__name__)

init_db()

@app.route('/')
def menu():
    return render_template('menu.html')

@app.route('/venda')
def venda():
    return render_template('venda.html')

@app.route('/produtos')
def produtos_escolha():
    return render_template('produtos_escolha.html')

@app.route('/produtos/existentes')
def produtos_existentes():
    produtos = buscar_todos_produtos()
    return render_template('produtos_existentes.html', produtos=produtos)

@app.route('/api/consulta-ean/<ean>')
def consulta_ean(ean):
    # 1. Bate no Banco Local Primeiro (Tiro curto)
    produto = buscar_produto_por_ean(ean)

    if produto:
        # Se achou no seu SQLite, devolve com a flag 'local'
        return jsonify({
            "sucesso": True,
            "origem": "local",
            "nome": produto['nome'],
            "marca": produto['marca'],
            "preco": produto['preco']
        })

    # 2. Se não achou local, aciona a 2ª marcha e busca na Internet
    url = f"https://world.openfoodfacts.org/api/v0/product/{ean}.json"
    try:
        response = requests.get(url, timeout=20)
        data = response.json()
        if data.get('status') == 1:
            p = data.get('product', {})
            return jsonify({
                "sucesso": True,
                "origem": "nuvem",
                "nome": p.get('product_name_pt') or p.get('product_name') or "",
                "marca": p.get('brands', "")
            })
    except:
        pass
    
    # 3. Não existe em lugar nenhum
    return jsonify({"sucesso": False, "origem": "nenhuma"})

@app.route('/salvar_produto_existente', methods=['POST'])
def salvar_produto_existente():
    ean = request.form.get('codigo')
    nome = request.form.get('nome')
    marca = request.form.get('marca')
    preco = request.form.get('preco')
    
    if ean and nome and preco and marca:
        inserir_ou_atualizar_produto(ean, nome, marca, preco)
        
    return redirect(url_for('produtos_existentes'))

@app.route('/api/salvar_venda', methods=['POST'])
def salvar_venda():
    dados = request.get_json()
    itens = dados.get('itens', [])
    valor_total = dados.get('valor_total', 0.0)
    
    if not itens:
        return jsonify({"sucesso": False, "mensagem": "Venda vazia."}), 400

    sucesso, resultado = registrar_venda_paga(itens, valor_total)
    
    if sucesso:
        return jsonify({"sucesso": True, "venda_id": resultado})
    else:
        return jsonify({"sucesso": False, "mensagem": resultado}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)