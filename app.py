from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("Healthcare_Costs_Prediction_model.pkl")

# Define expected columns by the model
EXPECTED_COLUMNS = [
    'age', 'bmi', 'children', 'sex_female', 'sex_male', 
    'smoker_no', 'smoker_yes', 
    'region_northeast', 'region_northwest', 'region_southeast', 'region_southwest'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request
        data = request.get_json()
        
        # Create a DataFrame from input
        input_df = pd.DataFrame([{
            'age': data['age'],
            'bmi': data['bmi'],
            'children': data['children'],
            'sex': data['sex'],
            'smoker': data['smoker'],
            'region': data['region']
        }])
        
        # One-hot encode categorical columns
        input_df = pd.get_dummies(input_df, columns=['sex', 'smoker', 'region'])
        
        # Add missing columns with default value 0
        for col in EXPECTED_COLUMNS:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Ensure columns are in the correct order
        input_df = input_df[EXPECTED_COLUMNS]
        
        # Make prediction
        prediction = model.predict(input_df)
        return jsonify({'estimated_cost': prediction[0]})

    except Exception as e:
        # Log error and return response
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True)
