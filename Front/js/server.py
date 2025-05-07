from flask import Flask, jsonify
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# Configuração do MySQL
db = pymysql.connect(
    host="localhost",
    user="root",
    password="123456",
    database="dados"
)

# Rota para o último dado do sensor
@app.route('/api/sensores', methods=['GET'])
def get_sensor_data():
    cursor = db.cursor()
    cursor.execute("SELECT temp, umi FROM sensores ORDER BY datahora DESC LIMIT 1")
    result = cursor.fetchone()
    cursor.close()
    
    if result:
        data = {
            "temp": result[0],
            "umi": result[1]
        }
        return jsonify(data)
    else:
        return jsonify({"erro": "Nenhum dado encontrado"}), 404

# Rota para o histórico (10 registros mais recentes)
@app.route('/api/historico', methods=['GET'])
def get_historico():
    cursor = db.cursor()
    cursor.execute("""
        SELECT 
            datahora as hora, 
            temp as temperatura 
        FROM sensores 
        ORDER BY datahora DESC 
        LIMIT 10
    """)
    results = cursor.fetchall()
    cursor.close()
    return jsonify([{"hora": row[0], "temperatura": float(row[1])} for row in results])

if __name__ == '__main__':
    app.run(port=5500, debug=True)