// BUG: the click handler sets `visiblity` (typo) instead of `display`,
// so the modal never becomes visible. ReplayPatch should detect and fix this.
document.getElementById("openBtn").addEventListener("click", () => {
  document.getElementById("modal").style.visiblity = "visible";
});

