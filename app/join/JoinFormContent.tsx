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
  const [githubAuthenticated, setGithubAuthenticated] = useState(!!githubParam);

  useEffect(() => {
    if (!pubkey) {
      // Redirect back to auth if no pubkey
      window.location.href = '/auth';
    } else {
      // Fetch existing user data if available
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user?pubkey=${pubkey}`);
          const data = await response.json();
          
          if (data.user) {
            const user = data.user;
            // Extract github username from URL
            let githubHandle = '';
            if (user.github) {
              const url = user.github.trim();
              githubHandle = url.replace('https://github.com/', '').replace('http://github.com/', '').split('/')[0];
              console.log('Extracted GitHub handle:', githubHandle, 'from:', url);
            }
            
            console.log('Prefilling user data:', { ...user, github: githubHandle });
            
            setFormData((prev) => ({
              ...prev,
              name: user.name || prev.name,
              email: user.email || prev.email,
              company: user.company || prev.company,
              x: user.x || prev.x,
              github: githubHandle || prev.github,
              description: user.description || prev.description,
            }));
            
            if (githubHandle) {
              setGithubAuthenticated(true);
            }
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };
      
      fetchUserData();
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

    if (!githubAuthenticated) {
      setError('Please sign in with GitHub first');
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
                    disabled
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
                        setGithubAuthenticated(false);
                      }
                      const pubkeyValue = pubkey || 'unknown';
                      window.location.href = `/api/auth/github?pubkey=${pubkeyValue}`;
                    }}
                    className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.545 2.914 1.209.092-.937.349-1.546.635-1.903-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.192 20 14.444 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
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
