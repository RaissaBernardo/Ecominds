from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pymysql

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Configuração do banco
db = pymysql.connect(
    host="localhost",
    user="root",
    password="123456",
    database="dados"
)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/sensores', methods=['GET'])
def get_sensor_data():
    cursor = db.cursor()
    cursor.execute("SELECT temp, umi FROM sensores ORDER BY datahora DESC LIMIT 1")
    result = cursor.fetchone()
    cursor.close()
    if result:
        return jsonify({"temp": result[0], "umi": result[1]})
    else:
        return jsonify({"erro": "Nenhum dado encontrado"}), 404

@app.route('/api/historico', methods=['GET'])
def get_historico():
    cursor = db.cursor()
    cursor.execute("""
        SELECT datahora, temp, umi 
        FROM sensores 
        ORDER BY datahora DESC 
        LIMIT 10
    """)
    results = cursor.fetchall()
    cursor.close()
    return jsonify([
        {
            "hora": row[0].strftime('%Y-%m-%d %H:%M:%S'),
            "temperatura": float(row[1]),
            "umidade": float(row[2])
        } for row in results
    ])

if __name__ == '__main__':
    app.run(port=5500, debug=True)
