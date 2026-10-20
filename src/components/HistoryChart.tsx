// A small line chart drawn as SVG, no library. Takes dated values and shows the last
// `days` of them; the first and last values and the low and high are labelled so
// the chart reads without hovering.
import { longDate } from "@/lib/rates";

export function HistoryChart({
  points,
  days = 30,
  label,
  format = (value) => value.toLocaleString("en-PK"),
}: {
  points: { date: string; value: number }[];
  days?: number;
  label: string;
  format?: (value: number) => string;
}) {
  const rows = points.filter((point) => Number.isFinite(point.value)).slice(-days);
  if (rows.length < 2) {
    return (
      <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">
        The {label} chart fills in as the daily figures build up. {rows.length === 1 ? `First figure: ${longDate(rows[0].date)}.` : ""}
      </p>
    );
  }
  const width = 640;
  const height = 220;
  const pad = { top: 16, right: 16, bottom: 28, left: 16 };
  const values = rows.map((row) => row.value);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || Math.abs(high) * 0.01 || 1;
  const x = (index: number) => pad.left + (index / (rows.length - 1)) * (width - pad.left - pad.right);
  const y = (value: number) => pad.top + (1 - (value - low) / span) * (height - pad.top - pad.bottom);
  const path = rows.map((row, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${y(row.value).toFixed(1)}`).join(" ");
  const first = rows[0];
  const last = rows[rows.length - 1];
  const lowIndex = values.indexOf(low);
  const highIndex = values.indexOf(high);

  return (
    <figure className="rounded-xl border border-line bg-surface p-3 sm:p-4">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}, ${longDate(first.date)} to ${longDate(last.date)}`} className="w-full">
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(rows.length - 1)} cy={y(last.value)} r="4" fill="var(--accent)" />
        <text x={x(highIndex)} y={y(high) - 6} textAnchor={highIndex > rows.length / 2 ? "end" : "start"} fontSize="12" fill="var(--muted)">
          high {format(high)}
        </text>
        <text x={x(lowIndex)} y={y(low) + 16} textAnchor={lowIndex > rows.length / 2 ? "end" : "start"} fontSize="12" fill="var(--muted)">
          low {format(low)}
        </text>
        <text x={pad.left} y={height - 8} fontSize="12" fill="var(--muted)">
          {longDate(first.date)}
        </text>
        <text x={width - pad.right} y={height - 8} textAnchor="end" fontSize="12" fill="var(--muted)">
          {longDate(last.date)}
        </text>
      </svg>
      <figcaption className="mt-2 text-sm text-muted">
        {label}: {format(first.value)} on {longDate(first.date)} to {format(last.value)} on {longDate(last.date)}.
      </figcaption>
    </figure>
  );
}
