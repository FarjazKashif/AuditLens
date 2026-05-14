// Sends analyst questions through Express to the AuditLens RAG query endpoint.
import { useState } from "react";
import { Search } from "lucide-react";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function QueryPanel() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setError("Enter a question before analyzing evidence.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/auditlens/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Query failed");
      }

      setResult(data);
    } catch (queryError) {
      setError(queryError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2">
        <Search size={18} className="text-cyan" />
        <h3 className="font-semibold">Analyst question</h3>
      </div>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-28 w-full rounded border border-white/10 bg-[#0e0e10] p-3 font-mono text-sm outline-none focus:border-cyan/50"
          placeholder="Example: Which account triggered suspicious activity and what evidence supports escalation?"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded border border-cyan/40 px-4 font-mono text-xs uppercase text-cyanSoft hover:bg-cyan/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {result && (
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="font-mono text-xs uppercase text-cyan">Answer</h4>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{result.answer}</p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase text-cyan">Sources</h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 font-mono text-xs text-muted">
              {(result.sources || []).map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
