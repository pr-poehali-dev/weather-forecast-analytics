import Icon from '@/components/ui/icon';

const risks = [
  {
    name: 'Смерчи',
    icon: 'Tornado',
    level: 'Высокий',
    value: 78,
    color: 'storm',
    desc: 'Условия для суперячеек',
  },
  {
    name: 'Град',
    icon: 'CloudHail',
    level: 'Средний',
    value: 54,
    color: 'hail',
    desc: 'Крупный град до 3 см',
  },
  {
    name: 'Шквалистый ветер',
    icon: 'Wind',
    level: 'Высокий',
    value: 71,
    color: 'wind',
    desc: 'Порывы до 25 м/с',
  },
  {
    name: 'Молнии',
    icon: 'Zap',
    level: 'Экстремальный',
    value: 92,
    color: 'lightning',
    desc: 'Плотность 40 разрядов/км²',
  },
] as const;

const RiskPanel = () => {
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
              className="h-full rounded-full"
              style={{
                width: `${r.value}%`,
                background: `hsl(var(--${r.color}))`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskPanel;
