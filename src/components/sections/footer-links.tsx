import React from 'react';

const FooterLinks = () => {
  return (
    <div 
      id="forgot-password" 
      className="flex justify-center w-full mt-[16px]"
      style={{
        paddingTop: '32px' // Approximate spacing from mt-4 and common form structures
      }}
    >
      <a 
        href="#"
        className="text-[12px] text-[#131435] underline font-normal decoration-1 underline-offset-2 hover:opacity-80 transition-opacity"
        style={{
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.2'
        }}
      >
        Mot de passe oublié ?
      </a>
    </div>
  );
};

export default FooterLinks;