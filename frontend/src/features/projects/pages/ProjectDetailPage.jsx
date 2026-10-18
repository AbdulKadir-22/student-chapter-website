import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Layers,
  Code2,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { getProjectById } from '../services/projectService';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getProjectById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h2>
        <p className="text-slate-500 mb-6">The project you are looking for does not exist or has been removed.</p>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((tag, i) => (
                <Badge key={i} variant={i === 0 ? 'indigo' : 'cyan'}>
                  {tag}
                </Badge>
              ))}
              {project.featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Featured Project
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? CheckCircle2 : Share2}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied' : 'Share'}
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              {project.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Button variant="primary" icon={ExternalLink}>
                  Live Demo
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary" icon={FaGithub}>
                  View Repository
                </Button>
              </a>
            )}

            <div className="flex items-center gap-4 ml-auto text-xs text-slate-500 font-medium">
              {project.stars && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {project.stars} Stars
                </span>
              )}
              {project.contributors && (
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4" />
                  {project.contributors} Contributors
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Screenshot Banner */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-slate-950 shadow-xl border border-slate-800 mb-10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Project Overview
              </h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {project.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
