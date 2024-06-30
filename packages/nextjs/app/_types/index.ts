export type IReport = {
    walletAddress: string,
    status: string,
    protectedCharacteristics : Record<string,number> | null
} & IReportData

export type IReportData = {
    hateSpeech: string,
    ignReporter: string,
    ignOffender: string,
    gameName: string,
}