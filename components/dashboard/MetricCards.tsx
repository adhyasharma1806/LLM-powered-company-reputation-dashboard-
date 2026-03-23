'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchMetrics, type MetricsResponse } from '@/lib/api';

const cards = [
  {
    key: 'total' as const,
    label: 'Total Mentions',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'positive' as const,
    label: 'Positive',
    color: 'from-green-500 to-emerald-500',
  },
  {
    key: 'negative' as const,
    label: 'Negative',
    color: 'from-red-500 to-pink-500',
  },
  {
    key: 'neutral' as const,
    label: 'Neutral',
    color: 'from-yellow-500 to-orange-500',
  },
];

export function MetricCards() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const metrics = await fetchMetrics();
        if (!cancelled) {
          setData(metrics);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load metrics');
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const value = data ? data[card.key] : null;
        const isPositive = card.key !== 'negative';

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div
              className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom right, var(--tw-gradient-stops))',
              }}
            />
            <div className="relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-zinc-400 font-medium">
                    {card.label}
                  </p>
                  <p
                    className="text-3xl font-bold mt-2 bg-gradient-to-br bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(to bottom right, var(--tw-gradient-stops))',
                    }}
                  >
                    {value !== null
                      ? value.toLocaleString()
                      : error
                      ? '—'
                      : '...'}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span
                  className={`text-sm font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  Live from news feed
                </span>
                <span className="text-sm text-zinc-500">
                  Apple-related mentions
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
