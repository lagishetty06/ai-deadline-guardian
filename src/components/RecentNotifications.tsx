import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export interface NotificationItem {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success';
  time: string;
}

interface RecentNotificationsProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

export default function RecentNotifications({ notifications, onDismiss }: RecentNotificationsProps) {
  const getIcon = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'success': return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Info className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getBorderColor = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'warning': return 'border-amber-500/10 bg-amber-500/5 text-amber-300';
      case 'success': return 'border-emerald-500/10 bg-emerald-500/5 text-emerald-300';
      default: return 'border-indigo-500/10 bg-indigo-500/5 text-indigo-300';
    }
  };

  return (
    <div id="recent-notifications-widget" className="bg-[#0e0e1b] border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display">System Alerts</h4>
        </div>
        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
          {notifications.length} Active
        </span>
      </div>

      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-2.5 rounded-xl border flex gap-2 items-start text-[11px] leading-relaxed relative group transition-all ${getBorderColor(notif.type)}`}
          >
            <div className="shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 pr-4">
              <p className="text-slate-300">{notif.text}</p>
              <span className="text-[9px] font-mono text-slate-500 block mt-1">{notif.time}</span>
            </div>
            <button
              onClick={() => onDismiss(notif.id)}
              aria-label="Dismiss Notification"
              className="absolute top-2.5 right-2 text-slate-500 hover:text-slate-300 transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            No system notifications active.
          </div>
        )}
      </div>
    </div>
  );
}
