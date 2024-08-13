'use client';

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Home, Report } from "~~/components/chat"

type IChatRecord = {
    message: string;
    role: "bot" | "user";
};

type IUserField = {
    input : string;
}

export const Chat: React.FC = () => {
    //can move this into the home component if there will always be a single response and no more chat
    const [chat, setChat] = useState<Array<IChatRecord>>([]);
    const [inputDisabled, setInputDisabled] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<IUserField>();

    const onSubmit : SubmitHandler<IUserField> = (data: IUserField) => {
        console.log(data.input , "value")
        setChat((prevState) => [...prevState, {message:data.input, role:"user"}])
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-[95%] w-full">
                    <Home chat={chat} setChat={setChat} setInputDisabled={setInputDisabled}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex content-end flex-wrap m-auto h-[5%] w-full">
                <input disabled={inputDisabled} type="text" placeholder="Type here" className="input input-bordered w-full rounded-xl" {...register("input", { required: true, maxLength: 150, minLength: 10 })}/>
            </form>
        </div>
    )
}