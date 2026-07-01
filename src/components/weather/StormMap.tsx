import { useState } from 'react';
import Icon from '@/components/ui/icon';

const layers = [
  { id: 'wind', label: 'Ветер', color: 'wind', icon: 'Wind' },
  { id: 'precip', label: 'Осадки', color: 'hail', icon: 'CloudRain' },
  { id: 'storm', label: 'Грозы', color: 'storm', icon: 'Zap' },
] as const;

type LayerId = (typeof layers)[number]['id'];

const cells = Array.from({ length: 96 }, (_, i) => i);

const StormMap = () => {
  const [active, setActive] = useState<Record<LayerId, boolean>>({
    wind: true,
    precip: false,
    storm: true,
  });

  const toggle = (id: LayerId) =>
    setActive((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* Toolbar */}
      <div className="absolute left-4 top-4 z-30 flex flex-wrap gap-2">
        {layers.map((l) => (
          <button
            key={l.id}
            onClick={() => toggle(l.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium backdrop-blur-md transition-all ${
              active[l.id]
                ? 'border-transparent text-background'
                : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
            }`}
            style={
              active[l.id]
                ? { backgroundColor: `hsl(var(--${l.color}))` }
                : undefined
            }
          >
            <Icon name={l.icon} size={16} />
            {l.label}
          </button>
        ))}
      </div>

      {/* Radar sweep */}
      <div className="absolute left-1/2 top-1/2 z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2">
        <div className="radar-sweep animate-sweep h-full w-full rounded-full" />
      </div>

      {/* Grid map */}
      <div className="grid-bg relative aspect-[16/10] w-full">
        {/* Wind streaks */}
        {active.wind && (
          <div className="absolute inset-0 z-10">
            {[15, 35, 55, 75].map((top, i) => (
              <div
                key={i}
                className="animate-drift absolute h-px w-40 rounded-full"
                style={{
                  top: `${top}%`,
                  left: `${10 + i * 12}%`,
                  background:
                    'linear-gradient(90deg, transparent, hsl(var(--wind)), transparent)',
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Precip cells */}
        {active.precip && (
          <div className="absolute inset-0 z-10 grid grid-cols-12 grid-rows-8">
            {cells.map((c) => {
              const intensity = Math.sin(c * 1.3) * 0.5 + 0.5;
              return (
                <div
                  key={c}
                  style={{
                    background: `hsl(var(--hail) / ${(intensity * 0.5).toFixed(2)})`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Storm cells */}
        {active.storm && (
          <div className="absolute inset-0 z-20">
            {[
              { l: 28, t: 34 },
              { l: 62, t: 58 },
              { l: 44, t: 22 },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: `${p.l}%`, top: `${p.t}%` }}
              >
                <div className="animate-pulse-ring absolute -inset-6 rounded-full border-2 border-storm" />
                <div
                  className="animate-flash flex h-9 w-9 items-center justify-center rounded-full text-background"
                  style={{
                    background: 'hsl(var(--storm))',
                    animationDelay: `${i * 1.1}s`,
                  }}
                >
                  <Icon name="Zap" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coordinates label */}
        <div className="absolute bottom-3 right-4 z-30 font-mono-tech text-xs text-muted-foreground">
          55.75°N · 37.61°E
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="font-mono-tech">RADAR · ОБНОВЛЕНО 2 МИН НАЗАД</span>
        <span className="flex items-center gap-1 text-wind">
          <span className="h-2 w-2 animate-pulse rounded-full bg-wind" />
          LIVE
        </span>
      </div>
    </div>
  );
};

export default StormMap;
