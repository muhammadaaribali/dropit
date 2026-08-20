import { useEffect, useRef, useState } from "react";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import "./App.css";

function App() {
    const [activeTab, setActiveTab] = useState("home");

    const sendRef = useRef(null);
    const receiveRef = useRef(null);

    useEffect(() => {
        if (!window.liquidGlass) {
            console.log("liquidGlass is not loaded");
            return;
        }

        if (sendRef.current) {
            window.liquidGlass(sendRef.current, {
                scale: -112
            });
        }

        if (receiveRef.current) {
            window.liquidGlass(receiveRef.current, {
                scale: -112
            });
        }
    }, []);

    return (
        <div className="app">

            <div className="glass-window">

                {/* Header */}
                <header className="top-bar">

                    <div className="logo">
                        <div className="logo-mark">
                            <span></span>
                            <span></span>
                        </div>

                        <span>Dropit</span>
                    </div>

                </header>


                {/* HOME */}
                {activeTab === "home" && (
                    <main className="home-content">

                        <div className="action-cards">

                            {/* Send */}
                            <button
                                ref={sendRef}
                                className="action-card send-card"
                                onClick={() => setActiveTab("send")}
                            >

                                <div className="card-icon send-icon">
                                    ➤
                                </div>

                                <div className="card-title">
                                    Send files
                                </div>

                                <div className="card-description">
                                    Upload and share
                                    <br />
                                    your files
                                </div>

                                <div className="card-button">
                                    Send files
                                </div>

                            </button>


                            {/* Receive */}
                            <button
                                ref={receiveRef}
                                className="action-card receive-card"
                                onClick={() => setActiveTab("receive")}
                            >

                                <div className="card-icon receive-icon">
                                    ▱
                                </div>

                                <div className="card-title">
                                    Receive files
                                </div>

                                <div className="card-description">
                                    Enter your code
                                    <br />
                                    to receive files
                                </div>

                                <div className="card-button">
                                    Receive files
                                </div>

                            </button>

                        </div>

                    </main>
                )}


                {/* SEND */}
                {activeTab === "send" && (
                    <div className="component-page">

                        <button
                            className="back-button"
                            onClick={() => setActiveTab("home")}
                        >
                            ← Back
                        </button>

                        <Send />

                    </div>
                )}


                {/* RECEIVE */}
                {activeTab === "receive" && (
                    <div className="component-page">

                        <button
                            className="back-button"
                            onClick={() => setActiveTab("home")}
                        >
                            ← Back
                        </button>

                        <Receive />

                    </div>
                )}

            </div>

        </div>
    );
}

export default App;