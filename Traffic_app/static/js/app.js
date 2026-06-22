document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");
    const analysisLoader = document.getElementById("analysis-loader");
    const imageViewerContainer = document.getElementById("image-viewer-container");
    const imgDisplay = document.getElementById("img-display");
    
    const tabAnnotated = document.getElementById("tab-annotated");
    const tabOriginal = document.getElementById("tab-original");
    
    const resultPlaceholder = document.getElementById("result-placeholder");
    const resultDetails = document.getElementById("result-details");
    const resultPlateText = document.getElementById("result-plate-text");
    const violationsList = document.getElementById("violations-list");
    const downloadChallanBtn = document.getElementById("download-challan-btn");
    const viewChallanBtn = document.getElementById("view-challan-btn");
    const plateInfoCard = document.querySelector(".plate-info-card");
    
    const statTotalCases = document.getElementById("stat-total-cases");
    const statTotalViolations = document.getElementById("stat-total-violations");
    const statTotalFines = document.getElementById("stat-total-fines");
    
    const historyRows = document.getElementById("history-rows");
    const historySearch = document.getElementById("history-search");
    const clearDataBtn = document.getElementById("clear-data-btn");

    // Global variables for active image toggles & statistics
    let activeAnnotatedUrl = "";
    let activeOriginalUrl = "";
    let statsData = { summary: {}, charts: {}, history: [] };
    
    // Chart instances
    let violationChartInstance = null;
    let severityChartInstance = null;

    // --- INITIALIZE & FETCH STATS ---
    function fetchStats() {
        fetch("/api/stats")
            .then(res => res.json())
            .then(data => {
                statsData = data;
                updateStatsDashboard();
            })
            .catch(err => console.error("Error fetching statistics:", err));
    }

    function updateStatsDashboard() {
        // 1. Update KPI Values
        statTotalCases.textContent = statsData.summary.total_cases || 0;
        statTotalViolations.textContent = statsData.summary.total_violations || 0;
        
        const formattedFines = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(statsData.summary.total_fines_inr || 0);
        statTotalFines.textContent = formattedFines;

        // 2. Render History Log Table
        renderHistoryTable(statsData.history);
    }

    function renderHistoryTable(records) {
        if (!records || records.length === 0) {
            historyRows.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty-row">No records found. Upload an image to log violations.</td>
                </tr>
            `;
            return;
        }

        const query = historySearch.value.toLowerCase().trim();
        
        const filteredRecords = records.filter(r => {
            if (!query) return true;
            
            const plateMatch = r.plate_text.toLowerCase().includes(query);
            const challanMatch = r.challan_id.toLowerCase().includes(query);
            const violationMatch = r.violations.some(v => v.type.toLowerCase().includes(query));
            
            return plateMatch || challanMatch || violationMatch;
        });

        if (filteredRecords.length === 0) {
            historyRows.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty-row">No matching records found. Try another search.</td>
                </tr>
            `;
            return;
        }

        historyRows.innerHTML = filteredRecords.map(r => {
            const dateStr = r.timestamp;
            
            // Build violation badges list
            let violationBadges = "";
            if (r.violations.length === 0) {
                violationBadges = `<span class="badge-violation" style="background-color: var(--success-bg); color: var(--success)">Compliant</span>`;
            } else {
                violationBadges = r.violations.map(v => `<span class="badge-violation">${v.type}</span>`).join("");
            }

            const fineAmount = r.violations.length * 1000;
            const pdfAction = r.challan_path 
                ? `<a href="${r.challan_path}" target="_blank" class="btn btn-secondary btn-icon" title="Download PDF"><i class="fa-solid fa-file-pdf"></i></a>` 
                : `<span class="btn btn-secondary btn-icon" style="opacity: 0.3; cursor: not-allowed" title="No violations"><i class="fa-solid fa-file-pdf"></i></span>`;

            return `
                <tr>
                    <td><strong>${r.challan_id}</strong></td>
                    <td>${dateStr}</td>
                    <td><span class="cell-plate">${r.plate_text}</span></td>
                    <td><div class="cell-violations-container">${violationBadges}</div></td>
                    <td><strong>Rs. ${fineAmount}</strong></td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            ${pdfAction}
                            <button class="btn btn-secondary btn-icon re-view-btn" data-id="${r.id}" title="Re-view Details"><i class="fa-solid fa-eye"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        // Attach event listeners to eye icons to re-populate the Live View panel
        document.querySelectorAll(".re-view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = btn.getAttribute("data-id");
                const selectedRecord = records.find(r => r.id === id);
                if (selectedRecord) {
                    populateResultPanel(selectedRecord);
                }
            });
        });
    }



    // --- UPLOAD FLOW HANDLING ---
    // Drag & Drop event bindings
    dropzone.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    ["dragenter", "dragover"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove("dragover");
        }, false);
    });

    dropzone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    }, false);

    function handleFileUpload(file) {
        // Toggle loader view
        analysisLoader.classList.remove("hidden");
        dropzone.classList.add("hidden");
        imageViewerContainer.classList.add("hidden");
        
        const formData = new FormData();
        formData.append("image", file);

        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => { throw new Error(errData.error || "Upload failed"); });
            }
            return res.json();
        })
        .then(data => {
            // Success response
            populateResultPanel(data);
            fetchStats(); // Refresh charts & logging rows
        })
        .catch(err => {
            alert(`Analysis Error: ${err.message}`);
            console.error("Pipeline Upload Error:", err);
            
            // Reset dropzone visibility
            dropzone.classList.remove("hidden");
        })
        .finally(() => {
            // Hide spinner loader
            analysisLoader.classList.add("hidden");
        });
    }

    function populateResultPanel(record) {
        // Make tabs visible and render correct image src
        dropzone.classList.add("hidden");
        imageViewerContainer.classList.remove("hidden");
        
        activeAnnotatedUrl = record.annotated_image;
        activeOriginalUrl = record.image_path;
        
        // Show annotated image by default
        imgDisplay.src = activeAnnotatedUrl;
        tabAnnotated.classList.add("active");
        tabOriginal.classList.remove("active");

        // Toggle Details Card Panels
        resultPlaceholder.classList.add("hidden");
        resultDetails.classList.remove("hidden");

        // Set Plate info
        if (record.violations.length === 0) {
            plateInfoCard.classList.add("hidden");
        } else {
            plateInfoCard.classList.remove("hidden");
            resultPlateText.textContent = record.plate_text || "UNKNOWN";
            
            // Adjust badge styles depending on UNKNOWN
            if (record.plate_text === "UNKNOWN") {
                resultPlateText.style.color = "rgba(0,0,0,0.3)";
            } else {
                resultPlateText.style.color = "#1F2937";
            }
        }

        // Set violations list
        if (record.violations.length === 0) {
            violationsList.innerHTML = `
                <div class="violation-item" style="background-color: var(--success-bg); border-color: rgba(16, 185, 129, 0.25);">
                    <div class="violation-icon-box" style="background-color: var(--success-bg); color: var(--success)">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div class="violation-details">
                        <span class="violation-name">Vehicle Compliant</span>
                        <span class="violation-meta">No safety infractions detected</span>
                    </div>
                </div>
            `;
            // Hide challan buttons for compliant vehicles
            downloadChallanBtn.classList.add("hidden");
            viewChallanBtn.classList.add("hidden");
        } else {
            violationsList.innerHTML = record.violations.map(v => {
                const badgeClass = v.severity === "High" ? "badge-severity high" : "badge-severity medium";
                return `
                    <div class="violation-item">
                        <div class="violation-icon-box">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div class="violation-details">
                            <span class="violation-name">${v.type}</span>
                            <span class="violation-meta">Safety infraction detected</span>
                        </div>
                        <span class="${badgeClass}">${v.severity}</span>
                    </div>
                `;
            }).join("");

            // Setup E-Challan PDF Links
            downloadChallanBtn.classList.remove("hidden");
            downloadChallanBtn.href = record.challan_path || "#";
            viewChallanBtn.classList.remove("hidden");
            viewChallanBtn.href = record.challan_path || "#";
        }
    }

    // --- TAB CLICKS ---
    tabAnnotated.addEventListener("click", () => {
        tabAnnotated.classList.add("active");
        tabOriginal.classList.remove("active");
        imgDisplay.src = activeAnnotatedUrl;
    });

    tabOriginal.addEventListener("click", () => {
        tabOriginal.classList.add("active");
        tabAnnotated.classList.remove("active");
        imgDisplay.src = activeOriginalUrl;
    });

    // --- SEARCH HISTORY ---
    historySearch.addEventListener("input", () => {
        renderHistoryTable(statsData.history);
    });

    // --- CLEAR HISTORY ---
    clearDataBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all history records and delete processed images? This action is permanent.")) {
            fetch("/api/clear", { method: "POST" })
                .then(res => res.json())
                .then(() => {
                    // Reset analysis panels
                    dropzone.classList.remove("hidden");
                    imageViewerContainer.classList.add("hidden");
                    resultPlaceholder.classList.remove("hidden");
                    resultDetails.classList.add("hidden");
                    
                    // Reset display variables
                    activeAnnotatedUrl = "";
                    activeOriginalUrl = "";
                    
                    // Refresh stats
                    fetchStats();
                })
                .catch(err => console.error("Error clearing data:", err));
        }
    });

    // --- BOOTSTRAP ---
    fetchStats();
});
