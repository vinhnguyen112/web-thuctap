// Search Form Handler
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const keyword = document.getElementById("keywordInput").value;
  const location = document.getElementById("locationSelect").value;
  const category = document.getElementById("categorySelect").value;

  console.log("Searching for:", { keyword, location, category });
  // Implement search logic here
});

// Filter Functions
function applyFilters() {
  const filters = {
    jobTypes: getCheckedValues([
      "fulltime",
      "parttime",
      "internship",
      "remote",
    ]),
    experience: getCheckedValues(["intern", "fresher", "junior", "middle"]),
    salary: getCheckedValues(["salary1", "salary2", "salary3", "salary4"]),
    companySize: getCheckedValues(["startup", "sme", "enterprise"]),
  };

  console.log("Applied filters:", filters);
  // Implement filter logic here
}

function resetFilters() {
  document
    .querySelectorAll('.filter-sidebar input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });
  // Re-check default values
  document.getElementById("fulltime").checked = true;
  document.getElementById("fresher").checked = true;
  document.getElementById("salary2").checked = true;
  document.getElementById("startup").checked = true;

  console.log("Filters reset");
}

function getCheckedValues(ids) {
  return ids.filter((id) => document.getElementById(id).checked);
}

// Sort Function
function sortJobs(criteria) {
  console.log("Sorting by:", criteria);
  // Implement sort logic here
}

// Save Job Function
function saveJob(jobId) {
  const button = event.target;
  button.innerHTML = '<i class="bi bi-bookmark-check"></i>';
  button.classList.remove("btn-outline-primary");
  button.classList.add("btn-success");

  alert("Đã lưu công việc vào danh sách yêu thích!");
  console.log("Saved job:", jobId);
}
