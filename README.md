# Implementation of Authorization Code Grant Flow

This flow is suitable for long-running applications in which the user grants permission only once. It provides an access token that can be refreshed. Since the token exchange involves sending your secret key, perform this on a secure location, like a backend service, and not from a client such as a browser or from a mobile app.

For further information about this flow, see [RFC-6749](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1/).

This is a [Express](https://expressjs.com//) project.

## Getting Started

First, run the development server:

```bash
npm install
# and
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.