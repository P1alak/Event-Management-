class PriorityQueue {
  constructor() {
    this.events = [];
  }

  enqueue(event) {
    this.events.push(event);
  }

  remove(index) {
    this.events.splice(index, 1);
  }

  toArray() {
    return [...this.events];
  }

  sortByDate() {
    return [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

const pq = new PriorityQueue();


const saved = JSON.parse(localStorage.getItem('events') || '[]');
saved.forEach(e => pq.enqueue(e));
renderEvents(pq.sortByDate());

document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const priority = document.getElementById("priority").value;

  if (!title || !date || !time || !priority) return;

  const newEvent = { title, date, time, priority };
  pq.enqueue(newEvent);
  localStorage.setItem('events', JSON.stringify(pq.toArray()));
  renderEvents(pq.sortByDate());

  this.reset();
});

function renderEvents(events) {
  const container = document.getElementById("eventsList");
  container.innerHTML = "";

  const upcoming = document.createElement("div");
  const past = document.createElement("div");

  const now = new Date();

  events.forEach((event, index) => {
    const card = document.createElement("div");
    card.className = "event-card";

    const info = document.createElement("div");
    info.className = "event-info";
    info.innerHTML = `
      <p><strong>${event.title}</strong></p>
      <p>Date: ${event.date}</p>
      <p>Time: ${event.time}</p>
      <p>Priority: <span class="event-label">${event.priority}</span></p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      pq.remove(index);
      localStorage.setItem('events', JSON.stringify(pq.toArray()));
      renderEvents(pq.sortByDate());
    };

    card.appendChild(info);
    card.appendChild(deleteBtn);

    const eventDate = new Date(event.date + " " + event.time);
    if (eventDate < now) {
      past.appendChild(card);
    } else {
      upcoming.appendChild(card);
    }
  });

  if (upcoming.children.length > 0) {
    const heading = document.createElement("h2");
    heading.textContent = "Upcoming Events";
    container.appendChild(heading);
    container.appendChild(upcoming);
  }

  if (past.children.length > 0) {
    const heading = document.createElement("h2");
    heading.textContent = "Past Events";
    container.appendChild(heading);
    container.appendChild(past);
  }
}
