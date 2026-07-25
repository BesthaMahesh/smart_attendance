import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Download, Search, ChevronRight } from 'lucide-react';

export default function StudentMaterials({ isDarkMode }) {
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const folders = ['All', 'Artificial Intelligence', 'Database Systems', 'Software Engineering'];

  const documents = [
    { id: 1, name: 'AI_Unit_1_State_Space_Search.pdf', folder: 'Artificial Intelligence', size: '2.5 MB', type: 'Lecture Notes', date: 'June 01, 2026' },
    { id: 2, name: 'AI_Unit_2_Neural_Networks.pdf', folder: 'Artificial Intelligence', size: '4.1 MB', type: 'Lecture Notes', date: 'June 10, 2026' },
    { id: 3, name: 'DBMS_Normalization_Exercises.docx', folder: 'Database Systems', size: '780 KB', type: 'Worksheet', date: 'June 08, 2026' },
    { id: 4, name: 'DBMS_Transaction_Management.pdf', folder: 'Database Systems', size: '1.9 MB', type: 'Lecture Notes', date: 'June 14, 2026' },
    { id: 5, name: 'SRS_IEEE_Template.pdf', folder: 'Software Engineering', size: '1.2 MB', type: 'Template', date: 'May 28, 2026' },
    { id: 6, name: 'Agile_Scrum_Methodology_Slides.pptx', folder: 'Software Engineering', size: '8.4 MB', type: 'Lecture Slides', date: 'June 05, 2026' }
  ];

  const handleDownload = (name) => {
    alert(`Starting download: ${name}`);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesFolder = selectedFolder === 'All' || doc.folder === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Study Materials</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Browse folder trees and download lecture slides, worksheets, and blueprints.</p>
        </div>

        {/* Search bar */}
        <div className={`flex items-center px-3 py-2 border rounded-xl w-full sm:w-64 ${
          isDarkMode ? 'bg-slateCustom-950/30 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <Search className="w-4 h-4 text-slateCustom-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Row: Folder selectors & Document list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Folders */}
        <div className="lg:col-span-3 space-y-2">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                selectedFolder === folder
                  ? 'bg-primary border-primary text-white shadow'
                  : isDarkMode
                    ? 'border-slateCustom-800 hover:bg-slateCustom-800/40 text-slateCustom-400'
                    : 'border-slateCustom-150 hover:bg-slateCustom-50 text-slateCustom-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Folder className="w-4 h-4" />
                <span className="truncate">{folder}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Right Column: Files List */}
        <div className={`lg:col-span-9 border rounded-3xl p-6 shadow-sm ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            Documents in {selectedFolder}
          </h3>

          <div className="space-y-3">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border flex justify-between items-center text-xs transition-all ${
                  isDarkMode 
                    ? 'border-slateCustom-850/60 bg-slateCustom-950/10 hover:bg-slateCustom-850/40' 
                    : 'border-slateCustom-100 bg-white hover:bg-slateCustom-50/60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'}`}>{doc.name}</h4>
                    <div className="flex items-center space-x-3 text-[10px] text-slateCustom-400 mt-1">
                      <span className="font-bold text-primary">{doc.type}</span>
                      <span>{doc.size}</span>
                      <span>Uploaded: {doc.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc.name)}
                  className={`p-2 rounded-lg border hover:bg-primary hover:text-white transition-all text-slateCustom-500 hover:border-primary ${
                    isDarkMode ? 'border-slateCustom-850 bg-slateCustom-900/50' : 'border-slateCustom-200 bg-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-12 text-slateCustom-500">
                No matching academic materials found in this folder.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
