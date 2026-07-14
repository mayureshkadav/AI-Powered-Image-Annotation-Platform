// // import React, { useState, useRef } from 'react';
// // import { useNavigate } from "react-router-dom";
// // import SelectTeam from './SelectTeam';
// // import './CreateProject.css';

// // const CreateProject = () => {

// //     const [annotationText, setAnnotationText] = useState("");
// //     const fileInputRef = useRef(null);

// //     // for class drag and drop 

// //     const handleTextFileUpload = (event) => {
// //         const file = event.target.files[0];
// //         if (!file || !file.name.endsWith(".txt")) return;

// //         const reader = new FileReader();
// //         reader.onload = (e) => {
// //             const content = e.target.result;
// //             const cleaned = content
// //                 .split(/[\s,]+/)
// //                 .filter((word) => word.trim().length > 0)
// //                 .join("\n");
// //             setAnnotationText(cleaned);
// //         };
// //         reader.readAsText(file);
// //     };

// //     const handleDrop = (event) => {
// //         event.preventDefault();
// //         const file = event.dataTransfer.files[0];
// //         if (file && file.name.endsWith(".txt")) {
// //             handleTextFileUpload({ target: { files: [file] } });
// //         }
// //     };

// //     const handleDragOver = (event) => {
// //         event.preventDefault();
// //     };

// //     const handleBrowseClick = () => {
// //         fileInputRef.current.click();
// //     };
// //     // for class drag and drop 

// //     // for img and video upload 

// //     const [uploadedImages, setUploadedImages] = useState([]);
// //     const [errorMsg, setErrorMsg] = useState("");
// //     const navigate = useNavigate();
// //     const folderInputRef = useRef(null);
// //     const validImageExtensions = ["jpg", "jpeg", "png"];

// //     const isValidImageFile = (file) => {
// //         const mimeValid = file.type && file.type.startsWith("image/");
// //         const extValid = validImageExtensions.some((ext) =>
// //             file.name.toLowerCase().endsWith("." + ext)
// //         );
// //         return mimeValid || extValid;
// //     };

// //     const traverseFileTree = async (item) => {
// //         return new Promise((resolve) => {
// //             if (item.isFile) {
// //                 item.file((file) => resolve([file]));
// //             } else if (item.isDirectory) {
// //                 const dirReader = item.createReader();
// //                 const entries = [];

// //                 const readEntries = () => {
// //                     dirReader.readEntries(async (results) => {
// //                         if (!results.length) {
// //                             const files = await Promise.all(
// //                                 entries.map((entry) => traverseFileTree(entry))
// //                             );
// //                             resolve(files.flat());
// //                         } else {
// //                             entries.push(...results);
// //                             readEntries();
// //                         }
// //                     });
// //                 };
// //                 readEntries();
// //             }
// //         });
// //     };

// //     const handleDrop1 = async (e) => {
// //         e.preventDefault();
// //         setErrorMsg("");
// //         const items = e.dataTransfer.items;

// //         if (!items) return;

// //         const entries = Array.from(items)
// //             .map((item) => item.webkitGetAsEntry())
// //             .filter(Boolean);

// //         const allFilesNested = await Promise.all(
// //             entries.map((entry) => traverseFileTree(entry))
// //         );
// //         const allFiles = allFilesNested.flat();

// //         const nonImages = allFiles.filter((file) => !isValidImageFile(file));

// //         if (nonImages.length > 0) {
// //             setUploadedImages([]);
// //             setErrorMsg("❌ The folder contains non-image files.");
// //             return;
// //         }

// //         const imagesWithPreview = allFiles.map((file) => ({
// //             name: file.name,
// //             preview: URL.createObjectURL(file),
// //         }));

// //         setUploadedImages(imagesWithPreview);
// //     };


// //     // const handleFiles = (files) => {
// //     //     setErrorMsg("");
// //     //     const fileList = Array.from(files);
// //     //     const nonImages = fileList.filter((file) => !file.type.startsWith("image/"));

// //     //     if (nonImages.length > 0) {
// //     //         setUploadedImages([]);
// //     //         setErrorMsg("❌ The folder contains non-image files.");
// //     //         return;
// //     //     }

// //     //     const imagesWithPreview = fileList.map((file) => ({
// //     //         name: file.name,
// //     //         preview: URL.createObjectURL(file),
// //     //     }));

// //     //     setUploadedImages(imagesWithPreview);
// //     // };



// //     const handleDragOver1 = (event) => {
// //         event.preventDefault();
// //     };

// //     const handleBrowse = (e) => {
// //         handleFiles(e.target.files);
// //     };

// //     // for img and video upload 


// //     //  for label's

// //     const [labelMode, setLabelMode] = useState(""); // Track label mode ("label myself" or "label with team")
// //     const [showPopup, setShowPopup] = useState(false); // Show the team select popup

// //     // When the user clicks on "Create Project"
// //     const handleCreateProject = () => {
// //         if (labelMode === "labelMyself") {
// //             // Navigate to AnnotationCanvas.jsx for "Label Myself"
// //             navigate("/AnnotationCanvas"); // Update your route path accordingly
// //         } else if (labelMode === "labelWithTeam") {
// //             // Show the SelectTeam popup window
// //             setShowPopup(true);
// //         }
// //     };

// //     // Handle selecting label mode
// //     const handleLabelModeChange = (mode) => {
// //         setLabelMode(mode);
// //     };


// //     // for label's

// //     return (
// //         <div className="create-project-container">
// //             <h2>Let's create your project.</h2>

// //             <div className="input-row">
// //                 <div className="form-group">
// //                     <label>Project Name</label>
// //                     <input type="text" placeholder="e.g., Dog Breeds or Car Models or Text Finder" />
// //                     {/* <span className="error-msg">Name cannot be empty.</span> */}
// //                 </div>
// //                 <div className="form-group">
// //                     <label>Batch Name</label>
// //                     <input type="text" placeholder="e.g., Training Set 1" />
// //                 </div>
// //             </div>

// //             <div className="form-group">
// //                 <label>Project Description</label>
// //                 <textarea placeholder="Describe what your project is about, its goals, and any specific requirements..." />
// //             </div>

// //             <div className="form-group">
// //                 <label>
// //                     Annotation Classes <span className="info-icon">?</span>
// //                 </label>
// //                 <textarea
// //                     value={annotationText}
// //                     onChange={(e) => setAnnotationText(e.target.value)}
// //                     placeholder={`Enter your classes, one per line\ne.g.:\nperson\ncar\nbicycle\ndog`}
// //                 />
// //             </div>
// //             {/* for drag and drop     */}
// //             <div
// //                 className="upload-drop-zone"
// //                 onDrop={handleDrop}
// //                 onDragOver={handleDragOver}
// //                 onClick={handleBrowseClick}
// //             >
// //                 <p>📂 Drag & drop your `.txt` file here or <span className="browse-text">browse</span></p>
// //                 <input
// //                     type="file"
// //                     accept=".txt"
// //                     ref={fileInputRef}
// //                     style={{ display: "none" }}
// //                     onChange={handleTextFileUpload}
// //                 />
// //             </div>
// //             {/* for drag and drop     */}

// //             <br />

// //             <div className="upload-data-card">
// //                 <p>Upload your images, videos </p>

// //                 <div className="media-upload-section">
// //                     <h4>📁 Upload Images</h4>

// //                     <div
// //                         className="image-drop-zone"
// //                         onDrop={handleDrop1}
// //                         onDragOver={handleDragOver1}
// //                         onClick={() => folderInputRef.current.click()}
// //                     >
// //                         <p>📂 Drag & drop a folder of images here</p>
// //                         <p className="subtext">or click to browse</p>
// //                         <p className="subtext">Only image files (.jpg, .png, etc.) are allowed</p>
// //                     </div>

// //                     <input
// //                         type="file"
// //                         ref={folderInputRef}
// //                         onChange={handleBrowse}
// //                         webkitdirectory="true"
// //                         directory="true"
// //                         multiple
// //                         style={{ display: "none" }}
// //                     />

// //                     {errorMsg && <p className="error-msg">{errorMsg}</p>}

// //                     {uploadedImages.length > 0 && (
// //                         <div className="preview-section">
// //                             <h5>🖼️ Image Preview</h5>
// //                             <div className="preview-list">
// //                                 {uploadedImages.map((img, index) => (
// //                                     <div className="preview-item" key={index}>
// //                                         <img src={img.preview} alt={img.name} />
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     )}

// //                     <div className="video-extract-button">
// //                         <p>Convert video to image</p>
// //                         <button onClick={() => navigate("/VideoFrameExtractor")}>
// //                             Extract Frame
// //                         </button>
// //                     </div>
// //                 </div>
// //             </div>
// //             {/* Labeling Options */}
// // <div className="labeling-options">
// //     <h4>How do you want to label your images?</h4>
// //     <button
// //         className={labelMode === "labelMyself" ? "selected" : ""}
// //         onClick={() => handleLabelModeChange("labelMyself")}
// //     >
// //         Label Myself
// //     </button>
// //     <button
// //         className={labelMode === "labelWithTeam" ? "selected" : ""}
// //         onClick={() => handleLabelModeChange("labelWithTeam")}
// //     >
// //         Label With My Team
// //     </button>
// // </div>

// //             {/* Create Project Button */}
// //             <button className="create-project-btn" onClick={handleCreateProject}>
// //                 Create Project
// //             </button>

// //             {/* Popup Window for Select Team */}
// //             {showPopup && (
// //                 <div className="popup-overlay">
// //                     <div className="popup">
// //                         {/* Close Button */}
// //                         <button className="close-btn" onClick={() => setShowPopup(false)}>
// //                             X
// //                         </button>

// //                         <SelectTeam closePopup={() => setShowPopup(false)} />
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default CreateProject;


// import React, { useState, useRef, useCallback } from 'react';

// const CreateProject = () => {
//   // State for form fields
//   const [projectName, setProjectName] = useState('');
//   const [projectDescription, setProjectDescription] = useState('');
//   const [annotationClasses, setAnnotationClasses] = useState('');
//   const [isTxtDragging, setIsTxtDragging] = useState(false);
//   const [showNameError, setShowNameError] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);

//   // Ref for file input
//   const fileInputRef = useRef(null);
//   const folderInputRef = useRef(null);

//   // Handle file selection from input
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       processFiles(files);
//     }
//   };

//   // Process dropped .txt file content
//   const processTxtFile = useCallback((file) => {
//     if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setAnnotationClasses(event.target.result);
//       };
//       reader.readAsText(file);
//       return true;
//     }
//     return false;
//   }, []);

//   // Process selected files
//   const processFiles = useCallback((files) => {
//     // Filter out any non-file items that might be in the FileList
//     const validFiles = files.filter(file => file instanceof File);

//     // Add new files to the existing ones, avoiding duplicates
//     setSelectedFiles(prev => {
//       const existingFileNames = new Set(prev.map(file => file.name + file.size));
//       const newFiles = validFiles.filter(file =>
//         !existingFileNames.has(file.name + file.size)
//       );
//       return [...prev, ...newFiles];
//     });
//   }, []);

//   // Handle drag events
//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const handleDragEnter = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     // Only set to false if we're leaving the drop zone
//     if (!e.currentTarget.contains(e.relatedTarget)) {
//       setIsDragging(false);
//     }
//   }, []);

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);

//     const items = e.dataTransfer.items;

//     // Process all items in the drag event
//     const processItems = (items) => {
//       return Array.from(items).map(item => {
//         if (item.kind === 'file') {
//           return item.getAsFile();
//         }
//         return null;
//       }).filter(Boolean);
//     };

//     if (items) {
//       // Use DataTransferItemList interface to access the files
//       const fileList = processItems(items);
//       if (fileList.length > 0) {
//         // Check if we're in the txt drop zone
//         const isTxtDropZone = e.currentTarget.closest('.txt-drop-zone');

//         if (isTxtDropZone) {
//           // Only process the first .txt file for annotation classes
//           const txtFile = fileList.find(file =>
//             file.type === 'text/plain' || file.name.endsWith('.txt')
//           );
//           if (txtFile) {
//             processTxtFile(txtFile);
//           }
//         } else {
//           // Process all files for the main drop zone
//           processFiles(fileList);
//         }
//       }
//     } else {
//       // Fallback for browsers that don't support the DataTransferItemList interface
//       const fileList = e.dataTransfer.files;
//       if (fileList.length > 0) {
//         const isTxtDropZone = e.currentTarget.closest('.txt-drop-zone');

//         if (isTxtDropZone) {
//           const txtFile = Array.from(fileList).find(file =>
//             file.type === 'text/plain' || file.name.endsWith('.txt')
//           );
//           if (txtFile) {
//             processTxtFile(txtFile);
//           }
//         } else {
//           processFiles(Array.from(fileList));
//         }
//       }
//     }
//   }, [processFiles]);

//   // Handle folder selection
//   const handleFolderChange = (e) => {
//     if (e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedFiles(prev => [...prev, ...files]);
//     }
//   };

//   // Handle file upload button click
//   const handleFileButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   // Handle folder upload button click
//   const handleFolderButtonClick = () => {
//     folderInputRef.current.click();
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!projectName.trim()) {
//       setShowNameError(true);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('projectName', projectName);
//     formData.append('projectDescription', projectDescription);
//     formData.append('annotationClasses', annotationClasses);
//     formData.append('labelMode', labelMode);

//     selectedFiles.forEach((file) => {
//       formData.append('files', file);
//     });

//     try {
//       const response = await fetch('http://localhost:5000/create-project', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert('✅ Project created successfully!');
//         console.log(result);

//         // Reset form
//         setProjectName('');
//         setProjectDescription('');
//         setAnnotationClasses('');
//         setSelectedFiles([]);
//         setShowNameError(false);
//       } else {
//         alert('❌ Error: ' + result.error);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('❌ Server error.');
//     }
//   };

//   // Handle cancel
//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
//       // Reset form
//       setProjectName('');
//       setProjectDescription('');
//       setAnnotationClasses('');
//       setSelectedFiles([]);
//       setShowNameError(false);
//     }
//   };

//   const [labelMode, setLabelMode] = useState('labelMyself');

//   const handleLabelModeChange = (mode) => {
//     setLabelMode(mode);
//     console.log('Selected labeling mode:', mode);
//     // You can add more logic here (e.g., show/hide sections, API calls, etc.)
//   };

//   return (
//     <div style={{ fontFamily: 'sans-serif', padding: '40px', background: '#fff', color: '#000' }}>
//       <h2 style={{ fontWeight: '500', fontSize: '20px', marginBottom: '20px' }}>Let's create your project.</h2>

//       <form onSubmit={handleSubmit}>

//         {/* Project Inputs */}
//         <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
//           <div>
//             <label style={{ fontSize: '14px' }}>Project Name</label>
//             <input
//               type="text"
//               value={projectName}
//               onChange={(e) => {
//                 setProjectName(e.target.value);
//                 setShowNameError(false);
//               }}
//               placeholder="e.g., Dog Breeds or Car Models or Text Finder"
//               style={{
//                 width: '100%',
//                 marginTop: '5px',
//                 marginBottom: '5px',
//                 padding: '10px',
//                 border: `1px solid ${showNameError ? 'red' : '#ccc'}`,
//                 borderRadius: '5px'
//               }}
//             />
//             {showNameError && (
//               <p style={{ color: 'red', fontSize: '12px', marginBottom: '20px' }}>
//                 Name cannot be empty.
//               </p>
//             )}

//             <label style={{ fontSize: '14px' }}>Project Description</label>
//             <textarea
//               value={projectDescription}
//               onChange={(e) => setProjectDescription(e.target.value)}
//               placeholder="Describe what your project is about, its goals, and any specific requirements."
//               style={{
//                 width: '100%',
//                 marginTop: '5px',
//                 marginBottom: '20px',
//                 padding: '10px',
//                 border: '1px solid #ccc',
//                 borderRadius: '5px',
//                 minHeight: '60px'
//               }}
//             />

//             <label style={{ fontSize: '14px' }}>Annotation Classes</label>
//             <textarea
//               value={annotationClasses}
//               onChange={(e) => setAnnotationClasses(e.target.value)}
//               placeholder={"Enter your classes, one per line\ne.g:\nperson\ncar\nbicycle\ndog"}
//               style={{
//                 width: '100%',
//                 marginTop: '5px',
//                 padding: '10px',
//                 border: '1px solid #ccc',
//                 borderRadius: '5px',
//                 minHeight: '100px',
//                 fontFamily: 'inherit',
//                 resize: 'vertical'
//               }}
//             />
//             <div
//               className="txt-drop-zone"
//               style={{
//                 margin: '10px 0',
//                 border: `2px dashed ${isTxtDragging ? '#666' : '#ddd'}`,
//                 borderRadius: '4px',
//                 padding: '15px',
//                 transition: 'all 0.3s ease',
//                 backgroundColor: isTxtDragging ? '#f8f9fa' : '#fff',
//                 position: 'relative'
//               }}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsTxtDragging(true);
//               }}
//               onDragEnter={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsTxtDragging(true);
//               }}
//               onDragLeave={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 if (!e.currentTarget.contains(e.relatedTarget)) {
//                   setIsTxtDragging(false);
//                 }
//               }}
//               onDrop={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsTxtDragging(false);
//                 handleDrop(e);
//               }}
//             >
//               <input
//                 type="file"
//                 accept=".txt"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (file) {
//                     processTxtFile(file);
//                   }
//                 }}
//                 style={{ display: 'none' }}
//                 id="txtFileInput"
//               />
//               <div style={{ textAlign: 'center', marginBottom: '10px' }}>
//                 <button
//                   type="button"
//                   onClick={() => document.getElementById('txtFileInput').click()}
//                   style={{
//                     padding: '8px 16px',
//                     border: 'none',
//                     background: '#000',
//                     color: '#fff',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     transition: 'background-color 0.2s',
//                     marginBottom: '10px'
//                   }}
//                   onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
//                   onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
//                 >
//                   Select .txt file
//                 </button>
//                 <p style={{ fontSize: '14px', color: '#666', margin: '10px 0 0' }}>
//                   or drag and drop a .txt file here
//                 </p>
//                 {isTxtDragging && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     zIndex: 1,
//                     borderRadius: '4px',
//                     border: '2px dashed #000'
//                   }}>
//                     <div style={{
//                       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                       color: 'white',
//                       padding: '10px 20px',
//                       borderRadius: '4px',
//                       fontSize: '14px',
//                       fontWeight: 'bold'
//                     }}>
//                       Drop .txt file here
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Upload Data */}
//             <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
//               <h4 style={{ marginBottom: '10px' }}>Upload Data</h4>
//               <p style={{ fontSize: '14px' }}>Upload your images, videos, or annotation files for training</p>
//               <div
//                 onDragOver={handleDragOver}
//                 onDragEnter={handleDragEnter}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 style={{
//                   border: `2px dashed ${isDragging ? '#666' : '#ccc'}`,
//                   borderRadius: '6px',
//                   padding: '30px',
//                   textAlign: 'center',
//                   marginTop: '15px',
//                   backgroundColor: isDragging ? '#f8f9fa' : '#fff',
//                   transition: 'all 0.3s ease',
//                   cursor: 'pointer',
//                   position: 'relative',
//                   overflow: 'hidden'
//                 }}
//               >
//                 {isDragging && (
//                   <div style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     backgroundColor: 'rgba(0, 0, 0, 0.05)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     zIndex: 1
//                   }}>
//                     <div style={{
//                       backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                       color: 'white',
//                       padding: '10px 20px',
//                       borderRadius: '4px',
//                       fontSize: '16px',
//                       fontWeight: 'bold'
//                     }}>
//                       Drop files here
//                     </div>
//                   </div>
//                 )}
//                 <p>Drag and drop file(s) here, or:</p>
//                 <div style={{ marginTop: '10px' }}>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: 'none' }}
//                     multiple
//                   />
//                   <button
//                     type="button"
//                     onClick={handleFileButtonClick}
//                     style={{
//                       padding: '8px 12px',
//                       borderRadius: '4px',
//                       backgroundColor: '#eee',
//                       border: '1px solid #ccc',
//                       marginRight: '10px',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s'
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.backgroundColor = '#e0e0e0';
//                       e.target.transform = 'translateY(-1px)';
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.backgroundColor = '#eee';
//                       e.target.transform = 'translateY(0)';
//                     }}
//                   >
//                     📂 Select File(s)
//                   </button>
//                   <input
//                     type="file"
//                     ref={folderInputRef}
//                     onChange={handleFolderChange}
//                     style={{ display: 'none' }}
//                     webkitdirectory=""
//                     directory=""
//                     multiple
//                   />
//                   <button
//                     type="button"
//                     onClick={handleFolderButtonClick}
//                     style={{
//                       padding: '8px 12px',
//                       borderRadius: '4px',
//                       backgroundColor: '#eee',
//                       border: '1px solid #ccc',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s'
//                     }}
//                     onMouseOver={(e) => {
//                       e.target.backgroundColor = '#e0e0e0';
//                       e.target.transform = 'translateY(-1px)';
//                     }}
//                     onMouseOut={(e) => {
//                       e.target.backgroundColor = '#eee';
//                       e.target.transform = 'translateY(0)';
//                     }}
//                   >
//                     📁 Select Folder
//                   </button>
//                 </div>
//                 <p style={{ fontSize: '12px', marginTop: '15px' }}>
//                   Supported Formats: JPG, PNG, MP4, JSON, TXT
//                   <br />
//                   Max size: 250MB, 18,400 files, 18,400 picks
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             {/* Sections for removal have been excluded here */}
//           </div>
//         </div>

//         {/* Selected Files Preview */}
//         {selectedFiles.length > 0 && (
//           <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
//             <h4>Selected Files ({selectedFiles.length})</h4>
//             <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
//               {selectedFiles.map((file, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     padding: '5px 0',
//                     borderBottom: '1px solid #eee',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                   }}
//                 >
//                   <span style={{ fontSize: '14px' }}>{file.name}</span>
//                   <button
//                     onClick={() => {
//                       setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//                     }}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: 'red',
//                       cursor: 'pointer',
//                       fontSize: '16px'
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* select labelling team */}

//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '12px',
//             marginBottom: '16px',
//           }}
//         >
//           <h4 style={{ margin: 0 }}>How do you want to label your images?</h4>

//           <button
//             style={{
//               padding: '10px 16px',
//               border: '1px solid #ccc',
//               backgroundColor: labelMode === 'labelMyself' ? '#2563eb' : 'white',
//               color: labelMode === 'labelMyself' ? 'white' : 'black',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'all 0.2s ease',
//             }}
//             onClick={() => handleLabelModeChange('labelMyself')}
//           >
//             Label Myself
//           </button>

//           <button
//             style={{
//               padding: '10px 16px',
//               border: '1px solid #ccc',
//               backgroundColor: labelMode === 'labelWithTeam' ? '#2563eb' : 'white',
//               color: labelMode === 'labelWithTeam' ? 'white' : 'black',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               transition: 'all 0.2s ease',
//             }}
//             onClick={() => handleLabelModeChange('labelWithTeam')}
//           >
//             Label With My Team
//           </button>
//         </div>


//         {/* Footer Buttons */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
//           <button
//             type="button"
//             onClick={handleCancel}
//             style={{
//               padding: '10px 20px',
//               border: '1px solid #ccc',
//               background: '#fff',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               transition: 'all 0.2s'
//             }}
//             onMouseOver={(e) => {
//               e.target.backgroundColor = '#f5f5f5';
//               e.target.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
//             }}
//             onMouseOut={(e) => {
//               e.target.backgroundColor = '#fff';
//               e.target.boxShadow = 'none';
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             style={{
//               padding: '10px 20px',
//               background: '#000',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               transition: 'all 0.2s'
//             }}
//             onMouseOver={(e) => {
//               e.target.backgroundColor = '#333';
//               e.target.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
//             }}
//             onMouseOut={(e) => {
//               e.target.backgroundColor = '#000';
//               e.target.boxShadow = 'none';
//             }}
//           >
//             Create Project
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateProject;




import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api';
import SelectTeam from '../components/SelectTeam';

const CreateProject = () => {
  // State for form fields
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [annotationClasses, setAnnotationClasses] = useState('');
  const [isTxtDragging, setIsTxtDragging] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  // Handle cancel action - navigate to the projects list page
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/Project'); // Navigate to the projects list page
    }
  };

  // Ref for file input
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  // Handle file selection from input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  // Process dropped .txt file content
  const processTxtFile = useCallback((file) => {
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAnnotationClasses(event.target.result);
      };
      reader.readAsText(file);
      return true;
    }
    return false;
  }, []);

  // Process selected files
  const processFiles = useCallback((files) => {
    // Filter out any non-file items that might be in the FileList
    const validFiles = files.filter(file => file instanceof File);

    // Add new files to the existing ones, avoiding duplicates
    setSelectedFiles(prev => {
      const existingFileNames = new Set(prev.map(file => file.name + file.size));
      const newFiles = validFiles.filter(file =>
        !existingFileNames.has(file.name + file.size)
      );
      return [...prev, ...newFiles];
    });
  }, []);

  // Handle drag events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;

    // Process all items in the drag event
    const processItems = (items) => {
      return Array.from(items).map(item => {
        if (item.kind === 'file') {
          return item.getAsFile();
        }
        return null;
      }).filter(Boolean);
    };

    if (items) {
      // Use DataTransferItemList interface to access the files
      const fileList = processItems(items);
      if (fileList.length > 0) {
        // Check if we're in the txt drop zone
        const isTxtDropZone = e.currentTarget.closest('.txt-drop-zone');

        if (isTxtDropZone) {
          // Only process the first .txt file for annotation classes
          const txtFile = fileList.find(file =>
            file.type === 'text/plain' || file.name.endsWith('.txt')
          );
          if (txtFile) {
            processTxtFile(txtFile);
          }
        } else {
          // Process all files for the main drop zone
          processFiles(fileList);
        }
      }
    } else {
      // Fallback for browsers that don't support the DataTransferItemList interface
      const fileList = e.dataTransfer.files;
      if (fileList.length > 0) {
        const isTxtDropZone = e.currentTarget.closest('.txt-drop-zone');

        if (isTxtDropZone) {
          const txtFile = Array.from(fileList).find(file =>
            file.type === 'text/plain' || file.name.endsWith('.txt')
          );
          if (txtFile) {
            processTxtFile(txtFile);
          }
        } else {
          processFiles(Array.from(fileList));
        }
      }
    }
  }, [processFiles]);

  // Handle folder selection
  const handleFolderChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  // Handle file upload button click
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle folder upload button click
  const handleFolderButtonClick = () => {
    folderInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setShowNameError(true);
      return;
    }

    setShowNameError(false);

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('annotationClasses', annotationClasses);
    formData.append('labelMode', labelMode);

    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:5000/create-project', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Project created successfully!');
        console.log(result);

        // Reset form
        setProjectName('');
        setProjectDescription('');
        setAnnotationClasses('');
        setSelectedFiles([]);
        setShowNameError(false);
      } else {
        alert('❌ Error: ' + result.error);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error.');
    }
  };



  //  For label roauting 
  const [labelMode, setLabelMode] = useState(null);
  const [showTeamPopup, setShowTeamPopup] = useState(false);

  const handleLabelModeChange = (mode) => {
    setLabelMode(mode);
  };

  const handleCreateProject = () => {
    if (labelMode === 'labelMyself') {
      navigate('/Project'); // Navigates to Sss.jsx
    } else if (labelMode === 'labelWithTeam') {
      setShowTeamPopup(true); // Shows SelectTeam popup
    } else {
      alert('Please select a labeling mode');
    }
  };

  return (
    <div style={{
      fontFamily: 'sans-serif',
      padding: '20px',
      background: '#fff',
      color: '#000',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{
        fontWeight: '500',
        fontSize: '24px',
        margin: '0 0 20px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
      }}>Let's create your project.</h2>

      <form onSubmit={handleSubmit} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>

        {/* Project Inputs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr',
          gap: '20px',
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          paddingRight: '10px'
        }}>
          <div>
            <label style={{ fontSize: '14px' }}>Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setShowNameError(false);
              }}
              placeholder="e.g., Dog Breeds or Car Models or Text Finder"
              style={{
                width: '100%',
                marginTop: '5px',
                marginBottom: '5px',
                padding: '10px',
                border: `1px solid ${showNameError ? 'red' : '#ccc'}`,
                borderRadius: '5px'
              }}
            />
            {showNameError && (
              <p style={{ color: 'red', fontSize: '12px', marginBottom: '20px' }}>
                Name cannot be empty.
              </p>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Project Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe what your project is about, its goals, and any specific requirements."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Annotation Classes (comma-separated)
              </label>
              <textarea
                placeholder="e.g., car, person, building"
                value={annotationClasses}
                onChange={(e) => setAnnotationClasses(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div
              className="txt-drop-zone"
              style={{
                margin: '10px 0',
                border: `2px dashed ${isTxtDragging ? '#666' : '#ddd'}`,
                borderRadius: '4px',
                padding: '15px',
                transition: 'all 0.3s ease',
                backgroundColor: isTxtDragging ? '#f8f9fa' : '#fff',
                position: 'relative'
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTxtDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTxtDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsTxtDragging(false);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTxtDragging(false);
                handleDrop(e);
              }}
            >
              <input
                type="file"
                accept=".txt"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    processTxtFile(file);
                  }
                }}
                style={{ display: 'none' }}
                id="txtFileInput"
              />
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => document.getElementById('txtFileInput').click()}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    background: '#000',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    marginBottom: '10px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
                >
                  Select .txt file
                </button>
                <p style={{ fontSize: '14px', color: '#666', margin: '10px 0 0' }}>
                  or drag and drop a .txt file here
                </p>
                {isTxtDragging && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    borderRadius: '4px',
                    border: '2px dashed #000'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      Drop .txt file here
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Data */}
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Upload Data</h4>
              <p style={{ fontSize: '14px' }}>Upload your images, videos, or annotation files for training</p>
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragging ? '#666' : '#ccc'}`,
                  borderRadius: '6px',
                  padding: '30px',
                  textAlign: 'center',
                  marginTop: '15px',
                  backgroundColor: isDragging ? '#f8f9fa' : '#fff',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isDragging && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      Drop files here
                    </div>
                  </div>
                )}
                <p>Drag and drop file(s) here, or:</p>
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      backgroundColor: '#eee',
                      border: '1px solid #ccc',
                      marginRight: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.backgroundColor = '#e0e0e0';
                      e.target.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.backgroundColor = '#eee';
                      e.target.transform = 'translateY(0)';
                    }}
                  >
                    📂 Select File(s)
                  </button>
                  <input
                    type="file"
                    ref={folderInputRef}
                    onChange={handleFolderChange}
                    style={{ display: 'none' }}
                    webkitdirectory=""
                    directory=""
                    multiple
                  />
                  <button
                    type="button"
                    onClick={handleFolderButtonClick}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      backgroundColor: '#eee',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.backgroundColor = '#e0e0e0';
                      e.target.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.backgroundColor = '#eee';
                      e.target.transform = 'translateY(0)';
                    }}
                  >
                    📁 Select Folder
                  </button>
                </div>
                <p style={{ fontSize: '12px', marginTop: '15px' }}>
                  Supported Formats: JPG, PNG, MP4, JSON, TXT
                  <br />
                  Max size: 250MB, 18,400 files, 18,400 picks
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Sections for removal have been excluded here */}
          </div>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
            <h4>Selected Files ({selectedFiles.length})</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '10px' }}>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    padding: '5px 0',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{file.name}</span>
                  <button
                    onClick={() => {
                      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* select labelling team */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <h4 style={{ margin: 0 }}>How do you want to label your images?</h4>

          <button
            style={{
              padding: '10px 16px',
              border: '1px solid #000',
              backgroundColor: labelMode === 'labelMyself' ? '#000' : '#fff',
              color: labelMode === 'labelMyself' ? '#fff' : '#000',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              marginRight: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = labelMode === 'labelMyself' ? '#333' : '#f5f5f5';
              e.target.style.borderColor = labelMode === 'labelMyself' ? '#333' : '#999';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = labelMode === 'labelMyself' ? '#000' : '#fff';
              e.target.style.borderColor = labelMode === 'labelMyself' ? '#000' : '#ccc';
            }}
            onClick={() => handleLabelModeChange('labelMyself')}
          >
            Label Myself
          </button>

          <button
            style={{
              padding: '10px 16px',
              border: '1px solid #000',
              backgroundColor: labelMode === 'labelWithTeam' ? '#000' : '#fff',
              color: labelMode === 'labelWithTeam' ? '#fff' : '#000',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = labelMode === 'labelWithTeam' ? '#333' : '#f5f5f5';
              e.target.style.borderColor = labelMode === 'labelWithTeam' ? '#333' : '#999';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = labelMode === 'labelWithTeam' ? '#000' : '#fff';
              e.target.style.borderColor = labelMode === 'labelWithTeam' ? '#000' : '#ccc';
            }}
            onClick={() => handleLabelModeChange('labelWithTeam')}
          >
            Label With My Team
          </button>
        </div>


        {/* Footer Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              border: '1px solid #ccc',
              background: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.backgroundColor = '#f5f5f5';
              e.target.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.target.backgroundColor = '#fff';
              e.target.boxShadow = 'none';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#333';
              e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#000';
              e.target.style.boxShadow = 'none';
            }}
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
        {/* Popup Modal for SelectTeam */}
        {showTeamPopup && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999
          }}>
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '400px',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowTeamPopup(false)}
                style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
              >
                ❌
              </button>
              <SelectTeam />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateProject;