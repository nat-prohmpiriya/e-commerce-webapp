'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('enterEmailAddress'));
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success(t('resetEmailSent'));
      // Wait a bit before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error(t('userNotFound'));
      } else if (error.code === 'auth/invalid-email') {
        toast.error(t('invalidEmail'));
      } else {
        toast.error(t('resetEmailFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Back Button */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{t('back')}</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('forgotPasswordTitle')}</h1>
        <p className="text-gray-600">
          {t('forgotPasswordDescription')}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('emailAddress')}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? t('sending') : t('sendResetLink')}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600">{t('rememberPassword')} </span>
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-gray-900 hover:underline"
            disabled={loading}
          >
            {t('backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
