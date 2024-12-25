fetch('https://norgias.github.io/FantasyPropertyPrices/city_data/north_america.json')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const currentCitySelect = document.getElementById('current-city');
        const destinationCitySelect = document.getElementById('destination-city');

        data.cities.forEach((city) => {
            // Create option for current city select dropdown
            const option = document.createElement('option');
            option.value = city.city; // Use 'city.city' to get the name
            option.textContent = city.city;
            currentCitySelect.appendChild(option);

            // Clone and append to destination city dropdown
            const destinationOption = option.cloneNode(true);
            destinationCitySelect.appendChild(destinationOption);
        });
    })
    .catch((error) => console.error('Error loading JSON:', error));

document.getElementById('see-results').addEventListener('click', () => {
  // Get user inputs
  const currentCity = document.getElementById('current-city').value;
  const destinationCity = document.getElementById('destination-city').value;
  const houseSize = parseFloat(document.getElementById('house-size-input').value);
  
  // Fetch JSON data
  fetch('./your/json/url.json')
    .then((response) => response.json())
    .then((data) => {
      // Get city price data
      const currentCityData = data.cities.find(city => city.city === currentCity);
      const destinationCityData = data.cities.find(city => city.city === destinationCity);

      // Ensure valid inputs
      if (!currentCityData || !destinationCityData || !houseSize) {
        alert("Please provide valid input for all fields.");
        return;
      }

      // Perform calculations
      const currentPrice = currentCityData.average_price_per_m2 * houseSize;
      const destinationPrice = destinationCityData.average_price_per_m2 * houseSize;
      const priceDifference = destinationPrice - currentPrice;

      // Display results
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = `
        <p>A house of ${houseSize}m² in <strong>${currentCity}</strong> costs <strong>$${currentPrice.toFixed(2)}</strong> on average.</p>
        <p>The same size house in <strong>${destinationCity}</strong> would cost <strong>$${destinationPrice.toFixed(2)}</strong>.</p>
        <p>The price difference is <strong>$${priceDifference.toFixed(2)}</strong>.</p>
      `;
    })
    .catch((error) => console.error('Error:', error));
});
