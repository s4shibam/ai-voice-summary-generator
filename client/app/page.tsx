'use client';

import useSubmitVoice from '@/hooks/useSubmitVoice';
import useVoiceRecorder from '@/hooks/useVoiceRecorder';
import { useState } from 'react';

const IndexPage = () => {
  const [isVoiceInputEnabled, setIsVoiceInputEnabled] = useState(false);
  const [email, setEmail] = useState('');

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

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white text-black'>
      {isVoiceInputEnabled ? (
        <div className='flex flex-col items-center justify-center gap-4'>
          {message || error ? (
            <>
              <p
                className={`text-sm font-medium text-center max-w-xs ${message ? 'text-green-600' : 'text-red-500'}`}
              >
                {message ?? error}
              </p>
              <button
                className='bg-blue-500 text-white rounded-md px-4 py-2 mt-2'
                onClick={() => {
                  window.location.reload();
                }}
              >
                Start Over
              </button>
            </>
          ) : (
            <>
              <div className='flex items-center gap-3'>
                <span className='relative flex h-3 w-3'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75' />
                  <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500' />
                </span>
                <span className='text-sm font-medium text-gray-700'>
                  {isRecording ? 'Recording...' : 'Processing...'}
                </span>
              </div>

              {permissionError && (
                <p className='text-sm text-red-500 text-center max-w-xs'>
                  {permissionError}
                </p>
              )}

              <div className='flex gap-3 mt-2'>
                <button
                  className='bg-green-500 disabled:opacity-50 text-white rounded-md px-4 py-2'
                  onClick={handleSubmitVoice}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  className='bg-gray-200 text-gray-800 rounded-md px-4 py-2'
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
        <div className='flex flex-col items-center justify-center gap-2'>
          <label htmlFor='email'>Email</label>
          <input
            className='border-2 border-gray-300 rounded-md p-2 min-w-60'
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {permissionError && (
            <p className='text-sm text-red-500 text-center max-w-xs mt-1'>
              {permissionError}
            </p>
          )}

          <button
            className='bg-blue-500 mt-4 text-white rounded-md p-2 disabled:opacity-50'
            onClick={handleRecordVoice}
            disabled={!email}
          >
            Record Voice
          </button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
