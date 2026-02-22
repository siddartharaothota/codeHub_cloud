import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API, { BASE_URL } from "../src/api";



function CreatePage({ username , api}) {
    const SERVER = api;
    const [textContent, setTextContent] = useState("");
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();

    const handleSave = async () => {
        if (!textContent.trim() || !fileName.trim()) {
            alert("Enter filename and content");
            return;
        }

        const blob = new Blob([textContent], { type: "text/plain" });

        const now = new Date();
        const formattedTime =
            now.toLocaleDateString("en-GB").replace(/\//g, "-") + "_" +
            now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }).replace(":", "-").replace(" ", "_");


        const file = new File([blob], `${fileName}-${formattedTime}.txt`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", username);


        try {
            await API.post("/upload", formData);
            alert("File uploaded successfully!");
            navigate("/"); // go back to Files page
        } catch (error) {
            alert("Upload failed");
        }
    };

    return (
        <div className="createPage">
            <div className="createButtons">
                {/* <button className="delete" onClick={() => navigate("/")}>Cancel</button> */}
                <button onClick={handleSave}>Save</button>
            </div>

            <h2>Create New File</h2>

            <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />

            <textarea
                placeholder="Write your content..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
            />

        </div>
    );
}

export default CreatePage;
