'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success(t('welcomeBack'));
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error(t('userNotFound'));
      } else if (error.code === 'auth/wrong-password') {
        toast.error(t('wrongPassword'));
      } else if (error.code === 'auth/invalid-email') {
        toast.error(t('invalidEmail'));
      } else {
        toast.error(t('signInFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success(t('welcomeBack'));
      router.push('/');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(t('signInWithGoogleFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{t('back')}</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t('login')}</h1>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleEmailLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterEmail')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('enterPassword')}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              disabled={loading}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline disabled:opacity-50"
            >
              {t('forgotPassword')}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? t('signingIn') : t('login')}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">{t('noAccount')} </span>
          <button
            onClick={() => router.push('/register')}
            className="text-sm font-semibold text-gray-900 hover:underline"
            disabled={loading}
          >
            {t('signUp')}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-500">{t('or')}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10V12.05H15.4818C15.2273 13.3 14.4727 14.3591 13.3545 15.0682V17.5773H16.7182C18.7091 15.7364 19.8 13.2273 19.8 10.2273Z" fill="#4285F4" />
            <path d="M10 20C12.7 20 14.9636 19.1045 16.7182 17.5773L13.3545 15.0682C12.4091 15.6682 11.2045 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.1636 4.35909 11.7273H0.890909V14.3182C2.63636 17.7909 6.09091 20 10 20Z" fill="#34A853" />
            <path d="M4.35909 11.7273C4.14545 11.1273 4.02273 10.4773 4.02273 9.81819C4.02273 9.15909 4.14545 8.50909 4.35909 7.90909V5.31819H0.890909C0.218182 6.65909 -0.181818 8.18182 -0.181818 9.81819C-0.181818 11.4545 0.218182 12.9773 0.890909 14.3182L4.35909 11.7273Z" fill="#FBBC05" />
            <path d="M10 3.61364C11.3182 3.61364 12.5091 4.07727 13.4409 4.96364L16.3818 2.02273C14.9591 0.690909 12.6955 -0.181818 10 -0.181818C6.09091 -0.181818 2.63636 2.02273 0.890909 5.31818L4.35909 7.90909C5.19091 5.47273 7.39545 3.61364 10 3.61364Z" fill="#EA4335" />
          </svg>
          {t('continueWithGoogle')}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-500">{t('or')}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Continue as Guest */}
        <button
          onClick={handleContinueAsGuest}
          disabled={loading}
          className="w-full text-gray-600 py-4 font-medium hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          {t('continueAsGuest')}
        </button>
      </div>
    </div>
  );
}
