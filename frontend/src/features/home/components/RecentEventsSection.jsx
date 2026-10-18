import React from 'react';
import { ArrowRight, ArrowUpRight, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import eventsData from '../../../data/events.json';

export default function RecentEventsSection() {
  const navigate = useNavigate();
  // Take first 3 events
  const recentEvents = eventsData.slice(0, 3);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              EVENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recent Events
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              A glimpse of our latest workshops, talks and community initiatives.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
          >
            View All Events
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {recentEvents.map((event) => {
            return (
              <Card
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="overflow-hidden group flex flex-col justify-between border-slate-200/80 hover:border-indigo-200"
              >
                <div>
                  {/* Event Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={event.badgeColor || 'indigo'} size="sm">
                        {event.category}
                      </Badge>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400">
                    {event.status === 'Upcoming' ? 'Registration Open' : 'Event Completed'}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50/50 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
