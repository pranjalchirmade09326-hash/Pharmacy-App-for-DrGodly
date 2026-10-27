"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Pill, ShieldCheck } from "lucide-react";
import { MOCK_PRODUCTS, CatalogProduct } from "@/data/products.mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { addToCart, getCartItems } from "@/lib/cartStore";

const CATEGORIES = [
  { label: "All Categories", value: "ALL" },
  { label: "Digestive Care", value: "digestive" },
  { label: "Respiratory & Cough", value: "respiratory" },
  { label: "Pain & Fever", value: "pain_fever" },
  { label: "Vitamins & Supplements", value: "supplements" },
  { label: "First Aid & Antiseptic", value: "first_aid" },
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prod.brandName.toLowerCase().includes(q) ||
        prod.genericComposition.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "ALL" || prod.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (prod: CatalogProduct) => {
    addToCart({
      id: prod.id,
      brandName: prod.brandName,
      genericComposition: prod.genericComposition,
      unitPriceINR: prod.sellingPriceINR,
      prescriptionRequired: prod.prescriptionRequired,
      cdscoCategory: prod.cdscoCategory,
      packSize: prod.packSize,
      imageUrl: prod.imageUrl,
    });
    setAddedItemName(prod.brandName);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">CDSCO OTC Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            CDSCO-Compliant OTC Medications & Health Supplements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Explore safe oral rehydration salts, antacids, throat lozenges, and first aid products. Prescriptions strictly gated per CDSCO 2026 regulations.
          </p>
        </div>

        {/* Added Notification Toast */}
        {addedItemName && (
          <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
            <span>✓ Added &ldquo;{addedItemName}&rdquo; to your pharmacy cart!</span>
            <Link href="/checkout" className="underline hover:text-emerald-950 font-black">
              View Cart &rarr;
            </Link>
          </div>
        )}

        {/* Category Filter Pills & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ORS, antacids, lozenges, paracetamol, vitamins..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge
                    variant={
                      prod.prescriptionRequired
                        ? "purple"
                        : prod.cdscoCategory === "AYUSH"
                        ? "yellow"
                        : "green"
                    }
                    size="sm"
                  >
                    {prod.prescriptionRequired
                      ? "Rx • Schedule H"
                      : prod.cdscoCategory === "AYUSH"
                      ? "Ayurvedic / OTC"
                      : "CDSCO OTC Safe"}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {prod.packSize}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.brandName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {prod.brandName}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {prod.genericComposition}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-lg text-[10px] text-slate-600 space-y-1">
                  <p><strong className="text-slate-700">Direction:</strong> {prod.dosageInstructions}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-slate-900">
                    {formatINR(prod.sellingPriceINR)}
                  </span>
                  {prod.mrpINR > prod.sellingPriceINR && (
                    <span className="text-[11px] text-slate-400 line-through ml-1.5">
                      {formatINR(prod.mrpINR)}
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => handleAddToCart(prod)}
                  variant="primary"
                  size="sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
