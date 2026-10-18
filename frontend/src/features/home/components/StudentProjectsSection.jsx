import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import projectsData from '../../../data/projects.json';

export default function StudentProjectsSection() {
  const navigate = useNavigate();
  // Take first 3 projects matching mockup
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Student Projects
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Innovative projects built by our talented community members.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
          >
            View All Projects
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredProjects.map((project) => (
            <Card
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="overflow-hidden group flex flex-col justify-between border-slate-200/80 hover:border-indigo-200"
            >
              <div>
                {/* Project Screenshot / Mockup Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {project.tagline}
                  </p>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant={i === 0 ? 'indigo' : 'cyan'}
                        size="sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50">
                <span className="text-xs font-medium text-slate-400">
                  View Case Study
                </span>
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50/50 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
