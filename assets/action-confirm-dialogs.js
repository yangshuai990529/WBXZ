(() => {
  let activeDialog = null;
  let focusedIndex = 1;
  let pendingAction = null;

  const dialogCopy = {
    reset: {
      title: "重置色彩风格",
      message: "确定恢复至初始色彩风格吗？",
    },
    apply: {
      title: "应用色彩风格",
      message: "确定应用当前色彩风格吗？",
    },
  };

  const dispatchKey = (key) => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      }),
    );
  };

  const getActionButtons = () =>
    Array.from(document.querySelectorAll(".panel-actions button"));

  const getActionType = (button) => {
    const label = button?.textContent?.trim();
    if (label === "重置") return "reset";
    if (label === "应用") return "apply";
    return null;
  };

  const isFocused = (button, action) =>
    action === "reset"
      ? button.classList.contains("bg-white")
      : button.classList.contains("bg-tv-highlight");

  const runConfirmedAction = (action, attempts = 0) => {
    const buttons = getActionButtons();
    const target = buttons.find((button) => getActionType(button) === action);
    if (!target || attempts > 4) return;

    if (isFocused(target, action)) {
      dispatchKey("Enter");
      return;
    }

    const focusedAction = buttons.find((button) => {
      const type = getActionType(button);
      return type && isFocused(button, type);
    });

    if (focusedAction) {
      dispatchKey(action === "reset" ? "ArrowUp" : "ArrowDown");
    } else {
      dispatchKey("ArrowDown");
    }

    requestAnimationFrame(() => runConfirmedAction(action, attempts + 1));
  };

  const updateFocus = () => {
    if (!activeDialog) return;
    activeDialog
      .querySelectorAll("button")
      .forEach((button, index) =>
        button.classList.toggle("is-focused", index === focusedIndex),
      );
  };

  const closeDialog = () => {
    activeDialog?.remove();
    activeDialog = null;
    pendingAction = null;
    document.body.classList.remove("action-confirm-open");
  };

  const confirmDialog = () => {
    const action = pendingAction;
    closeDialog();
    requestAnimationFrame(() => runConfirmedAction(action));
  };

  const openDialog = (action) => {
    if (activeDialog || !dialogCopy[action]) return;

    pendingAction = action;
    focusedIndex = 1;
    const copy = dialogCopy[action];
    const modal = document.createElement("div");
    modal.className = "action-confirm-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="action-confirm-card">
        <h2>${copy.title}</h2>
        <p>${copy.message}</p>
        <div class="action-confirm-actions">
          <button type="button" data-confirm-action="cancel">取消</button>
          <button type="button" data-confirm-action="confirm">确认</button>
        </div>
      </div>
    `;

    modal
      .querySelector('[data-confirm-action="cancel"]')
      .addEventListener("click", closeDialog);
    modal
      .querySelector('[data-confirm-action="confirm"]')
      .addEventListener("click", confirmDialog);

    document.body.appendChild(modal);
    document.body.classList.add("action-confirm-open");
    activeDialog = modal;
    updateFocus();
  };

  document.addEventListener(
    "click",
    (event) => {
      if (activeDialog || document.querySelector(".entry-modal")) return;
      const button = event.target.closest(".panel-actions button");
      const action = getActionType(button);
      if (!action) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      openDialog(action);
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (activeDialog) {
        if (event.key === "ArrowLeft") {
          focusedIndex = 0;
          updateFocus();
        } else if (event.key === "ArrowRight") {
          focusedIndex = 1;
          updateFocus();
        } else if (event.key === "Enter") {
          activeDialog.querySelectorAll("button")[focusedIndex].click();
        } else if (event.key === "Escape" || event.key === "Backspace") {
          closeDialog();
        } else {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      if (document.querySelector(".entry-modal") || event.key !== "Enter") return;

      const focusedButton = getActionButtons().find((button) => {
        const action = getActionType(button);
        return action && isFocused(button, action);
      });
      const action = getActionType(focusedButton);
      if (!action) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      openDialog(action);
    },
    true,
  );
})();
