import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const layers = [
  { id: 'wind', label: 'Ветер', color: 'wind', icon: 'Wind' },
  { id: 'precip', label: 'Осадки', color: 'hail', icon: 'CloudRain' },
  { id: 'storm', label: 'Молнии', color: 'lightning', icon: 'Zap' },
] as const;

type LayerId = (typeof layers)[number]['id'];

// Города ЮФО и их позиция на карте (в % от границ округа)
const cities = [
  { name: 'Ростов-на-Дону', x: 25, y: 40 },
  { name: 'Краснодар', x: 19, y: 66 },
  { name: 'Волгоград', x: 71, y: 25 },
  { name: 'Астрахань', x: 96, y: 55 },
  { name: 'Сочи', x: 25, y: 88 },
  { name: 'Ставрополь', x: 47, y: 63 },
  { name: 'Симферополь', x: 2, y: 68 },
  { name: 'Элиста', x: 67, y: 57 },
];

interface Strike {
  x: number;
  y: number;
  ageSec: number;
  lat: number;
  lon: number;
}

interface LightningData {
  total: number;
  source: string;
  updatedAt: string;
  strikes: Strike[];
  topCities: { name: string; count: number }[];
}

const cells = Array.from({ length: 96 }, (_, i) => i);

const StormMap = () => {
  const [active, setActive] = useState<Record<LayerId, boolean>>({
    wind: false,
    precip: false,
    storm: true,
  });
  const [data, setData] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(func2url.lightning);
      const json = (await res.json()) as LightningData;
      setData(json);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const toggle = (id: LayerId) =>
    setActive((s) => ({ ...s, [id]: !s[id] }));

  const strikes = data?.strikes ?? [];

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

      {/* Region label */}
      <div className="absolute right-4 top-4 z-30 rounded-lg border border-border bg-background/50 px-3 py-2 text-right backdrop-blur-md">
        <p className="font-mono-tech text-[10px] uppercase tracking-widest text-accent">
          Регион
        </p>
        <p className="text-sm font-600">Южный ФО</p>
      </div>

      {/* Radar sweep */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2">
        <div className="radar-sweep animate-sweep h-full w-full rounded-full" />
      </div>

      {/* Grid map */}
      <div className="grid-bg relative aspect-[16/10] w-full">
        {/* Wind streaks */}
        {active.wind && (
          <div className="pointer-events-none absolute inset-0 z-10">
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
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-12 grid-rows-8">
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

        {/* Cities */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {cities.map((c) => (
            <div
              key={c.name}
              className="absolute flex items-center gap-1"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Real lightning strikes */}
        {active.storm && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {strikes.map((s, i) => {
              const fresh = s.ageSec < 120;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {fresh && (
                    <div className="animate-pulse-ring absolute -inset-3 rounded-full border border-lightning" />
                  )}
                  <div
                    className={`h-2 w-2 rounded-full ${fresh ? 'animate-flash' : ''}`}
                    style={{
                      background: 'hsl(var(--lightning))',
                      boxShadow: fresh
                        ? '0 0 10px hsl(var(--lightning))'
                        : 'none',
                      opacity: fresh ? 1 : 0.4,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Coordinates label */}
        <div className="absolute bottom-3 right-4 z-30 font-mono-tech text-xs text-muted-foreground">
          47.24°N · 39.70°E
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="font-mono-tech">
          {loading
            ? 'ЗАГРУЗКА ДАННЫХ...'
            : data?.source === 'blitzortung'
              ? `BLITZORTUNG · ${data.total} РАЗРЯДОВ`
              : `ОЦЕНКА · ${data?.total ?? 0} РАЗРЯДОВ`}
        </span>
        <span className="flex items-center gap-1 text-lightning">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lightning" />
          LIVE
        </span>
      </div>
    </div>
  );
};

export default StormMap;
