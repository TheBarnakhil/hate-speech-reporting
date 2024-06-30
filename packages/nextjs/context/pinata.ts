import { IReportData } from "~~/app/_types";
import { useContract } from "~~/context/contract";

require("dotenv").config();

export const PinDataToPinata = async (data: IReportData, protectedCharacteristics: string) => {
  console.log(data, "data", protectedCharacteristics);

  const { walletAddress } = useContract();

  const body = {
    pinataMetadata: {
      name: data.gameName,
      keyvalues: {
        ...data,
        status: "Pending",
        protectedCharacteristics: protectedCharacteristics,
        isProposal: 0,
        walletAddress: walletAddress,
      },
    },
    pinataContent: data,
  };

  const options = {
    method: "POST",
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5M2U2ZGU3Ni1mNDg1LTQyZWUtYTkzNS04MTFhMzI3Y2E0ZWUiLCJlbWFpbCI6ImFraGlsLm5lZDgzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmNjIxOTc5MTRlNmExNmE5YzlkYyIsInNjb3BlZEtleVNlY3JldCI6IjdkOTk2NmVlZmVmODI5ZDUyYWU0YzcwMWQxNjRlNTAzMDI5MjFjMjIwZjNiODNlNTcwNjU4YjJiMzQyYzFiMjgiLCJleHAiOjE3NTEyNzM2OTh9.j8h4CwzCCKI-efV6oStr1C1mx3nYu038e9pE55Do6t4`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options)
    .then(response => response.json())
    .then(response => console.log(response, "response"))
    .catch(err => console.error(err));
};

export const UpdatePinataData = async (protectedCharacteristics: string, content:any) => {
  console.log(protectedCharacteristics, content,"check...")
  const { walletAddress } = useContract();
  const {cid, ...data} = content

  const body = {
    ipfsPinHash:"changed..",
    name: data.gameName,
    keyvalues: {
      ...data,
      status: "Pending",
      protectedCharacteristics,
      isProposal: 0,
      walletAddress: walletAddress,
    },
  };

  const options = {
    method: "PUT",
    headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5M2U2ZGU3Ni1mNDg1LTQyZWUtYTkzNS04MTFhMzI3Y2E0ZWUiLCJlbWFpbCI6ImFraGlsLm5lZDgzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmNjIxOTc5MTRlNmExNmE5YzlkYyIsInNjb3BlZEtleVNlY3JldCI6IjdkOTk2NmVlZmVmODI5ZDUyYWU0YzcwMWQxNjRlNTAzMDI5MjFjMjIwZjNiODNlNTcwNjU4YjJiMzQyYzFiMjgiLCJleHAiOjE3NTEyNzM2OTh9.j8h4CwzCCKI-efV6oStr1C1mx3nYu038e9pE55Do6t4`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  fetch("https://api.pinata.cloud/pinning/hashMetadata", options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
};
