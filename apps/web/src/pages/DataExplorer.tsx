import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight, Database, Download, RefreshCw, Search } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface DatasetInfo {
  id: string;
  name: string;
  total: number;
  columns: string[];
}

interface DatasetCatalog {
  synthetic: boolean;
  datasets: DatasetInfo[];
}

interface DatasetPage {
  dataset: string;
  synthetic: boolean;
  total: number;
  offset: number;
  limit: number;
  records: Array<Record<string, string | number | boolean | null>>;
}

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Data service returned ${response.status}`);
  return response.json() as Promise<T>;
}

function displayValue(value: string | number | boolean | null): string {
  if (value === null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return typeof value === "number" ? value.toLocaleString("en-US", { maximumFractionDigits: 4 }) : value;
}

export default function DataExplorer() {
  const reduce = useReducedMotion();
  const [datasetId, setDatasetId] = useState("facilities");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(50);

  const catalog = useApi<DatasetCatalog>(() => getJson(`${API_BASE}/datasets`), []);
  const page = useApi<DatasetPage>(
    () => getJson(`${API_BASE}/datasets/${datasetId}?q=${encodeURIComponent(debouncedQuery)}&offset=${offset}&limit=${limit}`),
    [datasetId, debouncedQuery, offset, limit],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => setOffset(0), [datasetId, debouncedQuery, limit]);

  const selectedDataset = catalog.data?.datasets.find((dataset) => dataset.id === datasetId);
  const totalPages = page.data ? Math.max(1, Math.ceil(page.data.total / limit)) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="max-w-[1500px] mx-auto p-4 md:p-7 lg:p-9 space-y-6">
      <motion.header
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-teal-700 mb-2">
            <Database size={14} /> HealthRipple data
          </div>
          <h1 className="font-head font-extrabold text-2xl md:text-3xl text-navy-900">Data Explorer</h1>
          <p className="text-sm text-slate-500 mt-2">Browse the source records behind the supply intelligence prototype.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold tracking-wide text-amber-800 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Synthetic data · prototype
        </div>
      </motion.header>

      <div className="rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-relaxed text-sky-900">
        These records are generated for demonstration. They contain no real patient, facility, or supply-system data and are not connected to live healthcare systems.
      </div>

      {catalog.error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <span className="inline-flex items-center gap-2"><AlertCircle size={16} /> Data API unavailable. Start the FastAPI backend to browse the CSV records.</span>
          <button onClick={catalog.reload} className="inline-flex items-center gap-2 text-xs font-bold"><RefreshCw size={13} /> Retry</button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:p-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 xl:flex xl:items-end">
            <div className="min-w-[210px]">
              <label htmlFor="dataset-select" className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Dataset</label>
              <select
                id="dataset-select"
                value={datasetId}
                onChange={(event) => setDatasetId(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {(catalog.data?.datasets ?? []).map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>{dataset.name} · {dataset.total.toLocaleString()} rows</option>
                ))}
                {!catalog.data && <option value="facilities">Facilities</option>}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label htmlFor="page-size" className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Rows per page</label>
              <select id="page-size" value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-600/20">
                {[25, 50, 100, 200].map((size) => <option key={size} value={size}>{size} rows</option>)}
              </select>
            </div>
          </div>

          <div className="flex w-full gap-2 xl:max-w-xl">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-teal-600 focus-within:bg-white">
              <Search size={15} className="shrink-0 text-slate-400" />
              <span className="sr-only">Search all dataset fields</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records or fields" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </label>
            <a href={`${API_BASE}/datasets/${datasetId}/download`} download={`${datasetId}.csv`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-navy-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-navy-800" aria-label={`Download all ${selectedDataset?.name ?? "dataset"} CSV rows`}>
              <Download size={14} /> <span className="hidden sm:inline">Download CSV</span>
            </a>
            <button onClick={page.reload} aria-label="Refresh records" title="Refresh records" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
          <div className="text-sm font-semibold text-navy-900">{selectedDataset?.name ?? "Dataset records"}</div>
          <div className="text-xs text-slate-500" aria-live="polite">
            {page.loading ? "Loading records…" : page.data ? `${page.data.total.toLocaleString()} matching records · ${selectedDataset?.columns.length ?? 0} fields` : "Waiting for data service"}
          </div>
        </div>

        {page.error && <div role="alert" className="mx-4 mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-800 md:mx-5">Could not load this dataset: {page.error}</div>}

        <div className="max-h-[65vh] overflow-auto border-y border-slate-100">
          <table className="w-full min-w-max border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#f5f8f9]">
              <tr>
                {(selectedDataset?.columns ?? []).map((column) => (
                  <th key={column} scope="col" className="whitespace-nowrap px-4 py-3 font-bold text-slate-600 first:pl-5">{column.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {page.data?.records.map((record, index) => (
                <tr key={`${datasetId}-${offset + index}`} className="hover:bg-teal-50/40">
                  {(selectedDataset?.columns ?? []).map((column) => (
                    <td key={column} className="whitespace-nowrap px-4 py-3 text-slate-700 first:pl-5">{displayValue(record[column] ?? null)}</td>
                  ))}
                </tr>
              ))}
              {!page.loading && page.data?.records.length === 0 && (
                <tr><td colSpan={selectedDataset?.columns.length ?? 1} className="px-5 py-12 text-center text-sm text-slate-500">No records match this search.</td></tr>
              )}
              {page.loading && !page.data && (
                <tr><td colSpan={selectedDataset?.columns.length ?? 1} className="px-5 py-12 text-center text-sm text-slate-500">Loading synthetic CSV records…</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
          <p className="text-[11px] text-slate-500">Showing {page.data?.records.length ?? 0} of {page.data?.total.toLocaleString() ?? "—"} matching rows</p>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <button disabled={offset === 0 || page.loading} onClick={() => setOffset(Math.max(0, offset - limit))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40">
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="min-w-20 text-center text-xs font-semibold text-slate-600">Page {currentPage} of {totalPages.toLocaleString()}</span>
            <button disabled={!page.data || offset + limit >= page.data.total || page.loading} onClick={() => setOffset(offset + limit)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-40">
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}