// Form submission handler
// Function to round to the nearest hundred
function roundToNearestHundred(number) {
  return Math.round(number / 100) * 100;
}

document
  .getElementById("prediction-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect input data
    const age = parseFloat(document.getElementById("age").value);
    const sex = document.getElementById("sex").value;
    const bmi = parseFloat(document.getElementById("bmi").value);
    const children = parseInt(document.getElementById("children").value);
    const smoker = document.getElementById("smoker").value;
    const region = document.getElementById("region").value;

    const inputData = { age, sex, bmi, children, smoker, region };

    try {
      // Send data to the backend for prediction
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Display prediction
      try {
        document.getElementById("cost").textContent = `$${roundToNearestHundred(result.estimated_cost)}`;
        document.getElementById("result").style.display = "block";
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("cost").textContent = "Error: Unable to estimate cost.";
        document.getElementById("error-message").textContent = "An error occurred: " + error.message;
        document.getElementById("error-message").style.display = "block";
        alert("An error occurred: " + error.message);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("cost").textContent =
        "Error: Unable to estimate cost.";
      document.getElementById("error-message").textContent = "An error occurred: " + error.message;
      document.getElementById("error-message").style.display = "block";
      alert("An error occurred: " + error.message);
    }
  });

document.getElementById("age").addEventListener("input", function (e) {
  document.getElementById("age-label").textContent = e.target.value;
});

document.getElementById("children").addEventListener("input", function (e) {
  document.getElementById("children-label").textContent = e.target.value;
});

// Form Submit Example
document
  .getElementById("prediction-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("cost").textContent = "$ "; // Example Response
  });
