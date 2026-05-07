import React from "react";
import { formatCurrency } from "../lib/utils";

interface DashboardStatsProps {
  totals: {
    current: number;
    prev: number;
    diff: number;
    percent: number;
  };
}

export function DashboardStats({ totals }: DashboardStatsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm transition-colors">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Atual</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totals.current)}</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm transition-colors">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mês Anterior</p>
        <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">{formatCurrency(totals.prev)}</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm transition-colors">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Variação Real</p>
        <p className={`text-2xl font-bold ${totals.diff > 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
          {totals.diff > 0 ? "+" : ""}{formatCurrency(totals.diff)}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] p-6 shadow-sm transition-colors">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Variação %</p>
        <p className={`text-2xl font-bold ${totals.percent > 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
          {totals.percent.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
