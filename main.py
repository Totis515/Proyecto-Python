from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # Variables Jinja para pasar a la plantilla
    context = {
        'autor': 'Milton Mendoza - Kodland',
        'titulo_pagina': 'EcoBot & Climate Arcade',
        'mensaje_bienvenida': '¡Bienvenido a la iniciativa Eco-Cyber!'
    }
    return render_template('index.html', **context)

@app.route('/api/stats')
def stats():
    # Enrutamiento adicional
    return {"co2_reduction": "15%", "trees_planted": 12500}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
