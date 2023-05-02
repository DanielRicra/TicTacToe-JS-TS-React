import { ModalProps } from '../types';
import './Modal.css';

const Modal = ({ message, handlePlayAgain }: ModalProps) => {
  return (
    <div className='modal'>
      <div className="modal-contents" data-id="modal-contents">
        <p>{message}</p>
        <button type="button" onClick={handlePlayAgain}>Play again</button>
      </div>
    </div>
  )
}

export default Modal;