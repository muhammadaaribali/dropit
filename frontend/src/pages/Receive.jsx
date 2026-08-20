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
    <div className="receive-container">

        <div className="receive-header">

            <div className="receive-icon-large">
                ↓
            </div>

            <div>
                <h1>Receive files</h1>

                <p>
                    Enter the 6-digit code to retrieve your file
                </p>
            </div>

        </div>


        <div className="receive-form">

            <label>
                Share code
            </label>

            <div className="code-input-wrapper">

                <input
                    type="text"
                    placeholder="000000"
                    value={code}
                    maxLength="6"
                    onChange={(event) => {
                        setCode(event.target.value);
                        setError("");
                    }}
                />

            </div>


            <button
                className="retrieve-button"
                onClick={handleReceive}
                disabled={loading}
            >

                {loading ? (
                    <>
                        <span className="loading-dot"></span>
                        Retrieving...
                    </>
                ) : (
                    <>
                        Retrieve file
                        <span>→</span>
                    </>
                )}

            </button>


            {error && (
                <div className="error-message">
                    <span>!</span>
                    {error}
                </div>
            )}

        </div>


        {share && (

            <div className="share-result">

                <div className="result-top">

                    <div className="file-icon">
                        {share.type === "Link" ? "↗" : "□"}
                    </div>

                    <div>

                        <span className="result-label">
                            SHARE FOUND
                        </span>

                        <h2>
                            {share.originalName}
                        </h2>

                    </div>

                </div>


                <div className="result-info">

                    <div>
                        <span>Type</span>
                        <strong>{share.type}</strong>
                    </div>

                </div>


                {share.type === "Link" ? (

                    <a
                        className="result-button"
                        href={share.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open link
                        <span>↗</span>
                    </a>

                ) : (

                    <a
                        className="result-button"
                        href={share.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                    >
                        Download file
                        <span>↓</span>
                    </a>

                )}

            </div>

        )}

    </div>
);
}

export default Receive;

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