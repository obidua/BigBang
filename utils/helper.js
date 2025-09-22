import { useBalance } from "wagmi";

export const formatAddress = (addr) => {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}


