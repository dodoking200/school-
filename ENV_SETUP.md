# Environment Variables Setup

## Overview

This project uses environment variables to manage configuration settings like API URLs. This approach allows for different configurations across development, testing, and production environments without changing the code.

## Available Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API requests | `http://localhost:3000` |

## Setup Instructions

### Local Development

1. Create a `.env.local` file in the root of the project (this file is already created for you)
2. Add your environment variables in the format `KEY=VALUE`

```
# Example .env.local file
NEXT_PUBLIC_API_BASE_URL=http://192.168.137.104:3000
```

### Production Environment

For production, set environment variables according to your hosting platform:

- **Vercel**: Set environment variables in the Vercel dashboard
- **Netlify**: Set environment variables in the Netlify dashboard
- **Docker**: Set environment variables in your Docker configuration

## Using Environment Variables in Code

Access environment variables in your code using `process.env`:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Important Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Variables without this prefix are only available on the server
- Always use `NEXT_PUBLIC_` for variables needed in client-side code
- Restart your development server after changing environment variables

## Adding New Environment Variables

1. Add the variable to your `.env.local` file
2. Update this documentation
3. If needed, add the variable to your deployment platform