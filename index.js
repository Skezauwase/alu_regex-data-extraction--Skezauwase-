// index.js
const fs = require("fs");

// Read input file safely
let rawText = "";
try {
  rawText = fs.readFileSync("sample_input.txt", "utf-8").trim();
} catch (err) {
  console.error("Error reading input file:", err.message);
  process.exit(1);
}

// ------------------- Regex Patterns -------------------
//We extract emails, URLs, phone numbers, credit cards, times, hashtags

const patterns = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  url: /https?:\/\/[^\s)]+/g,
  phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  time: /\b([01]?\d|2[0-3]):[0-5]\d(\s?[AP]M)?\b/g,
  hashtag: /#[A-Za-z0-9_]+/g
};
// ------------------- Security & Cleaning -------------------

// Remove trailing punctuation and extra spaces
function normalizeText(str) {
  return String(str).replace(/[.,;:!?]+$/g, "").trim();
}

// Basic safety check for malicious scripts, SQL, or inline JS
function sanitizeInput(str) {
  const lower = String(str).toLowerCase();
  return !(
    /<\s*script\b|javascript:|on\w+\s*=|<\s*iframe\b|drop\s+table|delete\s+from/.test(lower)
  );
}

// Extract matches for a given regex pattern with cleaning and security
function extractMatches(pattern) {
  const found = rawText.match(pattern) || [];
  const cleanMatches = [];
  for (let item of found) {
    const normalized = normalizeText(item);
    if (normalized && sanitizeInput(normalized)) {
      cleanMatches.push(normalized);
    }
  }
  return cleanMatches;
}

// ------------------- Masking Sensitive Data -------------------

function maskEmail(email) {
  const parts = email.split("@");
  return parts[0][0] + "***@" + parts[1]; // show first letter only
}

function maskCard(card) {
  const digits = card.replace(/[-\s]/g, "");
  return digits.slice(0, 4) + " **** **** " + digits.slice(-4);
}

// ------------------- Extraction -------------------

const emailList = extractMatches(patterns.email).map(maskEmail);
const urlList = extractMatches(patterns.url);
const phoneList = extractMatches(patterns.phone);
const cardList = extractMatches(patterns.creditCard).map(maskCard);
const timeList = extractMatches(patterns.time);
const hashtagList = extractMatches(patterns.hashtag);

// ------------------- Output -------------------

const output = {
  metadata: {
    extractedAt: new Date().toISOString(),
    notes: "Malicious and unsafe inputs have been filtered and masked."
  },
  data: {
    emails: emailList,
    urls: urlList,
    phones: phoneList,
    credit_cards: cardList,
    times: timeList,
    hashtags: hashtagList
  },
  counts: {
    emails: emailList.length,
    urls: urlList.length,
    phones: phoneList.length,
    credit_cards: cardList.length,
    times: timeList.length,
    hashtags: hashtagList.length
  }
};

// Write to output JSON
fs.writeFileSync("sample_output.json", JSON.stringify(output, null, 2));
console.log("Extraction complete. Results saved to sample_output.json.");
console.log(JSON.stringify(output, null, 2));
