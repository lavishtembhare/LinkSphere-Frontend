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
      className="flex items-center justify-center p-3 backdrop-blur-md sm:p-4"
    >
      <div className="flex w-full max-w-md items-center justify-center focus:outline-none">
        <CreateNewShorten setOpen={setOpen} refetch={refetch} />
      </div>
    </Modal>
  )
}

export default ShortenPopUp