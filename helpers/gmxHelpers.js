
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';


import configProcess from '../config/config.js';
export async function fetchGmxOTP() {
    try {
        const connection = await imaps.connect(configProcess.gmxConfig);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
        const messages = await connection.search(searchCriteria, fetchOptions);

        let latestOTP = null;

        for (const item of messages) {
            const part = item.parts.find(p => p.which === 'TEXT');
            const parsed = await simpleParser(part.body);
            const otpMatch = parsed.text.match(/\b\d{4,8}\b/);
            
            if (otpMatch) {
                latestOTP = otpMatch[0];
                break; // Stop at the first OTP found
            }
        }

        connection.end();
        return latestOTP; // Returns the string '123456' or null
    } catch (err) {
        console.error('IMAP Error:', err);
        throw err; // Let the caller handle the error
    }
}

export async function fetchLatestEmail() {
    try {
        const connection = await imaps.connect(configProcess.gmxConfig);
        await connection.openBox('INBOX');

        // We search for UNSEEN (unread) emails
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: true };
        const results = await connection.search(searchCriteria, fetchOptions);

        if (results.length === 0) {
            connection.end();
            return null;
        }

        // Get the very last email in the list (the most recent one)
        const latestMessage = results[results.length - 1];
        
        // Find the 'full' body part (indicated by an empty string '')
        const allParts = latestMessage.parts.find(part => part.which === '');
        const parsedEmail = await simpleParser(allParts.body);

        connection.end();

        // Return a clean object with only the data we care about
        return {
            subject: parsedEmail.subject,
            from: parsedEmail.from.text,
            date: parsedEmail.date,
            text: parsedEmail.text, // The plain text body
            html: parsedEmail.html  // The HTML body (if you want to parse it later)
        };
    } catch (err) {
        console.error('Fetch Error:', err);
        throw err;
    }
}


