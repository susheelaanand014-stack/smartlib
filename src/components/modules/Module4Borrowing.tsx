import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BookOpen,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { DataIntegrityBadge } from '../common/DataIntegrityBadge';

export const Module4Borrowing: React.FC = () => {
  const {
    currentUser,
    borrowRecords,
    returnBook,
    renewBook,
    setActiveTab,
    setSelectedBookForShelf,
    books
  } = useLibrary();

  const [activeTab, setActiveTabFilter] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [returnDialogRecord, setReturnDialogRecord] = useState<any | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Student vs Admin records view
  // Admins see all circulation transactions, Students see their own private records
  const userRecords = borrowRecords.filter(r =>
    currentUser.role === 'ADMIN' ? true : r.userId === currentUser.id
  );

  const activeLoans = userRecords.filter(r => r.status === 'ACTIVE' || r.status === 'OVERDUE');
  const historicalLoans = userRecords.filter(r => r.status === 'RETURNED');

  const handleReturn = (recordId: string) => {
    const res = returnBook(recordId);
    setActionFeedback(res.message);
    setReturnDialogRecord(null);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleRenew = (recordId: string) => {
    const res = renewBook(recordId);
    setActionFeedback(res.message);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Calculate days remaining or days overdue relative to current local date 2026-10-11
  const getDeadlineStatus = (dueDate: string) => {
    const today = new Date('2026-10-11').getTime();
    const due = new Date(dueDate).getTime();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        label: `OVERDUE by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`,
        type: 'danger',
        fine: overdueDays * 5,
        days: diffDays
      };
    } else if (diffDays <= 2) {
      return {
        label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'} (Urgent)`,
        type: 'warning',
        fine: 0,
        days: diffDays
      };
    } else {
      return {
        label: `${diffDays} days remaining`,
        type: 'good',
        fine: 0,
        days: diffDays
      };
    }
  };

  const studentActiveCount = borrowRecords.filter(r => r.userId === currentUser.id && r.status === 'ACTIVE').length;
  const loanCapacityPercentage = Math.round((studentActiveCount / currentUser.maxBorrowLimit) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 4</span>
            <span className="text-slate-300">·</span>
            <DataIntegrityBadge type="policy" label="ACID Transactions & Loan Isolation" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Circulation, Loans & Returns</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical copy checkouts, due date monitoring, renewals, and overdue penalty calculations
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTabFilter('ACTIVE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Loans ({activeLoans.length})</span>
          </button>
          <button
            onClick={() => setActiveTabFilter('HISTORY')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'HISTORY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Returned History ({historicalLoans.length})</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Loan Limit Capacity Card (for Student or Admin overview) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Current Loan Quota
          </span>
          <div className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>{studentActiveCount} of {currentUser.maxBorrowLimit} Books</span>
            <span className="text-xs font-medium text-slate-500">
              ({currentUser.maxBorrowLimit - studentActiveCount} Slots Left)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Standard borrowing duration: 14 days with 2 allowable renewals.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Capacity Utilized</span>
            <span>{loanCapacityPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                loanCapacityPercentage >= 100
                  ? 'bg-rose-500'
                  : loanCapacityPercentage >= 66
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, loanCapacityPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Link to Official Portal & Catalogue */}
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-end">
          <button
            onClick={() => setActiveTab('catalogue')}
            className="w-full sm:w-auto px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl border border-blue-200 transition-colors text-center"
          >
            Browse Catalogue
          </button>
          <a
            href="https://library.alliance.edu.in/"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>University Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Active Loans View */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {activeLoans.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="font-semibold text-slate-700">No active book checkouts</h3>
              <p className="text-xs text-slate-400">
                You currently have 0 active books checked out. Explore the catalogue to borrow course materials.
              </p>
              <button
                onClick={() => setActiveTab('catalogue')}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700"
              >
                Go to Catalogue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeLoans.map(record => {
                const deadline = getDeadlineStatus(record.dueDate);
                const bookRef = books.find(b => b.id === record.bookId);

                return (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-4">
                      {/* Top Header with Due Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={record.bookCoverUrl}
                            alt={record.bookTitle}
                            className="w-14 h-20 object-cover rounded-lg shadow-xs border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Barcode: {record.copyBarcode}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                              {record.bookTitle}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                              {record.bookAuthor}
                            </p>
                            {currentUser.role === 'ADMIN' && (
                              <p className="text-[11px] text-blue-600 font-medium mt-1">
                                Patron: {record.userName} ({record.userEmail})
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              deadline.type === 'danger'
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : deadline.type === 'warning'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {deadline.label}
                          </span>
                          {deadline.fine > 0 && (
                            <span className="text-xs font-bold text-rose-600 mt-1">
                              Accrued Fine: ₹{deadline.fine}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dates Summary */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Checked Out On</span>
                          <span className="font-semibold text-slate-800">{record.borrowDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Official Due Date</span>
                          <span className="font-bold text-slate-900">{record.dueDate}</span>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Renewals Used: {record.renewedCount} of {record.maxRenewals}</span>
                          {bookRef && (
                            <button
                              onClick={() => {
                                setSelectedBookForShelf(bookRef);
                                setActiveTab('shelf');
                              }}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Shelf: Floor {bookRef.shelf.floor}, {bookRef.shelf.bay} &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleRenew(record.id)}
                        disabled={record.renewedCount >= record.maxRenewals || deadline.type === 'danger'}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1.5 transition-colors"
                        title={
                          record.renewedCount >= record.maxRenewals
                            ? 'Maximum 2 renewals allowed'
                            : deadline.type === 'danger'
                            ? 'Overdue books cannot be renewed online; must be settled at counter'
                            : 'Extend due date by 7 days'
                        }
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Renew (+7 Days)</span>
                      </button>

                      <button
                        onClick={() => handleReturn(record.id)}
                        className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Return to Desk</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Historical Loans Table View */}
      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Circulation Audit Log & Past Return Receipts
            </h3>
            <span className="text-xs text-slate-500">
              Showing {historicalLoans.length} completed transactions
            </span>
          </div>

          {historicalLoans.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No historical return transactions on record yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 pl-4">Record ID</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Physical Barcode</th>
                    <th className="p-3">Borrow Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Returned On</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Fine Settled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {historicalLoans.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 pl-4 font-mono font-medium text-slate-500 text-[11px]">
                        {rec.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">
                        {rec.bookTitle}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">
                        {rec.copyBarcode}
                      </td>
                      <td className="p-3">{rec.borrowDate}</td>
                      <td className="p-3">{rec.dueDate}</td>
                      <td className="p-3 font-medium text-emerald-700">
                        {rec.returnDate || 'Returned'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          RETURNED
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right font-medium">
                        {rec.fineAmount > 0 ? (
                          <span className="text-amber-700">₹{rec.fineAmount} (Paid)</span>
                        ) : (
                          <span className="text-slate-400">₹0.00</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
