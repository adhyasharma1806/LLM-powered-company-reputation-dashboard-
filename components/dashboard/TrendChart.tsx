'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { fetchTrends, type TrendPoint } from '@/lib/api';

export function TrendChart() {
  const [data, setData] = useState<TrendPoint[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const points = await fetchTrends();
        if (!cancelled) {
          setData(points);
        }
      } catch {
        if (!cancelled) {
          setData([]);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Sentiment Trends</h3>
        <span className="text-sm text-zinc-500">By news day</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ color: '#a1a1aa' }} />
          <Line
            type="monotone"
            dataKey="positive"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="negative"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="neutral"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
