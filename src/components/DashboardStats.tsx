import React from "react";
import { formatCurrency } from "../lib/utils";
import { TrendingUp, TrendingDown, Wallet, Calendar, Scale, Percent } from "lucide-react";
import { motion } from "motion/react";

interface DashboardStatsProps {
  totals: {
    current: number;
    prev: number;
    diff: number;
    percent: number;
  };
}

export function DashboardStats({ totals }: DashboardStatsProps) {
  const isNegative = totals.diff <= 0;

  const stats = [
    {
      label: "Total Atual",
      value: formatCurrency(totals.current),
      icon: Wallet,
      color: "blue",
      trend: null
    },
    {
      label: "Mês Anterior",
      value: formatCurrency(totals.prev),
      icon: Calendar,
      color: "slate",
      trend: null
    },
    {
      label: "Variação Real",
      value: `${totals.diff > 0 ? "+" : ""}${formatCurrency(totals.diff)}`,
      icon: Scale,
      color: isNegative ? "emerald" : "red",
      trend: isNegative ? "down" : "up"
    },
    {
      label: "Variação %",
      value: `${totals.percent.toFixed(1)}%`,
      icon: Percent,
      color: isNegative ? "emerald" : "red",
      trend: isNegative ? "down" : "up"
    }
  ];

  return (
    <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass dark:glass rounded-3xl p-6 border border-border shadow-sm group hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={22} strokeWidth={2.5} />
            </div>
            {stat.trend && (
              <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-tighter ${isNegative ? "text-emerald-500" : "text-red-500"}`}>
                {stat.trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend === "up" ? "Alta" : "Baixa"}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.1em] text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black tracking-tight ${
              stat.label.includes("Variação") 
                ? (isNegative ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")
                : "text-foreground"
            }`}>
              {stat.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
