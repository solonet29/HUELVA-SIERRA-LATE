import React, { useState, useEffect } from 'react';
import { EventType, EventCategory } from '../types';
import { TOWNS, ICONS } from '../constants';

interface EditEventModalProps {
  event: EventType;
  onClose: () => void;
  onUpdate: (event: EventType) => void;
  onDelete: (eventId: string) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState<EventType>(event);
  const [imagePreview, setImagePreview] = useState<string | null>(event.imageUrl || null);


  useEffect(() => {
    setFormData(event);
    setImagePreview(event.imageUrl || null);
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    const fileInput = document.getElementById('imageUploadEdit') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el evento "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-display text-orange-800 dark:text-amber-300">Editar Evento</h2>
          <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">{ICONS.close}</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Título del Evento</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" required />
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Descripción</label>
              <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" required></textarea>
            </div>

            <div className="flex items-center">
                <input
                    id="sponsoredEdit"
                    name="sponsored"
                    type="checkbox"
                    checked={!!formData.sponsored}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="sponsoredEdit" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Marcar como evento destacado
                </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="town" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Pueblo</label>
                <select name="town" id="town" value={formData.town} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" required>
                  {TOWNS.map(town => <option key={town} value={town}>{town}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Fecha</label>
                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" required />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Categoría</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" required>
                    {Object.values(EventCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                  <label htmlFor="externalUrl" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">URL Externa (Opcional)</label>
                  <input type="url" name="externalUrl" id="externalUrl" value={formData.externalUrl || ''} onChange={handleChange} className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400" placeholder="https://..." />
                   <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Si se rellena, la tarjeta enlazará a esta URL.</p>
                </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Imagen del Evento (Opcional)</label>
              <div className="mt-2 flex items-center gap-4">
                {imagePreview ? (
                    <img src={imagePreview} alt="Previsualización" className="h-20 w-20 rounded-md object-cover" />
                ) : (
                    <div className="h-20 w-20 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <input
                        id="imageUploadEdit"
                        name="imageUploadEdit"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label htmlFor="imageUploadEdit" className="cursor-pointer bg-slate-500 dark:bg-slate-600 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors text-sm">
                        Cambiar Archivo
                    </label>
                    {imagePreview && (
                        <button type="button" onClick={handleRemoveImage} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-semibold text-left">
                            Quitar Imagen
                        </button>
                    )}
                </div>
              </div>
            </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-auto">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            {ICONS.trash}
            Eliminar
          </button>
          <div className="flex gap-4">
             <button type="button" onClick={onClose} className="bg-slate-500 dark:bg-slate-600 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
             <button type="submit" className="bg-amber-400 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors">Guardar Cambios</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEventModal;