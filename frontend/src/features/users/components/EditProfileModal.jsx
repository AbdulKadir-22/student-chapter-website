import React, { useState, useEffect } from 'react';
import { X, Sparkles, Lock, KeyRound, Globe, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateMyProfileApi } from '../api/user.api';
import { changePasswordApi } from '../../auth/api/auth.api';
import { useAuth } from '../../auth/hooks/useAuth';

export default function EditProfileModal({
  isOpen,
  onClose,
  initialTab = 'profile',
}) {
  const { user, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Details State
  const [shortBio, setShortBio] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [quote, setQuote] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [instagram, setInstagram] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setShortBio(user.shortBio || '');
      setAbout(user.about || '');
      setSkills(user.skills || []);
      setQuote(user.quote || '');
      setLinkedin(user.socials?.linkedin || '');
      setGithub(user.socials?.github || '');
      setInstagram(user.socials?.instagram || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!trimmed) return;
      if (skills.length >= 8) {
        toast.error('Maximum 8 skills allowed');
        return;
      }
      if (trimmed.length > 24) {
        toast.error('Each skill must be 24 characters or less');
        return;
      }
      if (skills.includes(trimmed)) {
        toast.error('Skill already added');
        return;
      }
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateMyProfileApi({
        shortBio: shortBio.trim(),
        about: about.trim(),
        skills,
        quote: quote.trim(),
        socials: {
          linkedin: linkedin.trim(),
          github: github.trim(),
          instagram: instagram.trim(),
        },
      });
      await refresh();
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter current password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      toast.error('Password must contain at least one letter and one number');
      return;
    }

    try {
      setSavingPassword(true);
      await changePasswordApi({
        currentPassword,
        newPassword,
      });
      await refresh();
      toast.success('Password changed successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header with Tabs */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#6332ec] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-[#6332ec] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Change Password
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Readonly info notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900">
                <span className="font-bold shrink-0">Note:</span>
                <span>
                  Name, Email, Year, Department, and Position are locked. Contact admin to change them.
                </span>
              </div>

              {/* Readonly Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Name
                  </span>
                  <span className="text-xs font-bold text-slate-800">{user?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Email
                  </span>
                  <span className="text-xs font-bold text-slate-800">{user?.email}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Academic Year & Department
                  </span>
                  <span className="text-xs font-medium text-slate-800">
                    {user?.year} Year • {user?.department}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Position
                  </span>
                  <span className="text-xs font-bold text-[#6332ec]">
                    {user?.position || 'Core Member'}
                  </span>
                </div>
              </div>

              {/* Editable: Short Bio */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Short Bio (Max 160 chars)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {shortBio.length}/160
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={160}
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  placeholder="A one-sentence summary about yourself..."
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              {/* Editable: About Me */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    About Me (Max 1000 chars)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {about.length}/1000
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Share your journey, interests, hackathon experiences, or goals..."
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              {/* Editable: Quote */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Inspirational Quote (Max 80 chars)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {quote.length}/80
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={80}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. Ideas grow when shared."
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              {/* Editable: Skills (tag input max 8) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Skills (Max 8, press Enter or Comma to add)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {skills.length}/8
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#fbfbfe] rounded-xl border border-slate-200">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#6332ec] font-semibold text-[11px] border border-purple-100"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length < 8 && (
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder={skills.length === 0 ? 'Type skill and press Enter' : 'Add another...'}
                      className="bg-transparent text-xs outline-none flex-1 min-w-[120px] py-1 px-1.5 text-slate-800"
                    />
                  )}
                </div>
              </div>

              {/* Editable: Social Links */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block">Social Profiles</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="LinkedIn URL"
                    className="bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6332ec]"
                  />
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="GitHub URL"
                    className="bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6332ec]"
                  />
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram URL"
                    className="bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6332ec]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-[#6332ec] hover:bg-[#5225d3] text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-purple-900 text-xs">
                <p className="font-semibold mb-1">Password Requirements:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-purple-800">
                  <li>At least 8 characters in length</li>
                  <li>Must contain at least one letter and one number</li>
                  <li>Must differ from your current password</li>
                </ul>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current or temporary password"
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 chars with letter and number"
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#fbfbfe] text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6332ec]/20 focus:border-[#6332ec]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPassToggle"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className="rounded text-[#6332ec] focus:ring-[#6332ec] cursor-pointer"
                />
                <label
                  htmlFor="showPassToggle"
                  className="text-xs text-slate-600 font-medium cursor-pointer"
                >
                  Show passwords
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2 rounded-xl bg-[#6332ec] hover:bg-[#5225d3] text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
