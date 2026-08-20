import {useState, useEffect} from "react";
import api from "../services/api";

function Send(){
    const [file, setFile]= useState(null);
    const [code, setCode]= useState("");
    const [loading, setLoading]=useState(false);
    const [error, setError]= useState("");
    const [mode,setMode]= useState("file");
    const [url, setUrl]= useState("");
    const [copied, setCopied]=useState(false);


    const handleFileChange= (event)=> {

        const selectedFile = event.target.files[0];

        if(!selectedFile){
            return;
        }

        setFile(selectedFile);
        setCode("");
        setError("");
    };

    const handleCopyCode= async()=>{
        try{
            await navigator.clipboard.writeText(code);
            setCopied(true);

            setTimeout(()=>{
                setCopied(false);
            },2000);
        }catch(error){
            console.error(error);
        }
    };

    const handleUpload = async()=>{

        if(mode === "file"&& !file){
            setError("Please select a file");
            return;
        }

        if(mode === "link"&& !url.trim()){
            setError("Please enter a URL");
            return;
        }

        setLoading(true);
        setError("");
        setCode("");

        try{
            if(mode === "file"){

                const formData= new FormData();

                formData.append("file",file);

                const response = await api.post("/share/upload",formData);

                setCode(response.data.code);
            } else{
                const response = await api.post("/share/share-link",
                    {
                        url:url
                    }
                );

                setCode(response.data.code);
            }
           
        } catch(error){
            console.error(error);
            setError("Upload failed");
        } finally {
            setLoading(false);
        }
    };

   return (
        <div className="send-container">

            {/* HEADER */}

            <div className="send-header">

                <div className="send-icon-large">
                    ↑
                </div>

                <div>

                    <h1>Send files</h1>

                    <p>
                        Upload a file or share a link with someone
                    </p>

                </div>

            </div>


            {/* MODE SWITCH */}

            <div className="mode-switch">

                <button
                    className={mode === "file" ? "mode-button active" : "mode-button"}
                    onClick={() => {
                        setMode("file");
                        setError("");
                        setCode("");
                    }}
                >
                    <span>□</span>
                    File
                </button>


                <button
                    className={mode === "link" ? "mode-button active" : "mode-button"}
                    onClick={() => {
                        setMode("link");
                        setError("");
                        setCode("");
                    }}
                >
                    <span>↗</span>
                    Link
                </button>

            </div>


            {/* MAIN FORM */}

            <div className="send-form">

                {mode === "file" && (

                    <div className="file-upload-area">

                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="file-input"
                            className="file-drop-zone"
                        >

                            <div className="upload-icon">
                                ↑
                            </div>

                            <h3>
                                {file
                                    ? file.name
                                    : "Choose a file"}
                            </h3>

                            <p>
                                {file
                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                    : "Click here to browse your files"}
                            </p>

                            <span className="browse-text">
                                Browse files
                            </span>

                        </label>

                    </div>

                )}


                {mode === "link" && (

                    <div className="link-area">

                        <label>
                            Share URL
                        </label>

                        <div className="url-input-wrapper">

                            <span className="url-icon">
                                ↗
                            </span>

                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(event) =>
                                    setUrl(event.target.value)
                                }
                            />

                        </div>

                    </div>

                )}


                {/* GENERATE BUTTON */}

                <button
                    className="generate-button"
                    onClick={handleUpload}
                    disabled={loading}
                >

                    {loading ? (
                        <>
                            <span className="loading-dot"></span>
                            Generating...
                        </>
                    ) : (
                        <>
                            Generate code
                            <span>→</span>
                        </>
                    )}

                </button>


                {/* ERROR */}

                {error && (

                    <div className="send-error">

                        <span>!</span>

                        {error}

                    </div>

                )}

            </div>


            {/* GENERATED CODE */}

            {code && (

                <div className="code-result">

                    <div className="code-result-header">

                        <div>

                            <span className="code-label">
                                SHARE READY
                            </span>

                            <h2>
                                Give this code to the receiver
                            </h2>

                        </div>

                        <div className="success-icon">
                            ✓
                        </div>

                    </div>


                    <div className="generated-code">
                        {code}
                    </div>


                    <button
                        className="copy-button"
                        onClick={handleCopyCode}
                    >

                        {copied ? (
                            <>
                                ✓ Copied
                            </>
                        ) : (
                            <>
                                Copy code
                                <span>⧉</span>
                            </>
                        )}

                    </button>

                </div>

            )}

        </div>
    );

}

export default Send;