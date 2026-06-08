export const CONFIG = {
  phone: '08070599262',
  phoneInternational: '2348070599262',
  paystackPublicKey:
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    'pk_live_2ac524dfe7371a9ad3ea0c3befb355d7e464b3d1',
  placeholderImage:
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 220 148%22%3E%3Crect fill=%22%232a2a2a%22 width=%22220%22 height=%22148%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2216%22 font-family=%22sans-serif%22%3EImage unavailable%3C/text%3E%3C/svg%3E',
  apiBase: import.meta.env.VITE_API_URL || '',
};
