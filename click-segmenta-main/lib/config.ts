export const FLASK_BASE =
  process.env.NEXT_PUBLIC_FLASK_BASE?.replace(/\/$/, "") || "http://localhost:5000";
