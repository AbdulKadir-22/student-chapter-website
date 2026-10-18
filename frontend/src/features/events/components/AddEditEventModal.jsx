import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import Select from '../../../shared/components/ui/Select';
import MultiSelect from '../../../shared/components/ui/MultiSelect';
import { EVENT_CATEGORIES } from '../../../shared/utils/constants';
import {
  createEventApi,
  updateEventApi,
  getEventByIdApi,
} from '../api/events.api';
import { getAdminMembersApi } from '../../admin/api/admin.api';

// Generate 30-minute time intervals (00:00 to 23:30)
const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const timeVal = `${hh}:${mm}`;

    // Convert to readable 12-hour format for label
    const period = h < 12 ? 'AM' : 'PM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const timeLabel = `${displayHour}:${mm} ${period}`;

    TIME_OPTIONS.push({ value: timeVal, label: timeLabel });
  }
}

export default function AddEditEventModal({
  isOpen,
  onClose,
  eventId = null,
  onSuccess,
}) {
  const isEdit = Boolean(eventId);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Workshop',
    date: '',
    startTime: '10:00',
    endTime: '13:00',
    venue: '',
    coordinatorIds: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch active coordinators for coordinator selection
  const { data: coordinatorsData } = useQuery({
    queryKey: ['admin', 'coordinators-lookup'],
    queryFn: () => getAdminMembersApi({ limit: 100, status: 'active' }),
    enabled: isOpen,
  });

  // Filter only users with role === 'coordinator'
  const coordinatorOptions = (coordinatorsData?.data || [])
    .filter((u) => u.role === 'coordinator')
    .map((u) => ({
      value: u.id,
      label: `${u.name} (${u.email})`,
    }));

  useEffect(() => {
    if (isOpen && isEdit && eventId) {
      setLoading(true);
      getEventByIdApi(eventId)
        .then((res) => {
          const ev = res.event || res.data || res;
          if (!ev) throw new Error('Event data missing');
          // Format date as YYYY-MM-DD
          let dateStr = '';
          let startStr = '10:00';
          let endStr = '13:00';
          if (ev.startsAt) {
            const startDate = new Date(ev.startsAt);
            // Convert to IST YYYY-MM-DD
            const istDateStr = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }).format(startDate);
            dateStr = istDateStr;

            const istTimeParts = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).formatToParts(startDate);
            const hour = istTimeParts.find((p) => p.type === 'hour')?.value || '10';
            const minute = istTimeParts.find((p) => p.type === 'minute')?.value || '00';
            startStr = `${hour}:${minute}`;
          }

          if (ev.endsAt) {
            const endDate = new Date(ev.endsAt);
            const istTimeParts = new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }).formatToParts(endDate);
            const hour = istTimeParts.find((p) => p.type === 'hour')?.value || '13';
            const minute = istTimeParts.find((p) => p.type === 'minute')?.value || '00';
            endStr = `${hour}:${minute}`;
          }

          setFormData({
            name: ev.name || '',
            category: ev.category || 'Workshop',
            date: dateStr,
            startTime: startStr,
            endTime: endStr,
            venue: ev.venue || '',
            coordinatorIds: (ev.coordinators || []).map((c) => c.id || c._id),
          });
          setErrors({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Failed to load event');
          onClose();
        })
        .finally(() => setLoading(false));
    } else if (isOpen && !isEdit) {
      // Default date = today in IST
      const todayIST = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

      setFormData({
        name: '',
        category: 'Workshop',
        date: todayIST,
        startTime: '10:00',
        endTime: '13:00',
        venue: '',
        coordinatorIds: [],
      });
      setErrors({});
    }
  }, [isOpen, isEdit, eventId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Event name is required';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.venue?.trim()) errs.venue = 'Venue is required';

    if (formData.startTime && formData.endTime) {
      const [sh, sm] = formData.startTime.split(':').map(Number);
      const [eh, em] = formData.endTime.split(':').map(Number);
      if (eh < sh || (eh === sh && em <= sm)) {
        errs.endTime = 'End time must be after start time';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue.trim(),
        coordinatorIds: formData.coordinatorIds,
      };

      if (isEdit) {
        await updateEventApi(eventId, payload);
        toast.success('Event updated successfully');
      } else {
        await createEventApi(payload);
        toast.success('Event created successfully');
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const resp = err.response?.data;
      toast.error(resp?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Event' : 'Add Event'}
      description={
        isEdit
          ? 'Update event details and coordinators.'
          : 'Create a new event for ACM Amtics.'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Event Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Event Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Web Development Workshop"
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 ${
              errors.name
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#6332ec]'
            }`}
          />
          {errors.name && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.name}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 ${
              errors.date
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#6332ec]'
            }`}
          />
          {errors.date && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.date}
            </p>
          )}
        </div>

        {/* Start Time & End Time side-by-side (30-min intervals) */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Start Time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            options={TIME_OPTIONS}
          />
          <Select
            label="End Time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            options={TIME_OPTIONS}
            error={errors.endTime}
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Venue
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => handleChange('venue', e.target.value)}
            placeholder="e.g. Seminar Hall, AMTICS"
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 ${
              errors.venue
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#6332ec]'
            }`}
          />
          {errors.venue && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.venue}
            </p>
          )}
        </div>

        {/* Category */}
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={EVENT_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        {/* Coordinators MultiSelect */}
        <div>
          <MultiSelect
            label="Event Coordinators"
            helperText="Assign coordinators who can scan and view attendee lists for this event"
            options={coordinatorOptions}
            value={formData.coordinatorIds}
            onChange={(ids) => handleChange('coordinatorIds', ids)}
            placeholder="Select coordinators..."
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
          >
            {isEdit ? 'Save Changes' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
