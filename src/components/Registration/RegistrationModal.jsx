import React, { useEffect, useRef, useState } from 'react';
import { X, Loader, Check } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useTransaction } from '../../../config/register';
import { useWaitForTransactionReceipt } from 'wagmi';
import Swal from 'sweetalert2';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const RegistrationModal = ({
  isOpen,
  onClose,
  joinAmountRAMA,
  joinAmountUSD,
  defaultSponsor
}) => {
  // Early return BEFORE any hooks is OK
  if (!isOpen) return null;

  // ---- State (fixed order)
  const [sponsor, setSponsor] = useState(defaultSponsor || '');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isValidSponsor, setIsValidSponsor] = useState(false);
  const [step, setStep] = useState(1);
  const [trxData, setTrxData] = useState(undefined);
  const [errorMsg, setErrorMsg] = useState(null);
  const [SponserData, setSponserData] = useState();

  // ---- Store / Wallet
  const { address, isConnected } = useAppKitAccount();
  const RegisterUser = useStore((s) => s.RegisterUser);
  const getUserDetails = useStore((s) => s.getUserDetails);
  const userIdByAdd = useStore((s) => s.userIdByAdd);
  const checkUserById = useStore((s) => s.checkUserById);

  // ---- Tx hook (always called, pass undefined when no tx yet)
  const { handleSendTx, hash } = useTransaction(trxData !== null && trxData);

  // ---- Send tx when we set trxData
  useEffect(() => {
    if (trxData) {
      try {
        handleSendTx(trxData);
      } catch (error) {
        alert("somthing went Wrong");
      }
    }
  }, [trxData]);

  useEffect(() => {
    if (hash) {


    }
  }, [hash]);

  // ---- Wait for receipt (guarded until hash exists)
  const { data: receipt, isLoading: waiting, isSuccess, isError } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });



  const handled = useRef(false);
  useEffect(() => {
    // need a tx hash, and avoid re-running once handled
    if (!hash || handled.current) return;

    // normalize status: can be 1/0 or "success"/"reverted"
    const ok = receipt?.status === 1 || receipt?.status === 'success';
    const bad = receipt?.status === 0 || receipt?.status === 'reverted';

    (async () => {
      try {
        if (isSuccess && ok) {
          handled.current = true;                // prevent duplicates
          await Swal.fire({
            icon: 'success',
            title: 'Transaction success',
            text: 'Transaction Completed Successfully',
          });
          setStep?.(3);
        } else if (isError || bad) {
          handled.current = true;
          await Swal.fire({
            icon: 'error',
            title: 'Transaction Failed',
            text: 'Your transaction failed or was reverted.',
          });
        }
      } catch (e) {
        console.error('post-tx flow error:', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, isSuccess, isError, receipt, address, getUserDetails]);




  // ---- Reset validation when input changes
  useEffect(() => {
    setIsValidSponsor(false);
  }, [sponsor]);

  // ---- Validate sponsor (address or numeric ID)
  const validateSponsor = async () => {
    setErrorMsg(null)
    const s = (sponsor || '').trim();
    if (!s) {
      setErrorMsg("Invalid Sponser")
      return;
    }
    try {
      setValidating(true);

      // Address input
      if (s.startsWith('0x')) {
        const addr = s.toLowerCase();
        if (addr === ZERO_ADDRESS.toLowerCase()) {
          setIsValidSponsor(false);
          setErrorMsg("Invalid Sponsor");
          return;
        }

        const uid = await userIdByAdd(addr); // expect a userId or 0/undefined if not found
        if (!uid || Number(uid) === 0) {
          setIsValidSponsor(false);
          setErrorMsg("Invalid Sponsor");
          return;
        }
        setSponserData(`userID :${uid}`)
        setIsValidSponsor(true);
        return;
      }

      // Numeric ID input
      if (/^\d+$/.test(s)) {
        const sponsorId = Number(s);
        if (sponsorId <= 0) {
          setIsValidSponsor(false);
          setErrorMsg("Invalid ID");
          return;
        }
        const sponsorAddr = await checkUserById(sponsorId); // expect address or ZERO_ADDRESS
        const ok = sponsorAddr && sponsorAddr.toLowerCase() !== ZERO_ADDRESS.toLowerCase();
        setSponserData(`Address :${sponsorAddr.slice(0, 12) + "....." + sponsorAddr.slice(-8)}`)
        setIsValidSponsor(Boolean(ok));
        if (!ok) {
          setErrorMsg("Sponsor Not Found");
        }
        return;
      }

      // Fallback: invalid format
      setIsValidSponsor(false);
      Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Enter a 0x address or a numeric user ID.' });
    } catch (error) {
      console.error('validateSponsor error:', error);
      setIsValidSponsor(false);
      Swal.fire({ icon: 'error', title: 'Validation Error', text: error?.message || 'Validation failed.' });
    } finally {
      setValidating(false);
    }
  };

  // ---- Register action
  const handleRegistration = async () => {
    if (!isConnected || !address) {
      Swal.fire({ icon: 'info', title: 'Connect Wallet', text: 'Please connect your wallet first.' });
      return;
    }
    if (!isValidSponsor) {
      Swal.fire({ icon: 'error', title: 'Sponsor Required', text: 'Please validate your sponsor first.' });
      return;
    }

    try {
      setLoading(true);

      const response = await RegisterUser(address, sponsor);
      await setTrxData(response); // triggers send
    } catch (error) {
      console.error('RegisterUser error:', error);
      Swal.fire({ icon: 'error', title: 'Unexpected Error', text: error?.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  // ---- Render (no hooks inside)
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6 pr-8">
              Join BigBang
            </h2>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Address or ID</label>
                <input
                  type="text"
                  disabled={isValidSponsor}
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="0x... or User ID (e.g., 1234)"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base text-gray-100 placeholder-gray-400"
                />
              </div>
              {
                <div>
                  <p>{SponserData}</p>
                </div>
              }

              {errorMsg && (
                <div>
                  <p>{errorMsg}</p>
                </div>
              )}
              <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                <h3 className="font-medium text-cyan-300 mb-2">Registration Fee</h3>
                <div className="text-sm text-blue-200">
                  <div className="flex justify-between">
                    <span>Amount (RAMA):</span>
                    <span className="font-medium">{joinAmountRAMA ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USD Value:</span>
                    <span className="font-medium">${joinAmountUSD ?? '—'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={onClose} className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-600 rounded-lg hover:bg-gray-800/50 transition-colors text-sm sm:text-base text-gray-300">
                Cancel
              </button>
              <button
                onClick={isValidSponsor ? () => setStep(2) : validateSponsor}
                disabled={validating || !sponsor.trim()}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {validating ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" /> Validating…
                  </span>
                ) : isValidSponsor ? 'Continue' : 'Validate Sponsor'}
              </button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6 pr-8">
              Confirm Registration
            </h2>
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sponsor:</span>
                  <span className="font-medium text-gray-100 break-all text-right ml-2">
                    {sponsor.length > 10 ? `${sponsor.slice(0, 6)}...${sponsor.slice(-4)}` : sponsor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className="font-medium text-gray-100">{joinAmountRAMA ?? '—'} RAMA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USD Value:</span>
                  <span className="font-medium text-gray-100">${joinAmountUSD ?? '—'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setStep(1)}
                disabled={loading || waiting}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-600 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50 text-sm sm:text-base text-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleRegistration}
                disabled={loading || waiting}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading || waiting ? (<><Loader className="w-4 h-4 animate-spin" /> Registering…</>) : 'Register & Pay'}
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-950/50 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
              Registration Successful!
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4">Welcome to BigBang! Your orbit journey begins now.</p>
            <button onClick={async () => {
              await getUserDetails(address)
            }} className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800/50 text-gray-200">
              Close
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-xl max-w-md w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {step < 3 && (
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        )}
        {renderStep()}
      </div>
    </div>
  );
};
