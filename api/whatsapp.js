import axios from 'axios';
import { configDotenv  } from 'dotenv';
import fs from 'fs';
import path from 'path';
configDotenv();

const META_API_URL = process.env.META_API_URL
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;


/**
 * Sends a WhatsApp message using the WhatsApp Cloud API.
 * @param {string} recipientPhone - The recipient's phone number in international format (e.g., "+1234567890").
 * @param {string} message - The message to send.
 * @returns {Promise<Object>} - The response from the WhatsApp API.
 */
export async function sendWhatsAppMessage(recipientPhone, message) {
    try {
        const response = await axios.post(
            `${META_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientPhone,
                type: 'text',
                text: { body: message },
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('WhatsApp message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        throw error;
    }
}


export async function sendReadReceipt(messageId) {
    try {
        const url = `${META_API_URL}/${PHONE_NUMBER_ID}/messages`;

        const response = await axios.post(
            url,
            {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId,
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Read receipt sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending read receipt:', error.response?.data || error.message);
        throw error;
    }
}

export async function getMediaUrl(mediaId) {
    const url = `${META_API_URL}/${mediaId}`;
    

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        });

        return response.data.url;

    } catch (error) {
        console.error('Error getting media URL:', error.response?.data || error.message);
        throw error;
    }
}

export async function downloadMedia(mediaUrl) {
    try {
      const response = await axios({
        method: 'GET',
        url: mediaUrl,
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
        responseType: 'stream',
      });
  
      // Extract file extension from content type
      const contentType = response.headers['content-type'];
      const extension = contentType ? contentType.split('/')[1] : 'bin';
      const fileName = `tmp/aud.${extension}`;
      const filePath = path.basename(fileName);
  
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
  
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading media:', error.message);
      throw error;
    }
  }
  
//   sendWhatsAppMessage('+923443826628', 'Hello, World!');
// sendReadReceipt("wamid.HBgMOTIzNDQzODI2NjI4FQIAEhggMzJEQjlGNDUzMjg4RTU4MkNCNDc1OTgwMkY5RTc0MEQA")