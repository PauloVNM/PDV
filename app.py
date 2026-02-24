from flask import Flask, render_template, jsonify, request, redirect, url_for
import requests
from database import get_db_connection, init_db

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
    conn = get_db_connection()
    produtos = conn.execute('SELECT * FROM produtos').fetchall()
    conn.close()
    return render_template('produtos_existentes.html', produtos=produtos)

@app.route('/api/consulta-ean/<ean>')
def consulta_ean(ean):
    url = f"https://world.openfoodfacts.org/api/v0/product/{ean}.json"
    try:
        response = requests.get(url, timeout=20)
        data = response.json()
        if data.get('status') == 1:
            p = data.get('product', {})
            return jsonify({
                "sucesso": True,
                "nome": p.get('product_name_pt') or p.get('product_name') or "",
                "marca": p.get('brands', "")
            })
    except:
        pass
    return jsonify({"sucesso": False})

@app.route('/salvar_produto_existente', methods=['POST'])
def salvar_produto_existente():
    ean, nome, marca, preco = request.form.get('codigo'), request.form.get('nome'), request.form.get('marca'), request.form.get('preco')
    
    if ean and nome and preco and marca:
        conn = get_db_connection()
        conn.execute('INSERT OR REPLACE INTO produtos VALUES (?, ?, ?, ?)', (ean, nome, marca, preco))
        conn.commit()
        conn.close()
    return redirect(url_for('produtos_existentes'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)