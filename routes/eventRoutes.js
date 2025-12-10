const express = require('express');
const { getAggregatedEvents, fetchEventbriteEvents, fetchTicketmasterEvents } = require('../services/eventService');

const router = express.Router();

// GET all aggregated events
router.get('/events', async (req, res) => {
  try {
    const { query, location } = req.query;
    if (!query || !location) {
      return res.status(400).json({ error: 'Query and location are required' });
    }
    const events = await getAggregatedEvents(query, location);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Eventbrite events
router.get('/eventbrite', async (req, res) => {
  try {
    const { query, location } = req.query;
    const events = await fetchEventbriteEvents(query, location);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Ticketmaster events
router.get('/ticketmaster', async (req, res) => {
  try {
    const { query, location } = req.query;
    const events = await fetchTicketmasterEvents(query, location);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
