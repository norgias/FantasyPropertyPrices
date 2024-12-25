// Fetch the data and populate dropdown menus
fetch('./https://norgias.github.io/FantasyPropertyPrices/city_data/north_america.json')
    .then(response => response.json())
    .then(data => {
        const currentCitySelect = document.getElementById('current-city');
        const destinationCitySelect = document.getElementById('destination-city');

        data.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.city; // Match JSON property name
            option.textContent = city.city; // Match JSON property name
            currentCitySelect.appendChild(option);

            const destinationOption = option.cloneNode(true);
            destinationCitySelect.appendChild(destinationOption);
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

// Add event listener for the "See Your Results" button
document.getElementById('calculate').addEventListener('click', () => {
    // Get user inputs
    const currentCity = document.getElementById('current-city').value;
    const destinationCity = document.getElementById('destination-city').value;
    const houseSize = parseFloat(document.getElementById('house-size').value);

    // Validate inputs
    if (!currentCity || !destinationCity || isNaN(houseSize) || houseSize <= 0) {
        document.getElementById('results').innerHTML = "<p>Please provide valid inputs for all fields.</p>";
        return;
    }

    // Fetch JSON data for calculations
    fetch('./https://norgias.github.io/FantasyPropertyPrices/city_data/north_america.json')
        .then(response => response.json())
        .then(data => {
            const currentCityData = data.cities.find(city => city.city === currentCity);
            const destinationCityData = data.cities.find(city => city.city === destinationCity);

            if (!currentCityData || !destinationCityData) {
                document.getElementById('results').innerHTML = "<p>Unable to fetch city data. Please try again.</p>";
                return;
            }

            // Perform calculations
            const currentPrice = currentCityData.average_price_per_m2 * houseSize;
            const destinationPrice = destinationCityData.average_price_per_m2 * houseSize;
            const priceDifference = destinationPrice - currentPrice;

            // Update results section
            document.getElementById('results').innerHTML = `
                <p>A house of <strong>${houseSize}m²</strong> in <strong>${currentCity}</strong> costs <strong>$${currentPrice.toFixed(2)}</strong> on average.</p>
                <p>The same size house in <strong>${destinationCity}</strong> would cost <strong>$${destinationPrice.toFixed(2)}</strong>.</p>
                <p>The price difference is <strong>$${priceDifference.toFixed(2)}</strong> (${priceDifference > 0 ? 'more expensive' : 'cheaper'}).</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML = "<p>Something went wrong while fetching data. Please try again.</p>";
        });
});
