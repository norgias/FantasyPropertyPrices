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
