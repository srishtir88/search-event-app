document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const eventList = document.getElementById('event-list');
    const nameSearch = document.getElementById('name-search');
    const dateSearch = document.getElementById('date-search');

    // Constants
    const ITEMS_PER_PAGE = 4;
    let currentPage = 1;

    // Utility functions
    const clearEventList = () => eventList.innerHTML = '';

    const showMessage = (message) => {
        clearEventList();
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        eventList.appendChild(messageElement);
    };

    const formatDate = (dateStr) => dateStr.replace(/^([A-Za-z]+) /, '$1, ');

    const filterEvents = (events, searchName, searchDate) => {
        return events.filter(event => {
            if (searchDate) {
                const eventDate = new Date(event.date);
                const filterDate = new Date(searchDate);
                if (eventDate.toDateString() !== filterDate.toDateString()) return false;
            }
            if (searchName) {
                const searchWords = searchName.toLowerCase().split(/\s+/);
                const titleWords = event.event.toLowerCase().split(/\s+/);
                return searchWords.some(search => titleWords.some(title => title.includes(search)));
            }
            return true;
        });
    };

    const createEventCard = (event, template, index) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template.replace(/\${id}/g, index + 1);
        const article = tempDiv.firstElementChild;

        const elements = {
            title: article.querySelector('.event-title'),
            dateP: article.querySelector('.event-date'),
            location: article.querySelector('.event-location'),
            district: article.querySelector('.event-district'),
            descP: article.querySelector('.event-description'),
            organisation: article.querySelector('.event-organisation')
        };

        if (Object.values(elements).some(el => !el)) {
            console.error('Invalid template structure:', 
                Object.entries(elements).filter(([_, el]) => !el).map(([key]) => key)
            );
            return null;
        }

        elements.title.textContent = event.event;
        elements.dateP.textContent = formatDate(event.date);
        elements.location.textContent = event.location;
        elements.district.textContent = event.district;
        elements.descP.textContent = event.type;
        elements.organisation.textContent = event.organisation;

        return article;
    };

    // Display events with pagination
    const displayEvents = (events, template, resetPage = true) => {
        if (resetPage) {
            currentPage = 1;
            clearEventList();
        }
        
        const filtered = filterEvents(
            events,
            nameSearch.value.toLowerCase().trim(),
            dateSearch.value
        );

        if (filtered.length === 0) {
            showMessage('No events found.');
            return;
        }

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = currentPage * ITEMS_PER_PAGE;
        const hasMoreItems = filtered.length > endIndex;

        filtered.slice(startIndex, endIndex).forEach((event, index) => {
            const card = createEventCard(event, template, startIndex + index);
            if (card) eventList.appendChild(card);
        });

        let loadMoreBtn = document.querySelector('#load-more-btn');
        if (!loadMoreBtn) {
            loadMoreBtn = document.createElement('button');
            loadMoreBtn.id = 'load-more-btn';
            loadMoreBtn.className = 'load-more-btn';
            loadMoreBtn.textContent = 'Load More';
            eventList.after(loadMoreBtn);
        }

        loadMoreBtn.style.display = hasMoreItems ? 'block' : 'none';
    };


    Promise.all([
        fetch('event-card.html').then(response => response.text()),
        fetch('data/events.json').then(response => response.json())
    ])
    .then(([template, events]) => {
        nameSearch.addEventListener('input', () => displayEvents(events, template));
        dateSearch.addEventListener('change', () => displayEvents(events, template));
        
        document.addEventListener('click', (e) => {
            if (e.target.id === 'load-more-btn') {
                currentPage++;
                displayEvents(events, template, false);
            }
        });
        
        displayEvents(events, template);
    })
    .catch(error => showMessage(`Error loading events: ${error.message}`));
});

