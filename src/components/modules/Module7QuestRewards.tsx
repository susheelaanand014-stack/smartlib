import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { LibraryQuiz, RewardItem, QuestMission } from '../../types/library';
import {
  Trophy,
  Coins,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  BookOpen,
  Compass,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module7QuestRewards: React.FC = () => {
  const {
    currentUser,
    quests,
    quizzes,
    rewards,
    pointHistory,
    claimMissionReward,
    submitQuiz,
    redeemReward
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'missions' | 'quizzes' | 'rewards' | 'ledger'>('missions');
  const [activeQuiz, setActiveQuiz] = useState<LibraryQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizResultFeedback, setQuizResultFeedback] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaimMission = (id: string) => {
    const res = claimMissionReward(id);
    showToast(res.message);
  };

  const handleOpenQuiz = (quiz: LibraryQuiz) => {
    setActiveQuiz(quiz);
    setQuizAnswers({});
    setQuizResultFeedback(null);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;

    const answersArray = activeQuiz.questions.map((q, idx) =>
      quizAnswers[q.id] !== undefined ? quizAnswers[q.id] : -1
    );

    const res = submitQuiz(activeQuiz.id, answersArray);
    setQuizResultFeedback(res);
  };

  const handleRedeem = (rewardId: string) => {
    const res = redeemReward(rewardId);
    showToast(res.message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 7</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="policy" label="Anti-Double-Spend & Ledger Validation" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Library Quest & Learning Rewards</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Engage with curriculum missions, test subject mastery with quizzes, and redeem verified library privileges
          </p>
        </div>

        {/* User Balance Chip */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Wallet Balance
            </span>
            <span className="text-base font-extrabold text-amber-600">
              {currentUser.points} <span className="text-xs font-semibold text-slate-600">Points</span>
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'missions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Learning Missions ({quests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'quizzes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span>Knowledge Quizzes ({quizzes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'rewards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-purple-500" />
          <span>Privilege Store ({rewards.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>Points Ledger ({pointHistory.length})</span>
        </button>
      </div>

      {/* TAB 1: MISSIONS */}
      {activeTab === 'missions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quests.map(m => {
            const isDone = m.currentProgress >= m.targetProgress;
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      {m.category} MISSION
                    </span>
                    <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" /> +{m.rewardPoints} Pts
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.description}</p>
                  </div>

                  {/* Progress Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Progress</span>
                      <span>
                        {m.currentProgress} / {m.targetProgress} {m.unit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isDone ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round((m.currentProgress / m.targetProgress) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {m.isClaimed ? 'Reward claimed' : isDone ? 'Criteria met!' : 'In progress'}
                  </span>
                  {m.isClaimed ? (
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-slate-100 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => handleClaimMission(m.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Claim {m.rewardPoints} Pts</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Ongoing</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quizzes.map(quiz => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {quiz.subject}
                  </span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> +{quiz.rewardPoints} Pts
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{quiz.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{quiz.description}</p>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Questions: <strong>{quiz.questions.length} Multi-Choice</strong></div>
                  <div>Estimated Time: <strong>{quiz.durationMinutes} Minutes</strong></div>
                  {quiz.lastScore !== undefined && (
                    <div className="text-emerald-700 font-semibold pt-1">
                      Last Score: {quiz.lastScore}% (Completed)
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenQuiz(quiz)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>{quiz.isCompleted ? 'Review / Retake Quiz' : 'Start Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: REWARD STORE */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rewards.map(rw => {
            const canAfford = currentUser.points >= rw.pointsRequired;
            return (
              <div
                key={rw.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                      {rw.category}
                    </span>
                    {rw.isDemonstrationOnly ? (
                      <DataIntegrityBadge type="demonstration" label="Demo Perk" />
                    ) : (
                      <DataIntegrityBadge type="policy" label="Official Pass" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rw.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rw.description}</p>
                  </div>

                  <p className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Terms: {rw.terms}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-extrabold text-amber-600 text-sm flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {rw.pointsRequired} Pts
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Stock: {rw.stockRemaining} Available
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleRedeem(rw.id)}
                    disabled={!canAfford || rw.stockRemaining <= 0}
                    className={`w-full py-2 text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 ${
                      canAfford && rw.stockRemaining > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {rw.stockRemaining <= 0
                        ? 'Out of Stock'
                        : canAfford
                        ? 'Redeem Privilege'
                        : `Need ${rw.pointsRequired - currentUser.points} More Pts`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: LEDGER AUDIT */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Cryptographic Learning Points Ledger & Audit Trail
            </h3>
            <span className="text-xs text-slate-500">
              Current Balance: <strong className="text-amber-600">{currentUser.points} Pts</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 pl-4">Tx ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 pr-4 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pointHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 pl-4 font-mono font-medium text-slate-500 text-[11px]">{tx.id}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'EARNED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-900">{tx.description}</td>
                    <td className="p-3 text-slate-500">{tx.timestamp}</td>
                    <td className={`p-3 font-bold ${tx.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'EARNED' ? `+${tx.amount}` : `-${tx.amount}`}
                    </td>
                    <td className="p-3 pr-4 text-right font-mono font-semibold text-slate-900">
                      {tx.balanceAfter} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {activeQuiz.subject} Assessment
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h3>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {quizResultFeedback ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border text-xs ${
                    quizResultFeedback.score >= 60
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <h4 className="font-bold text-sm">
                    {quizResultFeedback.score >= 60 ? 'Quiz Successfully Passed! 🎉' : 'Assessment Threshold Not Met'}
                  </h4>
                  <p className="mt-1 leading-relaxed">{quizResultFeedback.feedback}</p>
                </div>

                {/* Answers Review */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Answers & Explanations:</h4>
                  {activeQuiz.questions.map((q, idx) => {
                    const chosen = quizAnswers[q.id];
                    const isCorrect = chosen === q.correctIndex;
                    return (
                      <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900">
                            {idx + 1}. {q.question}
                          </span>
                          {isCorrect ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] pt-1">
                          <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                        </p>
                        <p className="text-slate-500 text-[11px] italic">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuiz} className="space-y-5">
                {activeQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {qIdx + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            quizAnswers[q.id] === optIdx
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={quizAnswers[q.id] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Answer all {activeQuiz.questions.length} questions before submitting
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveQuiz(null)}
                      className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-semibold text-xs rounded-xl shadow-xs"
                    >
                      Submit for Evaluation
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
