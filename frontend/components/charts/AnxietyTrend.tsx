"use client";

import { format } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { CheckinTrendPoint } from '@/types/api';

interface AnxietyTrendProps {
  data: CheckinTrendPoint[];
}

export function AnxietyTrend({ data }: AnxietyTrendProps) {
  const normalized = data.map((point) => ({
    ...point,
    label: format(new Date(point.date), 'MMM dd'),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart data={normalized} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
          <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#cbd5f5' }} />
          <Line type="monotone" dataKey="anxietyLevel" stroke="#2563eb" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="riskScore" stroke="#f97316" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
