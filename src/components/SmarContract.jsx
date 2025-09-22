import { Code, Copy, ExternalLink } from 'lucide-react'
import React from 'react'
import { copyToClipboard } from '../../utils/helper'

const SmarContract = () => {
    return (
        <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
            <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Smart Contract Information
            </h3>

            <div className="space-y-3 sm:space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">BigBang Contract</label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                        <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">0x564D9d678658849Dc283EF3AF7927258582d8a86</code>
                        <button
                            onClick={() => copyToClipboard('0x1234567890123456789012345678901234567890')}
                            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0">
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>

              
            </div>

            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-950/30 border border-yellow-500/50 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-300">
                    <strong>Note:</strong> These are placeholder addresses for demonstration.
                    Replace with actual deployed contract addresses.
                </p>
            </div>
        </div>
    )
}

export default SmarContract