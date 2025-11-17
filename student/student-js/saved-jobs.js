function viewJob(jobId) {
  window.location.href = `job-detail.html?id=${jobId}`;
}

function applyJob(jobId) {
  if (confirm("Bạn có muốn ứng tuyển vào công việc này?")) {
    window.location.href = `application-form.html?job=${jobId}`;
  }
}

function unsaveJob(jobId) {
  if (confirm("Bạn có chắc muốn bỏ lưu công việc này?")) {
    const jobCard = event.target.closest(".saved-job-card");
    jobCard.style.opacity = "0";
    setTimeout(() => {
      jobCard.remove();
      updateStats();
      checkEmptyState();
    }, 300);

    console.log("Unsaved job:", jobId);
  }
}

function filterSavedJobs(filter) {
  console.log("Filtering saved jobs by:", filter);
  // Implement filter logic here
}

function applyAllPriority() {
  if (confirm("Bạn có muốn ứng tuyển tất cả công việc ưu tiên cao?")) {
    alert("Đang gửi ứng tuyển cho các công việc ưu tiên...");
    // Implement bulk apply logic
  }
}

function clearAllSaved() {
  if (
    confirm(
      "Bạn có chắc muốn xóa tất cả công việc đã lưu? Hành động này không thể hoàn tác."
    )
  ) {
    document.querySelectorAll(".saved-job-card").forEach((card) => {
      card.style.opacity = "0";
      setTimeout(() => card.remove(), 300);
    });
    setTimeout(() => {
      updateStats();
      checkEmptyState();
    }, 500);
  }
}

function exportSavedJobs() {
  alert("Đang tải về danh sách công việc đã lưu...");
  // Implement export logic
}

function updateStats() {
  // Update stats after changes
  const remainingJobs = document.querySelectorAll(".saved-job-card").length;
  console.log("Remaining saved jobs:", remainingJobs);
}

function checkEmptyState() {
  const savedJobs = document.querySelectorAll(".saved-job-card");
  const emptyState = document.getElementById("emptyState");
  const savedJobsList = document.getElementById("savedJobsList");

  if (savedJobs.length === 0) {
    savedJobsList.classList.add("d-none");
    emptyState.classList.remove("d-none");
  } else {
    savedJobsList.classList.remove("d-none");
    emptyState.classList.add("d-none");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("Saved jobs page loaded");
  checkEmptyState();
});
