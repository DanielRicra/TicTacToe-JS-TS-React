import { useState } from 'react';

import './Menu.css';
import { MenuProps } from '../types';

const Menu = ({ handlePlayAgain, newRound }: MenuProps) => {
  const [isModalDisplayed, setIsModalDisplayed] = useState(false);

  const handleMenuClick = () => {
    setIsModalDisplayed((previous) => !previous);
  }

  return (
    <div className='menu' onClick={handleMenuClick}>
      <button
        className={`menu-btn ${isModalDisplayed && 'border'}`}
      >
        Actions
        <i className={`fa-solid ${isModalDisplayed ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>

      {isModalDisplayed &&
        <div className='items shadow'>
          <button type="button" onClick={handlePlayAgain}>Reset</button>
          <button type="button" onClick={newRound}>New Round</button>
        </div>
      }
    </div>
  )
}

export default Menu;