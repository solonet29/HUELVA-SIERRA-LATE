import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ChangeInstruction } from '../types';

interface ChangeRequestModalProps {
  instruction: ChangeInstruction;
  onClose: () => void;
}

const ChangeRequestModal: React.FC<ChangeRequestModalProps> = ({ instruction, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copiar Instrucción');
  
  const instructionText = JSON.stringify(instruction, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(instructionText).then(() => {
      setCopyButtonText('¡Copiado!');
      setTimeout(() => setCopyButtonText('Copiar Instrucción'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setCopyButtonText('Error al copiar');
    });
  };

  const getTitle = () => {
    switch(instruction.action) {
      case 'CREATE': return 'Evento Creado';
      case 'UPDATE': return 'Evento Actualizado';
      case 'DELETE': return 'Evento Eliminado';
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-display text-orange-800 dark:text-amber-300">{getTitle()} - Listo para Publicar</h2>
          <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">{ICONS.close}</button>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            El cambio se ha aplicado en tu vista previa. Para hacerlo permanente para todos los usuarios, copia la siguiente instrucción y envíasela al desarrollador:
          </p>
          <pre className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-4 rounded-md text-xs overflow-x-auto max-h-60">
            <code>
              {instructionText}
            </code>
          </pre>
        </div>
        <div className="flex justify-between items-center p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
           <p className="text-xs text-slate-500">Este paso es necesario para actualizar la web.</p>
           <div>
            <button type="button" onClick={onClose} className="bg-slate-500 dark:bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 mr-2">
                Cerrar
            </button>
             <button
                type="button"
                onClick={handleCopy}
                className="bg-amber-400 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-amber-500 dark:hover:bg-amber-300 flex items-center gap-2"
              >
                {ICONS.copy}
                {copyButtonText}
            </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestModal;