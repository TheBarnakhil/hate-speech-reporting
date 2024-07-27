"use client";

// Add this line at the top
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UpdateDataOnPinata } from "~~/app/lib/pinata";

interface ContractContextProps {
  setRunId: React.Dispatch<React.SetStateAction<bigint | undefined>>;
  runId: bigint | undefined;
  setWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  hsExamplesDict: {
    exampleInput: string;
    exampleOutput: (string | number)[];
  }[];
  HS_definition: string;
  setReportData: React.Dispatch<any>;
  setIsRunFinished: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setCid: React.Dispatch<React.SetStateAction<string>>;
}

const ContractContext = createContext<ContractContextProps | undefined>(undefined);

interface ContractProviderProps {
  children: ReactNode;
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [cid, setCid] = useState<string>("");
  const [reportData, setReportData] = useState<any>({});
  const [isRunFinished, setIsRunFinished] = useState<boolean>();
  const [runId, setRunId] = useState<bigint>();
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (isRunFinished && reportData && cid) {

      UpdateDataOnPinata(reportData, cid, reportData, walletAddress);

      setRunId(undefined);
      setIsRunFinished(false);
      setCid("");
    }
  }, [isRunFinished, cid]);

  const protected_characteristics = [
    "race",
    "religion",
    "ethnic origin",
    "national origin",
    "sex",
    "disability",
    "sexual orientation",
    "gender identity",
    "neurotype",
  ];

  const HS_definition =
    '"Hate speech" is speech that attacks a person or group on the basis of attributes such as: ' +
    protected_characteristics.join(", ") +
    ".";

  const hsExamplesDict = [
    {
      exampleInput: "You lost! Succer!",
      exampleOutput: ["not hate speech", "", 1],
    },
    {
      exampleInput: "you hateful sack of flesh",
      exampleOutput: ["not hate speech", "", 1],
    },
    {
      exampleInput: "“Pick one, kidd,” one nudged. Then, “Choose FA GO TT.”",
      exampleOutput: ["hate speech", "sexual orientation", 1],
    },
    {
      exampleInput: "Aspie my ass. too slow to remember, so dont waste our time playing",
      exampleOutput: ["hate speech", "neurotype", 1],
    },
    {
      exampleInput:
        '“Kept being called a "Jew" for no reason.”; "A player on the other team was named Hitler.” “[One player] threatened to get antisemitic if I didnt talk. [They] talked about Jew tunnels.”',
      exampleOutput: ["hate speech", "race", 1],
    },
  ];

  let hsExamplesStr = "\n";
  hsExamplesDict.forEach(example => {
    hsExamplesStr += "\n" + JSON.stringify(example).slice(1, -1);
  });

  return (
    <ContractContext.Provider
      value={{
        setRunId,
        runId,
        setWalletAddress,
        HS_definition,
        hsExamplesDict,
        setReportData,
        setIsRunFinished,
        setCid,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = (): ContractContextProps => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
