'use client'

import React, { useState } from 'react';
import { PlusCircle, Edit3, Download, Trash2, Briefcase } from 'lucide-react';

const ResumeList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'base' | 'tailored'>('base');

  const baseResumes = [
    {
      id: 1,
      title: "Software Developer Resume - Entry Level",
      subtitle: "Software Developer",
      template: "Classic Light",
      lastEdited: "2 days ago",
    },
    {
      id: 2,
      title: "Software Developer Resume - Entry Level",
      subtitle: "Software Developer",
      template: "Classic Light",
      lastEdited: "18 days ago",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Resumes</h1>
        
        {/* Resume type cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Base Resume</h3>
            <p className="text-gray-600 mb-6">
              A main resume targeted to a specific role/title and seniority.
              We suggest you create one or two of these at most, one for
              each role you are targeting.
            </p>
            <button className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300 rounded-full bg-blue-50 px-4 py-2">
              <PlusCircle className="mr-2" size={20} />
              Create New
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Tailored Resume</h3>
            <p className="text-gray-600 mb-6">
              A resume targeted to a specific job description and built
              off of a Base Resume.
            </p>
            <button className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition duration-300 rounded-full bg-blue-50 px-4 py-2">
              <PlusCircle className="mr-2" size={20} />
              Create New
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-4 border-b border-gray-200 mb-8">
          <button
            className={`pb-2 text-lg font-medium transition duration-300 ${
              activeTab === 'base'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('base')}
          >
            Base Resumes
          </button>
          <button
            className={`pb-2 text-lg font-medium transition duration-300 ${
              activeTab === 'tailored'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tailored')}
          >
            Job Tailored Resumes
          </button>
        </div>

        {/* Resume list */}
        {activeTab === 'base' && (
          <div className="grid md:grid-cols-2 gap-6">
            {baseResumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg">
                <div className="flex p-8">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center mr-6">
                    <Briefcase className="text-gray-400" size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{resume.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{resume.subtitle}</p>
                    <p className="text-xs text-gray-500 mb-6">Template: {resume.template}</p>
                    <p className="text-xs text-gray-400">Last Edited: {resume.lastEdited}</p>
                  </div>
                </div>
                <div className="bg-gray-50 px-8 py-4 flex justify-between">
                  <button className="text-blue-600 hover:text-blue-800 transition duration-300 flex items-center rounded-full bg-blue-50 px-3 py-1">
                    <Edit3 size={18} className="mr-1" /> Edit
                  </button>
                  <button className="text-green-600 hover:text-green-800 transition duration-300 flex items-center rounded-full bg-green-50 px-3 py-1">
                    <PlusCircle size={18} className="mr-1" /> Tailor
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition duration-300 flex items-center rounded-full bg-gray-100 px-3 py-1">
                    <Download size={18} className="mr-1" /> Download
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition duration-300 flex items-center rounded-full bg-red-50 px-3 py-1">
                    <Trash2 size={18} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'tailored' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No job tailored resumes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeList;

