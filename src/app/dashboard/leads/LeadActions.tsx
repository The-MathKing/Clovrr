"use client";
import React, { useState, useRef } from 'react';
import Papa from 'papaparse';

export default function LeadActions() {
  const [uploading, setUploading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/leads/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leads: results.data })
          });
          const data = await res.json();
          if (res.ok) {
            alert(`Successfully imported ${data.count} leads!`);
            window.location.reload();
          } else {
            alert(`Upload failed: ${data.error}`);
          }
        } catch {
          alert('Error uploading file');
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const handleTriggerCampaign = async () => {
    if (!confirm('WARNING: This will generate a unique AI message for EVERY uncontacted lead and blast them via Twilio SMS. Are you sure you want to proceed?')) return;
    
    setTriggering(true);
    try {
      const res = await fetch('/api/campaign/trigger', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully generated and blasted messages to ${data.count} leads!`);
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch {
      alert('Failed to trigger campaign');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <input 
        type="file" 
        accept=".csv" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        {uploading ? 'Parsing CSV...' : 'Import CSV'}
      </button>

      <button 
        onClick={handleTriggerCampaign}
        disabled={triggering}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/50 disabled:opacity-50 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        {triggering ? 'AI Generating & Blasting...' : 'Reactivate Campaign (AI Blast)'}
      </button>
    </div>
  );
}
