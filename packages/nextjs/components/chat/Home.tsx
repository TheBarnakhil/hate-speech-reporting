import { Dispatch, SetStateAction, useState } from "react";
import { HomePrompts } from "."
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type IChatRecord = {
    message: string;
    role: "bot" | "user";
    link?: string;
};

type props = {
    chat: Array<IChatRecord>;
    setChat: Dispatch<SetStateAction<IChatRecord[]>>;
    setInputDisabled: Dispatch<SetStateAction<boolean>>;
};

export const Home = ({ chat, setChat, setInputDisabled }: props) => {

    const [disablePropmts, setDisablePrompts] = useState<boolean>(false)

    const onOptionSelect = (option: number, message: string) => {
        setChat((prevState) => [...prevState, {
            message: message,
            role: "user"
        }])
        if (option === 4) {
            setInputDisabled(false);
            setChat((prevState) => [
                ...prevState,
                {
                    message: "Please input the hatespeech you've faced",
                    role: "bot"
                }
            ])
            return;
        }
        setInputDisabled(true);
    }

    return (
        <div className="h-full w-full">
            <div className={`flex flex-grow flex-col w-full h-${chat.length !== 0 ? "[90%]" : "4/6"} max-h-5/6 overflow-y-scroll`}>
                {
                    chat.length !== 0 && (
                        <button className="h-6 w-6" onClick={() => setChat([])}>
                            <ArrowLeftIcon />
                        </button>
                    )
                }
                <div className="chat chat-start">
                    <div className="chat-bubble text-md">
                        <p>
                            Hey! I'm sorry you've experienced hate speech online. You can report it here and we'll get straight on classifying it for you.
                            <br />
                            <br />
                            But before doing the report, would you like to try something that might make you feel better?
                        </p>
                    </div>
                </div>
                {/* <div className="chat chat-end">
                    <div className="chat-bubble"></div>
                </div> */}
                {
                    chat.map((chatRecord, index) => (
                        <div key={index} className={`chat chat-${chatRecord.role === "user" ? "end" : "start"}`}>
                            <div className="chat-bubble text-md">
                                <p>{chatRecord.message}</p>
                                {
                                    chatRecord?.link && (
                                        <Link href={chatRecord.link}>Click here to report</Link>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                chat.length === 0 && (
                    <div className="h-1/6 w-full">
                        <HomePrompts onOptionSelect={onOptionSelect} />
                    </div>
                )
            }
        </div>
    )
}