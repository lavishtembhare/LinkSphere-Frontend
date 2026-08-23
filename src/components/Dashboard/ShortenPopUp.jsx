import React from 'react'
import Modal from '@mui/material/Modal'
import CreateNewShorten from './CreateNewShorten'

const ShortenPopUp = ({ open, setOpen, refetch }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="shorten-modal-title"
      aria-describedby="shorten-modal-description"
      className="flex items-center justify-center p-4 backdrop-blur-md"
    >
      <div className="w-full max-w-lg focus:outline-none">
        <CreateNewShorten setOpen={setOpen} refetch={refetch} />
      </div>
    </Modal>
  )
}

export default ShortenPopUp