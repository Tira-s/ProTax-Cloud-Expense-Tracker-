"use client";

import { useState, useEffect } from "react";
import { X, Delete, Command, Equal } from "lucide-react";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue?: string;
}

export default function CalculatorModal({ isOpen, onClose, onConfirm, initialValue = "" }: CalculatorModalProps) {
  const [display, setDisplay] = useState(initialValue || "0");
  const [equation, setEquation] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDisplay(initialValue || "0");
      setEquation("");
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleNumber = (n: string) => {
    setDisplay(prev => (prev === "0" ? n : prev + n));
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const calculate = () => {
    try {
      // Basic math evaluation (safe because we control input)
      const sanitizedEquation = (equation + display).replace(/[^-+*/.0-9]/g, '');
      const result = eval(sanitizedEquation);
      const finalVal = Number(result.toFixed(2)).toString();
      setDisplay(finalVal);
      setEquation("");
    } catch {
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };

  const backspace = () => {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 w-full max-w-[320px] p-6 space-y-4 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Command className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Logic Calc</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-slate-50 rounded-3xl p-6 text-right min-h-[120px] flex flex-col justify-end border border-slate-100">
          <div className="text-slate-400 text-xs font-medium h-5 mb-1 overflow-hidden">{equation}</div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter truncate tabular-nums">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3 font-bold text-lg">
          <CalcBtn label="C" onClick={clear} variant="secondary" />
          <CalcBtn label="÷" onClick={() => handleOperator("/")} variant="operator" />
          <CalcBtn label="×" onClick={() => handleOperator("*")} variant="operator" />
          <CalcBtn label="⌫" onClick={backspace} variant="secondary" icon={<Delete className="w-5 h-5" />} />

          {[7, 8, 9].map(n => <CalcBtn key={n} label={n.toString()} onClick={() => handleNumber(n.toString())} />)}
          <CalcBtn label="-" onClick={() => handleOperator("-")} variant="operator" />

          {[4, 5, 6].map(n => <CalcBtn key={n} label={n.toString()} onClick={() => handleNumber(n.toString())} />)}
          <CalcBtn label="+" onClick={() => handleOperator("+")} variant="operator" />

          {[1, 2, 3].map(n => <CalcBtn key={n} label={n.toString()} onClick={() => handleNumber(n.toString())} />)}
          <CalcBtn label="=" rowSpan={2} onClick={calculate} variant="equal" icon={<Equal className="w-6 h-6" />} />

          <CalcBtn label="0" colSpan={2} onClick={() => handleNumber("0")} />
          <CalcBtn label="." onClick={() => handleNumber(".")} />
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => onConfirm(Number(display))}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-3xl transition-all shadow-xl shadow-slate-900/20 active:scale-95 mt-2"
        >
          Use Value
        </button>
      </div>
    </div>
  );
}

function CalcBtn({ label, onClick, variant = "default", colSpan = 1, rowSpan = 1, icon }: any) {
  const styles = {
    default: "bg-white text-slate-900 border-slate-100 hover:bg-slate-50 active:bg-slate-100",
    secondary: "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200 active:bg-slate-300",
    operator: "bg-indigo-50 text-indigo-600 border-transparent hover:bg-indigo-100 active:bg-indigo-200",
    equal: "bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
  };

  return (
    <button
      onClick={onClick}
      style={{ gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined, gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined }}
      className={`h-14 rounded-2xl border flex items-center justify-center transition-all ${styles[variant as keyof typeof styles]}`}
    >
      {icon ? icon : label}
    </button>
  );
}
