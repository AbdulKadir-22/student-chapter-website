import eventsData from '../../../data/events.json';

export async function getEvents({ category, status, search } = {}) {
  let list = [...eventsData];

  if (category && category !== 'All') {
    list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'All') {
    list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.speaker.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getEventById(id) {
  return eventsData.find((e) => e.id === id) || null;
}
