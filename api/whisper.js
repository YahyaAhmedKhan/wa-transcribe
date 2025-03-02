import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import { ElevenLabsClient } from "elevenlabs";

// Initialize the Groq client
const groq = new Groq();

async function main() {
  // Create a transcription job
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream("aud.ogg"), // Required path to audio file - replace with your audio file!
    model: "whisper-large-v3", // Required model to use for transcription
    prompt: "Give the output in English wihtout traslating", // Optional
    response_format: "text", // Optional
    language: "en", // Optional
    temperature: 0.0, // Optional
  });
  // Log the transcribed text
  console.log(transcription);
}
// main();

// export async function transcribeAudio(filepath){
//   // Create a transcription job
//   const transcription = await groq.audio.transcriptions.create({
//     file: fs.createReadStream(filepath),
//     model: "whisper-large-v3", // Required model to use for transcription
//     // model: "distil-whisper-large-v3-en", // Required model to use for transcription
//     // prompt: "Give the output in English wihtout traslating", // Optional
//     response_format: "text", // Optional
//     language: "en", // Optional
//     temperature: 0.0, // Optional
//   }); 

//   return transcription;
// }


export async function transcribeAudio(filepath){
  const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  const response = await client.speechToText.convert({
      file: fs.createReadStream(filepath),
      model_id: "scribe_v1",

  });
  return response.text;
}


// console.log(await transcribeAudio("test.mp3"));
