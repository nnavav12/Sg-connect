"use client";
import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: '#090941',
        height: '101px',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {/* Back Arrow */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.history.back(); }}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          opacity: 1,
          zIndex: 10,
          textDecoration: 'none',
        }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} color="#ffffff" />
      </a>

      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <a href="#" style={{ display: 'inline-block' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/40a5c106-bf02-4144-96d4-ea17bec0e053-identity-ret-afs-societegenerale-com/assets/images/sg_sen_white-1.png"
            alt="C'EST VOUS L'AVENIR - SOCIETE GENERALE SENEGAL"
            style={{ height: '60px', width: 'auto', maxWidth: '340px', display: 'block' }}
          />
        </a>
      </div>

      {/* Bottom separator */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
    </header>
  );
};

export default Header;
