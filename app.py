from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd  # Import pandas

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("Healthcare_Costs_Prediction_model.pkl")

# Define the column names expected by the model
FEATURE_COLUMNS = ['age', 'sex', 'bmi', 'children', 'smoker', 'region']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Create a DataFrame for the input
        input_df = pd.DataFrame([{
            'age': data['age'],
            'sex': data['sex'],
            'bmi': data['bmi'],
            'children': data['children'],
            'smoker': data['smoker'],
            'region': data['region']
        }])

        # Prediction
        prediction = model.predict(input_df)
        return jsonify({'estimated_cost': prediction[0]})

    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True)
