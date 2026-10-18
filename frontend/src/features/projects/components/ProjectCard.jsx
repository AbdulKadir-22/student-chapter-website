import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Star, GitFork, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/projects/${project.id}`)}
      className="overflow-hidden group flex flex-col justify-between border-slate-200/80 hover:border-indigo-200"
    >
      <div>
        {/* Project Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm uppercase tracking-wider">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {project.tagline}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag, idx) => (
              <Badge key={idx} variant={idx === 0 ? 'indigo' : 'cyan'} size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-slate-50">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {project.stars && (
            <span className="flex items-center gap-1 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {project.stars}
            </span>
          )}
          {project.contributors && (
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {project.contributors} contributors
            </span>
          )}
        </div>

        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50/50 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}
