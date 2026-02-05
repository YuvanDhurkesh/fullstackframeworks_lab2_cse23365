import React from 'react';
import { Link } from 'react-router-dom';

export default function HelperCard({ helper }) {
  const handleSpeak = (e) => {
    e.preventDefault();
    if ('speechSynthesis' in window) {
      const utterName = new window.SpeechSynthesisUtterance(helper.name);
      const utterDesc = new window.SpeechSynthesisUtterance(helper.description);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterName);
      utterName.onend = () => {
        window.speechSynthesis.speak(utterDesc);
        // Navigate after description is spoken
        utterDesc.onend = () => {
          window.location.href = `/helper/${helper._id}`;
        };
      };
      // Fallback: if speech fails, navigate after 2 seconds
      setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          window.location.href = `/helper/${helper._id}`;
        }
      }, 2000);
    } else {
      window.location.href = `/helper/${helper._id}`;
    }
  };

  return (
    <a
      href={`/helper/${helper._id}`}
      onClick={handleSpeak}
      className="block bg-pastel2 rounded-xl shadow-lg p-4 m-2 text-center hover:bg-gold focus:outline-none focus:ring-2 focus:ring-gold transition"
      tabIndex={0}
      aria-label={helper.name}
    >
      <img src={helper.image} alt={helper.name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border-4 border-pastel1" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">{helper.name}</h2>
    </a>
  );
}
