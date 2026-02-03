import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const emailDataPath = path.resolve('./Utils/emailData.json');

export async function waitForLatestResetEmail(
    request,
    accessToken,
    toEmail,
    testStartTime,
    maxWait = 60000,
    interval = 5000
) {
    const startTime = Date.now();

    while (true) {
        const inboxRes = await request.get(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=to:${toEmail}+subject:"Password Reset"`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        expect(inboxRes.status()).toBe(200);
        const inboxBody = await inboxRes.json();

        if (inboxBody.messages && inboxBody.messages.length > 0) {
            let latestMessageId = null;
            let latestInternalDate = 0;

            // 🔁 loop all messages and find latest one
            for (const msg of inboxBody.messages) {
                const msgRes = await request.get(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }
                );

                expect(msgRes.status()).toBe(200);
                const msgBody = await msgRes.json();

                // ⏱️ ignore old emails (before test started)
                if (Number(msgBody.internalDate) < testStartTime) continue;

                if (Number(msgBody.internalDate) > latestInternalDate) {
                    latestInternalDate = Number(msgBody.internalDate);
                    latestMessageId = msg.id;
                }
            }

            // ✅ latest valid mail found
            if (latestMessageId) {
                const messageRes = await request.get(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${latestMessageId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                expect(messageRes.status()).toBe(200);
                const messageBody = await messageRes.json();

                const encodedBody =
                    messageBody.payload?.parts?.[0]?.body?.data ||
                    messageBody.payload?.body?.data;

                const mailBody = Buffer.from(encodedBody, 'base64').toString('utf-8');

                // 📝 Save mail for debugging
                fs.writeFileSync(
                    emailDataPath,
                    JSON.stringify(
                        {
                            receivedAt: new Date(latestInternalDate).toISOString(),
                            mailBody
                        },
                        null,
                        2
                    )
                );

                return mailBody;
            }
        }

        if (Date.now() - startTime > maxWait) {
            throw new Error(`❌ No valid reset email received for ${toEmail}`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

export function extractResetLink(mailBody) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const links = mailBody.match(linkRegex);

    if (!links || links.length === 0) {
        throw new Error('❌ Reset link not found in email body');
    }

    return links[0]; // first link
}
