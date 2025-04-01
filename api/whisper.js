import fs from "fs";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import { ElevenLabsClient } from "elevenlabs";
import { getGroqChatCompletion } from "./utils.js";

// Initialize the Groq client
const groq = new Groq();

export async function transcribeAudio(filepath){
  // Create a transcription job
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filepath),
    model: "whisper-large-v3", // Required model to use for transcription
    // model: "distil-whisper-large-v3-en", // Required model to use for transcription
    // prompt: "Give the output in English wihtout traslating", // Optional
    response_format: "text", // Optional
    // language: "en", // Optional
    temperature: 0.0, // Optional
  }); 
  const cleanedTranscript = await getGroqChatCompletion(transcription)
  return cleanedTranscript;
}

export async function translateAudio(filepath) {
  // Create a transcription job
  const transcription = await groq.audio.translations.create({
    file: fs.createReadStream(filepath),
    model: "whisper-large-v3", // Required model to use for transcription
    // prompt: "Give the output in English wihtout traslating", // Optional
    response_format: "text", // Optional
    language: "en", // Optional
    temperature: 0.0, // Optional
  }); 
  const cleanedTranscript = await getGroqChatCompletion(transcription)
  return cleanedTranscript;
  
}

