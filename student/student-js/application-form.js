let selectedCV = 1;

function selectCV(cvId) {
  selectedCV = cvId;

  // Update UI
  document.querySelectorAll(".cv-option").forEach((option) => {
    option.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");

  // Update radio button
  document.querySelector(`input[value="${cvId}"]`).checked = true;

  console.log("Selected CV:", cvId);
}

function previewApplication() {
  const coverLetter = document.getElementById("coverLetter").value;
  alert("Mở cửa sổ xem trước hồ sơ ứng tuyển...");
  // Implement preview logic here
}

function submitApplication(event) {
  event.preventDefault();

  const formData = {
    cvId: selectedCV,
    coverLetter: document.getElementById("coverLetter").value,
    source: document.querySelector("select").value,
    expectedSalary: document.querySelector('input[type="number"]').value,
    startDate: document.querySelector('input[type="date"]').value,
    saveCoverLetter: document.getElementById("saveCoverLetter").checked,
  };

  console.log("Submitting application:", formData);

  // Simulate API call
  setTimeout(() => {
    alert(
      "🎉 Ứng tuyển thành công! Hồ sơ của bạn đã được gửi đến nhà tuyển dụng."
    );
    window.location.href = "my-applications.html";
  }, 1000);
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("Application form loaded for job ID: 1");
});
