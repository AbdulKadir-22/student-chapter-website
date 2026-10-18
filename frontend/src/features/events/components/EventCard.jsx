import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowUpRight } from 'lucide-react';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/events/${event.id}`)}
      className="overflow-hidden group flex flex-col justify-between border-slate-200/80 hover:border-indigo-200"
    >
      <div>
        {/* Banner image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={event.badgeColor || 'indigo'} size="sm">
              {event.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md ${
                event.status === 'Upcoming'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-slate-900/70 text-slate-200'
              }`}
            >
              {event.status}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-indigo-700">
              <Calendar className="w-3.5 h-3.5" />
              {event.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {event.time.split('(')[0]}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50">
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{event.venue}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 ml-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {event.attendees}+
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
          View Details & Register
        </span>
        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 group-hover:bg-indigo-50/50 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
}
