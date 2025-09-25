import React from "react";
import Modal from "./Modal.jsx";
import TransactionForm from "./TransactionForm.js";

const TransactionModal = ({
  isModalOpen,
  setIsModalOpen,
  modalType,
  editTxnID,
  Txns,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      title={`${modalType === "add" ? "Add" : "Edit"} Transaction`}
      onClose={() => setIsModalOpen(false)}
    >
      {modalType === "add" ? (
        <TransactionForm setIsModalOpen={setIsModalOpen} />
      ) : (
        <TransactionForm
          setIsModalOpen={setIsModalOpen}
          initialData={Txns.find((item) => item._id === editTxnID)}
        />
      )}
    </Modal>
  );
};

export default TransactionModal;
