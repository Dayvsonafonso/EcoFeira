import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Product } from "../lib/gemini";
import { formatCurrency, calculateVariation } from "../lib/utils";

interface ProductListProps {
  products: Product[];
  categories: string[];
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  isLoadingProducts: boolean;
  handleEditClick: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export function ProductList({
  products,
  categories,
  filterCategory,
  setFilterCategory,
  isLoadingProducts,
  handleEditClick,
  removeProduct,
}: ProductListProps) {
  const filteredProducts = products.filter(p => 
    filterCategory === "Todas" ? true : p.category === filterCategory
  );

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lista de Compras</h2>
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white px-3 py-1.5 text-sm outline-none transition-colors"
        >
          <option value="Todas">Todas</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {isLoadingProducts ? (
          <div className="py-20 text-center text-gray-500 dark:text-gray-400">Carregando itens...</div>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            Sua lista está vazia
          </div>
        ) : (
          Object.entries(groupedProducts).map(([category, items]) => {
            const categoryTotal = items.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
            return (
              <div key={category} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] shadow-sm transition-colors">
                <div className="bg-gray-50/80 dark:bg-[#0F172A]/80 px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between w-full">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">Total do Setor:</span>
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200">{formatCurrency(categoryTotal)}</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {items.map(item => {
                  const unitPrice = item.currentPrice;
                  const totalItem = unitPrice * item.quantity;
                  const { diff, percent } = calculateVariation(item.currentPrice, item.previousPrice);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h4>
                          <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                            x{item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.description || "Sem descrição"}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Unitário</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(unitPrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">Subtotal</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totalItem)}</p>
                        </div>
                        <div className={`text-right min-w-[60px] ${diff > 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                          <p className="text-xs font-bold">{percent.toFixed(1)}%</p>
                          <p className="text-[10px] font-medium">{diff > 0 ? "+" : ""}{formatCurrency(diff)}</p>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-3 ml-1">
                          <button onClick={() => handleEditClick(item)} className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => removeProduct(item.id)} className="text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
