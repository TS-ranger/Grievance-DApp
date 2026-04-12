import { useMemo } from "react";

export default function DashboardCharts({ stats }) {
  const { pending, processing, resolved } = stats;
  const total = pending + processing + resolved;

  // Donut chart calculations
  const donutData = useMemo(() => {
    if (total === 0) return [];

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    const segments = [
      { key: "pending", value: pending, color: "var(--pending)" },
      { key: "processing", value: processing, color: "var(--processing)" },
      { key: "resolved", value: resolved, color: "var(--resolved)" },
    ];

    return segments
      .filter((s) => s.value > 0)
      .map((segment) => {
        const pct = segment.value / total;
        const dashLength = pct * circumference;
        const gapLength = circumference - dashLength;
        const offset = currentOffset;
        currentOffset += dashLength;

        return {
          ...segment,
          dashArray: `${dashLength} ${gapLength}`,
          dashOffset: -offset,
          pct: Math.round(pct * 100),
        };
      });
  }, [pending, processing, resolved, total]);

  // Bar chart height calculation
  const maxBarValue = Math.max(pending, processing, resolved, 1);

  return (
    <div className="charts-section">
      <h3 className="charts-section__title">Analytics Overview</h3>

      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-card__title">Issues by Status</div>
          <div className="bar-chart">
            <div className="bar-chart__column">
              <div className="bar-chart__value">{pending}</div>
              <div
                className="bar-chart__bar bar-chart__bar--pending"
                style={{
                  height: `${(pending / maxBarValue) * 140}px`,
                  transformOrigin: "bottom",
                  animation: "growUp 0.6s ease forwards",
                }}
              />
              <div className="bar-chart__label">Pending</div>
            </div>

            <div className="bar-chart__column">
              <div className="bar-chart__value">{processing}</div>
              <div
                className="bar-chart__bar bar-chart__bar--processing"
                style={{
                  height: `${(processing / maxBarValue) * 140}px`,
                  transformOrigin: "bottom",
                  animation: "growUp 0.6s ease 0.1s forwards",
                }}
              />
              <div className="bar-chart__label">Processing</div>
            </div>

            <div className="bar-chart__column">
              <div className="bar-chart__value">{resolved}</div>
              <div
                className="bar-chart__bar bar-chart__bar--resolved"
                style={{
                  height: `${(resolved / maxBarValue) * 140}px`,
                  transformOrigin: "bottom",
                  animation: "growUp 0.6s ease 0.2s forwards",
                }}
              />
              <div className="bar-chart__label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-card__title">Distribution</div>
          <div className="donut-chart">
            <div className="donut-chart__svg-wrapper">
              <svg viewBox="0 0 160 160" width="160" height="160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  stroke="var(--border-light)"
                  strokeWidth="20"
                />
                {/* Data segments */}
                {donutData.map((seg) => (
                  <circle
                    key={seg.key}
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    strokeLinecap="butt"
                    transform="rotate(-90 80 80)"
                    style={{
                      transition: "all 0.6s ease",
                    }}
                  />
                ))}
              </svg>
              <div className="donut-chart__center-text">
                <div className="donut-chart__center-value">{total}</div>
                <div className="donut-chart__center-label">Total</div>
              </div>
            </div>

            <div className="donut-chart__legend">
              <div className="donut-chart__legend-item">
                <div className="donut-chart__legend-dot donut-chart__legend-dot--pending" />
                <div className="donut-chart__legend-info">
                  <span className="donut-chart__legend-label">Pending</span>
                  <span className="donut-chart__legend-value">
                    {pending} {total > 0 && `(${Math.round((pending / total) * 100)}%)`}
                  </span>
                </div>
              </div>

              <div className="donut-chart__legend-item">
                <div className="donut-chart__legend-dot donut-chart__legend-dot--processing" />
                <div className="donut-chart__legend-info">
                  <span className="donut-chart__legend-label">Processing</span>
                  <span className="donut-chart__legend-value">
                    {processing} {total > 0 && `(${Math.round((processing / total) * 100)}%)`}
                  </span>
                </div>
              </div>

              <div className="donut-chart__legend-item">
                <div className="donut-chart__legend-dot donut-chart__legend-dot--resolved" />
                <div className="donut-chart__legend-info">
                  <span className="donut-chart__legend-label">Resolved</span>
                  <span className="donut-chart__legend-value">
                    {resolved} {total > 0 && `(${Math.round((resolved / total) * 100)}%)`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
