
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Page } from "../../components/UI";

export default function Schemes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSchemes();
  }, []);

  async function loadSchemes() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/hospital-schemes");

      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Page
        title="Hospital Schemes"
        subtitle="Explore healthcare schemes and their official information."
      >
        <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 p-8 text-white">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-white/20" />
            <div className="mt-4 h-8 w-72 rounded bg-white/20" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/20" />
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page
        title="Hospital Schemes"
        subtitle="Explore healthcare schemes and their official information."
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm font-semibold text-red-700">
            Unable to load hospital schemes.
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </Page>
    );
  }

  const schemes = Array.isArray(data) ? data : [];

  const featuredScheme = schemes[0];
  const otherSchemes = schemes.slice(1);

  const getSchemeName = (scheme) =>
    scheme.name ||
    scheme.schemeName ||
    `Scheme #${scheme.id}`;

  const getOfficialUrl = (scheme) =>
    scheme.officialUrl ||
    scheme.official_url ||
    scheme.sourceUrl ||
    scheme.source_url ||
    null;

  const getApplicationUrl = (scheme) =>
    scheme.applicationUrl ||
    scheme.application_url ||
    null;

  return (
    <Page
      title="Hospital Schemes"
      subtitle="Explore healthcare schemes and access their official information."
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Healthcare Support
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Know your healthcare benefits.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Explore available healthcare schemes, understand
            what they provide, and visit official sources for
            complete eligibility and application details.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-2xl font-bold">
                {schemes.length}
              </p>

              <p className="text-xs text-slate-300">
                Available schemes
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-2xl font-bold">
                Official
              </p>

              <p className="text-xs text-slate-300">
                Source links
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {schemes.length === 0 && (
        <section className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            🏥
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No schemes available
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Healthcare scheme information added by the
            administrator will appear here.
          </p>
        </section>
      )}

      {/* =====================================================
          FEATURED SCHEME
      ====================================================== */}

      {featuredScheme && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                Featured
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-800">
                Start here
              </h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1.1fr_1.9fr]">

              {/* Left visual area */}

              <div className="relative flex min-h-[280px] items-end overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 p-7 text-white">
                <div className="absolute right-8 top-8 text-7xl opacity-20">
                  🏥
                </div>

                <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full border-[28px] border-white/10" />

                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                    +
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-100">
                    Healthcare Scheme
                  </p>

                  <h4 className="mt-2 max-w-sm text-2xl font-bold leading-tight">
                    {getSchemeName(featuredScheme)}
                  </h4>
                </div>
              </div>

              {/* Right content */}

              <div className="p-7 sm:p-9">
                <p className="text-sm font-semibold text-slate-400">
                  About this scheme
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {featuredScheme.description ||
                    featuredScheme.details ||
                    "Information about this healthcare scheme is available through the official source."}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">

                  {/* Official Website */}

                  {getOfficialUrl(featuredScheme) ? (
                    <a
                      href={getOfficialUrl(featuredScheme)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Official Website
                      <span>↗</span>
                    </a>
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-400">
                      Official link unavailable
                    </span>
                  )}

                  {/* Find / Apply */}

                  {getApplicationUrl(featuredScheme) && (
                    <a
                      href={getApplicationUrl(featuredScheme)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      Find / Apply
                      <span>↗</span>
                    </a>
                  )}

                  <span className="rounded-xl bg-teal-50 px-4 py-3 text-xs font-semibold text-teal-700">
                    Verified source
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          OTHER SCHEMES
      ====================================================== */}

      {otherSchemes.length > 0 && (
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Explore
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              Other healthcare schemes
            </h3>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {otherSchemes.map((scheme, index) => {
              const officialUrl = getOfficialUrl(scheme);
              const applicationUrl = getApplicationUrl(scheme);

              return (
                <article
                  key={scheme.id}
                  className={`group flex flex-col gap-5 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
                    index !== otherSchemes.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 transition group-hover:bg-teal-50 group-hover:text-teal-700">
                      {String(index + 2).padStart(2, "0")}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800">
                        {getSchemeName(scheme)}
                      </h4>

                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                        {scheme.description ||
                          scheme.details ||
                          "Healthcare scheme information is available through the official source."}
                      </p>

                      {scheme.category && (
                        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          {scheme.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Links for THIS scheme */}

                  <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">

                    {officialUrl ? (
                      <a
                        href={officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        Official Website
                        <span>↗</span>
                      </a>
                    ) : (
                      <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-400">
                        Official link unavailable
                      </span>
                    )}

                    {applicationUrl && (
                      <a
                        href={applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                      >
                        Find / Apply
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          INFORMATION NOTE
      ====================================================== */}

      <div className="mt-8 flex gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="text-xl"></div>

        <div>
          <p className="text-sm font-bold text-amber-900">
            Check the official source
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Eligibility, benefits, documents, application
            procedures and scheme rules can change. Use the
            official website or government scheme-finder link
            provided for the latest information.
          </p>
        </div>
      </div>
    </Page>
  );
}
