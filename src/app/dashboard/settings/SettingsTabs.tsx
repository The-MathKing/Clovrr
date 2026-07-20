'use client';

import React, { useState } from 'react';
import PersonaForm from './PersonaForm';
import ChatTester from './ChatTester';
import IntegrationsHub from './IntegrationsHub';

export default function SettingsTabs({ client, userEmail, isFree }: { client: any, userEmail: string, isFree?: boolean }) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General & Profile', icon: '👤' },
    { id: 'persona', label: 'AI Persona', icon: '🧠' },
    { id: 'messaging', label: 'Messaging Channels', icon: '💬' },
    { id: 'voice', label: 'Voice AI', icon: '🎙️' },
    { id: 'crms', label: 'CRM Syncing', icon: '🏢' },
    { id: 'widget', label: 'Web Widget', icon: '🌐' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
              activeTab === tab.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {isFree && activeTab !== 'general' ? (
          <div className="animate-in fade-in flex flex-col items-center justify-center text-center py-20">
            <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <h2 className="text-xl font-bold text-white mb-2">Unlock Settings</h2>
            <p className="text-gray-400 max-w-md mb-6">Upgrade your account to configure AI personas, messaging channels, and CRM integrations.</p>
            <a href="/pricing" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">View Plans</a>
          </div>
        ) : (
          <>
            {activeTab === 'general' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Agency Profile</h2>
                <form className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue={client?.name || ''} 
                      readOnly
                      className="w-full px-4 py-3 bg-black border border-white/5 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none transition-colors" 
                    />
                    <p className="mt-1 text-xs text-gray-500">Managed by Clovrr admin.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                    <input 
                      type="email" 
                      defaultValue={client?.email || userEmail || ''} 
                      readOnly
                      className="w-full px-4 py-3 bg-black border border-white/5 rounded-lg text-white opacity-70 cursor-not-allowed focus:outline-none transition-colors" 
                    />
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'persona' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-12">
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Bot Configuration</h2>
                  <PersonaForm client={client} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Test Your AI</h2>
                  <ChatTester initialMessage={client?.initial_message} />
                </div>
              </div>
            )}

            {activeTab === 'messaging' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Messaging Channels</h2>
                 <IntegrationsHub client={client} filter="messaging" />
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Inbound Voice AI</h2>
                 <IntegrationsHub client={client} filter="voice" />
              </div>
            )}

            {activeTab === 'crms' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">CRM Syncing</h2>
                 <IntegrationsHub client={client} filter="crms" />
              </div>
            )}

            {activeTab === 'widget' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                 <h2 className="text-xl font-semibold mb-6 text-white border-b border-white/5 pb-4">Live Chat Widget</h2>
                 <IntegrationsHub client={client} filter="widget" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
