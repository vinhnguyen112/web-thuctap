// API Base URL - Thay đổi theo cấu hình của bạn
const API_BASE_URL = "http://localhost:5000/api/cv";

// Lấy userId từ localStorage hoặc session (tạm thời dùng giá trị mặc định)
// Trong thực tế, bạn nên lấy từ authentication token
let currentUserId = localStorage.getItem("userId") || "1"; // Thay bằng userId thực tế
let currentCVId = null; // Lưu CVId nếu đang edit

// Khởi tạo
document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra nếu có CVId trong URL (đang edit)
  const urlParams = new URLSearchParams(window.location.search);
  const cvId = urlParams.get("id") || urlParams.get("cv"); // Hỗ trợ cả id và cv
  if (cvId) {
    loadCV(cvId);
  }
});

function selectTemplate(element, templateName) {
  // Remove selected class from all templates
  document.querySelectorAll(".template-card").forEach((card) => {
    card.classList.remove("selected");
    card.querySelector('input[type="radio"]').checked = false;
  });

  // Add selected class to clicked template
  element.classList.add("selected");
  element.querySelector('input[type="radio"]').checked = true;

  console.log("Selected template:", templateName);
  updatePreview();
}

function addSkill() {
  const skillInput = document.getElementById("skillInput");
  const skill = skillInput.value.trim();

  if (skill) {
    const skillsContainer = document.querySelector(
      ".d-flex.flex-wrap.gap-2.mb-2"
    );
    const skillBadge = document.createElement("span");
    skillBadge.className = "badge bg-primary";
    skillBadge.innerHTML = `${skill} <i class="bi bi-x ms-1" onclick="removeSkill(this)"></i>`;
    skillsContainer.appendChild(skillBadge);
    skillInput.value = "";
    updatePreview();
  }
}

function removeSkill(element) {
  element.parentElement.remove();
  updatePreview();
}

// Lấy dữ liệu từ form
function getFormData() {
  const titleInput = document.getElementById("cvTitle");
  const objectiveInput = document.getElementById("cvObjective");
  const templateInput = document.querySelector(
    'input[name="template"]:checked'
  );

  // Lấy danh sách kỹ năng
  const skillBadges = document.querySelectorAll(
    ".d-flex.flex-wrap.gap-2.mb-2 .badge"
  );
  const skills = Array.from(skillBadges)
    .map((badge) => {
      // Remove icon × hoặc bi-x
      return badge.textContent
        .trim()
        .replace(/\s*[×x]\s*$/i, "")
        .trim();
    })
    .filter((skill) => skill.length > 0);

  // Lấy dữ liệu từ preview (trong thực tế, bạn nên có form đầy đủ hơn)
  const cvData = {
    fullName:
      document.querySelector(".cv-template-preview h2")?.textContent.trim() ||
      "",
    position:
      document
        .querySelector(".cv-template-preview p.text-muted")
        ?.textContent.trim() || "",
    phone: "",
    email: "",
    address: "",
    objective: objectiveInput?.value || "",
    education: [],
    experience: [],
    projects: [],
  };

  return {
    userId: currentUserId,
    cvId: currentCVId,
    title: titleInput?.value || "CV chưa đặt tên",
    objective: objectiveInput?.value || "",
    skills: skills,
    template: templateInput?.value || "modern",
    cvData: cvData,
  };
}

// Lưu CV chính thức
async function saveCV(event) {
  try {
    const data = getFormData();

    if (!data.title || data.title.trim() === "") {
      alert("Vui lòng nhập tiêu đề CV!");
      return;
    }

    // Lấy button từ event hoặc tìm bằng selector
    const button =
      event?.target || document.querySelector('button[onclick*="saveCV"]');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';

    const url = currentCVId
      ? `${API_BASE_URL}/${currentCVId}`
      : `${API_BASE_URL}/save`;
    const method = currentCVId ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      currentCVId = result.data.CVId || currentCVId;
      alert("Lưu CV thành công!");
      // Có thể redirect hoặc reload trang
      // window.location.href = `my-cvs.html`;
    } else {
      alert("Lỗi: " + result.message);
    }

    button.disabled = false;
    button.innerHTML = originalText;
  } catch (error) {
    console.error("Lỗi lưu CV:", error);
    alert(
      "Có lỗi xảy ra khi lưu CV. Vui lòng thử lại!\n\n" + (error.message || "")
    );

    // Reset button nếu có
    const button =
      event?.target || document.querySelector('button[onclick*="saveCV"]');
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Lưu CV';
    }
  }
}

// Lưu bản nháp
async function saveDraft(event) {
  try {
    const data = getFormData();

    // Lấy button từ event hoặc tìm bằng selector
    const button =
      event?.target || document.querySelector('button[onclick*="saveDraft"]');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';

    const response = await fetch(`${API_BASE_URL}/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      currentCVId = result.data.CVId;
      alert("Đã lưu bản nháp!");
    } else {
      alert("Lỗi: " + result.message);
    }

    button.disabled = false;
    button.innerHTML = originalText;
  } catch (error) {
    console.error("Lỗi lưu bản nháp:", error);
    alert(
      "Có lỗi xảy ra khi lưu bản nháp. Vui lòng thử lại!\n\n" +
        (error.message || "")
    );

    // Reset button nếu có
    const button =
      event?.target || document.querySelector('button[onclick*="saveDraft"]');
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-file-earmark me-2"></i>Lưu bản nháp';
    }
  }
}

// Tải CV từ server
async function loadCV(cvId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${cvId}?userId=${currentUserId}`
    );
    const result = await response.json();

    if (result.success) {
      const cv = result.data;
      currentCVId = cv.CVId;

      // Điền dữ liệu vào form
      const titleInput = document.getElementById("cvTitle");
      const objectiveInput = document.getElementById("cvObjective");

      if (titleInput) titleInput.value = cv.Title || "";
      if (objectiveInput) objectiveInput.value = cv.Objective || "";

      // Chọn template
      const templateInput = document.querySelector(
        `input[name="template"][value="${cv.Template || "modern"}"]`
      );
      if (templateInput) {
        templateInput.checked = true;
        const templateCard = templateInput.closest(".template-card");
        if (templateCard) {
          selectTemplate(templateCard, cv.Template);
        }
      }

      // Hiển thị skills
      if (cv.Skills && cv.Skills.length > 0) {
        const skillsContainer = document.querySelector(
          ".d-flex.flex-wrap.gap-2.mb-2"
        );
        skillsContainer.innerHTML = "";
        cv.Skills.forEach((skill) => {
          const skillBadge = document.createElement("span");
          skillBadge.className = "badge bg-primary";
          skillBadge.innerHTML = `${skill} <i class="bi bi-x ms-1" onclick="removeSkill(this)"></i>`;
          skillsContainer.appendChild(skillBadge);
        });
      }

      updatePreview();
    } else {
      alert("Không tìm thấy CV!");
    }
  } catch (error) {
    console.error("Lỗi tải CV:", error);
    alert("Có lỗi xảy ra khi tải CV!");
  }
}

// Tải CV dạng PDF
async function downloadPDF(event) {
  if (!currentCVId) {
    alert("Vui lòng lưu CV trước khi tải PDF!");
    return;
  }

  try {
    // Lấy button từ event hoặc tìm bằng selector
    const button =
      event?.target || document.querySelector('button[onclick*="downloadPDF"]');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Đang tạo PDF...';

    const response = await fetch(
      `${API_BASE_URL}/${currentCVId}/download?userId=${currentUserId}`
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert("Tải PDF thành công!");
    } else {
      const result = await response.json();
      alert("Lỗi: " + (result.message || "Không thể tải PDF"));
    }

    button.disabled = false;
    button.innerHTML = originalText;
  } catch (error) {
    console.error("Lỗi tải PDF:", error);
    alert(
      "Có lỗi xảy ra khi tải PDF. Vui lòng thử lại!\n\n" + (error.message || "")
    );

    // Reset button nếu có
    const button =
      event?.target || document.querySelector('button[onclick*="downloadPDF"]');
    if (button) {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-download me-1"></i>Tải xuống PDF';
    }
  }
}

// Cập nhật preview (tùy chọn - có thể mở rộng)
function updatePreview() {
  // Có thể cập nhật preview real-time ở đây
  console.log("Preview updated");
}

// Gán event cho nút tải PDF
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.querySelector(".btn-primary");
  if (downloadBtn && downloadBtn.textContent.includes("Tải xuống PDF")) {
    downloadBtn.onclick = downloadPDF;
  }
});
