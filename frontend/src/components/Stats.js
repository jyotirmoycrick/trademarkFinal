import React, { useEffect, useState, useRef } from 'react';

const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 50;
    const interval = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
};

const Stats = () => {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const businesses = useCountUp(1000, 2000, started);
  const applications = useCountUp(5000, 2000, started);
  const rate = useCountUp(99, 2000, started);

  const stats = [
    { value: `${businesses.toLocaleString()}+`, label: 'Businesses Served', sub: 'Across India' },
    { value: `${applications.toLocaleString()}+`, label: 'Applications Filed', sub: 'With authorities' },
    { value: `${rate}%`, label: 'Success Rate', sub: 'Approved applications' },
  ];

  return (
    <section className="py-10 sm:py-14 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-xl border border-slate-100 py-6 px-3 sm:px-6 shadow-sm"
                data-testid={`stat-${index}`}
              >
                <div
                  className="text-2xl sm:text-4xl font-bold text-primary mb-1"
                  data-testid={`stat-value-${index}`}
                >
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-800 mb-0.5" data-testid={`stat-label-${index}`}>
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;