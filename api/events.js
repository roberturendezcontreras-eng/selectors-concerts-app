// Vercel Serverless API Handler para eventos
// GET /api/events/search - Busca eventos de Eventbrite

const axios = require('axios');

module.exports = async (req, res) => {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { query = 'conciertos', location = '', limit = 20 } = req.query;
    const eventbriteKey = process.env.EVENTBRITE_API_KEY;

    if (!eventbriteKey) {
      return res.status(500).json({ error: 'API Key no configurada' });
    }

    // Llamar a Eventbrite API
    const eventbriteUrl = 'https://www.eventbriteapi.com/v3/events/search/';
    
    const response = await axios.get(eventbriteUrl, {
      params: {
        q: query,
        'location.address': location || 'Spain',
        sort_by: 'date',
        expand: 'venue,category'
      },
      headers: {
        'Authorization': `Bearer ${eventbriteKey}`
      }
    });

    // Transformar datos de Eventbrite
    const events = response.data.events.slice(0, limit).map(event => ({
      id: event.id,
      title: event.name.text,
      date: event.start.utc,
      location: event.venue ? event.venue.name : 'Por confirmar',
      description: event.description?.text || '',
      url: event.url,
      image: event.logo?.url || '',
      source: 'eventbrite',
      status: event.status
    }));

    res.status(200).json({ 
      success: true,
      events: events,
      total: response.data.pagination?.total_items || events.length
    });

  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Error cargando eventos',
      message: error.message
    });
  }
};
