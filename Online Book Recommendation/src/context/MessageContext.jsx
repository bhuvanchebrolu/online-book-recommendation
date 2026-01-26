import React,{ Children, createContext, useCallback, useContext, useState } from "react";


const MessageContext=createContext();

export const MessageProvider=({children})=>{

    const [msg,setMsg]=useState({text:"",type:"info"});

    const showMessage=useCallback((text,type="info",duration=4000)=>{
        setMsg({text,type});

        if(duration>0){
            setTimeout(()=>setMsg({text:"",type:"info"}),duration);
        }
    },[]);

    const hideMessage=useCallback(()=>setMsg({text:"",type:"info"}),[]);

    return (
        <MessageContext.Provider value={{msg,showMessage,hideMessage}}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage=()=>useContext(MessageContext);