// API Base URL
const API_BASE_URL = "http://localhost:5000/api/cv";

let currentUserId = localStorage.getItem("userId") || "1";
let allCVs = [];
let completedCVs = [];
let draftCVs = [];

document.addEventListener("DOMContentLoaded", function () {
  loadAllCVs();

  const tabButtons = document.querySelectorAll(
    '#cvTabs button[data-bs-toggle="pill"]'
  );
  tabButtons.forEach((button) => {
    button.addEventListener("shown.bs.tab", function (event) {
      const targetId = event.target.getAttribute("data-bs-target");
      if (targetId === "#all") {
        renderCVs(allCVs, "allCVsContainer");
      } else if (targetId === "#completed") {
        renderCVs(completedCVs, "completedCVsContainer");
      } else if (targetId === "#draft") {
        renderCVs(draftCVs, "draftCVsContainer");
      }
    });
  });
});

// Load CVs
async function loadAllCVs() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/list/${currentUserId}?includeDrafts=true`
    );
    const result = await response.json();

    if (result.success) {
      allCVs = result.data || [];
      completedCVs = allCVs.filter((cv) => !cv.IsDraft || cv.IsDraft === 0);
      draftCVs = allCVs.filter((cv) => cv.IsDraft === 1);

      updateStats();
      renderCVs(allCVs, "allCVsContainer");
    } else {
      showError("Không thể tải danh sách CV: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi load CV:", error);
    showError("Có lỗi xảy ra khi tải danh sách CV");
  }
}

// Cập nhật thống kê
function updateStats() {
  document.getElementById("totalCVs").textContent = allCVs.length;
  document.getElementById("completedCVs").textContent = completedCVs.length;
  document.getElementById("draftCVs").textContent = draftCVs.length;
  document.getElementById("applications").textContent = "0";
}

// Render CVs
function renderCVs(cvs, containerId) {
  const container = document.getElementById(containerId);

  if (cvs.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="bi bi-file-text display-1 text-muted"></i>
              <p class="text-muted mt-3">Chưa có CV nào. <a href="cv-builder.html">Tạo CV mới</a></p>
            </div>`;
    return;
  }

  container.innerHTML = cvs
    .map((cv) => {
      const isDraft = cv.IsDraft === 1;
      const templateIcon = getTemplateIcon(cv.Template || "modern");
      const templateName = getTemplateName(cv.Template || "modern");
      const updateDate = formatDate(cv.CreatedAt || cv.NgayTaiLen);
      const skills = Array.isArray(cv.Skills)
        ? cv.Skills
        : cv.Skills
        ? cv.Skills.split(", ")
        : [];

      return `
            <div class="col-md-6 col-lg-4 mb-4">
              <div class="cv-card">
                <div class="cv-preview">
                  <div class="text-center">
                    ${templateIcon}
                    <p class="mt-2 mb-0">${templateName}</p>
                  </div>
                </div>
                <h6 class="fw-bold mb-2">${
                  cv.Title || cv.TenCV || "CV chưa đặt tên"
                }</h6>
                <p class="text-muted small mb-2">Cập nhật: ${updateDate}</p>

                ${
                  skills.length > 0
                    ? `
                  <div class="mb-2">
                    ${skills
                      .slice(0, 3)
                      .map(
                        (skill) =>
                          `<span class="badge bg-secondary me-1">${skill}</span>`
                      )
                      .join("")}
                    ${
                      skills.length > 3
                        ? `<span class="text-muted">+${
                            skills.length - 3
                          }</span>`
                        : ""
                    }
                  </div>`
                    : ""
                }

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge ${isDraft ? "bg-warning" : "bg-success"}">
                    ${isDraft ? "Bản nháp" : "Đã hoàn thành"}
                  </span>
                  <small class="text-muted">0 lần ứng tuyển</small>
                </div>

                <div class="btn-group w-100">
                  <button class="btn btn-outline-primary btn-sm" onclick="editCV(${
                    cv.CVId || cv.CV_id
                  })"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-outline-success btn-sm" onclick="downloadCV(${
                    cv.CVId || cv.CV_id
                  })" ${
        isDraft ? "disabled" : ""
      }><i class="bi bi-download"></i></button>
                  <button class="btn btn-outline-info btn-sm" onclick="previewCV(${
                    cv.CVId || cv.CV_id
                  })"><i class="bi bi-eye"></i></button>
                  <button class="btn btn-outline-danger btn-sm" onclick="deleteCV(${
                    cv.CVId || cv.CV_id
                  })"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>`;
    })
    .join("");
}

function getTemplateIcon(template) {
  const icons = {
    modern: '<i class="bi bi-file-text display-4 text-primary"></i>',
    professional: '<i class="bi bi-briefcase display-4 text-success"></i>',
    creative: '<i class="bi bi-palette display-4 text-warning"></i>',
    minimal: '<i class="bi bi-layout-text-sidebar display-4 text-info"></i>',
  };
  return icons[template] || icons.modern;
}

function getTemplateName(template) {
  const names = {
    modern: "Modern Template",
    professional: "Professional",
    creative: "Creative",
    minimal: "Minimal",
  };
  return names[template] || names.modern;
}

function formatDate(dateString) {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function showError(message) {
  ["allCVsContainer", "completedCVsContainer", "draftCVsContainer"].forEach(
    (id) => {
      const container = document.getElementById(id);
      container.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
              <p class="text-danger mt-3">${message}</p>
              <button class="btn btn-primary mt-2" onclick="loadAllCVs()">Thử lại</button>
            </div>`;
    }
  );
}

function editCV(id) {
  window.location.href = `cv-builder.html?id=${id}`;
}

async function downloadCV(cvId) {
  try {
    const button = event.target.closest("button");
    const originalHTML = button.innerHTML;

    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    const response = await fetch(
      `${API_BASE_URL}/${cvId}/download?userId=${currentUserId}`
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${cvId}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      const result = await response.json();
      alert("Lỗi: " + (result.message || "Không thể tải PDF"));
    }

    button.disabled = false;
    button.innerHTML = originalHTML;
  } catch (error) {
    alert("Có lỗi xảy ra khi tải PDF");
  }
}

function previewCV(id) {
  window.open(`cv-builder.html?id=${id}&preview=true`, "_blank");
}

async function deleteCV(id) {
  if (!confirm("Bạn có chắc muốn xóa CV này?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/${id}?userId=${currentUserId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Đã xóa CV thành công!");
      loadAllCVs();
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (e) {
    alert("Có lỗi xảy ra khi xóa CV");
  }
}
