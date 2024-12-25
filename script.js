// Function to populate city dropdown options
function populateCityDropdowns(data) {
    const currentCitySelect = document.getElementById('current-city');
    const destinationCitySelect = document.getElementById('destination-city');

    data.cities.forEach(city => {
        // Create dropdown options
        const option = document.createElement('option');
        option.value = city.city;
        option.textContent = city.city;
        currentCitySelect.appendChild(option);

        const destinationOption = option.cloneNode(true);
        destinationCitySelect.appendChild(destinationOption);
    });
}

// Fetch JSON data and populate dropdowns
fetch('./city_data/north_america.json') // Ensure the path matches your file structure
    .then(response => {
        if (!response.ok) throw new Error('Failed to load JSON data');
        return response.json();
    })
    .then(data => {
        populateCityDropdowns(data);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        document.getElementById('results').innerHTML = "<p>Failed to load city data. Please check your JSON file and try again.</p>";
    });

// Add event listener for the "See Your Results" button
document.getElementById('calculate').addEventListener('click', () => {
    const currentCity = document.getElementById('current-city').value;
    const destinationCity = document.getElementById('destination-city').value;
    const houseSize = parseFloat(document.getElementById('house-size').value);

    // Validate inputs
    if (!currentCity || !destinationCity || isNaN(houseSize) || houseSize <= 0) {
        document.getElementById('results').innerHTML = "<p>Please provide valid inputs for all fields.</p>";
        return;
    }

    // Fetch JSON data for calculations
    fetch('./city_data/north_america.json') // Ensure the file path is correct
        .then(response => {
            if (!response.ok) throw new Error('Failed to load JSON data');
            return response.json();
        })
        .then(data => {
            const currentCityData = data.cities.find(city => city.city === currentCity);
            const destinationCityData = data.cities.find(city => city.city === destinationCity);

            if (!currentCityData || !destinationCityData) {
                document.getElementById('results').innerHTML = "<p>Unable to fetch data for the selected cities. Please try again.</p>";
                return;
            }

            // Perform calculations
            const currentPrice = currentCityData.average_price_per_m2 * houseSize;
            const destinationPrice = destinationCityData.average_price_per_m2 * houseSize;
            const priceDifference = destinationPrice - currentPrice;

            // Display results
            document.getElementById('results').innerHTML = `
                <p>A house of <strong>${houseSize.toLocaleString()}m²</strong> in <strong>${currentCity}</strong> costs <strong>$${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> on average.</p>
                <p>The same house in <strong>${destinationCity}</strong> would cost <strong>$${destinationPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>.</p>
                <p>The price difference is <strong>$${priceDifference.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> (${priceDifference > 0 ? 'more expensive' : 'cheaper'}).</p>
            `;
        })
        .catch(error => {
            console.error('Error processing data:', error);
            document.getElementById('results').innerHTML = "<p>Something went wrong while fetching data. Please try again.</p>";
        });
});
