import React, { useRef, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Bell, CheckCheck, Clock, Award, BookOpen, AlertTriangle } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab, currentUser } = useLibrary();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'DUE_SOON':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'REWARD':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'BORROW_CONFIRM':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-sm text-slate-900">Notifications</span>
          {userNotifications.some(n => !n.read) && (
            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
              {userNotifications.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {userNotifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active library notifications.
          </div>
        ) : (
          userNotifications.map(item => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.actionTab) {
                  setActiveTab(item.actionTab);
                  onClose();
                }
              }}
              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                !item.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5 p-1.5 bg-white rounded-md shadow-xs border border-slate-100 flex-shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs ${!item.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {item.message}
                </p>
                {item.actionTab && (
                  <span className="inline-block mt-1.5 text-[11px] font-medium text-blue-600 hover:underline">
                    View in {item.actionTab} &rarr;
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">
          Official overdue policy: ₹5/day after due date
        </span>
      </div>
    </div>
  );
};
