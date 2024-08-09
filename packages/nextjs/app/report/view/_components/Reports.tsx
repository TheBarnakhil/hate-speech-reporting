"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { ReportCard } from "~~/app/_components";
import { IReport } from "~~/app/_types/index.ts";
import { useContract } from "~~/context/contract";
import externalContracts from "~~/contracts/externalContract";
import { useAccount } from "wagmi";
import { fetchDataByGroupId , fetchAllGroups, createGroup} from "~~/app/lib/pinata";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";


type Props = {
  tab: number;
  setReport: (report: IReport) => void;
};

export const Reports = ({ tab, setReport }: Props) => {
  const { runId, setReportData, setIsRunFinished, groupId, setGroupId, setUserId } = useContract();
  const chainID = 696969;
  const { address: contractAddress, abi } = externalContracts[chainID].HateSpeechAgent;
  const {address} = useAccount()

  const [metadata, setMetadata] = useState<{ reports: Array<IReport> }>({ reports: [] });


  const { data: isFinished, refetch: getRunStatus } = useReadContract({
    address: contractAddress,
    functionName: "isRunFinished",
    abi: abi,
    args: [runId as bigint],
    chainId: chainID,
    query: {
      enabled: false,
      retry: true,
    },
  });

  const { data: getMessageHistoryContent, refetch: getMessage } = useReadContract({
    address: contractAddress,
    functionName: "getMessageHistoryContents",
    abi: abi,
    args: [runId as bigint],
    chainId: chainID,
    query: {
      enabled: false,
      retry: true,
    },
  });

 

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (runId !== undefined) {
      intervalId = setInterval(() => {
        getRunStatus();
        getMessage();
        if (getMessageHistoryContent && isFinished) {
          setReportData(getMessageHistoryContent[2]);
          setIsRunFinished(isFinished);
        }
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [runId, isFinished, getMessageHistoryContent]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const issuerId = address && `HS-${address}`;
     
        if (issuerId) {
          const issuerProfile = await fetchAllGroups(issuerId);

          if (issuerProfile.length > 0) {
            setUserId(issuerProfile[0].user_id);
            setGroupId(issuerProfile[0].id);
             

          } else {
            const groupResponse = await createGroup(issuerId);
            setUserId(groupResponse.user_id);
            setGroupId(groupResponse.id);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile or creating group:", error);
      }
    };

    fetchUserProfile();
  
  }, [address]);

  useEffect(() => {
    // if(runId && isFinished) {

    const options = { method: "GET", headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}` } };
    // TODO: Display use's report 
    // fetchDataByGroupId(groupId as string)
    fetch("https://api.pinata.cloud/data/pinList", options)
      .then(response => response.json())
      .then(response => {
        let preparedResponse = response?.rows?.map((res: any) => {
          let keyvalues = res.metadata.keyvalues;
          if (keyvalues) {
            let protectedCharacteristics = null;
            let isProposal = false;
            let isHateSpeech = false;
            if (keyvalues.characteristics) {
              //read the JSON stringified array if required
              const characteristics = keyvalues.characteristics
                .split(",")
                .map((val: string) => val.replaceAll('"', ""));
              const classification: string = characteristics[0];
              if (classification && !classification.includes("not")) {
                isHateSpeech = true;
              }
              protectedCharacteristics = characteristics
                .slice(1)
                .map((val: string, index: number) => (index % 2 === 0 ? val : null))
                .filter((val: string) => val);
            }
            if (keyvalues.isProposal === 1) {
              isProposal = true;
            }

            return {
              ...keyvalues,
              protectedCharacteristics,
              isProposal,
              isHateSpeech,
            };
          }
        });
        
        setMetadata({
          reports: [...preparedResponse],
        });
      })
      .catch(err => console.error(err, "Error in fetching"));

    // }
  }, [runId, isFinished]);

  return (
    <div className="grid grid-cols-4 md:grid-cols-3 xs:gird-cols-2 gap-10 mb-20 mr-20 mt-20 ml-20 grid-rows-2">
      {tab === 1 &&
        metadata.reports.map((report, index) => (
          <ReportCard {...report} setReport={setReport} key={index + report.gameName} />
        ))}
      {tab === 2 &&
        metadata.reports
          .filter(report => report.ignReporter === "foo-player")
          .map((report, index) => <ReportCard {...report} setReport={setReport} key={index + report.gameName} />)}
      {tab === 3 &&
        metadata.reports
          .filter(report => report.ignOffender === "foo-player")
          .map((report, index) => <ReportCard {...report} setReport={setReport} key={index + report.gameName} />)}
    </div>
  );
};
