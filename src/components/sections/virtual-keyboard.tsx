"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

/**
 * VirtualKeyboard Component
 * 
 * A pixel-perfect reproduction of the secure numeric virtual keyboard
 * used for password entry in the Société Générale portal.
 */

interface VirtualKeyboardProps {
  onKeyPress?: (key: string) => void;
  onBackspace?: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  onKeyPress = () => {}, 
  onBackspace = () => {} 
}) => {
  // The layout according to the HTML structure provided
  // Row 1: [empty, 8, 7, 6, empty, 1]
  // Row 2: [3, 4, empty, empty, empty, 9]
  // Row 3: [2, 0, 5, empty, empty, backspace]
  const layout = [
    ["", "8", "7", "6", "", "1"],
    ["3", "4", "", "", "", "9"],
    ["2", "0", "5", "", "", "{bksp}"]
  ];

  const handleButtonClick = (key: string) => {
    if (key === "{bksp}") {
      onBackspace();
    } else if (key !== "") {
      onKeyPress(key);
    }
  };

  return (
    <div className="mt-[40px] mb-[24px] mx-auto max-w-[520px]">
      <div 
        id="basic-pwd-kb" 
        className="simple-keyboard hg-theme-default hg-layout-numeric px-[2px]"
        style={{
          userSelect: "none"
        }}
      >
        {layout.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex mb-[5px] last:mb-0 w-full">
            {row.map((btn, btnIndex) => {
              const isEmpty = btn === "";
              const isBackspace = btn === "{bksp}";
              
              return (
                <button
                  key={`btn-${rowIndex}-${btnIndex}`}
                  type="button"
                  onClick={() => handleButtonClick(btn)}
                  disabled={isEmpty}
                  className={`
                    flex items-center justify-center flex-grow flex-shrink-0 basis-0
                    h-[40px] text-[15px] font-medium font-sans border-0 rounded-[4px]
                    transition-all duration-200 mx-[2.5px]
                    ${isEmpty 
                      ? "bg-transparent cursor-default pointer-events-none" 
                      : "bg-[#eceef1] hover:bg-[#e2e5e9] active:bg-[#d8dbdf] text-[#12163b] cursor-pointer shadow-sm"
                    }
                  `}
                  data-skbtn={btn}
                >
                  {isBackspace ? (
                    <span className="text-[18px] font-bold">&lt;</span>
                  ) : (
                    <span>{btn}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Inline styles to match the specific "simple-keyboard" theme seen in the HTML */}
      <style jsx global>{`
        .hg-theme-default {
          background-color: transparent;
          padding: 5px;
          border-radius: 5px;
        }
        .hg-theme-default .hg-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .hg-theme-default .hg-button span {
           pointer-events: none;
        }
        .hg-button-bksp {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default VirtualKeyboard;