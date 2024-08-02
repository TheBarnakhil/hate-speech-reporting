export type IReport = {
    hateSpeech: string,
    ignReporter: string,
    ignOffender: string,
    walletAddress: string,
    gameName: string,
    status: string,
    isHateSpeech: boolean,
    protectedCharacteristics : Array<string> | null
}