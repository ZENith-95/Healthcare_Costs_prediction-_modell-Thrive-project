// Form submission handler
document
  .getElementById("prediction-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect input data
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const bmi = document.getElementById("bmi").value;
    const children = document.getElementById("children").value;
    const smoker = document.getElementById("smoker").value;
    const region = document.getElementById("region").value;

    const inputData = {
      age: Number(age),
      sex,
      bmi: Number(bmi),
      children: Number(children),
      smoker,
      region,
    };

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
      document.getElementById(
        "cost"
      ).textContent = `$${result.estimated_cost.toFixed(2)}`;
      document.getElementById("result").style.display = "block";
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("cost").textContent =
        "Error: Unable to estimate cost.";
      document.getElementById("result").style.display = "block";
      alert("An error occurred: " + error.message);
    }
  });
