# ALU Regex Data Extraction ✅

**Short description:**
A small Node.js utility that reads a plain text file (`sample_input.txt`), extracts common data types (emails, URLs, phone numbers, credit cards, times, hashtags) using regular expressions, filters out unsafe/malicious input, masks sensitive fields, and writes a clean JSON summary to `sample_output.json`.

---

## Features

- Extracts: **emails**, **URLs**, **phone numbers**, **credit cards**, **times**, **hashtags**
- Cleans extracted values (trailing punctuation, extra spaces)
- Filters out obvious malicious input (simple checks for inline scripts, SQL keywords, etc.)
- Masks sensitive items (emails and credit card numbers)
- Produces a JSON file with metadata, extracted data, and counts

---

## Requirements

- Node.js (12+ recommended)
- No external dependencies (uses built-in `fs` module)

---

## How to run

1. Make sure `sample_input.txt` is in the same folder as `index.js` (a sample is included).
2. Run the script:

```bash
node index.js
```

3. Output is written to `sample_output.json` and also printed to the console.

---

## Implementation details (what the code does and why)

### Input reading
- `fs.readFileSync('sample_input.txt', 'utf-8')` reads the source text and trims whitespace.
- If the input file can't be read, the script exits with an error message.

### Regex patterns used
The script defines a `patterns` object (in `index.js`):

- `email`: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g — common email forms
- `url`: /https?:\/\/[^\s)]+/g — HTTP/HTTPS links (stops at whitespace and close paren)
- `phone`: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/g — flexible phone formats
- `creditCard`: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g — groups of 4 digits with optional separators
- `time`: /\b([01]?\d|2[0-3]):[0-5]\d(\s?[AP]M)?\b/g — 24-hour or 12-hour with AM/PM
- `hashtag`: /#[A-Za-z0-9_]+/g — simple hashtag pattern

> Note: These regexes are intentionally simple and practical for text extraction. They are not infallible (e.g., international phone formats, unusual emails), but they cover common cases.

### Data cleaning and safety
- `normalizeText(str)` trims trailing punctuation like `.,;:!?` and extra whitespace.
- `sanitizeInput(str)` performs a simple safety check against patterns such as `<script>`, `javascript:`, `on...=` handlers, `<iframe>`, `DROP TABLE`, `DELETE FROM`, etc. It returns `false` for inputs that match these risky patterns so they are not included in the output.

This is a lightweight safety layer — it helps remove obvious malicious snippets but is not a substitute for rigorous input validation in production systems.

### Masking sensitive data
- `maskEmail(email)`: shows only the first character of the local part, with `***`, e.g. `j***@gmail.com`.
- `maskCard(card)`: normalizes digits and outputs like `4539 **** **** 6467` (keeps first 4 and last 4 visible).

These masks reduce exposure of sensitive data while keeping results useful for analysis and debugging.

### Output format (`sample_output.json`)
- `metadata`:
  - `extractedAt`: ISO timestamp when extraction ran
  - `notes`: short statement about filtering and masking
- `data`: object with arrays for `emails`, `urls`, `phones`, `credit_cards`, `times`, and `hashtags`
- `counts`: counts for each array, useful for quick summarization or monitoring

Example (trimmed):
```json
{
  "metadata": { "extractedAt": "2026-02-01T...Z", "notes": "Malicious and unsafe inputs have been filtered and masked." },
  "data": { "emails": ["j***@gmail.com"], "urls": ["https://www.example.org/..."], ... }
}
```

---

## Example
Given `sample_input.txt` (included), the script:
- Ignores the `<script>` snippet and malformed addresses like `john@@gmail..com` and `DROP TABLE users;`
- Extracts valid items and masks sensitive pieces
- Writes a JSON summary like `sample_output.json` (included)

---

## Limitations & Notes
- The security checks are simple pattern matches. For production, use established sanitization/validation libraries and follow secure coding practices.
- Regexes are tuned to common formats — adding broader international or edge-case support may require more complex patterns or specialized parsers.

---

##  Contributing
- Feel free to open an issue or send a PR to improve patterns, add more data types, or harden security/sanitization.

---

## License
- Add your preferred license or repository policy here.

---

If you'd like, I can also add a `USAGE.md` with more examples or add unit tests for each extractor (Jest/Mocha). 💡
