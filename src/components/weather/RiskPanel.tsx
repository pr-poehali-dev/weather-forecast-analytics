import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const baseRisks = [
  {
    id: 'tornado',
    name: 'Смерчи',
    icon: 'Tornado',
    level: 'Высокий',
    value: 78,
    color: 'storm',
    desc: 'Условия для суперячеек',
  },
  {
    id: 'hail',
    name: 'Град',
    icon: 'CloudHail',
    level: 'Средний',
    value: 54,
    color: 'hail',
    desc: 'Крупный град до 3 см',
  },
  {
    id: 'wind',
    name: 'Шквалистый ветер',
    icon: 'Wind',
    level: 'Высокий',
    value: 71,
    color: 'wind',
    desc: 'Порывы до 25 м/с',
  },
  {
    id: 'lightning',
    name: 'Молнии',
    icon: 'Zap',
    level: '—',
    value: 0,
    color: 'lightning',
    desc: 'Данные Blitzortung по ЮФО',
  },
];

interface LightningData {
  total: number;
  source: string;
  topCities: { name: string; count: number }[];
}

function levelByCount(n: number): string {
  if (n >= 60) return 'Экстремальный';
  if (n >= 30) return 'Высокий';
  if (n >= 10) return 'Средний';
  if (n > 0) return 'Низкий';
  return 'Спокойно';
}

const RiskPanel = () => {
  const [lightning, setLightning] = useState<LightningData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(func2url.lightning);
        setLightning((await res.json()) as LightningData);
      } catch {
        /* ignore */
      }
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const risks = baseRisks.map((r) => {
    if (r.id !== 'lightning') return r;
    const total = lightning?.total ?? 0;
    const top = lightning?.topCities?.[0];
    return {
      ...r,
      value: Math.min(100, total * 2),
      level: levelByCount(total),
      desc: top
        ? `${total} разрядов · пик: ${top.name}`
        : `${total} разрядов по ЮФО`,
    };
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {risks.map((r, idx) => (
        <div
          key={r.name}
          className="animate-fade-up relative overflow-hidden rounded-2xl border border-border bg-card p-5"
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: `hsl(var(--${r.color}))` }}
          />

          <div className="flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: `hsl(var(--${r.color}) / 0.15)`,
                color: `hsl(var(--${r.color}))`,
              }}
            >
              <Icon name={r.icon} fallback="TriangleAlert" size={22} />
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-600 uppercase tracking-wider"
              style={{
                background: `hsl(var(--${r.color}) / 0.15)`,
                color: `hsl(var(--${r.color}))`,
              }}
            >
              {r.level}
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg font-500">{r.name}</h3>
          <p className="text-xs text-muted-foreground">{r.desc}</p>

          {/* Gauge */}
          <div className="mt-4 flex items-end gap-2">
            <span
              className="font-mono-tech text-3xl font-600 leading-none"
              style={{ color: `hsl(var(--${r.color}))` }}
            >
              {r.value}
            </span>
            <span className="mb-0.5 text-xs text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${r.value}%`,
                background: `hsl(var(--${r.color}))`,
              }}
            />
          </div>
          {r.id === 'lightning' && (
            <p className="mt-2 flex items-center gap-1 text-[10px] text-lightning">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lightning" />
              LIVE · обновление раз в минуту
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RiskPanel;
