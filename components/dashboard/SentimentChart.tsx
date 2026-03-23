'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { fetchSentiment, type SentimentSlice } from '@/lib/api';

const COLORS = {
  Positive: '#10b981',
  Negative: '#ef4444',
  Neutral: '#f59e0b',
} as const;

export function SentimentChart() {
  const [data, setData] = useState<SentimentSlice[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const slices = await fetchSentiment();
        if (!cancelled) {
          setData(slices);
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

  const chartData =
    data.length > 0
      ? data.map((d) => ({
          ...d,
          color: COLORS[d.name as keyof typeof COLORS] ?? '#71717a',
        }))
      : [
          { name: 'Positive', value: 0, color: COLORS.Positive },
          { name: 'Negative', value: 0, color: COLORS.Negative },
          { name: 'Neutral', value: 0, color: COLORS.Neutral },
        ];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
        <span className="text-sm text-zinc-500">Live Apple news</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ color: '#a1a1aa' }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {chartData.map((item) => (
          <div key={item.name} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-2xl font-bold">
              {item.value.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-500">{item.name}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
