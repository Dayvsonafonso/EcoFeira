import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface ProductModalProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[];
  formatInputCurrency: (val: string) => string;
}

export function ProductModal({
  showForm,
  setShowForm,
  editingId,
  formData,
  setFormData,
  handleAddProduct,
  handleNameChange,
  categories,
  formatInputCurrency
}: ProductModalProps) {
  return (
    <AnimatePresence>
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setShowForm(false)} 
            className="absolute inset-0" 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }} 
            className="relative w-full max-w-lg bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? "Editar Item" : "Novo Item"}</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Nome</label>
                <input required value={formData.name} onChange={handleNameChange} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Preço Unitário Atual</label>
                  <input required value={formData.currentPrice} onChange={e => setFormData({ ...formData, currentPrice: formatInputCurrency(e.target.value) })} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Preço Unitário Anterior</label>
                  <input value={formData.previousPrice} onChange={e => setFormData({ ...formData, previousPrice: formatInputCurrency(e.target.value) })} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Quantidade</label>
                  <input type="number" min="1" step="any" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-1">Observações (opcional)</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-colors" placeholder="Ex: Estava mais caro no varejão" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-3 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100/20 dark:shadow-blue-900/20 transition-colors">
                  {editingId ? "Salvar Alterações" : "Salvar Item"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
