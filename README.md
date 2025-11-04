This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## css variables
LIGHT_MODE = background: linear-gradient(252deg, #F7F9FA 12.74%, #F7F9FA 98.57%);
           = background: rgba(42, 163, 239, 0.04);
THEME_COLOR = #4FD8E0
PRIMARY_COLOR = #436475
SECONDARY_COLOR = #436475
font-family: Poppins;
font-size = 10 || 12 || 14 || 16
button = 101*44

DARK_MODE = background: linear-gradient(0deg, #255878 0%, #15202B 98.36%);
          = background: rgba(42, 163, 239, 0.04);
THEME_COLOR = #2AA3EF
PRIMARY_COLOR = #F1F1F1
SECONDARY_COLOR = #F1F1F1
font-family: Poppins;
font-size = 10 || 12 || 14 || 16
button = 101*44


login .. https://api.tippni.com/api/v1/auth/register
request body
{
  "email": "string",
  "username": "string",
  "password": "string"
}
response
register .. https://api.tippni.com/api/v1/auth/authenticate
{
  "jwt": "string"
}
https://api.tippni.com/api/v1/auth/validate/{jwt}

