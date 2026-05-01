"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";

interface NumpadProps {
  onInput: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

const Numpad: React.FC<NumpadProps> = ({ onInput, onBackspace }) => {
  const [keys, setKeys] = useState<(number | null)[]>([]);

  // Randomize digits 0-9 and fill the rest of the 18 slots (3x6 grid) with null
  const generateRandomKeys = useCallback(() => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const randomized = [...digits].sort(() => Math.random() - 0.5);
    
    // The original layout is a 3-row, 6-button wide grid (18 total slots)
    // We need to distribute these 10 digits and 1 backspace into the 18 slots.
    // Based on the HTML structure and visual reference:
    // Row 1: 2 digits + empty spaces
    // Row 2: 6 digits
    // Row 3: 2 digits + backspace + empty spaces
    
    // However, to match the randomized nature for security, we'll just ensure 
    // all digits are present once and the backspace is in the target position.
    
    const layout: (number | string | null)[] = new Array(18).fill(null);
    
    // Assign digits to specific indices derived from the HTML structure mapping
    // Digits indices based on the provided HTML dump's presence:
    // Row 0: index 1, 2
    // Row 1: index 6, 7, 8, 9, 10, 11
    // Row 2: index 12, 14
    // Row 3 (bksp): index 17
    
    const targetIndices = [1, 2, 6, 7, 8, 9, 10, 11, 12, 14];
    randomized.forEach((digit, i) => {
      layout[targetIndices[i]] = digit;
    });
    
    // 17 is the index for backspace in a 3x6 grid (r2b5)
    layout[17] = "{bksp}";
    
    return layout;
  }, []);

  useEffect(() => {
    setKeys(generateRandomKeys() as (number | null)[]);
  }, [generateRandomKeys]);

  const handleKeyPress = (key: number | string | null) => {
    if (key === null) return;
    if (key === "{bksp}") {
      onBackspace();
    } else {
      onInput(key.toString());
    }
  };

  return (
    <div className="mt-5 mx-auto w-full max-w-[400px]">
      <div 
        className="grid grid-cols-6 border-t border-l border-[#DEE2E6] bg-white select-none"
        style={{ userSelect: 'none' }}
      >
        {keys.map((key, index) => {
          const isBksp = key === "{bksp}";
          const isEmpty = key === null;

          return (
            <div
              key={index}
              onClick={() => handleKeyPress(key === "{bksp}" ? "{bksp}" : key)}
              className={`
                h-[45px] flex items-center justify-center border-r border-b border-[#DEE2E6] text-[15px] cursor-pointer
                transition-colors duration-150 active:bg-gray-100
                ${isEmpty ? 'cursor-default' : 'hover:bg-gray-50'}
                ${isBksp ? 'bg-gray-50' : ''}
              `}
              style={{
                fontFamily: "inherit",
                fontSize: "15px",
                color: "#131435",
                fontWeight: 500
              }}
            >
              {isBksp ? (
                <span className="text-[12px] font-bold text-[#495057]">&lt;</span>
              ) : (
                <span>{key !== null ? key : ""}</span>
              )}
            </div>
          );
        })}
      </div>
      
      <style jsx global>{`
        .simple-keyboard.hg-theme-default {
          background-color: transparent;
          padding: 0;
        }
        .hg-button {
          height: 45px !important;
          background: #fff !important;
          border-bottom: 1px solid #dee2e6 !important;
          border-right: 1px solid #dee2e6 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .hg-button:active {
          background: #f4f6f9 !important;
        }
        .hg-button-bksp {
          background: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

export default Numpad;