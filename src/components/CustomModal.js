import { html } from 'htm/preact';

export function CustomModal({ title, content, type, onConfirm, onCancel, show }) {
  if (!show) return null;

  return html`
    <div class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl border border-cyan-500/50">
        <h3 class="text-xl font-bold text-cyan-200 mb-4">${title}</h3>
        <p class="text-gray-300 mb-6">${content}</p>
        <div class="flex justify-end gap-3">
          ${type === 'confirm' && html`
            <button onClick=${onCancel}
                    class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
              Abbrechen
            </button>
          `}
          <button onClick=${onConfirm}
                  class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition duration-150">
            ${type === 'confirm' ? 'Bestätigen' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  `;
}