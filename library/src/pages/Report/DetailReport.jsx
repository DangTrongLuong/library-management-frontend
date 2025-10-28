import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, FileDown } from "lucide-react";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/DetailReport.css";

const DetailReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("reports");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);
  const [hideActions, setHideActions] = useState(false); // ✅ Trạng thái ẩn nút khi export

  useEffect(() => {
    const pathToItem = {
      "/dashboard": "home",
      "/books": "books",
      "/readers": "readers",
      "/categorys": "category",
      "/librarians": "librarians",
      "/borrows": "borrows",
      "/penalties": "penalties",
      "/reports": "reports",
    };
    setActiveMenuItem(pathToItem[location.pathname] || "reports");
  }, [location.pathname]);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/getReport/${id}`);
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load report details!");
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/reports");
  const handleEdit = () => navigate(`/reports/editReport/${id}`);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const handleMenuClick = (itemId) => setActiveMenuItem(itemId);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !report) return;

    const input = reportRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const scale = 1.2; // tăng độ nét

    try {
      setHideActions(true);

      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(input, {
        scale,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Thêm tiêu đề
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(`${report.typeDescription || "Report"}`, pdfWidth / 2, 15, {
        align: "center",
      });

      pdf.addImage(imgData, "PNG", 0, 25, pdfWidth, pdfHeight - 10);
      pdf.save(`${report.typeDescription || "Report"}.pdf`);
      toast.success("Exported report to PDF!");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error("Failed to export PDF!");
    } finally {
      setHideActions(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>No report found</div>;

  return (
    <div className="app-container-report">
      <ToastContainer position="top-right" autoClose={3000} />
      <NavBar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
        userName="Admin"
      />
      <SideBar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
      />

      <main className="main-content">
        <div className="detail-report-wrapper">
          <div className="detail-header-report">
            <button
              onClick={handleBack}
              className="detail-btn-back-report"
              title="Back to reports"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="detail-report-h1">
              Report Management / Report Details
            </h1>

            {/* ✅ Nút Export PDF */}
            <button
              onClick={handleExportPDF}
              className="detail-btn-export-report"
              title="Export to PDF"
            >
              <FileDown size={20} />
            </button>
          </div>

          <div className="detail-container-report" ref={reportRef}>
            <div className="detail-card-report">
              <h3 className="detail-card-title-report">Basic Information</h3>
              <div className="detail-grid-report">
                <div className="detail-item-report">
                  <label>ID</label>
                  <p>{report.id}</p>
                </div>
                <div className="detail-item-report">
                  <label>Type</label>
                  <p>{report.typeDescription}</p>
                </div>
                <div className="detail-item-report">
                  <label>From Date</label>
                  <p className="detail-meta-report">
                    <Calendar size={14} className="detail-icon-report" />
                    {formatDate(report.fromDate)}
                  </p>
                </div>
                <div className="detail-item-report">
                  <label>To Date</label>
                  <p className="detail-meta-report">
                    <Calendar size={14} className="detail-icon-report" />
                    {formatDate(report.toDate)}
                  </p>
                </div>
                <div className="detail-item-report">
                  <label>Created By</label>
                  <p>{report.createdBy}</p>
                </div>
              </div>
            </div>

            <div className="detail-card-report">
              <h3 className="detail-card-title-report">Content</h3>
              <div className="detail-full-width-report">
                <div className="detail-item-report">
                  <label>Content</label>
                  <p className="detail-notes-report">
                    {report.content || "No content"}
                  </p>
                </div>
              </div>
            </div>

            <div className="detail-card-report">
              <h3 className="detail-card-title-report">
                Additional Information
              </h3>
              <div className="detail-grid-report">
                <div className="detail-item-report">
                  <label>Created Date</label>
                  <p className="detail-meta-report">
                    {formatDate(report.createdAt)}
                  </p>
                </div>
                <div className="detail-item-report">
                  <label>Last Updated</label>
                  <p className="detail-meta-report">
                    {formatDate(report.updatedAt) || "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Ẩn 2 nút này khi export */}
            {!hideActions && (
              <div className="detail-actions-report">
                <button onClick={handleEdit} className="detail-btn-edit-report">
                  Edit Report
                </button>
                <button
                  onClick={handleBack}
                  className="detail-btn-back-action-report"
                >
                  Back to List
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailReport;
