import { get } from "http";
import { sendWhatsAppMessage, getMediaUrl, downloadMedia, sendReadReceipt } from "./whatsapp.js";
import {transcribeAudio} from "./whisper.js";


export async function handleWebhookVerifcation (req, res) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        return res.status(200).send(challenge);
      } else {
        console.log("VERIFICATION_FAILED");
        return res.status(403).json({ status: "error", message: "Verification failed" });
      }
    } else {
      console.log("MISSING_PARAMETER");
      return res.status(400).json({ status: "error", message: "Missing parameters" });
    }
  }

export async function handleUserMessage (req, res) {
    try {
      const entry = req.body.entry?.[0]?.changes?.[0]?.value;
  
      if (!entry) {
        console.log("Invalid webhook structure");
        return res.status(200).json({ status: "error", message: "Invalid payload" });
      }
  
      if (entry?.statuses) { // handle status update
        console.log("Received Status update:");
  
        const status = entry.statuses[0]?.status;
        const recipient_id = entry.statuses[0]?.recipient_id;
  
        if (status && recipient_id) {
          console.log(`Status Update: ${status} by ${recipient_id}`);
        } else {
          console.log("Received a WhatsApp status update but missing details.");
        }
  
        return res.status(200).json({ status: "ok", message: "Status received" });
      }
      const message = entry?.messages;
    
      if (message) { // handle message received
        const wa_number = message[0].from;
        const user_message = message[0].text?.body || "No message content";
        const message_id = message[0].id;
        const type = message[0].type;
        sendReadReceipt(message_id); 
  
        if (!wa_number || !user_message || !message_id) {
          console.log("Missing message details");
          return res.status(200).json({ status: "error", message: "Invalid message payload" });
        }
  
        console.log("wa_id:", wa_number);
        console.log("user_message:", user_message);
        
        let transcription = "No transcription available";
        if (message[0].audio) {
          try {
            const audio_id = message[0].audio.id;
            const audio_url = await getMediaUrl(audio_id);
            const audio_path = await downloadMedia(audio_url);
            let transcription = await transcribeAudio(audio_path);
        
            if (!transcription || transcription.trim() === "") {
              sendWhatsAppMessage(wa_number, "Transcription is empty.");
              return;
            }
        
            const MAX_CHUNK_SIZE = 4096;
            for (let i = 0; i < transcription.length; i += MAX_CHUNK_SIZE) {
              const chunk = transcription.substring(i, i + MAX_CHUNK_SIZE);
              await sendWhatsAppMessage(wa_number, chunk); // Ensure messages are sent sequentially
            }
          } catch (error) {
            console.error("Error processing audio message:", error);
            sendWhatsAppMessage(wa_number, "An error occurred while processing your audio.");
          }
        }
        
        return res.status(200).json({ status: "success", message: "Response sent", text: transcription });
      }
  
      return res.status(200).json({ status: "ignored", message: "No relevant data found" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(200).json({ status: "error", message: "Internal server error" });
    }
  }

  async function handleTextMessage(req) {

    const wa_number = message[0].from;
    const user_message = message[0].text?.body || "No message content";
    const message_id = message[0].id;
    const type = message[0].type;

    if (!wa_number || !user_message || !message_id) {
      console.log("Missing message details");
      return res.status(200).json({ status: "error", message: "Invalid message payload" });
    }

    console.log("wa_id:", wa_number);
    console.log("user_message:", user_message);
    
    let transcription = "No transcription available";
    if(message[0].audio){
      const audio_id = message[0].audio.id;
      const audio_url = await getMediaUrl(audio_id);
      const audio_path = await downloadMedia(audio_url);
      transcription = await transcribeAudio(audio_path);
        }
  }