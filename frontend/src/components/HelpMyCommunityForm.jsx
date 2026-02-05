import React, { useState, useEffect } from 'react';
import FeedbackHeader from './FeedbackHeader';

const helperOptions = [
  { value: '', label: 'Select a helper', icon: '❓' },
  { value: 'doctor', label: 'Doctor', icon: '🩺' },
  { value: 'police', label: 'Police', icon: '👮' },
  { value: 'mail', label: 'Mail Carrier', icon: '📬' },
  { value: 'firefighter', label: 'Firefighter', icon: '🚒' },
  { value: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
  { value: 'librarian', label: 'Librarian', icon: '📚' },
  { value: 'paramedic', label: 'Paramedic', icon: '🚑' },
  { value: 'garbage', label: 'Garbage Collector', icon: '🚛' },
  { value: 'electrician', label: 'Electrician', icon: '💡' },
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
];

const whyOptions = [
  { value: 'sick', label: 'I feel sick', icon: '🤒' },
  { value: 'lostDog', label: 'I found a lost dog', icon: '🐶' },
  { value: 'sendLetter', label: 'I want to send a letter', icon: '✉️' },
  { value: 'fire', label: 'There is a fire', icon: '🔥' },
  { value: 'injury', label: 'Someone is injured', icon: '🩹' },
  { value: 'powerOutage', label: 'Power outage', icon: '💡' },
  { value: 'waterLeak', label: 'Water leak', icon: '💧' },
  { value: 'garbage', label: 'Garbage needs pickup', icon: '🗑️' },
  { value: 'libraryHelp', label: 'Need help finding a book', icon: '📖' },
  { value: 'schoolIssue', label: 'Issue at school', icon: '🏫' },
];

const whereOptions = [
  { value: 'home', label: 'Home' },
  { value: 'school', label: 'School' },
  { value: 'park', label: 'Park' },
  { value: 'library', label: 'Library' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'firestation', label: 'Fire Station' },
  { value: 'policestation', label: 'Police Station' },
  { value: 'postoffice', label: 'Post Office' },
  { value: 'street', label: 'Street' },
  { value: 'playground', label: 'Playground' },
  { value: 'market', label: 'Market' },
];

function HelpMyCommunityForm() {
  const [who, setWho] = useState('');
  const [why, setWhy] = useState('');
  const [where, setWhere] = useState('');
  const [description, setDescription] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // Success message handled below
    }
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleFinalSubmit = () => {
    setSubmitted(true);
    setShowSummary(false);
  };

  const handleReset = () => {
    setWho('');
    setWhy('');
    setWhere('');
    setDescription('');
    setShowSummary(false);
    setSubmitted(false);
  };

  const selectedHelper = helperOptions.find(opt => opt.value === who);
  const selectedWhy = whyOptions.find(opt => opt.value === why);
  const selectedWhere = whereOptions.find(opt => opt.value === where);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <FeedbackHeader />
      <h3 className="text-lg font-semibold mb-2">Help My Community Request</h3>
      {submitted ? (
        <div className="text-green-700 font-semibold text-center">
          <span className="text-3xl block mb-2">✅</span>
          Request submitted!
          <div className="mt-2 text-left">
            <div><b>Helper:</b> {selectedHelper?.icon} {selectedHelper?.label}</div>
            <div><b>Why:</b> {selectedWhy?.icon} {selectedWhy?.label}</div>
            <div><b>Where:</b> {selectedWhere?.label}</div>
            {description && <div><b>Description:</b> {description}</div>}
          </div>
          <button className="mt-4 bg-gray-300 px-4 py-2 rounded" onClick={handleReset}>Make another request</button>
        </div>
      ) : showSummary ? (
        <div className="mb-4 p-4 border rounded bg-blue-50">
          <div className="font-semibold mb-2">Review your request:</div>
          <div><b>Helper:</b> {selectedHelper?.icon} {selectedHelper?.label}</div>
          <div><b>Why:</b> {selectedWhy?.icon} {selectedWhy?.label}</div>
          <div><b>Where:</b> {selectedWhere?.label}</div>
          {description && <div><b>Description:</b> {description}</div>}
          <div className="flex gap-2 mt-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleFinalSubmit}>Confirm & Submit</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowSummary(false)}>Edit</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Who do I need?</label>
            <div className="flex items-center gap-2 mb-2">
              {selectedHelper && selectedHelper.value && (
                <span className="text-3xl">{selectedHelper.icon}</span>
              )}
              <select
                className="w-full border px-3 py-2 rounded"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                required
              >
                {helperOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Why?</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              {whyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Where are they?</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              required
            >
              <option value="">Select a place</option>
              {whereOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Describe your situation <span className="text-gray-400 text-xs">(optional)</span></label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Preview Request
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default HelpMyCommunityForm;
