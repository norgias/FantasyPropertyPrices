// Fetch JSON data and populate city dropdowns
fetch('./city_data/north_america.json') // Update path if the JSON file is not in the same directory
    .then((response) => {
        if (!response.ok) throw new Error('Failed to load JSON data');
        return response.json();
    })
    .then((data) => {
        const currentCitySelect = document.getElementById('current-city');
        const destinationCitySelect = document.getElementById('destination-city');

        if (!data || !data.cities) {
            console.error('Invalid JSON structure. No "cities" array found.');
            return;
        }

        data.cities.forEach((city) => {
            // Create <option> elements for both dropdowns
            const currentOption = document.createElement('option');
            currentOption.value = city.city; // Set value as city name
            currentOption.textContent = city.city; // Set text content
            currentCitySelect.appendChild(currentOption);

            const destinationOption = currentOption.cloneNode(true); // Clone for destination dropdown
            destinationCitySelect.appendChild(destinationOption);
        });
    })
    .catch((error) => {
        console.error('Error loading JSON:', error);
        document.getElementById('results').innerHTML =
            '<p>Could not load city data. Please try again later.</p>';
    });

// Add event listener for the "See Your Results" button
document.getElementById('calculate').addEventListener('click', () => {
    // Get user inputs
    const currentCity = document.getElementById('current-city').value;
    const destinationCity = document.getElementById('destination-city').value;
    const houseSize = parseFloat(document.getElementById('house-size').value);

    // Validate inputs
    if (!currentCity || !destinationCity || isNaN(houseSize) || houseSize <= 0) {
        document.getElementById('results').innerHTML =
            '<p>Please provide valid inputs for all fields.</p>';
        return;
    }

    // Fetch data again for calculation
    fetch('./north_america.json')
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load JSON data');
            return response.json();
        })
        .then((data) => {
            const currentCityData = data.cities.find(
                (city) => city.city === currentCity
            );
            const destinationCityData = data.cities.find(
                (city) => city.city === destinationCity
            );

            if (!currentCityData || !destinationCityData) {
                document.getElementById('results').innerHTML =
                    '<p>Unable to fetch city data. Please try again.</p>';
                return;
            }

            // Perform calculations
            const currentPrice =
                currentCityData.average_price_per_m2 * houseSize;
            const destinationPrice =
                destinationCityData.average_price_per_m2 * houseSize;
            const priceDifference = destinationPrice - currentPrice;

            // Update results section
            document.getElementById('results').innerHTML = `
                <p>A house of <strong>${houseSize}m²</strong> in <strong>${currentCity}</strong> costs <strong>$${currentPrice.toFixed(
                2
            )}</strong> on average.</p>
                <p>The same size house in <strong>${destinationCity}</strong> would cost <strong>$${destinationPrice.toFixed(
                2
            )}</strong>.</p>
                <p>The price difference is <strong>$${priceDifference.toFixed(
                2
            )}</strong> (${priceDifference > 0 ? 'more expensive' : 'cheaper'}).</p>
            `;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML =
                '<p>Something went wrong while fetching data. Please try again.</p>';
        });
});
