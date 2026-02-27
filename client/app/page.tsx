'use client';

import useServerStatus from '@/hooks/useServerStatus';
import useSubmitVoice from '@/hooks/useSubmitVoice';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { useState } from 'react';

const IndexPage = () => {
  const [isVoiceInputEnabled, setIsVoiceInputEnabled] = useState(false);
  const [email, setEmail] = useState('');

  const serverStatus = useServerStatus();
  const { submitVoice, loading, message, error } = useSubmitVoice();
  const {
    startRecording,
    stopRecording,
    cancelRecording,
    isRecording,
    permissionError
  } = useVoiceRecorder();

  const handleRecordVoice = async () => {
    const ok = await startRecording();
    if (ok) setIsVoiceInputEnabled(true);
  };

  const handleSubmitVoice = async () => {
    const blob = await stopRecording();
    await submitVoice({ email, voice: blob });
  };

  const handleCancel = () => {
    cancelRecording();
    setIsVoiceInputEnabled(false);
    setEmail('');
  };

  const statusColor =
    serverStatus === 'up'
      ? 'bg-green-400'
      : serverStatus === 'down'
        ? 'bg-red-400'
        : 'bg-yellow-300';
  const statusLabel =
    serverStatus === 'up'
      ? 'Server Online'
      : serverStatus === 'down'
        ? 'Server Offline'
        : 'Checking...';

  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]'>
      {/* Decorative blobs */}
      <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl' />

      {/* Server status */}
      <div
        className='fixed bottom-5 right-1/2 translate-x-1/2 flex items-center gap-2 text-xs text-white/50'
        title={statusLabel}
      >
        <span className='relative flex h-2 w-2'>
          {serverStatus === 'up' && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-60`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`}
          />
        </span>
        <span>{statusLabel}</span>
      </div>

      {/* Card */}
      <div className='relative z-10 w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6'>
        {/* Header */}
        <div className='flex flex-col items-center gap-2 text-center'>
          <div className='mb-1 flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-purple-500 to-indigo-500 shadow-lg'>
            <MicSvg className='h-6 w-6 text-white' />
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            AI Voice Summary
          </h1>
          <p className='text-sm text-white/50 max-w-xs'>
            Record your voice, get a concise AI-generated summary delivered to
            your inbox.
          </p>
        </div>

        <div className='w-full h-px bg-white/10' />

        {/* Content */}
        {isVoiceInputEnabled ? (
          <div className='flex flex-col items-center gap-5 w-full'>
            {message || error ? (
              <>
                <div
                  className={`w-full rounded-xl px-4 py-3 text-sm text-center font-medium ${
                    message
                      ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                      : 'bg-red-500/10 text-red-300 border border-red-500/20'
                  }`}
                >
                  {message ?? error}
                </div>
                <button
                  className='w-full rounded-xl bg-linear-to-r from-purple-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity'
                  onClick={() => window.location.reload()}
                >
                  Start Over
                </button>
              </>
            ) : (
              <>
                <div className='flex flex-col items-center gap-2'>
                  <div className='flex items-center gap-2.5'>
                    <span className='relative flex h-3 w-3'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70' />
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-red-400' />
                    </span>
                    <span className='text-sm font-medium text-white/80'>
                      {isRecording ? 'Recording...' : 'Processing...'}
                    </span>
                  </div>
                  {permissionError && (
                    <p className='text-xs text-red-300 text-center max-w-xs'>
                      {permissionError}
                    </p>
                  )}
                </div>

                <div className='flex gap-3 w-full'>
                  <button
                    className='flex-1 rounded-xl bg-linear-to-r from-purple-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity disabled:opacity-40'
                    onClick={handleSubmitVoice}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    className='flex-1 rounded-xl bg-white/10 border border-white/10 py-2.5 text-sm font-medium text-white/70 hover:bg-white/15 transition-colors disabled:opacity-40'
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className='flex flex-col gap-4 w-full'>
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='email'
                className='text-xs font-medium text-white/60 uppercase tracking-wider'
              >
                Your Email
              </label>
              <input
                className='w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40 transition'
                type='email'
                id='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {permissionError && (
              <p className='text-xs text-red-300 text-center'>
                {permissionError}
              </p>
            )}

            <button
              className='w-full rounded-xl bg-linear-to-r from-purple-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2'
              onClick={handleRecordVoice}
              disabled={!email}
            >
              <MicSvg className='h-4 w-4' />
              Record Voice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;

const MicSvg = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path d='M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z' />
      <path d='M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z' />
    </svg>
  );
};
