import {useState} from "react";
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
        <div>
            <h1>Send</h1>
            <div>
                <button
                    onClick={()=>{
                        setMode("file");
                        setError("");
                        setCode("");
                    }}
                >
                    File
                </button>

                <button
                    onClick={()=>{
                        setMode("link");
                        setError("");
                        setCode("");
                    }}
                >
                    Link
                </button>
            </div>

            {mode === "file" && (
                <div>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <p>
                            Selected: {file.name}
                        </p>
                    )}
                </div>
            )}

            {/* conditional rendring */}
            {mode === "link" && (
                <div>
                    <input
                        type="url"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(event)=> setUrl(event.target.value)}
                    />
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Generating...":"Generate Code"}
            </button>

            {code && (
                <div>
                    <h2>Your Code</h2>
                    <p>{code}</p>

                    <button
                        onClick={handleCopyCode}
                    >
                        {copied ? "✓ Copied!" : "Copy Code"}
                    </button>
                </div>
            )}

            {error && (
                <p>{error}</p>
            )}

        </div>
    );

}

export default Send;