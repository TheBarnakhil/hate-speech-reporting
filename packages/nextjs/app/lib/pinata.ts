"use client";

import { IReportFields } from "../report/page";
import toast from "react-hot-toast";


export const SaveDataToPinata = async (data: IReportFields, walletAddress: string) => {
  const body = {
    pinataMetadata: {
      name: data.gameName,
      keyvalues: {
        ...data,
        status: "Pending",
        characteristics: "",
        isProposal: 0,
        walletAddress: walletAddress,
      },
    },
    pinataContent: {
      reportData: data,
      walletAddress: walletAddress,
    },
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    const cid = responseData.IpfsHash;
    return cid;
  } catch (err: any) {
    console.error(err);
  }
};

export const getReportsFromPinata = async () => {
  const options = { method: "GET", headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}` } };

  try {
    const response = await fetch("https://api.pinata.cloud/data/pinList", options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      responseData = await response;
    }

    return responseData;
  } catch (err: any) {
    console.error(err);
  }
};

export const UpdateDataOnPinata = async (
  protectedCharacteristics: string,
  cid: string,
  data: any,
  walletAddress: string,
) => {
  try {
    const reports = await getReportsFromPinata();

    const report = reports.rows.find((report: any) => report.ipfs_pin_hash === cid);

    const body = {
      ipfsPinHash: cid,
      name: data.gameName,
      keyvalues: {
        ...report.metadata.keyvalues,
        status: "Classified",
        characteristics: protectedCharacteristics,
      },
    };

    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch("https://api.pinata.cloud/pinning/hashMetadata", options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.indexOf("application/json") !== -1) {
      responseData = await response.json();
    } else {
      responseData = await response;
    }

    toast.success("Latest report has been classified successfully, please refresh for latest data");
    return responseData;
  } catch (err: any) {
    console.error(err);
    toast.error("Error classifing report, please try again");
  }
};

export const fetchDataForCid = async (cid: string) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
  };

  try {
    const response = await fetch(`https://api.pinata.cloud/cid/${cid}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`Data for CID ${cid}:`, responseData);
    return responseData;
  } catch (err: any) {
    console.error(`Error fetching data for CID ${cid}:`, err);
  }
};

export const createGroup = async (groupName: string) => {
  const body = JSON.stringify({
    name: groupName,
  });

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: body,
  };

  try {
    const response = await fetch("https://api.pinata.cloud/groups", options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Group created successfully:", responseData);
    return responseData;
  } catch (err: any) {
    console.error("Error creating group:", err);
  }
};

export const fetchGroupDetails = async (groupId: string) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
  };

  try {
    const response = await fetch(`https://api.pinata.cloud/groups/${groupId}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Group details:", responseData);
    return responseData;
  } catch (err: any) {
    console.error("Error fetching group details:", err);
  }
};

export const fetchAllGroups = async (issuerId: string) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
  };

  try {
    const response = await fetch(`https://api.pinata.cloud/groups?nameContains=${issuerId}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("All groups:", responseData);
    return responseData;
  } catch (err: any) {
    console.error("Error fetching all groups:", err);
  }
};

export const updateGroupCIDs = async (groupId: string, cids: string[]) => {
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Use your JWT token here
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cids }),
  };

  try {
    const response = await fetch(`https://api.pinata.cloud/groups/${groupId}/cids`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Update response:", responseData);
    return responseData;
  } catch (err: any) {
    console.error("Error updating group CIDs:", err);
  }
};

export const fetchDataByGroupId = async (groupId: string ) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
  };

  try {
    const response = await fetch(`https://api.pinata.cloud/data/pinList?groupId=${groupId}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("User's Report:", data);
    return data;
  } catch (err) {
    console.error('Error fetching files:', err);
  }
};


