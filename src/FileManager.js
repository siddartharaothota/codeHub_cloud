import React, { useEffect, useState } from "react";
import axios from "axios";
import API, { BASE_URL } from "../src/api";
import { useNavigate } from "react-router-dom";
import "./index.css";
import JSZip from "jszip";

function FileManager({ username, onLogout, api }) {
    const SERVER = api;
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [serverDown, setServerDown] = useState(false);

    const [search, setSearch] = useState("");
    const [matchedFile, setMatchedFile] = useState(null);

    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            if (!search.trim()) {
                setMatchedFile(null);
                return;
            }

            const found = files.find(file =>
                file.toLowerCase().includes(search.toLowerCase())
            );

            if (found) {
                setMatchedFile(found);
            } else {
                setMatchedFile(null);
                alert("⚠ File not found!");
            }
        }
    };


    const navigate = useNavigate();

    // useEffect(() => {
    //     fetchFiles();
    // }, []);


    // const fetchFiles = async () => {
    //     try {
    //         const res = await axios.get(`${SERVER}/files`);
    //         setFiles(res.data);
    //         setServerDown(false);
    //     } catch (error) {
    //         console.log("Server not reachable");
    //         setServerDown(true);
    //     }
    // };

    const fetchFiles = async () => {
        try {
            const res = await API.get("/files");

            // Only update if data changed
            if (JSON.stringify(res.data) !== JSON.stringify(files)) {
                setFiles(res.data);
            }

            setServerDown(false);
        } catch (error) {
            setServerDown(true);
            setFiles([]);
            console.log("Server not reachable");
        }
    };

    useEffect(() => {
        fetchFiles()

        const interval = setInterval(() => {
            fetchFiles();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchFiles]);


    const deleteFile = async (name) => {
        const fileName = name.split(":")[0];
        if (username !== fileName) {
            window.alert(`Access Denied.\nOnly User:${fileName} have the permission to delete files.`);
            return;
        } else {
            if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
            await API.delete(`/delete/${name}`);
            fetchFiles();
        }

    };

    const downloadFile = (name) => {
        window.open(`${BASE_URL}/download/${name}`);

    };

    const openFile = async (name) => {
        const ext = name.split(".").pop().toLowerCase();
        if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
            setSelectedImage(`${BASE_URL}/download/${name}`);
        } else if (["html", "js", "py", "txt"].includes(ext)) {
            const res = await API.get(`/download/${name}`);
            setFileContent(res.data);
        } else {
            alert("Can't open this file type");
        }
    };


    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", username);

        try {
            setUploading(true);
            setUploadProgress(0);

            await API.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percent);
                }
            });

            fetchFiles();
        } catch (error) {
            console.error("Upload failed");
        } finally {
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 800);
        }
    };

    const handleFolderUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const zip = new JSZip();


        const firstFile = files[0];
        const folderName = firstFile.webkitRelativePath.split("/")[0];


        for (let file of files) {
            const relativePath = file.webkitRelativePath;
            zip.file(relativePath, file);
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            const zipBlob = await zip.generateAsync(
                { type: "blob" },
                (metadata) => {
                    setUploadProgress(Math.round(metadata.percent));
                }
            );

            const formData = new FormData();
            formData.append("file", zipBlob, `${folderName}.zip`);
            formData.append("username", username);

            await API.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            fetchFiles();

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };




    return (
        <div className="container">
            <div className="header">
                <h2>CodeHub</h2>

                <button className="logout" onClick={onLogout}>Logout</button>
                <input
                    type="text"
                    placeholder="Search file..."
                    className="searchBar"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (e.target.value === "") {
                            setMatchedFile(null);
                        }
                    }}
                    onKeyDown={handleSearch}
                />

                <div className="buttons">
                    <span style={{ marginRight: "10px" }}>Hello, {username}</span>

                    <label className="uploadBtn">
                        <img src="plus.png" alt="create" className="btnIcon" />
                        <button onClick={() => navigate("/create")} hidden></button>
                    </label>

                    <label className="uploadBtn">
                        <img src="chat.png" alt="create" className="btnIcon" />
                        <button onClick={() => navigate("/chat")} hidden></button>
                    </label>

                </div>


                <div className="buttons">

                    <label className="uploadBtn">
                        <img src="file.png" alt="create" className="btnIcon" />
                        <input type="file" onChange={uploadFile} hidden />
                    </label>

                    <label className="uploadBtn">
                        <img src="folder.png" alt="create" className="btnIcon" />
                        {/* <button className="uploadBtn" onClick={() => document.getElementById("folderInput").click()}></button> */}

                        <input
                            type="file"
                            id="folderInput"
                            webkitdirectory="true"
                            directory=""
                            multiple
                            hidden
                            onChange={handleFolderUpload}
                        />
                    </label>
                </div>

            </div>

            {serverDown && (
                <div>
                    ⚠ <b>SR Server</b> is not responding. Check the backend.
                </div>
            )}

            {uploading && (
                <div className="progressContainer">
                    <div
                        className="progressBar"
                        style={{ width: `${uploadProgress}%` }}
                    >
                        {uploadProgress}%
                    </div>
                </div>
            )}


            <div className="grid">
                {files.map((file, index) => {
                    const ext = file.split(".").pop().toLowerCase();
                    const isImage = ["png", "jpg", "jpeg", "gif"].includes(ext);
                    const isZip = ext === "zip";
                    const isPdf = ext === "pdf";
                    const isJs = ext === "js";
                    const isTxt = ext === "txt";
                    const isHtml = ext === "html";
                    return (
                        <div
                            className={`card ${matchedFile === file ? "highlight" : ""}`}
                            key={index}
                        >

                            <div className="preview" onClick={() => openFile(file)}>
                                {isImage ? (
                                    <img src={`${BASE_URL}/download/${file}`} alt={file} />
                                ) : isZip ? (
                                    <div className="fileIcon"><img src="zip.png" alt="zip" /></div>
                                ) : isPdf ? (
                                    <div className="fileIcon"><img src="pdf.png" alt="zip" /></div>
                                ) : isJs ? (
                                    <div className="fileIcon"><img src="jsfile.png" alt="zip" /></div>
                                ) : isTxt ? (
                                    <div className="fileIcon"><img src="txt.png" alt="zip" /></div>
                                ) : isHtml ? (
                                    <div className="fileIcon"><img src="html.png" alt="zip" /></div>
                                ) : (
                                    <div className="fileIcon"><img src="fileicon.png" alt="icon" /></div>
                                )}
                            </div>

                            <p className="filename">
                                <span className="usernamePart">
                                    {file.split(":")[0]}:
                                </span>
                                {file.split(":")[1]}
                            </p>

                            <div className="buttons">
                                <button className="download" onClick={() => downloadFile(file)}>Download</button>
                                <button className="delete" onClick={() => deleteFile(file)}>Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedImage && (
                <div className="modal" onClick={() => setSelectedImage(null)}>
                    <img src={selectedImage} alt="Full" />
                </div>
            )}

            {fileContent && (
                <div className="modal">
                    <div className="textModal">
                        <div className="modalHeader">
                            <button
                                className="copyBtn"
                                onClick={() => {
                                    navigator.clipboard.writeText(fileContent);
                                    alert("Copied to clipboard!");
                                }}
                            >
                                Copy
                            </button>

                            <button
                                className="cancelBtn"
                                onClick={() => setFileContent(null)}
                            >
                                Cancel
                            </button>
                        </div>

                        <pre className="textViewer">{fileContent}</pre>
                    </div>
                </div>
            )}

            <div className="footer">
                SIDDARTHA RAO
            </div>


        </div>
    );
}

export default FileManager;
