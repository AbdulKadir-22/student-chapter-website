import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  CheckCircle2,
  Share2,
  Sparkles
} from 'lucide-react';
import { getEventById } from '../services/eventService';
import Button from '../../../shared/components/ui/Button';
import Badge from '../../../shared/components/ui/Badge';
import Modal from '../../../shared/components/ui/Modal';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getEventById(id).then((data) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
        <p className="text-slate-500 mb-6">The event you are looking for does not exist or has been archived.</p>
        <Link to="/events">
          <Button variant="primary">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpDone(true);
    setTimeout(() => {
      setRsvpDone(false);
      setRsvpModalOpen(false);
    }, 2000);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all events
        </Link>

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] sm:aspect-[2.2/1] bg-slate-900 shadow-xl mb-8">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white space-y-3">
            <div className="flex items-center gap-2.5">
              <Badge variant={event.badgeColor || 'indigo'}>
                {event.category}
              </Badge>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                {event.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About This Event</h3>
                <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                  {event.longDescription || event.description}
                </p>
              </div>

              {event.topics && (
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Topics & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.topics.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {event.speaker && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Featured Speaker / Instructor
                    </h5>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {event.speaker}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Event Logistics
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Date</span>
                    <span className="font-semibold text-slate-800">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Timing</span>
                    <span className="font-semibold text-slate-800">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Venue</span>
                    <span className="font-semibold text-slate-800">{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400">Participation</span>
                    <span className="font-semibold text-slate-800">{event.attendees}+ Attendees</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => setRsvpModalOpen(true)}
                >
                  {event.status === 'Upcoming' ? 'Register Now' : 'RSVP for Future Editions'}
                </Button>

                <Button
                  variant="secondary"
                  className="w-full justify-center text-xs"
                  onClick={handleCopyLink}
                  icon={copied ? CheckCircle2 : Share2}
                >
                  {copied ? 'Link Copied!' : 'Share Event'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <Modal
        isOpen={rsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        title={`Register for ${event.title}`}
      >
        {rsvpDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">You're on the list!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              We've saved your registration for {event.title}. Calendar invites and prep materials will be sent to your student email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                placeholder="Rohan Varma"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">College Email</label>
              <input
                type="email"
                required
                placeholder="rohan.2023cse@amtics.edu"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Enrollment Number</label>
              <input
                type="text"
                required
                placeholder="210203100045"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center">
              Confirm Registration
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
