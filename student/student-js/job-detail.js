function applyForJob() {
  // Check if user has CVs
  if (
    confirm(
      "Bạn có muốn ứng tuyển vào vị trí Frontend Developer Intern tại Tech Corp Vietnam?"
    )
  ) {
    window.location.href = "application-form.html?job=1";
  }
}

function saveJob() {
  const button = event.target;
  button.innerHTML = '<i class="bi bi-bookmark-check me-2"></i>Đã lưu';
  button.classList.remove("btn-outline-primary");
  button.classList.add("btn-success");

  alert("Đã lưu tin tuyển dụng vào danh sách yêu thích!");
}

function shareJob() {
  const jobUrl = window.location.href;
  navigator.clipboard.writeText(jobUrl).then(() => {
    alert("Đã copy link công việc vào clipboard!");
  });
}

function reportJob() {
  const reason = prompt("Vui lòng nhập lý do báo cáo tin tuyển dụng này:");
  if (reason) {
    alert("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét tin tuyển dụng này.");
    console.log("Reported job for reason:", reason);
  }
}

// Check application compatibility
function checkCompatibility() {
  // This would typically call an API to check compatibility
  return 85; // 85% compatibility
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  const compatibility = checkCompatibility();
  console.log("Job compatibility:", compatibility + "%");
});
