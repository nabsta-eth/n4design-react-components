export const deactivateAllElementsBehindModal = () => {
  const selectorsToHide = ["[tabindex='0']", "[uk-tooltip]", "input"].join(",");
  const elementsToModify = document.querySelectorAll(selectorsToHide);
  elementsToModify.forEach(el => {
    el.setAttribute("tabindex", "-99");
  });
  const modalDialogElementsToReinstate = document.querySelectorAll(
    ".uk-modal-dialog [tabindex='-99']",
  );
  modalDialogElementsToReinstate.forEach(el => {
    el.setAttribute("tabindex", "0");
  });
};

export const reactivateAllElementsBehindModal = () => {
  document.querySelectorAll("[tabindex='-99']").forEach(el => {
    el.setAttribute("tabindex", "0");
  });
};
