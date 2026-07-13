"use client";

import { useState } from "react";

const WA_NUMBER = "923313454719";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const startChat = () => {
    const text = name.trim()
      ? `Hi, I'm ${name.trim()}. I'd like to ask about your products.`
      : "Hi, I'd like to ask about your products.";
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <>
      {/* Popup */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] w-[300px] overflow-hidden rounded-2xl shadow-2xl sm:right-6 sm:w-[320px]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#25D366] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <svg className="h-5 w-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.845L.057 23.428a.5.5 0 0 0 .609.61l5.71-1.494A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.856 9.856 0 0 1-5.031-1.376l-.36-.214-3.733.977.997-3.645-.236-.374A9.856 9.856 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1S21.9 6.534 21.9 12 17.466 21.9 12 21.9z" />
              </svg>
              <span className="text-sm font-black text-white uppercase tracking-wide">Chat with us on WhatsApp</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white transition-colors text-lg leading-none font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="bg-white px-5 py-5 space-y-4">
            <p className="text-sm text-zinc-600 text-center leading-relaxed">
              Please enter your name and start chat on WhatsApp:
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startChat()}
              placeholder="Your name"
              autoFocus
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20"
            />
            <button
              type="button"
              onClick={startChat}
              className="w-full rounded-lg bg-[#25D366] py-3 text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              Start Chat
            </button>
          </div>
        </div>
      )}

      {/* Floating button — just the brand icon, no wrapper circle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-4 z-[60] drop-shadow-xl transition-transform hover:scale-110 active:scale-95 sm:right-6"
      >
        <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Green background circle */}
          <circle cx="24" cy="24" r="24" fill="#25D366" />
          {/* WhatsApp logo — white */}
          <path
            fill="white"
            d="M24 10.4C16.5 10.4 10.4 16.5 10.4 24c0 2.4.64 4.67 1.76 6.63L10.4 37.6l7.22-1.74A13.48 13.48 0 0 0 24 37.6c7.5 0 13.6-6.1 13.6-13.6S31.5 10.4 24 10.4zm0 24.8a11.14 11.14 0 0 1-5.68-1.56l-.41-.24-4.22 1.1 1.13-4.12-.27-.42A11.18 11.18 0 0 1 12.8 24c0-6.18 5.02-11.2 11.2-11.2S35.2 17.82 35.2 24 30.18 35.2 24 35.2zm6.14-8.38c-.34-.17-2-.98-2.3-1.1-.31-.11-.54-.17-.76.17-.23.34-.87 1.1-1.07 1.32-.2.23-.39.25-.73.08-.34-.17-1.43-.53-2.72-1.68-1.01-.9-1.69-2-1.89-2.34-.2-.34-.02-.52.15-.69.15-.15.34-.39.51-.59.17-.2.23-.34.34-.57.11-.23.06-.42-.03-.59-.08-.17-.76-1.83-1.04-2.51-.27-.66-.55-.57-.76-.58h-.65c-.22 0-.59.08-.9.42-.31.34-1.18 1.15-1.18 2.81s1.21 3.26 1.38 3.49c.17.23 2.38 3.63 5.77 5.09.81.35 1.44.56 1.93.71.81.26 1.55.22 2.13.13.65-.1 2-.82 2.28-1.6.28-.79.28-1.46.2-1.6-.09-.14-.31-.23-.65-.4z"
          />
        </svg>
      </button>
    </>
  );
}
