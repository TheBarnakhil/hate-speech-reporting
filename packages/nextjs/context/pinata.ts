import { IReportData } from "~~/app/_types";
import { useContract } from "~~/context/contract";
require("dotenv").config();



export const PinDataToPinata = async  (data:IReportData, protectedCharacteristics:string) => {
    const {walletAddress} = useContract()

    const body = {
        "pinataMetadata": {
          "name": data.gameName,
          "keyvalues": {
            ...data,
            "status": "Pending",
            "protectedCharacteristics": protectedCharacteristics,
            "isProposal": 0,
            "walletAddress":walletAddress
          }
        },
        "pinataContent": data
      }

      console.log(body,"bb")
  
      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      };
  
      fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', options)
        .then(response => response.json())
        .then(response => console.log(response, "response"))
        .catch(err => console.error(err));
}
