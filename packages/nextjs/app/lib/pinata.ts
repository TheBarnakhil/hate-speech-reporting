import toast from "react-hot-toast";
import { IReportFields } from "../report/page";

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

    const responseData = await response.json(); // Parse the JSON body
    const cid = responseData.IpfsHash; // Assuming IpfsHash contains the CID
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

}

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
