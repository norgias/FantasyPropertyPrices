fetch('./https://norgias.github.io/FantasyPropertyPrices/city_data/north_america.json')
    .then((response) => response.json())
    .then((data) => {
        const currentCitySelect = document.getElementById('current-city');
        const destinationCitySelect = document.getElementById('destination-city');

        data.cities.forEach((city) => {
            const option = document.createElement('option');
            option.value = city.name;
            option.textContent = city.name;
            currentCitySelect.appendChild(option);

            const destinationOption = option.cloneNode(true);
            destinationCitySelect.appendChild(destinationOption);
        });
    })
    .catch((error) => console.error('Error loading JSON:', error));
