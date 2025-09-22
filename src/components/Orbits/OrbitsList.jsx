import React, { useState, useEffect } from 'react';
import { Circle, CheckCircle, Clock, Filter } from 'lucide-react';
import { useStore } from '../../../store/useStore';

export const OrbitsList = () => {
  const [loadingList, setLoadingList] = useState(true);
  const [filterOrbit, setFilterOrbit] = useState(null);

  // Keep orbits as objects so UI can rely on orbit.orbitId
  const [orbits, setOrbits] = useState([]); // [{ orbitId, completedX, xSlots }]
  const [openedOrbit, setOpenedOrbit] = useState(null);

  // cache: { [orbitId]: { loading: boolean, rows: [] } }
  const [incomeByOrbit, setIncomeByOrbit] = useState({});

  const data = useStore((s) => s.data);                // must contain address
  const getPayHistory = useStore((s) => s.getPayHistory);




  const completedSlot = data?.currentOrbitX;
  const lastOrbit  = data?.currentOrbitX < 10?orbits.length-1:orbits.length;

  console.log(completedSlot,lastOrbit)

  // Initial load: determine total orbits (using orbit 0 call) and seed cache
  useEffect(() => {
    let alive = true;

    const init = async () => {
      if (!data?.address || !getPayHistory) return;
      try {
        // call orbit 0 to get total orbit count and first income page
        const res = await getPayHistory(data.address, 0);
        const total = Number(res?.totalOrbit || 0);

        // build [{orbitId}] list; completedX/xSlots unknown here -> default 0/[]
        const list = Array.from({ length: total }, (_, i) => ({
          orbitId: i,
          completedX: 0,
          xSlots: []
        }));

        if (!alive) return;

        setOrbits(list);

        // seed income cache for orbit 0
        setIncomeByOrbit({
          0: {
            loading: false,
            rows: Array.isArray(res?.orbitIncome) ? res.orbitIncome : []
          }
        });
      } catch (err) {
        console.error('Init orbits failed:', err);
      } finally {
        if (alive) setLoadingList(false);
      }
    };

    init();
    return () => { alive = false; };
  }, [data?.address, getPayHistory]);

  // Load income for a specific orbit on demand (keeps cache per-orbit)
  const loadIncome = async (orbitId) => {
    if (!getPayHistory || !data?.address) return;

    // if already loaded or currently loading, skip
    const cached = incomeByOrbit[orbitId];
    if (cached?.loading || (cached && Array.isArray(cached.rows))) return;

    setIncomeByOrbit((prev) => ({
      ...prev,
      [orbitId]: { ...(prev[orbitId] || {}), loading: true }
    }));

    try {
      const res = await getPayHistory(data.address, orbitId);
      const rows = Array.isArray(res?.orbitIncome) ? res.orbitIncome : [];

      setIncomeByOrbit((prev) => ({
        ...prev,
        [orbitId]: { loading: false, rows }
      }));
    } catch (e) {
      setIncomeByOrbit((prev) => ({
        ...prev,
        [orbitId]: { loading: false, rows: [] }
      }));
    }
  };

  const filteredOrbits =
    filterOrbit !== null ? orbits.filter((o) => o.orbitId === filterOrbit) : orbits;

  if (loadingList) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse glass-card rounded-xl p-6 shadow-lg">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter */}
      <div className="glass-card rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">Filter by Orbit:</span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setFilterOrbit(null)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filterOrbit === null
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
              }`}
            >
              All Orbits
            </button>
            {orbits.map((orbit) => (
              <button
                key={orbit.orbitId}
                onClick={() => setFilterOrbit(orbit.orbitId)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filterOrbit === orbit.orbitId
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                Orbit #{orbit.orbitId + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {filteredOrbits.length === 0 ? (
        <div className="glass-card rounded-xl p-6 sm:p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 glow-blue">
          <Circle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-500" />
          <p className="text-gray-400">No orbits found for the selected filter.</p>
        </div>
      ) : (
        filteredOrbits.map((orbit) => {
          // Placeholder progress (you can fill with real values when available)
          const completedX = Number(orbit.completedX || 0);
          const progress = (orbit.orbitId<lastOrbit?10:completedSlot / 10) * 100;
          const isComplete = orbit?.orbitId<lastOrbit?1:0;

          const orbitId = orbit.orbitId;
          const incomeState = incomeByOrbit[orbitId];
          const isOpen = openedOrbit === orbitId;

          return (
            <div
              key={orbitId}
              className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-100">
                  Orbit #{orbitId + 1}
                </h3>
                <div
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    isComplete
                      ? 'bg-green-950/50 text-emerald-300 border border-emerald-500/50'
                      : 'bg-blue-950/50 text-cyan-300 border border-cyan-500/50'
                  }`}
                >
                  {isComplete ? 'Complete' : 'Active'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3 sm:mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-400">Progress</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-100">
                    {orbitId<lastOrbit?10:completedSlot}/10
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 border border-gray-600">
                  <div
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      isComplete
                        ? 'bg-green-600 border-emerald-400 text-emerald-400 glow-green'
                        : progress > 0
                        ? ' bg-green-600 text-cyan-400 animate-pulse glow-blue'
                        : 'bg-gray-800/50 border-gray-600 text-gray-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Slots (visual only) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {Array.from({ length: 10 }, (_, i) => {
                  const done = i < (orbitId<lastOrbit?10:completedSlot);
                  const current = i === (orbitId<lastOrbit?10:completedSlot) && !isComplete;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-md sm:rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        done
                          ? 'bg-green-50 border-green-500 text-green-600'
                          : current
                          ? 'bg-blue-50 border-blue-500 text-blue-600 animate-pulse'
                          : 'bg-gray-50 border-gray-300 text-gray-400'
                      }`}
                    >
                      {done ? (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      ) : current ? (
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      ) : (
                        <Circle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Toggle income drawer */}
              <button
                onClick={async () => {
                  const willOpen = openedOrbit !== orbitId;
                  setOpenedOrbit(willOpen ? orbitId : null);
                  if (willOpen) {
                    await loadIncome(orbitId);
                  }
                }}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-gray-600 hover:bg-gray-800/50 text-gray-200"
              >
                {openedOrbit === orbitId ? 'Hide Income' : 'View Income'}
              </button>

              {/* Income drawer */}
              {isOpen && (
                <div className="mt-4 bg-blue-950/20 border border-blue-500/30 rounded-lg p-3">
                  {incomeState?.loading ? (
                    <div className="animate-pulse space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-5 bg-blue-900/40 rounded" />
                      ))}
                    </div>
                  ) : (incomeState?.rows?.length || 0) === 0 ? (
                    <p className="text-xs sm:text-sm text-blue-200">No income records.</p>
                  ) : (
                    <div className="space-y-2">
                      {incomeState.rows.map((r, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-xs sm:text-sm text-blue-100 bg-blue-950/30 border border-blue-500/30 rounded-md px-2 py-1.5"
                        >
                          <span className="font-medium">
                            {r.coin}: {(Number(r.amount) / 1e18).toFixed(4)} RAMA
                          </span>
                          <span className="opacity-80">
                            ${(Number(r.usd) / 1e6).toFixed(2)} · L{Number(r.level)}
                          </span>
                          <span className="opacity-60">
                            {new Date(Number(r.timestamp) * 1000).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
