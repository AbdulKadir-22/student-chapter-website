import projectsData from '../../../data/projects.json';

export async function getProjects({ tag, search } = {}) {
  let list = [...projectsData];

  if (tag && tag !== 'All') {
    list = list.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
    );
  }

  return list;
}

export async function getProjectById(id) {
  return projectsData.find((p) => p.id === id) || null;
}
