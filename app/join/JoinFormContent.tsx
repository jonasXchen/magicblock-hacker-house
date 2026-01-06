'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ParticleBackground from '../components/ParticleBackground';
import Spotlight from '../components/Spotlight';
import Link from 'next/link';

export default function JoinFormContent() {
  const searchParams = useSearchParams();
  const pubkey = searchParams.get('pubkey');
  const githubParam = searchParams.get('github');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    x: '',
    github: githubParam || '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!pubkey) {
      // Redirect back to auth if no pubkey
      window.location.href = '/auth';
    }
  }, [pubkey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.company || !formData.x || !formData.github || !formData.description) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        github: `https://github.com/${formData.github}`,
        publicKey: pubkey,
      };
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit form');
      }

      setSuccess(true);
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'https://play.workadventu.re/@/magicblock/magicblock-office/startup';
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <Spotlight />
        <ParticleBackground />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="text-xl text-gray-300">Redirecting to virtual office...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Spotlight />
      <ParticleBackground />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-12 pb-8">
        <div className="w-full max-w-sm backdrop-blur-md bg-white/5 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-white">Join the Hacker House</h1>
              <p className="text-gray-400 text-xs">Fill out the form to access the virtual office</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-xs font-semibold text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-semibold text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="company" className="text-xs font-semibold text-gray-300">
                  Company / Project
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Your company or project"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-xs font-semibold text-gray-300">
                  Project Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="What are you building?"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="x" className="text-xs font-semibold text-gray-300">
                  X Handle
                </label>
                <input
                  type="text"
                  id="x"
                  name="x"
                  value={formData.x}
                  onChange={handleChange}
                  required
                  className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="@yourhandle"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="github" className="text-xs font-semibold text-gray-300">
                  GitHub Handle
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    disabled={!!formData.github}
                    required
                    className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="github-username"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.github) {
                        // Clear the field and redirect
                        setFormData((prev) => ({
                          ...prev,
                          github: '',
                        }));
                      }
                      const pubkeyValue = pubkey || 'unknown';
                      window.location.href = `/api/auth/github?pubkey=${pubkeyValue}`;
                    }}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-colors"
                  >
                    {formData.github ? 'Change' : 'Sign in'}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-400 text-xs">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Enter Virtual Office'}
              </button>
            </form>

            <Link href="/" className="text-center text-xs text-gray-400 hover:text-gray-300">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
