import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Product } from "../lib/gemini";

export function useProducts(userId: string | undefined) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("products_cache");
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    if (!userId) return;
    if (products.length === 0) setIsLoading(true);
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        currentPrice: Number(p.current_price),
        previousPrice: Number(p.previous_price),
        quantity: Number(p.quantity || 1),
        description: p.description,
        createdAt: p.created_at
      }));
      
      setProducts(mapped);
      localStorage.setItem("products_cache", JSON.stringify(mapped));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [userId]);

  const addProduct = async (payload: any) => {
    const { data, error } = await supabase.from("products").insert([payload]).select();
    if (!error) await fetchProducts();
    return { data, error };
  };

  const updateProduct = async (id: string, payload: any) => {
    const { data, error } = await supabase.from("products").update(payload).eq("id", id).select();
    if (!error) await fetchProducts();
    return { data, error };
  };

  const removeProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter(p => p.id !== id));
    return { error };
  };

  const currentMonthProducts = useMemo(() => {
    const now = new Date();
    return products.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [products]);

  const prevMonthProducts = useMemo(() => {
    const now = new Date();
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return products.filter(p => {
      const d = new Date(p.createdAt);
      return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear();
    });
  }, [products]);

  const totals = useMemo(() => {
    const currentTotal = currentMonthProducts.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
    const prevTotal = prevMonthProducts.reduce((sum, p) => sum + (p.currentPrice * p.quantity), 0);
    const diff = currentTotal - prevTotal;
    
    let percent = 0;
    if (prevTotal > 0) {
      percent = (diff / prevTotal) * 100;
    } else if (currentTotal > 0) {
      percent = 100;
    }

    return { current: currentTotal, prev: prevTotal, diff, percent };
  }, [currentMonthProducts, prevMonthProducts]);

  return {
    products,
    currentMonthProducts,
    isLoading,
    totals,
    fetchProducts,
    addProduct,
    updateProduct,
    removeProduct
  };
}
