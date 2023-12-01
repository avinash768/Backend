const http = require('http');
const url = require('url');
const querystring = require('querystring');
const port = 3000; // You can change this to the desired port number

const server = http.createServer((req, res) => {
  // Handle only POST requests
  if (req.method === 'POST') {
    let data = '';

    // Accumulate data as it comes in
    req.on('data', (chunk) => {
      data += chunk;
    });

    // When all data is received
    req.on('end', () => {
      // Parse the JSON payload
      const payload = JSON.parse(data);

      // Check if the payload has the expected property
      if (payload && payload.str) {
        // Using regex to check if there are at least 8 words
        const wordCount = (payload.str.match(/\b\w+\b/g) || []).length;

        if (wordCount >= 8) {
          // Return 200 OK if at least 8 words
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Return 200 OK.' }));
        } else {
          // Return Not Acceptable if not 8 words
          res.writeHead(406, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Return Not Acceptable if not 8 words.' }));
        }
      } else {
        // Return Bad Request if payload is missing the expected property
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid payload. Missing "str" property.' }));
      }
    });
  } else {
    // Return Method Not Allowed for non-POST requests
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed. Only POST requests are accepted.' }));
  }
});

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});


