import React, { useState } from 'react';

interface FigmaImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string, token: string) => void;
}

const FigmaImportModal: React.FC<FigmaImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && token) {
      onImport(url, token);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl border border-slate-700 p-8 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Import from Figma</h2>
        <p className="text-slate-400 text-sm mb-6">
          Paste your Figma file URL and a personal access token to import your design.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="figma-url" className="block text-sm font-medium text-slate-300 mb-1">
              Figma File URL
            </label>
            <input
              type="text"
              id="figma-url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.figma.com/file/..."
              className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label htmlFor="figma-token" className="block text-sm font-medium text-slate-300 mb-1">
              Personal Access Token
            </label>
            <input
              type="password"
              id="figma-token"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="figd_..."
              className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
            <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline mt-1 block">
              How to get a token?
            </a>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-600 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url || !token}
              className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 text-sm disabled:bg-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FigmaImportModal;