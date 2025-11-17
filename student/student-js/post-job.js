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
  }
}

function removeSkill(element) {
  element.parentElement.remove();
}

function saveDraft() {
  alert("Đã lưu bản nháp!");
  // Implement draft save logic
}

function previewJob() {
  alert("Mở cửa sổ xem trước tin tuyển dụng");
  // Implement preview logic
}

// Form submission
document.getElementById("jobPostForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (confirm("Bạn có chắc muốn gửi tin tuyển dụng này để duyệt?")) {
    alert("Tin tuyển dụng đã được gửi duyệt thành công!");
    // Implement submit logic
  }
});
