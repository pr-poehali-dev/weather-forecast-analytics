import Icon from '@/components/ui/icon';

const models = [
  {
    name: 'ECMWF',
    full: 'European Centre',
    temp: '+8°',
    precip: 62,
    confidence: 91,
    trend: 'up',
    accent: 'accent',
  },
  {
    name: 'GFS',
    full: 'Global Forecast System',
    temp: '+6°',
    precip: 74,
    confidence: 83,
    trend: 'up',
    accent: 'wind',
  },
  {
    name: 'ICON',
    full: 'Deutscher Wetterdienst',
    temp: '+7°',
    precip: 58,
    confidence: 87,
    trend: 'down',
    accent: 'storm',
  },
  {
    name: 'ГМЦ',
    full: 'Гидрометцентр РФ',
    temp: '+9°',
    precip: 45,
    confidence: 79,
    trend: 'down',
    accent: 'lightning',
  },
] as const;

const hours = ['06', '09', '12', '15', '18', '21', '00'];

const ModelCompare = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {models.map((m, idx) => (
        <div
          key={m.name}
          className="animate-fade-up group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-muted-foreground/40"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
            style={{ background: `hsl(var(--${m.accent}))` }}
          />

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-2xl font-600 tracking-wide">
                  {m.name}
                </h3>
                <Icon
                  name={m.trend === 'up' ? 'TrendingUp' : 'TrendingDown'}
                  size={18}
                  className={m.trend === 'up' ? 'text-wind' : 'text-destructive'}
                />
              </div>
              <p className="text-xs text-muted-foreground">{m.full}</p>
            </div>
            <span
              className="font-mono-tech text-3xl font-600"
              style={{ color: `hsl(var(--${m.accent}))` }}
            >
              {m.temp}
            </span>
          </div>

          {/* Mini forecast bars */}
          <div className="mt-5 flex h-16 items-end gap-1.5">
            {hours.map((h, i) => {
              const height = 30 + Math.abs(Math.sin(i + idx)) * 65;
              return (
                <div key={h} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${height}%`,
                      background: `hsl(var(--${m.accent}) / 0.55)`,
                      animation: `bar-grow 0.8s ${i * 0.05}s ease-out both`,
                    }}
                  />
                  <span className="font-mono-tech text-[10px] text-muted-foreground">
                    {h}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Осадки</p>
              <p className="font-mono-tech font-500">{m.precip}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Достоверность</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.confidence}%`,
                      background: `hsl(var(--${m.accent}))`,
                    }}
                  />
                </div>
                <span className="font-mono-tech text-xs">{m.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModelCompare;
