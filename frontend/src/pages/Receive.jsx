import {useState} from "react";
import api from "../services/api";

function Receive(){

    const [code, setCode]= useState("");
    const [share, setShare]= useState(null);
    const [loading, setLoading]= useState(false);
    const [error, setError]= useState("");

    const handleReceive= async()=>{

        if(!code.trim()){
            setError("Please enter a code");
            return;
        }

        setLoading(true);
        setError("");
        setShare(null);

        try{
            const response= await api.get(`/share/${code}`);

            setShare(response.data);
        }
        catch(error){
            console.error(error);
            setError("Share not found or expired");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Receive</h1>

            <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(event)=> setCode(event.target.value)}

            />

            <button
                onClick={handleReceive}
                disabled={loading}
            >
                {loading ? "Retrieving..." : "Retrive"}
            </button>

            {error && (
                <p>{error}</p>
            )}

            {share && (
                <div>
                    <h2>Share Found</h2>

                    <p>
                        Name: {share.originalName}
                    </p>
                    <p>
                        Type: {share.type}
                    </p>

                    //ternary operator
                    {share.type === "Link" ?(
                        <a
                            href={share.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Open Link
                        </a>
                    ) : (

                        <a
                            href={share.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            download
                        >
                            Download
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

/*
You type 1
   ↓
onChange runs
   ↓
event.target.value = "1"
   ↓
setCode("1")
   ↓
React updates code state
   ↓
Receive component re-renders
   ↓
code is now "1"
*/