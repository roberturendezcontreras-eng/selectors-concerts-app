const fetch = require('node-fetch');

const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;
const EVENTBRITE_API_URL = 'https://www.eventbriteapi.com/v3';
const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2';

// Fetch events from Eventbrite
const fetchEventbriteEvents = async (query, location) => {
  try {
    const response = await fetch(
      `${EVENTBRITE_API_URL}/organizations/search/?q=${query}&location.address=${location}`,
      {
        headers: {
          'Authorization': `Bearer ${EVENTBRITE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
};

// Fetch events from Ticketmaster
const fetchTicketmasterEvents = async (query, location) => {
  try {
    const response = await fetch(
      `${TICKETMASTER_API_URL}/events.json?keyword=${query}&city=${location}&apikey=${TICKETMASTER_API_KEY}`
    );
    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    return [];
  }
};

// Get aggregated events from both sources
const getAggregatedEvents = async (query, location) => {
  const [eventbriteEvents, ticketmasterEvents] = await Promise.all([
    fetchEventbriteEvents(query, location),
    fetchTicketmasterEvents(query, location),
  ]);

  return {
    eventbrite: eventbriteEvents,
    ticketmaster: ticketmasterEvents,
  };
};

module.exports = {
  fetchEventbriteEvents,
  fetchTicketmasterEvents,
  getAggregatedEvents,
};
