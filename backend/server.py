from flask import Flask, jsonify, request
from flask_cors import CORS
import face_recognition

app = Flask(__name__)
CORS(app)

def compare(img):
    image_path_1 = 'images/'+img
    image_path_2 = 'images/p2.png'

    # Wczytaj obrazy
    image_1 = face_recognition.load_image_file(image_path_1)
    image_2 = face_recognition.load_image_file(image_path_2)

    # Znajdź twarze na obrazach
    face_locations_1 = face_recognition.face_locations(image_1)
    face_locations_2 = face_recognition.face_locations(image_2)

    # Jeśli znaleziono więcej niż jedną twarz na którymś z obrazów, użyj pierwszej znalezionej
    if len(face_locations_1) == 0 or len(face_locations_2) == 0:
        return "Nie znaleziono twarzy na jednym z obrazów."

    # kodowanie twarzy z obrazów
    face_encoding_1 = face_recognition.face_encodings(image_1, known_face_locations=[face_locations_1[0]])[0]
    face_encoding_2 = face_recognition.face_encodings(image_2, known_face_locations=[face_locations_2[0]])[0]

    # porównanie twarzy
    results = face_recognition.compare_faces([face_encoding_1], face_encoding_2)

    if results[0]:
        return "Twarze są identyczne."
    else:
        return "Twarze nie są identyczne."

# Przykładowa lista danych
accounts = [
    {"id": 1, "login": "jakubkurzacz123", "password": "zaq12wsx", "image": "p1.png"},
    {"id": 2, "login": "lukaszbis123", "password": "zaq12wsx", "image": "p2.png"},
    {"id": 3, "login": "damiankostek123", "password": "zaq12wsx", "image": "p3.png"}
]

# Ustawienie nagłówków CORS
@app.after_request
def set_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'  # Wpisz swoje pochodzenie (origin)
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Endpoint do pobierania wszystkich danych
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(accounts)

# Endpoint do pobierania danych o produkcie na podstawie ID
@app.route('/api/products/<string:varlogin>/<string:varpassword>', methods=['GET'])
def get_product(varlogin, varpassword):
    account = next((item for item in accounts if item["login"] == varlogin and item["password"] == varpassword), None)
    if account:
        return jsonify(account, compare(account["image"]))
    else:
        return jsonify({"message": "Account not found"}), 404

# Endpoint do dodawania nowego produktu
@app.route('/api/account', methods=['POST'])
def get_account():
    data = request.form
    login = data.get('login')
    password = data.get('password')
    image = request.files.get('image')

    if not login or not password or not image:
        return jsonify({"message": "Brakuje danych"}), 400

    account = next((item for item in accounts if item["login"] == login and item["password"] == password), None)

    if account:
        return jsonify(image)
    else:
        return jsonify({"message": "Account not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
