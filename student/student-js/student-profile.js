function previewAvatar(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById("avatarPreview");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function toggleEditMode() {
  const inputs = document.querySelectorAll(
    ".profile-card input, .profile-card textarea"
  );
  const isReadOnly = inputs[0].readOnly;

  inputs.forEach((input) => {
    input.readOnly = !isReadOnly;
  });

  const button = event.target;
  if (isReadOnly) {
    button.innerHTML = '<i class="bi bi-check me-1"></i>Lưu thay đổi';
    button.classList.remove("btn-outline-primary");
    button.classList.add("btn-primary");
  } else {
    button.innerHTML = '<i class="bi bi-pencil me-1"></i>Chỉnh sửa';
    button.classList.remove("btn-primary");
    button.classList.add("btn-outline-primary");
  }
}
