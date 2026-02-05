import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHelperContext } from '../context/HelperContext';
import HelperCard from '../components/HelperCard';

export default function HelperGallery() {
  const { helpers } = useHelperContext();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Meet Our Community Helpers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {helpers.map((helper) => (
          <HelperCard key={helper._id} helper={helper} />
        ))}
      </div>
    </div>
  );
}
