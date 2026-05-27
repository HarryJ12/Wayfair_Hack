import { z } from "zod";
import { getAgentVoiceId } from "@/lib/council/voices";

const VoiceRequestSchema = z.object({
  agentId: z.string().min(1),
  text: z.string().min(1).max(500),
});

export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const body = await request.json().catch(() => ({}));
  const parsed = VoiceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "agentId and text are required." }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json(
      { error: "ELEVENLABS_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const voiceId = getAgentVoiceId(parsed.data.agentId);
  const elevenLabsResponse = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: parsed.data.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.78,
          style: 0.35,
          speed: 1.12,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!elevenLabsResponse.ok) {
    const errorText = await elevenLabsResponse.text().catch(() => "");
    return Response.json(
      { error: errorText || "ElevenLabs voice generation failed." },
      { status: elevenLabsResponse.status },
    );
  }

  return new Response(elevenLabsResponse.body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "audio/mpeg",
    },
  });
}
