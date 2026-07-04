'use client';

import React, { useState } from 'react';

export default function PersonaForm({ client }: { client: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    calendly_link: client?.calendly_link || '',
    system_prompt: client?.system_prompt || 'You are a helpful and professional AI receptionist for a small business. Your goal is to answer basic questions and encourage the user to book an appointment using the provided Calendly link.',
    initial_message: client?.initial_message || 'Hi there! We noticed you were interested in our services. Are you still looking to book a demo?'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Configuration saved successfully!');
      } else {
        alert('Failed to save configuration.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving configuration.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">System Prompt (AI Personality)</label>
        <textarea 
          rows={5}
          value={formData.system_prompt} 
          onChange={e => setFormData({...formData, system_prompt: e.target.value})}
          className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
          placeholder="You are Sarah, a helpful assistant for Bob's Plumbing..."
        />
        <p className="mt-1 text-xs text-gray-500">Instruct the AI on how to behave, what tone to use, and what information to collect.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Initial Outbound Message</label>
        <textarea 
          rows={2}
          value={formData.initial_message} 
          onChange={e => setFormData({...formData, initial_message: e.target.value})}
          className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
          placeholder="Hi [Name], this is Bob's Plumbing. Are you still looking for help?"
        />
        <p className="mt-1 text-xs text-gray-500">This is the very first text message sent to the lead to initiate the conversation.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Calendly Link</label>
        <input 
          type="url" 
          value={formData.calendly_link} 
          onChange={e => setFormData({...formData, calendly_link: e.target.value})}
          className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" 
          placeholder="https://calendly.com/your-name/demo"
        />
        <p className="mt-1 text-xs text-gray-500">The AI will provide this exact link when it qualifies a lead and tries to book a meeting.</p>
      </div>
      
      <div className="pt-4">
        <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
