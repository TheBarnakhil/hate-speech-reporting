'use client';

import { useEffect, useState } from 'react';
import { ReportCard } from '~~/app/_components';
import { metadata as JSONMetadata } from '~~/app/_metadata/metadata.ts'
import { IReport } from '~~/app/_types/index.ts';

const pinataSDK = require('@pinata/sdk');

type Props = {
    tab: number;
    setReport: (report: IReport) => void;
}


export const Reports = ({ tab, setReport }: Props) => {

    const pinata = new pinataSDK(process.env.NEXT_PUBLIC_API_Key, process.env.NEXT_PUBLIC_API_Secret);

    const [metadata, setMetadata] = useState<{reports : Array<IReport>}>(JSONMetadata)

    useEffect(() => {
        const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}` } };

        fetch('https://api.pinata.cloud/data/pinList', options)
            .then(response => response.json())
            .then(response => {
                console.log(response, "response")
                let preparedResponse = response?.rows?.map((res: any) => {
                    let keyvalues = res.metadata.keyvalues;
                    if(keyvalues){
                        console.log
                        let protectedCharacteristics = null;
                        let isProposal = false;
                        if(keyvalues.protectedCharacteristics !== ""){
                            //read the JSON stringified array if required
                        }
                        if(keyvalues.isProposal === 1){
                            isProposal = true
                        }

                        return{
                            ...keyvalues,
                            protectedCharacteristics,
                            isProposal
                        }
                    }
                })
                console.log(preparedResponse, "preparedResponse")
            })
            .catch(err => console.error(err));

        // setMetadata(prevState => {
        //     return {
        //         reports : [
        //             ...prevState.reports
        //         ]
        //     }
        // })
    }, [])

    return (
        <div className="grid grid-cols-4 md:grid-cols-3 xs:gird-cols-2 gap-10 mb-20 mr-20 mt-20 ml-20 grid-rows-2">
            {
                tab === 1 && metadata.reports.map((report, index) => (
                    <ReportCard {...report} setReport={setReport} key={index+report.gameName}/>
                ))
            }
            {
                tab === 2 && metadata.reports.filter(report => report.ignReporter === "foo-player").map((report, index) => (
                    <ReportCard {...report} setReport={setReport} key={index+report.gameName}/>
                ))
            }
            {
                tab === 3 && metadata.reports.filter(report => report.ignOffender === "foo-player").map((report, index) => (
                    <ReportCard {...report} setReport={setReport} key={index+report.gameName}/>
                ))
            }
        </div>
    )
}