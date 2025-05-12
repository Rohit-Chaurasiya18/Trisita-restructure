import { GrClose } from "react-icons/gr";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import CommonButton from "../buttons/CommonButton";

const CommonModal = ({
  isOpen,
  handleClose,
  className,
  title,
  modalProps = {},
  children,
  maxWidth,
  onWheel,
  modalClassname,
  size,
  scrollable = false,
}) => {
  const closeBtn = (
    <div className="gr-close-icon" onClick={handleClose}>
      <GrClose size={20} />
    </div>
  );
  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={handleClose}
        className={`${className} modal-styles `}
        {...modalProps}
        centered
        min
        style={{ maxWidth: maxWidth }}
        onWheel={onWheel}
        size={size ? size : "lg"}
        scrollable={scrollable}
      >
        <ModalHeader
          toggle={handleClose}
          close={closeBtn}
          className="header-title"
        >
          {title}
        </ModalHeader>
        <ModalBody className={modalClassname}>{children}</ModalBody>
        <ModalFooter>
          <CommonButton
            style={{
              width: "fit-content",
              background: "#1595dd",
            }}
            onClick={handleClose}
          >
            Close
          </CommonButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CommonModal;
