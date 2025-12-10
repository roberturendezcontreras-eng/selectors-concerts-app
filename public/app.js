// App de Conciertos - Agregador Eventbrite + Ticketmaster

class ConcertsApp {
  constructor() {
    this.events = [];
    this.filteredEvents = [];
    this.currentSource = 'all';
    this.searchTerm = '';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadEvents();
  }

  setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const sourceFilter = document.getElementById('sourceFilter');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) searchBtn.addEventListener('click', () => this.handleSearch());
    if (sourceFilter) sourceFilter.addEventListener('change', (e) => this.filterBySource(e.target.value));
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });
  }

  async loadEvents() {
    this.showLoading(true);
    try {
      const response = await fetch('/api/events/search?query=conciertos&limit=20');
      if (!response.ok) throw new Error('Error cargando eventos');
      
      const data = await response.json();
      this.events = data.events || [];
      this.filteredEvents = this.events;
      this.renderEvents();
    } catch (error) {
      console.error('Error:', error);
      this.showError('No pudimos cargar los eventos. Intenta más tarde.');
    } finally {
      this.showLoading(false);
    }
  }

  handleSearch() {
    const searchInput = document.getElementById('searchInput');
    this.searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (!this.searchTerm) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    
    this.filterBySource(this.currentSource);
  }

  filterBySource(source) {
    this.currentSource = source;
    
    if (source === 'all') {
      this.renderEvents();
    } else {
      const filtered = this.filteredEvents.filter(event => event.source === source);
      this.renderEvents(filtered);
    }
  }

  renderEvents(eventsToRender = this.filteredEvents) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    if (eventsToRender.length === 0) {
      container.innerHTML = '<div class="empty-state">No se encontraron eventos</div>';
      return;
    }

    container.innerHTML = eventsToRender.map(event => this.createEventCard(event)).join('');
  }

  createEventCard(event) {
    const date = new Date(event.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="event-card">
        <div class="event-header">
          <div class="event-title">${event.title}</div>
          <span class="event-source">${event.source.toUpperCase()}</span>
        </div>
        <div class="event-body">
          <div class="event-detail">
            <strong>📅 Fecha:</strong> <span class="event-date">${date}</span>
          </div>
          <div class="event-detail">
            <strong>📍 Ubicación:</strong> ${event.location || 'Por confirmar'}
          </div>
          ${event.artist ? `<div class="event-detail"><strong>🎤 Artista:</strong> ${event.artist}</div>` : ''}
          ${event.price ? `<div class="event-detail"><strong>💰 Precio:</strong> ${event.price}</div>` : ''}
          ${event.description ? `<div class="event-detail"><strong>📝 Descripción:</strong> ${event.description.substring(0, 100)}...</div>` : ''}
          ${event.url ? `<a href="${event.url}" target="_blank" class="event-link">Ver más detalles →</a>` : ''}
        </div>
      </div>
    `;
  }

  showLoading(show) {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = show ? 'block' : 'none';
  }

  showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
      errorDiv.innerHTML = message;
      errorDiv.style.display = 'block';
    }
  }
}

// Inicializar app cuando DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ConcertsApp();
});
