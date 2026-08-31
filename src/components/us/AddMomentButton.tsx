"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import AddMomentModal from "./AddMomentModal";

export default function AddMomentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-center pt-8 pb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <Plus size={14} className="text-[var(--color-brand)] group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase">Add Moment</span>
        </button>
      </div>

      <AddMomentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
