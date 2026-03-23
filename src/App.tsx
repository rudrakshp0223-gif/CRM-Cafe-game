/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Receipt, TrendingUp, User, Award, ChevronRight, RefreshCw } from 'lucide-react';
import { Quadrant, GameState, Customer, MenuItem } from './types';
import { MENU, QUADRANT_INFO } from './constants';
import { generateCustomer } from './utils';

const INITIAL_STATE: GameState = {
  round: 0,
  totalRevenue: 0,
  crmScore: 0,
  accuracy: 0,
  loyaltyPointsSold: 0,
  phase: 'START',
  currentCustomer: null,
  lastGuessCorrect: null,
  roundRevenue: 0,
  history: [],
};

export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const startRound = () => {
    const nextRound = state.round + 1;
    if (nextRound > 5) {
      setState(prev => ({ ...prev, phase: 'SUMMARY' }));
      return;
    }
    const customer = generateCustomer(nextRound);
    setState(prev => ({
      ...prev,
      round: nextRound,
      currentCustomer: customer,
      phase: 'ENCOUNTER',
      lastGuessCorrect: null,
      roundRevenue: 0,
    }));
  };

  const proceedToTransaction = () => {
    setState(prev => ({ ...prev, phase: 'TRANSACTION' }));
  };

  const proceedToGuessing = () => {
    setState(prev => ({ ...prev, phase: 'GUESSING' }));
  };

  const handleGuess = (guess: Quadrant) => {
    const isCorrect = guess === state.currentCustomer?.quadrant;
    const subtotal = state.currentCustomer?.order.reduce((acc, item) => acc + item.price, 0) || 0;
    const discount = state.currentCustomer?.order.length && state.currentCustomer.order.length > 1 ? subtotal * 0.1 : 0;
    const total = subtotal - discount + (state.currentCustomer?.tip || 0);

    setState(prev => {
      const newCrmScore = isCorrect ? prev.crmScore + 1 : prev.crmScore;
      const newHistory = [...prev.history, { quadrant: state.currentCustomer!.quadrant, correct: isCorrect }];
      return {
        ...prev,
        phase: 'REVEAL',
        lastGuessCorrect: isCorrect,
        crmScore: newCrmScore,
        accuracy: Math.round((newCrmScore / prev.round) * 100),
        roundRevenue: total,
        totalRevenue: prev.totalRevenue + total,
        loyaltyPointsSold: prev.loyaltyPointsSold + (state.currentCustomer?.quadrant === Quadrant.STAR ? 10 : 0),
        history: newHistory,
      };
    });
  };

  const proceedToLedger = () => {
    setState(prev => ({ ...prev, phase: 'LEDGER' }));
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
  };

  const renderStart = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="space-y-4"
      >
        <h1 className="text-4xl sm:text-6xl font-serif italic tracking-tighter text-stone-800">CAFÉ NEXUS</h1>
        <p className="text-stone-500 font-mono text-[10px] sm:text-sm uppercase tracking-widest">CRM Management Simulation</p>
      </motion.div>
      
      <div className="w-full max-w-md bg-stone-100/50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm backdrop-blur-sm">
        <p className="text-stone-600 leading-relaxed italic text-sm sm:text-base">
          "The rain taps against the window. The smell of roasted beans fills the air. 
          The bell above the door is ready to chime. Your customers are waiting."
        </p>
      </div>

      <button
        onClick={startRound}
        className="group relative px-12 py-4 bg-stone-800 text-stone-100 rounded-full font-medium overflow-hidden transition-all hover:bg-stone-900 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          Open the Café <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>
    </div>
  );

  const renderEncounter = () => {
    const c = state.currentCustomer!;
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="font-mono text-[10px] sm:text-xs text-stone-400 flex justify-between border-b border-stone-200 pb-2">
          <span>CUSTOMER ENCOUNTER</span>
          <span>ROUND {state.round}/5</span>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] sm:shadow-[8px_8px_0px_0px_rgba(41,37,36,1)] overflow-hidden"
        >
          <div className="bg-stone-800 text-stone-100 p-3 flex justify-between items-center">
            <span className="font-mono text-xs sm:text-sm tracking-tighter">CUSTOMER #{state.round}</span>
            <span className="font-mono text-[10px] opacity-70">MORNING RUSH</span>
          </div>
          <div className="p-4 sm:p-6 space-y-4 font-mono text-xs sm:text-sm text-stone-800">
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-x-2 gap-y-1 sm:gap-y-2">
              <div className="flex sm:block justify-between border-b border-stone-50 sm:border-none pb-1 sm:pb-0">
                <span className="text-stone-400">NAME</span>
                <span className="font-bold sm:hidden">{c.name}</span>
              </div>
              <span className="font-bold hidden sm:block">{c.name}</span>
              
              <div className="flex sm:block justify-between border-b border-stone-50 sm:border-none pb-1 sm:pb-0">
                <span className="text-stone-400">VISITS</span>
                <span className="sm:hidden">{c.visitCount}</span>
              </div>
              <span>{c.visitCount} visits to your café</span>
              
              <div className="flex sm:block justify-between border-b border-stone-50 sm:border-none pb-1 sm:pb-0">
                <span className="text-stone-400">AVG SPEND</span>
                <span className="sm:hidden">₹{c.avgSpend}</span>
              </div>
              <span>₹{c.avgSpend} per visit</span>
              
              <div className="flex sm:block justify-between border-b border-stone-50 sm:border-none pb-1 sm:pb-0">
                <span className="text-stone-400">LAST VISIT</span>
                <span className="sm:hidden">{c.lastVisit}</span>
              </div>
              <span>{c.lastVisit}</span>
              
              <div className="flex sm:block justify-between border-b border-stone-50 sm:border-none pb-1 sm:pb-0">
                <span className="text-stone-400">MOOD</span>
                <span className="sm:hidden">{c.mood}</span>
              </div>
              <span>{c.mood}</span>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <span className="text-stone-400 block mb-1 text-[10px] sm:text-xs">NOTES</span>
              <p className="italic text-stone-600 text-xs sm:text-sm">"{c.notes}"</p>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <button
            onClick={proceedToTransaction}
            className="px-8 py-3 bg-stone-800 text-stone-100 rounded-lg hover:bg-stone-900 transition-colors flex items-center gap-2"
          >
            Greet Customer <Coffee size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderTransaction = () => {
    const c = state.currentCustomer!;
    const subtotal = c.order.reduce((acc, item) => acc + item.price, 0);
    const discount = c.order.length > 1 ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
              <User size={16} className="text-stone-500 sm:hidden" />
              <User size={20} className="text-stone-500 hidden sm:block" />
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-2xl rounded-tl-none border border-stone-200 shadow-sm italic text-stone-700 text-sm sm:text-base leading-relaxed">
              {c.dialogue}
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#fdfcf0] p-6 sm:p-8 border border-stone-300 shadow-lg w-full max-w-[280px] sm:max-w-xs mx-auto font-mono text-xs sm:text-sm text-stone-800"
          >
            <div className="text-center mb-6 border-b border-dashed border-stone-400 pb-4">
              <h3 className="font-bold text-lg">CAFÉ NEXUS</h3>
              <p className="text-[10px] text-stone-500">EST. 2026 | MUMBAI</p>
            </div>
            
            <div className="space-y-2 mb-6">
              {c.order.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Combo Discount (10%)</span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-stone-400 pt-4 space-y-2">
              <div className="flex justify-between font-bold text-base">
                <span>TOTAL</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Payment</span>
                <span>UPI / Card</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Tip</span>
                <span>₹{c.tip}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-stone-400">
              <p>THANK YOU FOR VISITING</p>
              <p>SEE YOU AGAIN SOON</p>
            </div>
          </motion.div>

          <div className="text-center italic text-stone-500 text-sm">
            "{c.exitBehavior}"
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={proceedToGuessing}
            className="px-8 py-3 bg-stone-800 text-stone-100 rounded-lg hover:bg-stone-900 transition-colors flex items-center gap-2"
          >
            Analyze Customer <TrendingUp size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderGuessing = () => (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto text-center">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-800">The CRM Challenge</h2>
        <p className="text-xs sm:text-sm text-stone-500">Based on this customer's profile and behavior — which quadrant do they belong to?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {(Object.keys(QUADRANT_INFO) as Quadrant[]).map((q) => (
          <button
            key={q}
            onClick={() => handleGuess(q)}
            className="p-4 sm:p-6 bg-white border border-stone-200 rounded-2xl hover:border-stone-800 hover:shadow-md transition-all text-left group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 mb-1 sm:mb-2">
              <span className="text-xl sm:text-2xl">{QUADRANT_INFO[q].emoji}</span>
              <span className="font-bold text-sm sm:text-base text-stone-800 group-hover:text-stone-900">{QUADRANT_INFO[q].name}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-500 leading-relaxed">{QUADRANT_INFO[q].description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderReveal = () => {
    const c = state.currentCustomer!;
    const info = QUADRANT_INFO[c.quadrant];
    
    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 sm:p-8 rounded-3xl border-2 ${state.lastGuessCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}
        >
          <div className="mb-4">
            {state.lastGuessCorrect ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] sm:text-sm font-bold uppercase tracking-wider">
                <Award size={14} className="sm:hidden" />
                <Award size={16} className="hidden sm:block" /> Correct
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] sm:text-sm font-bold uppercase tracking-wider">
                Incorrect
              </div>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-stone-800 mb-2">
            {info.emoji} {info.name}
          </h3>
          
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {c.quadrant === Quadrant.STAR && `This customer is a Star because they show both high loyalty (${c.visitCount} visits) and high spend (₹${c.avgSpend} avg). Their emotional investment is clear from their dialogue.`}
              {c.quadrant === Quadrant.BUTTERFLY && `A classic Butterfly. They spend big (₹${c.avgSpend} avg) but their loyalty is low (${c.visitCount} visits). They are drawn by novelty and high-value items but easily switch to competitors.`}
              {c.quadrant === Quadrant.BARNACLE && `A Barnacle. Extremely loyal (${c.visitCount} visits) but their spend is minimal (₹${c.avgSpend} avg). They use your space frequently but generate low margins.`}
              {c.quadrant === Quadrant.STRANGER && `This is a Stranger. Low loyalty (first visit) and low spend. There is no existing attachment to the brand, making them a low-priority investment.`}
            </p>

            <div className="pt-4 sm:pt-6 border-t border-stone-200 flex justify-center gap-6 sm:gap-8">
              <div className="text-center">
                <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Points</span>
                <span className="text-xl sm:text-2xl font-mono font-bold text-stone-800">+{state.lastGuessCorrect ? 10 : 0}</span>
              </div>
              {c.tip > 20 && (
                <div className="text-center">
                  <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Bonus</span>
                  <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">+5</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <button
            onClick={proceedToLedger}
            className="px-8 py-3 bg-stone-800 text-stone-100 rounded-lg hover:bg-stone-900 transition-colors flex items-center gap-2"
          >
            Check Ledger <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderLedger = () => (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm font-mono text-xs sm:text-sm text-stone-800"
      >
        <div className="text-center mb-6 sm:mb-8 border-b border-stone-200 pb-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tighter">CAFÉ NEXUS — ROUND {state.round}</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">REVENUE THIS ROUND</span>
            <span className="font-bold">₹{state.roundRevenue.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">TOTAL REVENUE</span>
            <span className="font-bold">₹{state.totalRevenue.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">CRM SCORE</span>
            <span className="font-bold">{state.crmScore}/{state.round}</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">ACCURACY</span>
            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div className="h-full bg-stone-800" style={{ width: `${state.accuracy}%` }} />
              </div>
              <span className="font-bold">{state.accuracy}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-stone-400">LOYALTY SOLD</span>
            <span className="font-bold">{state.loyaltyPointsSold}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <button
          onClick={startRound}
          className="px-8 py-3 bg-stone-800 text-stone-100 rounded-lg hover:bg-stone-900 transition-colors flex items-center gap-2"
        >
          {state.round < 5 ? 'Next Customer' : 'Finish Session'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderSummary = () => {
    const weakestQuadrant = useMemo(() => {
      const stats = {
        [Quadrant.STAR]: { correct: 0, total: 0 },
        [Quadrant.BUTTERFLY]: { correct: 0, total: 0 },
        [Quadrant.BARNACLE]: { correct: 0, total: 0 },
        [Quadrant.STRANGER]: { correct: 0, total: 0 },
      };
      state.history.forEach(h => {
        stats[h.quadrant].total++;
        if (h.correct) stats[h.quadrant].correct++;
      });
      
      let weakest = Quadrant.STAR;
      let minAccuracy = 1.1;
      
      (Object.keys(stats) as Quadrant[]).forEach(q => {
        if (stats[q].total > 0) {
          const acc = stats[q].correct / stats[q].total;
          if (acc < minAccuracy) {
            minAccuracy = acc;
            weakest = q;
          }
        }
      });
      return weakest;
    }, [state.history]);

    const tips = {
      [Quadrant.STAR]: "You seem to miss the subtle signs of true loyalty. Look for high visit counts paired with personal engagement.",
      [Quadrant.BUTTERFLY]: "Butterflies can be tricky. They spend like Stars but don't show the same long-term commitment. Watch for mentions of competitors.",
      [Quadrant.BARNACLE]: "Don't confuse frequency with value. Barnacles are always there, but they rarely open their wallets for premium items.",
      [Quadrant.STRANGER]: "Strangers are the easiest to spot—they have no history. If it's their first visit and they're ordering the basics, they're likely just passing through.",
    };

    return (
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-2xl mx-auto text-center">
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-5xl font-serif italic text-stone-800">Session Summary</h1>
          <p className="text-stone-500 font-mono text-[10px] sm:text-sm uppercase tracking-widest">End of the Day Report</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1 sm:mb-2">Total Revenue</span>
            <span className="text-2xl sm:text-3xl font-bold text-stone-800">₹{state.totalRevenue.toFixed(0)}</span>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1 sm:mb-2">CRM Accuracy</span>
            <span className="text-2xl sm:text-3xl font-bold text-stone-800">{state.accuracy}%</span>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
            <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1 sm:mb-2">Loyalty Sold</span>
            <span className="text-2xl sm:text-3xl font-bold text-stone-800">{state.loyaltyPointsSold}</span>
          </div>
        </div>

        <div className="bg-stone-800 text-stone-100 p-6 sm:p-8 rounded-3xl text-left space-y-4">
          <h3 className="text-lg sm:text-xl font-serif italic flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400 sm:hidden" />
            <TrendingUp size={20} className="text-emerald-400 hidden sm:block" /> Strategic Insight
          </h3>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            {tips[weakestQuadrant]}
          </p>
          <div className="pt-4 border-t border-stone-700 text-[10px] sm:text-xs text-stone-400 italic">
            "Focus on identifying your {QUADRANT_INFO[weakestQuadrant].name}s to optimize your marketing spend."
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-stone-800 text-stone-100 rounded-lg hover:bg-stone-900 transition-colors flex items-center gap-2"
          >
            Restart Session <RefreshCw size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-stone-800 font-sans selection:bg-stone-200">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        <header className="p-4 sm:p-6 flex justify-between items-center border-b border-stone-200/50 backdrop-blur-sm sticky top-0 z-50 bg-[#f5f5f0]/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <Coffee size={16} className="text-stone-100 sm:hidden" />
              <Coffee size={18} className="text-stone-100 hidden sm:block" />
            </div>
            <span className="font-serif italic text-lg sm:text-xl tracking-tight">Café Nexus</span>
          </div>
          {state.phase !== 'START' && state.phase !== 'SUMMARY' && (
            <div className="flex gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400">
              <div className="flex flex-col items-end">
                <span>Revenue</span>
                <span className="text-stone-800 font-bold">₹{state.totalRevenue.toFixed(0)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span>Accuracy</span>
                <span className="text-stone-800 font-bold">{state.accuracy}%</span>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.phase}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {state.phase === 'START' && renderStart()}
              {state.phase === 'ENCOUNTER' && renderEncounter()}
              {state.phase === 'TRANSACTION' && renderTransaction()}
              {state.phase === 'GUESSING' && renderGuessing()}
              {state.phase === 'REVEAL' && renderReveal()}
              {state.phase === 'LEDGER' && renderLedger()}
              {state.phase === 'SUMMARY' && renderSummary()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
