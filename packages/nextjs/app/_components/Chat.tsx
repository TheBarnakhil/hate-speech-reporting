'use client';

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Home } from "~~/components/chat"

type IChatRecord = {
    message: string;
    role: "bot" | "user";
    link?: string;
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
        reset,
        formState: { errors },
    } = useForm<IUserField>();

    const timeout = () => {
        setTimeout(() => {
            setChat((prevState) => [...prevState, {message:"It seems like you have faced hate speech about religion. Please report your experience!", role:"bot" , link:"/report"}])
        }, 3000)
    }
    
    const onSubmit : SubmitHandler<IUserField> = async (data: IUserField) => {
        console.log(data.input , "value")
        reset();
        setChat((prevState) => [...prevState, {message:data.input, role:"user"}])
        // try{
        //     const response = await fetch("https://hs-server.onrender.com/classify-hs",{
        //         method: "post",
        //         body: JSON.stringify({message:data.input}),
        //         headers: {
        //             "Content-Type": "application/json",
        //         }
        //     })
        //     console.log(response, response.json())
        // }catch(err){
        //     console.log(err)
        // }
        // setChat((prevState) => [...prevState, {message:"It seems like you have faced hate speech about religion. Please report your experience!", role:"user"}])
        timeout();
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