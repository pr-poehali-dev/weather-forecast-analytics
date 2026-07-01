import Icon from '@/components/ui/icon';
import StormMap from '@/components/weather/StormMap';
import ModelCompare from '@/components/weather/ModelCompare';
import RiskPanel from '@/components/weather/RiskPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground glow-primary">
              <Icon name="Tornado" size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-600 leading-none tracking-wider">
                ШТОРМ
              </p>
              <p className="font-mono-tech text-[10px] text-muted-foreground">
                МЕТЕОЦЕНТР ОПАСНЫХ ЯВЛЕНИЙ
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#map" className="transition-colors hover:text-foreground">
              Карта
            </a>
            <a href="#models" className="transition-colors hover:text-foreground">
              Модели
            </a>
            <a href="#risks" className="transition-colors hover:text-foreground">
              Риски
            </a>
          </nav>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-600 text-primary-foreground transition-transform hover:scale-105">
            <Icon name="Bell" size={16} />
            <span className="hidden sm:inline">Оповещения</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div
          className="absolute -left-40 top-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'hsl(var(--storm))' }}
        />
        <div
          className="absolute -right-40 top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'hsl(var(--accent))' }}
        />

        <div className="container relative px-4 py-16 md:py-24">
          <div className="animate-fade-up flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-destructive">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ
            </span>
          </div>
          <h1
            className="animate-fade-up mt-6 max-w-4xl font-display text-5xl font-700 leading-[0.95] tracking-tight md:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            Опасная погода под{' '}
            <span className="text-glow text-primary">контролем</span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-2xl text-lg text-muted-foreground"
            style={{ animationDelay: '0.2s' }}
          >
            Прогноз по четырём мировым моделям для Южного федерального округа.
            Молнии в реальном времени из сети Blitzortung, риск смерчей, града и
            шквалистого ветра на интерактивной карте.
          </p>

          <div
            className="animate-fade-up mt-8 grid max-w-2xl grid-cols-3 gap-4"
            style={{ animationDelay: '0.3s' }}
          >
            {[
              { v: '4', l: 'модели прогноза' },
              { v: '12+', l: 'слоёв карты' },
              { v: '24/7', l: 'мониторинг' },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
              >
                <p className="font-display text-3xl font-700 text-accent">
                  {s.v}
                </p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="container px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-mono-tech text-xs uppercase tracking-widest text-accent">
              Интерактивная карта
            </p>
            <h2 className="font-display text-3xl font-600">Слои явлений</h2>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Включайте наложения: ветер, осадки, грозы
          </p>
        </div>
        <StormMap />
      </section>

      {/* Models */}
      <section id="models" className="container px-4 py-10">
        <div className="mb-6">
          <p className="font-mono-tech text-xs uppercase tracking-widest text-accent">
            Сравнение
          </p>
          <h2 className="font-display text-3xl font-600">
            Прогностические модели
          </h2>
        </div>
        <ModelCompare />
      </section>

      {/* Risks */}
      <section id="risks" className="container px-4 py-10 pb-20">
        <div className="mb-6">
          <p className="font-mono-tech text-xs uppercase tracking-widest text-accent">
            Оценка угроз
          </p>
          <h2 className="font-display text-3xl font-600">Риск опасных явлений</h2>
        </div>
        <RiskPanel />
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Icon name="Tornado" size={18} className="text-primary" />
            <span className="font-display font-600 tracking-wider text-foreground">
              ШТОРМ
            </span>
            <span>· Метеоцентр опасных явлений</span>
          </div>
          <p className="font-mono-tech text-xs">
            Данные обновляются каждые 5 минут
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;