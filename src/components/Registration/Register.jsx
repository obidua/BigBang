import { Circle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { WalletButton } from '../WalletConnection/WalletButton'
import { useStore } from '../../../store/useStore'
import { RegistrationModal } from "./RegistrationModal"

const Register = () => {

    const getReqRamaActiv = useStore((s) => s.getReqRamaActiv);

    const [showRegistration, setShowRegistration] = useState(false)
    const [ActivationAmt, setActivationAmt] = useState();
    

    useEffect(() => {
        const getRequiredRama = async () => {
            try {
                const res = await getReqRamaActiv();
                console.log(res)
                setActivationAmt(res)
            } catch (error) {
                console.log(error);
            }
        }
        getRequiredRama();
    }, [])



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full glow-blue relative z-10">
                <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-blue animate-pulse">
                        <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 neon-text">Welcome to BigBang</h1>
                    <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                        Join the orbit ecosystem and start earning through our multi-level system
                    </p>

                    <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left glow-blue">
                        <h3 className="font-medium text-cyan-300 mb-2">Registration Details</h3>
                        <div className="text-sm text-blue-200 space-y-1">
                            <div className="flex justify-between">
                                <span>Sponsor:</span>
                                <span className="font-medium">Address or ID</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Join Amount:</span>
                                <span className="font-medium">{ActivationAmt?.RequiredRama} RAMA</span>
                            </div>
                            <div className="flex justify-between">
                                <span>USD Value:</span>
                                <span className="font-medium">${ActivationAmt?.RequiredUSD}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowRegistration(true)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base glow-blue"
                    >
                        Enter Sponser ID/Address
                    </button>

                    <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
                        <WalletButton />
                    </div>
                </div>
            </div>

            <RegistrationModal
                isOpen={showRegistration}
                onClose={() => setShowRegistration(false)}
                joinAmountRAMA={ActivationAmt?.RequiredRama}
                joinAmountUSD={ActivationAmt?.RequiredUSD}
            />
        </div>
    )
}

export default Register