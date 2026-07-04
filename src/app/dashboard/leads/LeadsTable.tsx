'use client';
import React, { useState, useEffect } from 'react';

export default function LeadsTable({ leads }: { leads: Record<string, unknown>[] }) {
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-900/30 text-blue-400 border-blue-800';
      case 'qualified': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
      case 'booked': return 'bg-purple-900/30 text-purple-400 border-purple-800';
      case 'disqualified': return 'bg-red-900/30 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const getChannelIcon = (channel: string) => {
    if (channel === 'sms') return '📱';
    if (channel === 'email') return '✉️';
    if (channel === 'instagram') return '📸';
    return '💬';
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedLead) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedLead]);

  return (
    <>
      <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm cursor-default">
            <thead className="bg-black border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-400">Lead</th>
                <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 font-medium text-gray-400">Date Added</th>
                <th className="px-6 py-4 font-medium text-gray-400 text-right">Messages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No leads found. Import a CSV or wait for inbound messages.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">{lead.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {getChannelIcon(lead.channel)} {lead.contact_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400 text-xs">
                      <div className="flex items-center justify-end gap-2">
                        {lead.conversations?.length || 0} msgs
                        <svg className="w-4 h-4 text-gray-600 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0a0a0a] border-l border-white/5 h-full shadow-2xl flex flex-col relative transform transition-transform duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {selectedLead.name || 'Unknown Lead'}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </h2>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {getChannelIcon(selectedLead.channel)} {selectedLead.contact_id}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Conversation Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#000000]">
              {(!selectedLead.conversations || selectedLead.conversations.length === 0) ? (
                <div className="text-center text-gray-500 text-sm py-12">
                  No conversation history found.
                </div>
              ) : (
                [...selectedLead.conversations]
                  .sort((a: Record<string, unknown>, b: Record<string, unknown>) => new Date(String(a.created_at)).getTime() - new Date(String(b.created_at)).getTime())
                  .map((msg: Record<string, unknown>, idx: number) => {
                    const isAI = msg.role === 'assistant' || msg.role === 'system';
                    return (
                      <div key={idx} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm relative ${
                          isAI 
                            ? 'bg-[#111] border border-emerald-500/20 text-gray-300 rounded-tl-sm' 
                            : 'bg-emerald-600 text-white rounded-tr-sm shadow-lg shadow-emerald-900/20'
                        }`}>
                          {isAI && (
                            <div className="absolute -left-2 -top-2 bg-black border border-emerald-500/30 rounded-full p-1 text-[10px]">
                              🤖
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-[10px] mt-2 ${isAI ? 'text-gray-500 text-left' : 'text-emerald-200/70 text-right'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>

            {/* Input Placeholder (Read Only for now) */}
            <div className="p-4 border-t border-white/5 bg-black/50 backdrop-blur-md">
              <div className="bg-[#111] border border-white/10 rounded-full px-4 py-3 flex items-center gap-3">
                 <input type="text" readOnly placeholder="AI is handling this conversation..." className="bg-transparent flex-1 text-sm text-gray-500 focus:outline-none cursor-not-allowed" />
                 <button disabled className="text-emerald-500/50 cursor-not-allowed">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                 </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
