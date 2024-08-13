//This file is not being used


import { useState } from "react"

type IChatRecord = {
    message: string;
    role: "bot" | "user";
};

export const Report: React.FC = () => {
    const [chat, setChat] = useState<Array<IChatRecord>>([]);

    const handleOptionSelect = (option: string) => {
        setChat([...chat, { message: option, role: "bot" }]);
    };
    return (
        <div className="h-full w-full">
            {
                chat.length % 2 === 0 && (
                    <div tabIndex={0} className="collapse collapse-open collapse-arrow border-base-300 bg-base-200 border w-2/3">
                        <div className="collapse-title text-xl font-medium">Please select one of the following</div>
                        <div className="collapse-content w-full">
                            <div className="border border-base-300 w-full p-5" onClick={() => handleOptionSelect("")}>
                                What is the hate speech you've faced?
                            </div>
                            <div className="border border-base-300 w-full p-5">
                                What is the name of the game?
                            </div>
                            <div className="border border-base-300 w-full p-5">
                                What is the name of the offender?
                            </div>
                            <div className="border border-base-300 w-full p-5">
                                What is your in game name?
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}