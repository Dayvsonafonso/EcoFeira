import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Product, getSavingInsights, AiInsight } from "../lib/gemini";

interface AiCardProps {
  products: Product[];
}

export function AiCard({ products }: AiCardProps) {
  const [aiInsights, setAiInsights] = useState<AiInsight | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const analyzeWithAi = async () => {
    if (products.length === 0) return;
    setIsLoadingAi(true);
    try {
      const insights = await getSavingInsights(products);
      setAiInsights(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="rounded-2xl bg-blue-600 dark:bg-blue-700 p-6 text-white shadow-lg transition-colors">
      <div className="mb-4 flex items-center justify-between">
        <Sparkles size={24} className="text-blue-200" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">AI Power</span>
      </div>
      <h3 className="mb-2 text-lg font-bold">Análise com IA</h3>
      <p className="mb-6 text-sm text-blue-100 leading-relaxed">
        Descubra como economizar analisando as variações da sua feira.
      </p>
      <button 
        onClick={analyzeWithAi}
        disabled={isLoadingAi || products.length === 0}
        className="w-full rounded-xl bg-white dark:bg-[#0F172A] py-3 font-bold text-blue-600 dark:text-blue-400 hover:scale-[1.02] transition-transform disabled:opacity-50"
      >
        {isLoadingAi ? "Analisando..." : "Gerar Insights"}
      </button>

      {aiInsights && (
        <div className="mt-6 space-y-4 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
          {aiInsights.topIncreases.map((inc, i) => (
            <div key={i} className="bg-white/10 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{inc.name}</span>
                <span className="text-red-300 text-xs font-black">+{inc.percent}%</span>
              </div>
              <p className="text-[11px] text-blue-100 italic">"{inc.suggestion}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
