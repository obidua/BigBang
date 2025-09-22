import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, Loader, } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { RegistrationModal } from "../Registration/RegistrationModal";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const getRefFromUrl = () => {
  try {
    // 1) /?ref=123
    const q = new URLSearchParams(window.location.search);
    const refQ = q.get("ref");
    if (refQ) return refQ;

    // 2) /ref/123   or   /ref=123
    const path = window.location.pathname; // e.g. /ref/123  or /ref=123
    // try /ref/123
    const m1 = path.match(/\/ref\/([^/]+)/i);
    if (m1?.[1]) return decodeURIComponent(m1[1]);
    // try /ref=123
    const m2 = path.match(/\/ref=([^/]+)/i);
    if (m2?.[1]) return decodeURIComponent(m2[1]);

    return null;
  } catch {
    return null;
  }
};

const isHexAddress = (v) => /^0x[a-fA-F0-9]{40}$/.test(v);
const isNumeric = (v) => /^\d+$/.test(v);

const shorten = (addr, left = 6, right = 4) =>
  addr && addr.length > left + right
    ? `${addr.slice(0, left)}...${addr.slice(-right)}`
    : addr || "";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-100 font-medium text-right ml-2">{value}</span>
  </div>
);

const Referral = () => {

  const getUserDetails = useStore((s) => s.getUserDetails);
  const { address, isConnected } = useAppKitAccount();


  useEffect(() => {
    const checkRegistration = async () => {
      if (!isConnected || !address) return;

      try {
        const details = await getUserDetails(address);
        if (details?.isRegistered) {
          // ✅ Remove ?ref=... or /ref=... from the URL
          const url = new URL(window.location.href);

          // remove query param if exists
          url.searchParams.delete("ref");

          // or strip /ref/xxx pattern from pathname
          if (/\/ref(=|\/)/i.test(url.pathname)) {
            url.pathname = "/";
          }

          // push clean url without ref
          window.history.replaceState({}, document.title, url.toString());

          // reload page to show normal app flow
          window.location.reload();
        }
      } catch (e) {
        console.error("Registration check failed:", e);
      } finally {
        setChecked(true);
      }
    };

    checkRegistration();
  }, [isConnected, address, getUserDetails]);




  // ---- store hooks (all optional-safe)
  const getReqRamaActiv = useStore((s) => s.getReqRamaActiv)


  const { requiredAct } = useStore((s) => s.requiredAct)




  const userIdByAdd = useStore((s) => s.userIdByAdd);
  const checkUserById = useStore((s) => s.checkUserById);

  // ---- local state
  const [refInput, setRefInput] = useState("");
  const [validating, setValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [resolvedId, setResolvedId] = useState(null);
  const [resolvedAddr, setResolvedAddr] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const [joinAmountRAMA, setJoinAmountRAMA] = useState(requiredAct?.requiredRama);
  const [joinAmountUSD, setJoinAmountUSD] = useState(requiredAct?.requiredUSD);

  const [openModal, setOpenModal] = useState(false);


  const appKit = useAppKit();

  // ---- read ref from URL on mount
  useEffect(() => {
    const r = getRefFromUrl();
    if (r) setRefInput(r);
  }, []);

  // ---- try to fetch join amounts if helpers exist
  useEffect(() => {
    (async () => {
      const res = await getReqRamaActiv()
      console.log(res)
      setJoinAmountRAMA(res?.RequiredRama)
      setJoinAmountUSD(res?.RequiredUSD)
    })()
  }, []);

  // ---- (re)validate whenever refInput changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErrorMsg(null);
      setIsValid(false);
      setResolvedAddr(null);
      setResolvedId(null);

      const s = (refInput || "").trim();
      if (!s) return;

      setValidating(true);
      try {
        // address path
        if (isHexAddress(s)) {
          const addr = s.toLowerCase();
          if (addr === ZERO_ADDRESS) {
            setErrorMsg("Invalid sponsor address.");
            return;
          }
          const uid = typeof userIdByAdd === "function" ? await userIdByAdd(addr) : null;
          const ok = uid && Number(uid) > 0;
          if (!cancelled) {
            setResolvedAddr(addr);
            setResolvedId(ok ? Number(uid) : null);
            setIsValid(!!ok);
            if (!ok) setErrorMsg("This address is not a registered sponsor.");
          }
          return;
        }

        // numeric ID path
        if (isNumeric(s)) {
          const id = Number(s);
          if (id <= 0) {
            setErrorMsg("Invalid sponsor ID.");
            return;
          }
          const addr =
            typeof checkUserById === "function" ? await checkUserById(id) : null;
          const ok = addr && addr.toLowerCase() !== ZERO_ADDRESS.toLowerCase();
          if (!cancelled) {
            setResolvedId(id);
            setResolvedAddr(ok ? String(addr) : null);
            setIsValid(!!ok);
            if (!ok) setErrorMsg("Sponsor not found for this ID.");
          }
          return;
        }

        // fallback
        setErrorMsg("Enter a 0x address or a numeric user ID.");
      } catch (e) {
        if (!cancelled) {
          setErrorMsg(e?.message || "Validation failed.");
        }
      } finally {
        if (!cancelled) setValidating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refInput, userIdByAdd, checkUserById]);

  const defaultSponsorForModal = useMemo(() => {
    // Pass through exactly what the user typed (so your modal handles either ID or address),
    // but prefer the normalized/validated version when available.
    if (resolvedAddr && isNumeric(refInput)) return String(resolvedId ?? refInput); // keep ID if user provided ID
    if (resolvedAddr) return resolvedAddr;
    return refInput || "";
  }, [refInput, resolvedAddr, resolvedId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-xl glass-card rounded-2xl p-5 sm:p-7 shadow-lg glow-blue">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Join via Referral
        </h1>
        <p className="text-gray-400 mb-5">
          Enter a sponsor <span className="text-gray-300">User ID</span> or{" "}
          <span className="text-gray-300">wallet address</span>, or use the value in your link.
        </p>

        {/* Input */}
        <div className="space-y-3 mb-5">
          <label className="block text-sm font-medium text-gray-300">Sponsor (ID or 0x…)</label>
          <input
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="e.g., 1234 or 0xabc…"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-100 placeholder-gray-400"
          />

          {/* Validation state */}
          {validating && (
            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <Loader className="w-4 h-4 animate-spin" /> Validating sponsor…
            </div>
          )}
          {!validating && errorMsg && (
            <div className="flex items-start gap-2 text-amber-300 text-sm">

              <span>{errorMsg}</span>
            </div>
          )}
          {!validating && isValid && (
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <Check className="w-4 h-4" />
              <span>Sponsor verified</span>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-4 mb-5">
          <h3 className="font-medium text-cyan-300 mb-3">Sponsor Summary</h3>
          <div className="space-y-2">
            <InfoRow label="Sponsor ID" value={resolvedId ?? "—"} />
            <InfoRow label="Sponsor Address" value={resolvedAddr ? shorten(resolvedAddr, 8, 10) : "—"} />
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-300 mb-3">Registration Fee</h3>
          <div className="space-y-2">
            <InfoRow label="Amount (RAMA)" value={joinAmountRAMA ?? "—"} />
            <InfoRow label="USD Value" value={joinAmountUSD != null ? `$${joinAmountUSD}` : "—"} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800/60 transition-colors text-gray-200"
          >
            Back to App
          </button>
          <button
            onClick={isConnected ? () => setOpenModal(true) : () => appKit.open()}
            // disabled={!isValid || !isConnected}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isConnected ? "Connect wallet to continue" : ""}
          >
            {isConnected ? "Register Now" : "Connect Wallet First"}
          </button>
        </div>
      </div>

      {openModal && (
        <RegistrationModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          joinAmountRAMA={joinAmountRAMA ?? undefined}
          joinAmountUSD={joinAmountUSD ?? undefined}
          defaultSponsor={defaultSponsorForModal}
        />
      )}
    </main>
  );
};

export default Referral;
