'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { fetchTopics, type TopicPoint } from '@/lib/api';

export function TopicsChart() {
  const [data, setData] = useState<TopicPoint[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const topics = await fetchTopics();
        if (!cancelled) {
          setData(topics);
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
      ? data.map((t) => ({
          topic: t.name,
          mentions: t.value,
          color: '#3b82f6',
        }))
      : [];

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Top Topics</h3>
        <span className="text-sm text-zinc-500">
          Extracted from recent Apple news
        </span>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            type="number"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            type="category"
            dataKey="topic"
            stroke="#71717a"
            style={{ fontSize: '12px' }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Bar dataKey="mentions" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
