#!/usr/bin/env node
// Generates the keys used for push notifications. Run ONCE and keep them: changing them later cancels every
// subscribed device. Prints lines ready for .env / Vercel.
import * as webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();
console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
console.log("VAPID_SUBJECT=https://muhammedferej.pro.et");
