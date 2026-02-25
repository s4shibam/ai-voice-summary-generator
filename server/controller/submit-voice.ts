import type { Request, Response } from 'express';
import { openai, toFile } from '../services/openai.js';
import { resend } from '../services/resend.js';

/**
 * For Audio to Text: GPT-4o mini Transcribe
 * For Text to Summary: gpt-4.1-nano-2025-04-14
 */

export const submit_voice = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const voiceFile = req.file;

    console.log('Email:', email);
    console.log('Voice buffer size:', voiceFile?.buffer?.byteLength, 'bytes');

    const transcription = await openai.audio.transcriptions.create({
      file: await toFile(voiceFile!.buffer, voiceFile!.originalname, {
        type: voiceFile!.mimetype
      }),
      model: 'gpt-4o-mini-transcribe',
      prompt:
        'You are a helpful assistant that transcribes audio to text. Assume the text is always in English.'
    });

    console.log('transcription.text : ', transcription.text);

    const summarization = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content:
            'You are a strict assistant that only summarizes the given user input into much fewer words. Respond exclusively with a brief summary, removing all unnecessary details and not repeating any input text verbatim. Make the summary as concise as possible.'
        },
        { role: 'user', content: transcription.text }
      ]
    });

    console.log(
      'summarization.choices[0].message.content : ',
      summarization.choices[0]?.message?.content
    );

    const { error } = await resend.emails.send({
      from: 'Recording Summary <support@mail.s4shibam.com>',
      to: email,
      subject: `Your voice summary ${new Date().toISOString()}`,
      html: `<p>${summarization.choices[0]?.message?.content}</p>`
    });

    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Voice submitted and email sent with summary' });
  } catch (error) {
    console.error('Error submitting voice:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
