import { Link } from "react-router-dom";

function BrandMark({ light = false, to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 no-underline">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          light ? "bg-brand text-void" : "bg-brand text-void"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </span>
      <span className={`font-display text-[17px] font-semibold tracking-[0.04em] ${light ? "text-brand" : "text-ink"}`}>
        Billsphere
      </span>
    </Link>
  );
}

export default BrandMark;
