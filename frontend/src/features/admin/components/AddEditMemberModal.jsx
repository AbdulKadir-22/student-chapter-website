import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import Select from '../../../shared/components/ui/Select';
import PhoneInput from '../../../shared/components/ui/PhoneInput';
import MultiSelect from '../../../shared/components/ui/MultiSelect';
import {
  DEPARTMENTS,
  OFFICE_BEARER_POSITIONS,
} from '../../../shared/utils/constants';
import {
  createAdminMemberApi,
  updateAdminMemberApi,
  getAdminMemberByIdApi,
} from '../api/admin.api';
import { getEventsApi } from '../../events/api/events.api';

export default function AddEditMemberModal({
  isOpen,
  onClose,
  memberId = null,
  onSuccess,
}) {
  const isEdit = Boolean(memberId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentNumber: '',
    year: '1',
    department: 'CSE',
    position: '',
    role: 'member',
    isActive: true,
    coordinatorEventIds: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load events for coordinator assignment
  const { data: eventsData } = useQuery({
    queryKey: ['admin', 'events-lookup'],
    queryFn: () => getEventsApi({ limit: 100 }),
    enabled: isOpen && formData.role === 'coordinator',
  });

  const eventOptions = (eventsData?.data || []).map((ev) => ({
    value: ev.id,
    label: ev.name,
  }));

  // Fetch member details if edit mode
  useEffect(() => {
    if (isOpen && isEdit && memberId) {
      setLoading(true);
      getAdminMemberByIdApi(memberId)
        .then((res) => {
          const m = res.member || res.data || res;
          if (!m) throw new Error('Member data missing');
          setFormData({
            name: m.name || '',
            email: m.email || '',
            phone: m.phone || '',
            enrollmentNumber: m.enrollmentNumber || '',
            year: String(m.year || '1'),
            department: m.department || 'CSE',
            position: m.position || '',
            role: m.role || 'member',
            isActive: m.isActive !== undefined ? m.isActive : true,
            coordinatorEventIds: (m.coordinatorEvents || []).map((e) => e.id),
          });
          setErrors({});
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Failed to load member');
          onClose();
        })
        .finally(() => setLoading(false));
    } else if (isOpen && !isEdit) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        enrollmentNumber: '',
        year: '1',
        department: 'CSE',
        position: '',
        role: 'member',
        isActive: true,
        coordinatorEventIds: [],
      });
      setErrors({});
    }
  }, [isOpen, isEdit, memberId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Name is required';
    if (!isEdit) {
      if (!formData.email?.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
        errs.email = 'Invalid email address';
    }
    if (!formData.phone?.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+\d{10,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Valid phone with country code required (e.g. +91...)';
    }
    if (!formData.enrollmentNumber?.trim()) {
      errs.enrollmentNumber = 'Enrollment number is required';
    } else if (!/^\d{8,16}$/.test(formData.enrollmentNumber.trim())) {
      errs.enrollmentNumber = 'Enrollment must be 8-16 digits';
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
        phone: formData.phone.trim(),
        enrollmentNumber: formData.enrollmentNumber.trim(),
        year: Number(formData.year),
        department: formData.department,
        position: formData.position || null,
        role: formData.role,
        coordinatorEventIds:
          formData.role === 'coordinator' ? formData.coordinatorEventIds : [],
      };

      if (isEdit) {
        payload.isActive = formData.isActive;
        await updateAdminMemberApi(memberId, payload);
        toast.success('Member updated successfully');
      } else {
        payload.email = formData.email.trim().toLowerCase();
        await createAdminMemberApi(payload);
        toast.success(
          'Member added! Temporary password is the part of the email before @'
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const resp = err.response?.data;
      if (err.response?.status === 409 && resp?.field) {
        setErrors((prev) => ({
          ...prev,
          [resp.field]: resp.message || `${resp.field} already exists`,
        }));
      } else {
        toast.error(resp?.message || 'Operation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Member' : 'Add Member'}
      description={
        isEdit
          ? 'Update member details and event assignments.'
          : 'Add a new member to ACM Amtics.'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Shaikh Yahiya"
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

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            disabled={isEdit}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="yahiya.contact@gmail.com"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 ${
              isEdit
                ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                : errors.email
                ? 'bg-white border-rose-400 focus:border-rose-500'
                : 'bg-white border-slate-200 focus:border-[#6332ec]'
            }`}
          />
          {isEdit && (
            <p className="text-[10px] text-slate-400 mt-1">
              Email cannot be changed after creation.
            </p>
          )}
          {errors.email && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <PhoneInput
          label="Phone Number"
          value={formData.phone}
          onChange={(val) => handleChange('phone', val)}
          error={errors.phone}
        />

        {/* Enrollment Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enrollment Number
          </label>
          <input
            type="text"
            value={formData.enrollmentNumber}
            onChange={(e) => handleChange('enrollmentNumber', e.target.value)}
            placeholder="e.g. 20260310350081"
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 ${
              errors.enrollmentNumber
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#6332ec]'
            }`}
          />
          {errors.enrollmentNumber && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">
              {errors.enrollmentNumber}
            </p>
          )}
        </div>

        {/* Year & Department */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Year"
            value={formData.year}
            onChange={(e) => handleChange('year', e.target.value)}
            options={[
              { value: '1', label: '1st Year' },
              { value: '2', label: '2nd Year' },
              { value: '3', label: '3rd Year' },
              { value: '4', label: '4th Year' },
            ]}
          />
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            options={DEPARTMENTS.map((dept) => ({ value: dept, label: dept }))}
          />
        </div>

        {/* Position & Role */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Position (Optional)"
            placeholder="None"
            value={formData.position}
            onChange={(e) => handleChange('position', e.target.value)}
            options={[
              { value: '', label: 'None' },
              ...OFFICE_BEARER_POSITIONS.map((pos) => ({
                value: pos,
                label: pos,
              })),
            ]}
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            options={[
              { value: 'member', label: 'Member' },
              { value: 'coordinator', label: 'Coordinator' },
            ]}
          />
        </div>

        {/* Assign Events if Coordinator */}
        {formData.role === 'coordinator' && (
          <div className="pt-1">
            <MultiSelect
              label="Assign Events"
              helperText="Pick the events this person coordinates"
              options={eventOptions}
              value={formData.coordinatorEventIds}
              onChange={(ids) => handleChange('coordinatorEventIds', ids)}
              placeholder="Select coordinated events..."
            />
          </div>
        )}

        {/* Active Toggle (Edit Mode Only) */}
        {isEdit && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <p className="text-xs font-bold text-slate-800">Account Status</p>
              <p className="text-[11px] text-slate-500">
                {formData.isActive
                  ? 'Active — member can log in and participate'
                  : 'Inactive — member is deactivated and cannot log in'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('isActive', !formData.isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.isActive ? 'bg-[#6332ec]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}

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
            {isEdit ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
