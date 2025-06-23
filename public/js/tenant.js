// public/js/tenant.js

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const noResultsMessage = document.getElementById('no-results-message');

    const createHouseCard = (house) => {
        const placeholderImageUrl = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop';
        const imageUrl = house.imageUrl || placeholderImageUrl;

        const cardHTML = `
          <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; width: 320px; display: flex; flex-direction: column; margin-bottom: 25px;">
            <img src="${imageUrl}" alt="House at ${house.address}" style="width: 100%; height: 220px; object-fit: cover;">
            <div style="padding: 15px 20px; flex-grow: 1; display: flex; flex-direction: column;">
              <h3 style="margin: 0; font-size: 1.4rem; font-weight: 600; color: #2c3e50;">${house.address}</h3>
              <p style="margin: 4px 0 12px 0; font-size: 0.9rem; color: #7f8c8d;">${house.city}</p>
              <div style="font-size: 1.5rem; font-weight: bold; color: #27ae60; margin-bottom: 15px;">${(house.rentAmount || house.rent).toLocaleString()}/month</div>
              
              <!-- Container for details like bedrooms and phone -->
              <div style="margin-bottom: 15px; color: #34495e;">
                <span style="display: block; margin-bottom: 5px;">🛏️ ${house.bedrooms} Bedrooms</span>
                
                <!-- =================================== -->
                <!--    NEW PHONE NUMBER DISPLAY         -->
                <!-- =================================== -->
                <span style="display: block;">📞 ${house.phoneNumber}</span>
                <!-- =================================== -->
              </div>
              
              <p style="font-size: 0.9rem; color: #555; line-height: 1.5; margin-top: auto;">${house.description || ''}</p>
            </div>
          </div>
        `;
        return cardHTML;
    };

    const fetchAndDisplayHouses = async () => {
        const queryString = window.location.search;
        const url = `/api/houses/search${queryString}`;
        cardContainer.innerHTML = '';
        if (noResultsMessage) noResultsMessage.style.display = 'none';
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch houses');
            const houses = await res.json();
            if (houses.length === 0) {
                if (noResultsMessage) noResultsMessage.style.display = 'block';
            } else {
                cardContainer.style.display = 'flex';
                cardContainer.style.flexWrap = 'wrap';
                cardContainer.style.gap = '25px';
                cardContainer.style.justifyContent = 'center';
                houses.forEach(house => {
                    cardContainer.insertAdjacentHTML('beforeend', createHouseCard(house));
                });
            }
        } catch (err) {
            console.error('Error fetching houses:', err);
            cardContainer.innerHTML = '<p style="color: #c0392b; font-weight: bold;">Could not load houses. Please try again later.</p>';
        }
    };

    fetchAndDisplayHouses();
});