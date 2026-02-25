import { useState } from 'react';

const useSubmitVoice = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitVoice = async ({
    email,
    voice
  }: {
    email: string;
    voice: Blob;
  }) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('voice', voice);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voice/submit-voice`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to submit voice');
      }

      setMessage(data?.message ?? 'Voice submitted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { submitVoice, loading, message, error };
};

export default useSubmitVoice;
