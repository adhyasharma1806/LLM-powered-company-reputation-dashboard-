'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  Hash,
  Database,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onSelect: (key: string) => void;
}

const menuItems = [
  { key: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'sentiment', icon: MessageSquare, label: 'Sentiment' },
  { key: 'trends', icon: TrendingUp, label: 'Trends' },
  { key: 'topics', icon: Hash, label: 'Topics' },
  { key: 'data', icon: Database, label: 'Data' },
];

export function Sidebar({
  collapsed,
  onToggle,
  activeItem,
  onSelect,
}: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative h-full bg-zinc-950 border-r border-zinc-800/50 backdrop-blur-xl"
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
              <span className="font-semibold text-sm">RepIntel</span>
            </motion.div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mx-auto" />
          )}
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(item.key)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200',
                item.key === activeItem
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.button>
          ))}
        </nav>

        <button
          onClick={onToggle}
          className="m-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
