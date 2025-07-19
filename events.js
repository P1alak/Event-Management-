
const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filterType');
const sortType = document.getElementById('sortType');

let events = JSON.parse(localStorage.getItem('events')) || [];

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents() {
  eventsList.innerHTML = '';
  const search = searchInput.value.toLowerCase();
  let filteredEvents = events.filter(e => e.title.toLowerCase().includes(search));

  const filter = filterType.value;
  if (filter !== 'all') {
    filteredEvents = filteredEvents.filter(e => {
      if (filter === 'urgent') return e.priority === '1';
      if (filter === 'important') return e.priority === '2';
      return e.priority === '3';
    });
  }

  if (sortType.value === 'date') {
    filteredEvents.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
  } else if (sortType.value === 'priority') {
    filteredEvents.sort((a, b) => a.priority - b.priority);
  }

  filteredEvents.forEach(event => {
    const div = document.createElement('div');
    div.className = `event ${isPast(event.date, event.time) ? 'past' : 'upcoming'} ${event.completed ? 'completed' : ''}`;

    const badge = event.priority === '1' ? 'urgent' : event.priority === '2' ? 'important' : 'normal';

    div.innerHTML = `
      <h3>${event.title} <span class="badge ${badge}">${badge.charAt(0).toUpperCase() + badge.slice(1)}</span></h3>
      <p><i class="fa-solid fa-calendar-days"></i> ${event.date}</p>
      <p><i class="fa-solid fa-clock"></i> ${event.time}</p>
      <p><i class="fa-solid fa-repeat"></i> ${event.recurrence}</p>
      <div class="actions">
        <button class="complete">✔ Done</button>
        <button class="delete">🗑 Delete</button>
      </div>
    `;

 
    div.querySelector('.complete').addEventListener('click', () => {
      event.completed = !event.completed;
      saveEvents();
      renderEvents();
    });

    div.querySelector('.delete').addEventListener('click', () => {
      events = events.filter(e => e !== event);
      saveEvents();
      renderEvents();
    });

    eventsList.appendChild(div);
  });
}

function isPast(dateStr, timeStr) {
  const now = new Date();
  const eventDate = new Date(`${dateStr}T${timeStr}`);
  return eventDate < now;
}


eventForm.addEventListener('submit', e => {
  e.preventDefault();

  const newEvent = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    priority: document.getElementById('priority').value,
    recurrence: document.getElementById('recurrence').value,
    completed: false
  };

  events.push(newEvent);
  saveEvents();
  renderEvents();
  eventForm.reset();
});


searchInput.addEventListener('input', renderEvents);
filterType.addEventListener('change', renderEvents);
sortType.addEventListener('change', renderEvents);

document.addEventListener('DOMContentLoaded', renderEvents);
