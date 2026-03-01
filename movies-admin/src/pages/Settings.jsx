import React from 'react';
import { HiCog6Tooth } from 'react-icons/hi2';

const Settings = () => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400">Manage your admin panel preferences and configurations</p>
      </div>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiCog6Tooth className="h-6 w-6 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-100">General Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <p className="text-sm font-medium text-slate-100">Notifications</p>
                  <p className="text-xs text-slate-400">Enable desktop notifications</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">Auto-refresh</p>
                  <p className="text-xs text-slate-400">Automatically refresh data every 30 seconds</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HiCog6Tooth className="h-6 w-6 text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-100">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="py-3 border-b border-white/10">
                <p className="text-sm font-medium text-slate-100 mb-1">Email Preferences</p>
                <p className="text-xs text-slate-400">Configure email notifications and alerts</p>
                <button className="mt-2 text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  Configure →
                </button>
              </div>
              <div className="py-3 border-b border-white/10">
                <p className="text-sm font-medium text-slate-100 mb-1">Security</p>
                <p className="text-xs text-slate-400">Password and authentication settings</p>
                <button className="mt-2 text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  Manage →
                </button>
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-slate-100 mb-1">API Access</p>
                <p className="text-xs text-slate-400">Manage API keys and access tokens</p>
                <button className="mt-2 text-xs text-slate-400 hover:text-slate-300 transition-colors">
                  View Keys →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
