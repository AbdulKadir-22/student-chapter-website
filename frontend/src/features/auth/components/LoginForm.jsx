import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Info, Sparkles, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Modal } from '../../../shared/components/ui';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // checked by default
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login({
        email: email.trim(),
        password,
        remember: rememberMe,
      });

      toast.success('Welcome back!');
      
      // Redirect to /profile (or previous location if applicable)
      const from = location.state?.from?.pathname;
      navigate(from || '/profile', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Invalid email or password';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] flex flex-col font-sans">
      {/* Top Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3eeff] border border-[#e0d3fc] text-[#6332ec] text-xs font-semibold self-start mb-4 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" />
        <span>Welcome to ACM AMTICS</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
        Welcome <span className="text-[#6332ec]">Back</span>
      </h1>

      {/* Subheading */}
      <p className="text-sm text-slate-500 mt-1 mb-6">
        Login to continue to ACM AMTICS
      </p>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-slate-100 p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          {/* Options: Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#6332ec] focus:ring-[#6332ec] border-gray-300 accent-[#6332ec] cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-[#6332ec] hover:underline font-semibold cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 bg-[#6332ec] hover:bg-[#5225d3]"
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Info Box */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#f5f1fe] border border-[#e8ddfc] flex items-start gap-2.5">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-[#6332ec] text-white flex items-center justify-center shrink-0">
              <Info className="w-3 h-3 stroke-[2.5]" />
            </div>
            <div className="text-[11.5px] leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-800">
                Only authorized members can access this platform.
              </span>{' '}
              No self-signup. Use the credentials issued by the Admin.
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Link: Back to Home */}
      <div className="mt-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6332ec] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Password Assistance"
      >
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            Accounts for ACM AMTICS members are issued and managed directly by the chapter administration.
          </p>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-900 text-xs">
            <p className="font-semibold mb-1">How to reset your credentials:</p>
            <p>
              Please contact the ACM chapter admin at{' '}
              <a href="mailto:admin@amtics.ac.in" className="font-bold underline text-[#6332ec]">
                admin@amtics.ac.in
              </a>{' '}
              or reach out in person to your faculty coordinator.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 bg-[#6332ec] text-white text-xs font-semibold rounded-lg hover:bg-[#5225d3] cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
