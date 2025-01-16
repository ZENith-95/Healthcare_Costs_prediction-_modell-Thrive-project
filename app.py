from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib

app = Flask(__name__)

CORS(app)

# Load the trained model
model = joblib.load("Healthcare_Costs_Prediction_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # Preprocess input
    input_features = [
        data['age'], 
        1 if data['sex'] == 'male' else 0,
        data['bmi'],
        data['children'],
        1 if data['smoker'] == 'yes' else 0,
        # Adjust encoding for region based on the training
        1 if data['region'] == 'northwest' else 0,
        1 if data['region'] == 'southeast' else 0,
        1 if data['region'] == 'southwest' else 0
    ]
    
    # Prediction
    prediction = model.predict([input_features])
    return jsonify({'estimated_cost': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)