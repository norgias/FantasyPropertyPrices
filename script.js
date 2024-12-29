// Fetch JSON data and populate city dropdowns
fetch('https://www.fantasypopertyprices.com/city_data/north_america.json')
    .then((response) => {
        if (!response.ok) throw new Error('Failed to load JSON data');
        return response.json();
    })
    .then((data) => {
        const currentCitySelect = document.getElementById('current-city');
        const destinationCitySelect = document.getElementById('destination-city');

        // Verify data structure
        if (!data.cities || !Array.isArray(data.cities)) {
            console.error('Invalid JSON structure: no "cities" array found.');
            return;
        }

        // Populate dropdown menus
        data.cities.forEach((city) => {
            const optionElement = document.createElement('option');
            optionElement.value = city.city;
            optionElement.textContent = city.city;

            // Add option to both current and destination dropdowns
            currentCitySelect.appendChild(optionElement.cloneNode(true));
            destinationCitySelect.appendChild(optionElement);
        });
    })
    .catch((error) => {
        console.error('Error loading JSON:', error);
        document.getElementById('results').innerHTML =
            '<p>Could not load city data. Please try again later.</p>';
    });

// Add commas to numbers for readability
function formatNumber(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Handle the "See Your Results" button click
document.getElementById('calculate').addEventListener('click', () => {
    const currentCity = document.getElementById('current-city').value;
    const destinationCity = document.getElementById('destination-city').value;
    const houseSize = parseFloat(document.getElementById('house-size').value);

    // Validate inputs
    if (!currentCity || !destinationCity || isNaN(houseSize) || houseSize <= 0) {
        document.getElementById('results').innerHTML =
            '<p>Please provide valid inputs for all fields.</p>';
        return;
    }

    // Fetch city data again for calculation
    fetch('https://www.fantasypropertyprices.com/city_data/north_america.json')
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load JSON data');
            return response.json();
        })
        .then((data) => {
            const currentCityData = data.cities.find(city => city.city === currentCity);
            const destinationCityData = data.cities.find(city => city.city === destinationCity);

            if (!currentCityData || !destinationCityData) {
                document.getElementById('results').innerHTML =
                    '<p>Unable to fetch city data. Please try again.</p>';
                return;
            }

            // Calculate costs
            const calculateCost = (pricePerM2) => pricePerM2 * houseSize;

            const currentInnerCost = calculateCost(currentCityData.price_per_m2_inner);
            const currentRuralCost = calculateCost(currentCityData.price_per_m2_rural);
            const currentAverageCost = calculateCost(currentCityData.average_price_per_m2);

            const destinationInnerCost = calculateCost(destinationCityData.price_per_m2_inner);
            const destinationRuralCost = calculateCost(destinationCityData.price_per_m2_rural);
            const destinationAverageCost = calculateCost(destinationCityData.average_price_per_m2);

            const priceDifference = destinationAverageCost - currentAverageCost;

            // Display results
            document.getElementById('results').innerHTML = `
                <p>A house of <strong>${houseSize}m²</strong> in <strong>${currentCity}</strong> costs approximatley:</p>
                <ul>
                    <li><strong>Inner city cost:</strong> $${formatNumber(currentInnerCost)}</li>
                    <li><strong>Rural area cost:</strong> $${formatNumber(currentRuralCost)}</li>
                    <li><strong>Average cost:</strong> $${formatNumber(currentAverageCost)}</li>
                </ul> 
                <p>The same sized house in <strong>${destinationCity} costs roughly...</strong>:</p>
                <ul>
                    <li>$${formatNumber(destinationInnerCost)} <strong>In the inner city</strong></li>
                    <li>$${formatNumber(destinationRuralCost)} <strong>In the surrounding areas</strong></li>
                    <strong>And is</strong> $${formatNumber(destinationAverageCost)} <strong>on average</strong>
                </ul>
                <p>The average price difference is <strong>$${formatNumber(Math.abs(priceDifference))}</strong> making it (${priceDifference > 0 ? 'more expensive' : 'cheaper'}) to live in <strong>${destinationCity}</strong>.</p>
            `;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML =
                '<p>Something went wrong while fetching data. Please try again.</p>';
        });
});
