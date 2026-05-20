import React, { useState } from "react";
import { Pencil, Trash2, Tag, Box, ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import { Product } from "../lib/gemini";
import { formatCurrency, calculateVariation, cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

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

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isCategoryExpanded = (category: string) => {
    if (filterCategory !== "Todas") return true;
    return !!expandedCategories[category];
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
             <Box className="text-brand-primary" size={24} />
             Sua Lista
           </h2>
           <p className="text-slate-400 text-sm font-medium">Itens cadastrados no mês atual.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-border">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3 mr-2 hidden lg:inline">Filtro:</span>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white dark:bg-slate-800 text-foreground font-bold px-4 py-2 rounded-xl text-xs outline-none shadow-sm transition-all border-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="Todas">Todas as Categorias</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-8">
        {isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
             <div className="h-10 w-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
             <p className="font-black text-xs uppercase tracking-widest">Sincronizando dados...</p>
          </div>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center gap-4 group"
          >
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Tag className="text-slate-300" size={32} />
            </div>
            <div>
               <p className="text-slate-400 font-bold text-lg italic">"Tudo começa com o primeiro item."</p>
               <p className="text-slate-300 text-xs font-black uppercase tracking-widest mt-1">Adicione um produto para começar</p>
            </div>
          </motion.div>
        ) : (
          Object.entries(groupedProducts).map(([category, items], catIdx) => {
            const categoryTotal = items.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
            const isExpanded = isCategoryExpanded(category);
            return (
              <motion.div 
                key={category} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="glass dark:glass rounded-[2rem] overflow-hidden border border-border shadow-sm transition-all"
              >
                <div 
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "bg-slate-50/50 dark:bg-slate-900/50 px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors",
                    isExpanded && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-primary/10 text-brand-primary p-2 rounded-xl">
                       <Tag size={18} />
                    </span>
                    <span className="font-black text-foreground tracking-tight">{category}</span>
                    <span className="bg-slate-200 dark:bg-slate-800 text-[10px] font-black px-2 py-0.5 rounded-full text-slate-500">
                      {items.length} {items.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 ml-auto sm:ml-0">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total do Setor</span>
                      <span className="text-xl font-black text-brand-primary">{formatCurrency(categoryTotal)}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-400"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden divide-y divide-border/50"
                    >
                      <AnimatePresence mode="popLayout">
                        {items.map(item => {
                          const { diff, percent } = calculateVariation(item.currentPrice, item.previousPrice);
                          const isUp = diff > 0;
                          return (
                            <motion.div 
                              key={item.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="flex items-center justify-between p-6 lg:p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                            >
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-lg text-foreground truncate">{item.name}</h4>
                                  <span className="shrink-0 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                                    x{item.quantity}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 truncate max-w-[200px] font-medium">
                                  {item.description || "Sem observações adicionais"}
                                </p>
                              </div>

                              <div className="flex items-center gap-6 lg:gap-12 shrink-0">
                                <div className="text-right hidden md:block">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Unitário</p>
                                  <p className="text-sm text-slate-500 font-bold">{formatCurrency(item.currentPrice)}</p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Subtotal</p>
                                  <p className="text-lg font-black text-foreground">{formatCurrency(item.currentPrice * item.quantity)}</p>
                                </div>

                                <div className={`text-right min-w-[80px] hidden sm:block ${isUp ? "text-red-500" : "text-emerald-500"}`}>
                                   <div className="flex items-center justify-end gap-1 font-black">
                                     {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                     <span className="text-sm">{percent.toFixed(1)}%</span>
                                   </div>
                                   <p className="text-[10px] font-bold opacity-70">
                                     {isUp ? "+" : ""}{formatCurrency(diff)}
                                   </p>
                                </div>

                                <div className="flex items-center gap-1 lg:gap-2 ml-2">
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditClick(item);
                                    }} 
                                    className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                                  >
                                    <Pencil size={18} />
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeProduct(item.id);
                                    }} 
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                  >
                                    <Trash2 size={18} />
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
