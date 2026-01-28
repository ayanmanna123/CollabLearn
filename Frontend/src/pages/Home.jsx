import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [roomCode, setRoomCode]=useState('');
    const navigate=useNavigate();
    const handleForm=(e)=>{
        e.preventDefault();
        navigate(`/room/${roomCode}`)

    }

  return (
    <div className='home-page'>
        <form action="" className='form' onSubmit={handleForm}>
            <div>
                <label htmlFor="">Enter Room Code</label>
                <input type="text" required placeholder='Enter Room Code' 
                value={roomCode}
                onChange={(e)=>setRoomCode(e.target.value)}/>
            </div>
            <button type='submit'>
                Enter Room
            </button>
        </form>
    </div>
  )
}

export default Home