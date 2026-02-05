import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHelperContext } from '../context/HelperContext';

export default function HelperRolePage() {
  const { id } = useParams();
  const { helpers } = useHelperContext();
  const helper = helpers.find((h) => h._id === id);
  const navigate = useNavigate();

  if (!helper) return <div className="p-6 text-center">Helper not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-pastel1 rounded-xl shadow-lg mt-8">
      <button onClick={() => navigate(-1)} className="mb-4 bg-pastel2 px-4 py-2 rounded-full shadow hover:bg-gold">Back</button>
      <img src={helper.image} alt={helper.name} className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-pastel2 mb-4" />
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-2">{helper.name}</h2>
      {/* YouTube Video */}
      <div className="mb-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <svg height="24" width="24" viewBox="0 0 24 24" fill="#FF0000" className="mr-2"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span className="font-semibold text-lg">Watch Video</span>
        </div>
        {/* Show only the current helper's video link below the symbol */}
        {helper.video && (
          <div className="flex flex-col items-center mt-2">
            <a
              href={helper.video}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {helper.video}
            </a>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Tools</h3>
        <ul className="flex justify-center gap-4">
          {helper.tools.map((tool, idx) => (
            <li key={idx} className="bg-pastel2 rounded-xl px-4 py-2 shadow text-lg">{tool}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <h3 className="text-xl font-semibold mb-2">What I Do</h3>
        <p className="bg-pastel2 rounded-xl px-4 py-2 shadow text-lg">{helper.description}</p>
      </div>
    </div>
  );
}
