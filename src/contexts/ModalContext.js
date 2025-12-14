import { html } from "htm/preact";
import { createContext } from "preact";
import { useState, useContext } from "preact/hooks";
import { CustomModal } from "../components/CustomModal.js";

/**
 * @typedef {object} ModalState
 * @property {boolean} modalShow - Whether the modal is visible.
 * @property {string} modalTitle - The title of the modal.
 * @property {string} modalContent - The content of the modal.
 * @property {'alert' | 'confirm'} modalType - The type of the modal.
 * @property {Function | null} modalCallback - The callback function to execute on confirmation.
 */

/**
 * @typedef {object} ModalActions
 * @property {(title: string, content: string, type?: 'alert' | 'confirm', callback?: Function | null) => void} showModal - Function to show the modal.
 * @property {() => void} handleModalConfirm - Function to handle modal confirmation.
 * @property {() => void} handleModalCancel - Function to handle modal cancellation.
 */

/**
 * @typedef {ModalState & ModalActions} ModalContextType
 */

/**
 * @type {import("preact").Context<ModalContextType>}
 */
const ModalContext = createContext();

/**
 * Custom hook to manage modal state.
 * @returns {ModalContextType}
 */
function useModal() {
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalType, setModalType] = useState("alert");
  const [modalCallback, setModalCallback] = useState(/** @type {Function | null} */ (null));

  /**
   * Shows the modal with the given title, content, and type.
   * @param {string} title - The title of the modal.
   * @param {string} content - The content of the modal.
   * @param {'alert' | 'confirm'} [type='alert'] - The type of the modal.
   * @param {Function | null} [callback=null] - The callback function to execute on confirmation.
   */
  const showModal = (title, content, type = "alert", callback = null) => {
    setModalTitle(title);
    setModalContent(content);
    setModalType(type);
    setModalCallback(() => callback);
    setModalShow(true);
  };

  const handleModalConfirm = () => {
    setModalShow(false);
    if (modalCallback) {
      modalCallback();
    }
  };

  const handleModalCancel = () => {
    setModalShow(false);
  };

  return {
    modalShow,
    modalTitle,
    modalContent,
    modalType,
    showModal,
    handleModalConfirm,
    handleModalCancel,
  };
}

/**
 * Provides the modal context to its children.
 * @param {object} props - The component props.
 * @param {import("preact").ComponentChildren} props.children - The child components.
 * @returns {import("preact").VNode}
 */
export const ModalProvider = ({ children }) => {
  const {
    modalShow,
    modalTitle,
    modalContent,
    modalType,
    showModal,
    handleModalConfirm,
    handleModalCancel,
  } = useModal();

  return html`
    <${ModalContext.Provider} value=${{ showModal }}>
      ${children}
      <${CustomModal}
        show=${modalShow}
        title=${modalTitle}
        content=${modalContent}
        type=${modalType}
        onConfirm=${handleModalConfirm}
        onCancel=${handleModalCancel}
      />
    </${ModalContext.Provider}>
  `;
};

/**
 * Custom hook to use the modal context.
 * @returns {{showModal: (title: string, content: string, type?: 'alert' | 'confirm', callback?: Function | null) => void}}
 */
export const useModalContext = () => useContext(ModalContext);

