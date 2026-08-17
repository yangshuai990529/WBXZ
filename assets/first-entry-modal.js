(() => {
  const modal = document.querySelector(".entry-modal");
  if (!modal) return;

  const cancelButton = modal.querySelector('[data-entry-action="cancel"]');
  const confirmButton = modal.querySelector('[data-entry-action="confirm"]');
  const buttons = [cancelButton, confirmButton];
  let focusedIndex = 1;

  const updateFocus = () => {
    buttons.forEach((button, index) => {
      button.classList.toggle("is-focused", index === focusedIndex);
    });
  };

  const confirmEntry = () => {
    document.body.classList.remove("calibration-gated");
    modal.remove();
  };

  const cancelEntry = () => {
    modal.remove();
  };

  cancelButton.addEventListener("click", cancelEntry);
  confirmButton.addEventListener("click", confirmEntry);

  document.addEventListener(
    "keydown",
    (event) => {
      if (!document.body.contains(modal)) return;

      if (event.key === "ArrowLeft") {
        focusedIndex = 0;
        updateFocus();
      } else if (event.key === "ArrowRight") {
        focusedIndex = 1;
        updateFocus();
      } else if (event.key === "Enter") {
        buttons[focusedIndex].click();
      } else if (event.key === "Escape" || event.key === "Backspace") {
        cancelEntry();
      } else {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  updateFocus();
})();
