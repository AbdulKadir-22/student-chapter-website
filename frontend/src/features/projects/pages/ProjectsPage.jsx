import React, { useState, useEffect } from 'react';
import { Search, FolderGit2, PlusCircle, Sparkles } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../services/projectService';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [search, setSearch] = useState('');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tags = ['All', 'Web App', 'Open Source', 'Flutter', 'Mobile App', 'Full Stack', 'AI / ML'];

  useEffect(() => {
    getProjects({ tag: selectedTag, search }).then((data) => {
      setProjects(data);
    });
  }, [selectedTag, search]);

  const handleSubmitProject = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubmitModalOpen(false);
    }, 2000);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              Student Showcase
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Student Projects
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Explore open source libraries, tools, and full-stack platforms engineered and maintained by AMTICS students.
            </p>
          </div>

          <Button
            variant="primary"
            icon={PlusCircle}
            iconPosition="left"
            onClick={() => setSubmitModalOpen(true)}
            className="self-start md:self-auto shrink-0"
          >
            Submit Project
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project title, framework, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No projects matched</h3>
            <p className="text-sm text-slate-500 mb-4">
              Try a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedTag('All');
                setSearch('');
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Submit Project Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Submit Your Project to ACM AMTICS"
      >
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Project Submitted!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Our technical leads will review your repository and feature it on the official chapter portal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. AlgoVisualizer"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Short Tagline</label>
              <input
                type="text"
                required
                placeholder="Interactive graph algorithm visualizer in React"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Tailwind, Canvas"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center">
              Submit for Review
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
