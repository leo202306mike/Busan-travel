
import React, { useState, useMemo } from 'react';
import { Expense, Participant } from '../types';
import { KRW_TO_TWD_RATE } from '../constants';

interface ExpenseViewProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  participants: Participant[];
}

const ExpenseView: React.FC<ExpenseViewProps> = ({ expenses, setExpenses, participants }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'KRW' | 'TWD'>('KRW');
  const [paidBy, setPaidBy] = useState(participants[0]?.id);

  const totalKRW = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      return acc + (exp.currency === 'KRW' ? exp.amount : exp.amount / KRW_TO_TWD_RATE);
    }, 0);
  }, [expenses]);

  const totalTWD = totalKRW * KRW_TO_TWD_RATE;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: desc,
      amount: parseFloat(amount),
      currency,
      paidById: paidBy,
      participantIds: participants.map(p => p.id),
      date: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    setDesc('');
    setAmount('');
  };

  const balances = useMemo(() => {
    const net: Record<string, number> = {};
    participants.forEach(p => net[p.id] = 0);

    expenses.forEach(exp => {
      const amountInTWD = exp.currency === 'TWD' ? exp.amount : exp.amount * KRW_TO_TWD_RATE;
      const share = amountInTWD / exp.participantIds.length;
      
      net[exp.paidById] += amountInTWD;
      exp.participantIds.forEach(pid => {
        net[pid] -= share;
      });
    });

    return net;
  }, [expenses, participants]);

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* 總結卡片 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">旅行總支出</p>
            <h2 className="text-3xl font-bold mt-1">₩ {totalKRW.toLocaleString()}</h2>
            <p className="text-blue-200 text-sm mt-1">≈ NT$ {totalTWD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <i className="fas fa-calculator text-2xl"></i>
          </div>
        </div>
      </div>

      {/* 新增支出表單 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">新增支出</h3>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <input 
            type="text" 
            placeholder="項目名稱 (例如：海鮮晚餐)" 
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input 
                type="number" 
                placeholder="金額" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <select 
              value={currency}
              onChange={e => setCurrency(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
            >
              <option value="KRW">₩ 韓元</option>
              <option value="TWD">$ 台幣</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">付款人：</span>
            <select 
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            加入帳單
          </button>
        </form>
      </div>

      {/* 結算資訊 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">結算資訊 (誰該給誰錢)</h3>
        <div className="space-y-3">
          {participants.map(p => {
            const bal = balances[p.id];
            return (
              <div key={p.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm border border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{p.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">應收款/應付款</p>
                  </div>
                </div>
                <div className={`text-right font-bold ${bal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {bal >= 0 ? '收回' : '支出'} NT$ {Math.abs(bal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 歷史紀錄 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">支出明細</h3>
        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className="text-gray-400 text-center py-4 text-sm">尚無支出紀錄</p>
          ) : expenses.map(exp => (
            <div key={exp.id} className="bg-white/50 border border-gray-100 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">{exp.description}</p>
                <p className="text-[10px] text-gray-400">{new Date(exp.date).toLocaleDateString('zh-TW')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">
                  {exp.currency === 'KRW' ? '₩' : '$'} {exp.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400">由 {participants.find(p => p.id === exp.paidById)?.name} 付款</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseView;
