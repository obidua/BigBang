import { create } from "zustand";
import Web3, { errors } from "web3";
import Swal from "sweetalert2";

import BigBang_ABI from "./Contract/BigBangABI.json"
import { formatDate } from "../utils/helper";

const Contract = {
  BIGBANG_CONTRACT: "0x564D9d678658849Dc283EF3AF7927258582d8a86",
  PRICE_CONTRACT: "0xE509c98137AFA4798888D8ecd0597d6D7f1c0ece",
};

// ROOT_SPONSOR:"0x45e6BC3F392c4862945e8Bc6Fe1100F67F2915Ee"
// 0xf35aE49755308Fc97CF61Fb28f8Aec15CAE84147

const INFURA_URL = "https://blockchain.ramestta.com";
const web3 = new Web3(INFURA_URL);





// Some Default data
const DEFAULT_DATA = {
  balance: "",
  address: "",
  userId: "",
  isRegistered: false,
  registrationTime: "",
  sponsor: "",
  totalEarningsUSD: 0.00,
  totalEarningsRAMA: 0.00,
  repurchaseCount: 0,
  currentOrbitX: 0,
  orbitCount: 0,
  totalUsers: 0
};


const DEFAULT_ACtiv = {
  requiredRama: '',
  requiredUSD: ''
}


export const useStore = create((set, get) => ({

  data: { ...DEFAULT_DATA },
  requiredAct: { ...DEFAULT_ACtiv },
  lastFetchedAt: null,
  _reqId: 0, // prevents racing updates


  setField: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  merge: (patch = {}) => set((s) => ({ ...s, ...patch })),

  userIdByAdd: async (userAddress) => {
    try {
      if (!userAddress) {
        throw new Error("Invalid userAddress");
      }

      const contract = new web3.eth.Contract(BigBang_ABI, Contract["BIGBANG_CONTRACT"]);
      const userId = await contract.methods.getUserId(userAddress).call();

      return userId;
    } catch (error) {
      console.log(error);
    }
  },

  getReqRamaActiv: async () => {
    try {
      const contract = new web3.eth.Contract(BigBang_ABI, Contract["BIGBANG_CONTRACT"]);
      const RequiredRama = await contract.methods.getJoinAmountInRAMA().call();


      const required = { RequiredRama: parseFloat(RequiredRama) / 1e18, RequiredUSD: parseFloat(RequiredRama) / 1e18 }
      set({
        requiredAct: required,
        lastFetchedAt: new Date().toISOString(),
      });

      return required;
    } catch (error) {
      console.log(error)
    }
  },

  RegisterUser: async (userAddress, value) => {
    console.log('RegisterUser args:', userAddress, value);
    try {
      if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
        throw new Error('Invalid user address');
      }

      const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);

      // --- Resolve sponsor: address or numeric ID
      let sponsorAddress;
      if (typeof value === 'string' && value.startsWith('0x')) {
        sponsorAddress = value;
      } else {
        const userId = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(userId) || userId <= 0) throw new Error('Invalid sponsor id');
        sponsorAddress = await contract.methods.getUserById(userId).call();
      }

      if (!sponsorAddress || !sponsorAddress.startsWith('0x')) {
        throw new Error('Resolved sponsor address is invalid');
      }
      const ZERO = '0x0000000000000000000000000000000000000000';
      if (sponsorAddress.toLowerCase() === ZERO.toLowerCase()) {
        throw new Error('Sponsor not found (zero address)');
      }

      // --- Funds & join amount
      const balanceWei = await web3.eth.getBalance(userAddress);
      const joinAmountRama = await contract.methods.getJoinAmountInRAMA().call(); // string wei

      if (BigInt(balanceWei) < BigInt(joinAmountRama)) {
        Swal.fire({
          title: 'Insufficient Balance',
          text: 'Recharge your account with RAMA to join BigBang',
          icon: 'warning'
        });
        throw new Error('Insufficient native RAMA balance');
      }

      // --- Calldata (payable: amount is NOT a function arg)

      const data = contract.methods.registerAndActivate(sponsorAddress).encodeABI();

      // --- Gas
      const gasPrice = await web3.eth.getGasPrice(); // string wei
      let gasLimit;

      try {
        gasLimit = await web3.eth.estimateGas({
          from: userAddress,
          to: Contract['BIGBANG_CONTRACT'],
          value: joinAmountRama,
          data,
        });
      } catch (err) {
        console.error('Gas estimation failed:', err);
        Swal.fire({ icon: 'error', title: 'Gas estimation failed', text: 'Check contract & inputs.' });
        throw err;
      }

      // Some wallets/clients prefer hex strings
      const toHex = web3.utils.toHex;
      const tx = {
        from: userAddress,
        to: Contract['BIGBANG_CONTRACT'],
        data,
        value: toHex(joinAmountRama),
        gas: toHex(gasLimit),
        gasPrice: toHex(gasPrice),
      };

      return tx;
    } catch (error) {
      console.error('RegisterUser error:', error);
      Swal.fire({ icon: 'error', title: 'Registration error', text: error?.message || 'Unknown error' });
      throw error;
    }
  },



  checkUserById: async (userId) => {
    try {
      if (!userId) {
        throw new Error("Invalid userId");
      }

      const contract = new web3.eth.Contract(BigBang_ABI, Contract["BIGBANG_CONTRACT"]);

      const userAddress = await contract.methods.getUserById(userId).call();

      return userAddress;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error checking user: ${error.message}`);
      throw error;
    }
  },


  getUserDetails: async (userAddress) => {
    // bump a request id to ignore stale results in the store update
    const reqId = (get()._reqId || 0) + 1;
    set({ _reqId: reqId });

    try {
      if (!userAddress || typeof userAddress !== 'string' || !userAddress.startsWith('0x')) {
        throw new Error('Invalid userAddress');
      }

      const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);

      // Always get balance
      const balanceWei = await web3.eth.getBalance(userAddress);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

      // Quick membership check first (saves RPCs if false)
      const isRegistered = await contract.methods.isRegistered(userAddress).call();

      // If NOT registered, return a minimal, stable shape and (optionally) update store
      if (!isRegistered) {
        const result = {
          balance: Number(balanceEth).toFixed(4),
          address: userAddress,
          userId: 0,
          isRegistered: false,
          registrationTime: null,
          sponsor: null,
          totalEarningsUSD: 0,
          totalEarningsRAMA: 0,
          repurchaseCount: 0,
          currentOrbitX: 0,
          orbitCount: 0,
          totalUsers: 0,
        };

        if (get()._reqId === reqId) {
          set({ data: result, lastFetchedAt: new Date().toISOString() });
        }
        return result;
      }

      // Registered: fetch details in parallel
      const [
        userId,
        regTime,
        upline,
        ramaEarnedUSD,
        currentOrbitX,
        orbitCount,
        repurchaseCount,
      ] = await Promise.all([
        contract.methods.getUserId(userAddress).call(),
        contract.methods.registrationTime(userAddress).call(),
        contract.methods.upline(userAddress).call(),
        contract.methods.getTotalEarnings(userAddress).call(),
        contract.methods.getCurrentOrbitX(userAddress).call(),
        contract.methods.getOrbitCount(userAddress).call(),
        contract.methods.getRepurchaseCount(userAddress).call(),
      ]);

      // regTime from many contracts is in SECONDS — convert to ms if your formatDate expects ms
      const regTimeMs = Number(regTime) < 1e12 ? Number(regTime) * 1000 : Number(regTime);

      const userData = {
        balance: Number(balanceEth).toFixed(4),
        address: userAddress,
        userId: Number(userId),
        isRegistered: true,
        registrationTime: formatDate(regTimeMs),
        sponsor: upline,
        // adjust divisor to your contract's decimals
        totalEarningsUSD: Number(ramaEarnedUSD) / 1e6,
        totalEarningsRAMA: 0.0,
        repurchaseCount: Number(repurchaseCount),
        currentOrbitX: Number(currentOrbitX),
        orbitCount: Number(orbitCount),
        totalUsers: 0.0,
      };

      if (get()._reqId === reqId) {
        set({ data: userData, lastFetchedAt: new Date().toISOString() });
      }

      return userData;
    } catch (error) {
      // DO NOT return false — bubble the error so callers can handle it
      if (get()._reqId === reqId) {
        console.error('getUserDetails error:', error);
      }
      throw error;
    }
  },


  isUserRegisterd: async (userAddress) => {
    try {
      if (!userId) {
        throw new Error("Invalid userId");
      }

      const contract = new web3.eth.Contract(BigBang_ABI, Contract["BIGBANG_CONTRACT"]);

      const isUserExist = await contract.methods.isRegistered(userAddress).call();

      return isUserExist;
    } catch (error) {
      console.error("Error:", error);
      alert(`Error checking user: ${error.message}`);
      throw error;
    }
  },

  getPayHistory: async (userAddress, orbitId = 0) => {
    if (!userAddress || orbitId === undefined || orbitId === null) return;

    try {
      const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);

      const totalOrbit = await contract.methods.getOrbitCount(userAddress).call();
      const lastIndex = Number(totalOrbit) - 1;

      // orbitId is 0-based; valid range: [0, lastIndex]
      if (Number(orbitId) < 0 || Number(orbitId) > lastIndex) {
        await Swal.fire('Invalid Orbit', `Orbit ${orbitId} does not exist for this user.`, 'error');
        return;
      }

      const orbitIncome = await contract.methods
        .getFullOrbitIncome(userAddress, Number(orbitId))
        .call();

      return { totalOrbit: Number(totalOrbit), orbitIncome };
    } catch (error) {
      console.error('getPayHistory error:', error);
      await Swal.fire('Error', error?.message || 'Failed to fetch orbit income.', 'error');
      throw error;
    }
  },


  getTeamAtLevel: async (userAddress, level) => {
    try {
      const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);

      // Fetch team data for a single level
      const team = await contract.methods.getTeamAtLevel(userAddress, level).call();

      // Return an empty array if no members
      if (!team || (Array.isArray(team) && team.length === 0)) {
        return [];
      }

      // Add level key to each member for context
      return team.map((m) => ({ ...m, level }));
    } catch (error) {
      console.error('getTeamAtLevel error:', error);
      throw error;
    }
  },

  getAllLevelIncome: async (userAddress) => {
    try {
      const contract = new web3.eth.Contract(BigBang_ABI, Contract['BIGBANG_CONTRACT']);
      const results = [];
      const MAX_LEVEL = 9;

      let stop = false;

      for (let level = 1; level <= MAX_LEVEL; level++) {
        if (stop) {
          // Fill remaining levels with zero income
          results.push({ Level: level, TotalEarned: "0" });
          continue;
        }

        const team = await contract.methods.getTeamAtLevel(userAddress, level).call();

        // If the contract returns an empty array, stop and pad remaining levels
        if (!team || (Array.isArray(team) && team.length === 0)) {
          results.push({ Level: level, TotalEarned: "0" });
          stop = true;
          // Push zero for remaining levels in next loop iterations
          continue;
        }

        // Sum earned income for this level
        const totalIncome = team.reduce((sum, member) => {
          const income = parseFloat(member.incomeEarned || 0)/1e6;
          return sum + (isNaN(income) ? 0 : income);
        }, 0);

        results.push({
          Level: level,
          TotalEarned: totalIncome.toString()
        });
      }

      return results;
    } catch (error) {
      console.error('getAllLevelIncome error:', error);
      throw error;
    }
  },




}));