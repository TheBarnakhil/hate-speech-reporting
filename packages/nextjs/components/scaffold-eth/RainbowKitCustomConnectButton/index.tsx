"use client";

// @refresh reset
// import { Balance } from "../Balance";
// import { AddressInfoDropdown } from "./AddressInfoDropdown";
// import { AddressQRCodeModal } from "./AddressQRCodeModal";
// import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useContract } from "~~/context/contract";
import { useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();
  const { connectToWallet } = useContract();

  return (
    <div>
      <button className="btn btn-primary btn-sm" onClick={connectToWallet} type="button">
        Connect Wallet
      </button>
    </div>
  );
};
