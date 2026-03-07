import { useState, useMemo } from "react";
import { 
  Plus, 
  ShieldCheck, 
  HeartPulse, 
  Calculator, 
  Pencil, 
  Check, 
  Trash2, 
  Sparkles,
  X
} from "lucide-react";
import { Deduction } from "@/types";
import { generateId } from "@/lib/idUtils";
import CalculatorModal from "./CalculatorModal";
import { useTranslation } from "./LanguageProvider";

interface DeductionManagerProps {
  deductions: Deduction[];
  onAdd: (deduction: Deduction) => void;
  onUpdate: (updated: Deduction) => void;
  onDelete: (id: string) => void;
}

export default function DeductionManager({ deductions, onAdd, onUpdate, onDelete }: DeductionManagerProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Deduction | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (customName?: string) => {
    const finalName = customName || name.trim();
    if (!finalName || !amount || Number(amount) <= 0) return;
    
    onAdd({
      id: generateId(),
      name: finalName,
      amount: Number(amount),
    });
    
    setName("");
    setAmount("");
    setShowAddForm(false);
  };

  const startEdit = (d: Deduction) => {
    setEditingId(d.id);
    setEditForm({ ...d });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = () => {
    if (editForm && editForm.name.trim() && editForm.amount > 0) {
      onUpdate(editForm);
      cancelEdit();
    }
  };

  const handleCalcConfirm = (val: number) => {
    if (editingId && editForm) {
      setEditForm({ ...editForm, amount: val });
    } else {
      setAmount(val.toString());
    }
    setIsCalcOpen(false);
  };

  const total = useMemo(() => deductions.reduce((sum, d) => sum + d.amount, 0), [deductions]);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-600 rounded-2xl shadow-xl shadow-violet-600/20 text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t('manualDeductions')}</h2>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deductions.length} {t('entries')}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('totalCustom')}</p>
            <p className="text-xl font-black text-violet-600 tabular-nums">฿{total.toLocaleString()}</p>
          </div>
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="p-3 bg-violet-100 text-violet-600 rounded-2xl hover:bg-violet-600 hover:text-white transition-all active:scale-95 shadow-sm"
              title={t('addTransaction')}
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Add Form (Dynamic) */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-violet-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-violet-600 uppercase tracking-wider">{t('addTransaction')}</h3>
            <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-slate-100 rounded-full transition text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('deductionName')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none font-bold"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-4 pr-10 py-3 text-sm focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition outline-none font-bold tabular-nums"
                />
                <button 
                  type="button"
                  onClick={() => setIsCalcOpen(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-600 transition"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => handleAdd()}
                className="px-6 bg-violet-600 hover:bg-black text-white rounded-2xl font-black transition shadow-lg shadow-violet-600/10 active:scale-95 flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-w-0 max-h-[250px] overflow-y-auto">
        <div className="divide-y divide-slate-100">
          {deductions.length === 0 ? (
            <div className="p-10 text-center space-y-2 opacity-50">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('noRecords')}</p>
            </div>
          ) : (
            deductions.map((d) => {
              const isEditing = editingId === d.id;
              
              if (isEditing && editForm) {
                return (
                  <div key={d.id} className="p-4 bg-violet-50/30 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs bg-white outline-none focus:border-violet-500 font-bold"
                      />
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                            className="w-full rounded-xl border border-slate-200 pl-4 pr-10 py-2 text-xs bg-white outline-none focus:border-violet-500 font-bold tabular-nums"
                          />
                          <button 
                            type="button"
                            onClick={() => setIsCalcOpen(true)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-600 transition"
                          >
                            <Calculator className="w-3" />
                          </button>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={saveEdit} className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition shadow-md">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-2 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-xl transition">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={d.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <HeartPulse className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 line-clamp-1">{d.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('manualDeductions')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-violet-600 tabular-nums">฿{d.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => startEdit(d)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(d.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <CalculatorModal 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
        onConfirm={handleCalcConfirm} 
        initialValue={editingId && editForm ? editForm.amount.toString() : amount}
      />
    </div>
  );
}
