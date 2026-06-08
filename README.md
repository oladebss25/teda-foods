# Teda Foods

Fresh jollof rice, fried rice, pasta & more — made daily at FUNAAB, Abeokuta. Order online or via WhatsApp.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Lint & Format

```bash
npm run lint
npm run format
```

## Environment Variables

| Variable                   | Description                        | Required |
| -------------------------- | ---------------------------------- | -------- |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key (client-side)  | Yes      |
| `PAYSTACK_SECRET_KEY`      | Paystack secret key (server-side)  | Yes      |
| `PAYSTACK_PUBLIC_KEY`      | Paystack public key (server-side)  | Yes      |
| `PORT`                     | Server port (default: 3001)        | No       |

Copy `.env` and fill in your values. Do **not** commit `.env.production` — it's in `.gitignore`.

### Environment files

| File                 | Purpose                | Committed |
| -------------------- | ---------------------- | --------- |
| `.env`               | Local overrides        | No        |
| `.env.development`   | Dev/test keys          | Yes       |
| `.env.production`    | Live keys              | No        |
