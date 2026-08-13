import {useState} from "react";
import api from "../services/api";

function Send(){
    const [file, setFile]= useState(null);
    const [code, setCode]= useState("");
    const [loading, setLoading]=useState(false);
    const [error, setError]= useState("");

    const handleFileChange= (event)=> {

        const selectedFile = event.target.files[0];

        if(!selectedFile){
            return;
        }

        setFile(selectedFile);
        setCode("");
        setError("");
    };

    const handleUpload = async()=>{
        if(!file){
            setError("Please select a file");
            return;
        }

        setLoading(true);
        setError("");
        setCode("");

        try{
            const formData= new FormData();

            formData.append("file",file);

            const response = await api.post("/share/upload",formData);

            setCode(response.data.code);
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
            <input 
            type="file"
            onChange={handleFileChange}
            />

            {file && (
                <p>
                    Selected: {file.name}
                </p>
            )}

            <button
                onClick={handleUpload}
                disabled={loading}
                >
                    {loading ? "Uploading...": "Generate Code"}
                </button>

                {code && (
                    <div>
                        <h2>Your Code</h2>
                        <p>{code}</p>
                    </div>
                )}

                {error && (
                    <p>{error}</p>
                )}
            
        </div>
    );

}

export default Send;