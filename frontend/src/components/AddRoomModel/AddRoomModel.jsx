import React, { useState } from 'react'
import { createRoom as create } from '../../http'
import TextInput from '../shared/TextInput/TextInput'
import styles from './AddRoomModel.module.css'
import { useHistory } from 'react-router-dom';

const AddRoomModel = ({ onClose }) => {
  const history = useHistory();

  const [roomType, setRoomType] = useState('open');
  const [topic, setTopic] = useState('');

  async function createRoom() {
      try {
          if (!topic) return;
          const { data } = await create({ topic, roomType });
          history.push(`/room/${data.id}`);
      } catch (err) {
          console.log(err.message);
      }
  }
  return (
    <div className={styles.modelWrapper}>
        <div className={styles.modelBody}>
            <button onClick={onClose} className={styles.closeButton}>
                <img src="/images/close.png" alt="" />
            </button>
          <div className={styles.modelHeader}>
            <h3 className={styles.modelHeading}>Enter the topic to be discussed</h3>
             {/* eslint-disable-next-line */}
            <TextInput fullWidth="ture" value={topic} onChange={(e)=>setTopic(e.target.value)}/>
            <h3 className={styles.roomTypesHeading}>Room Type</h3>
            <div className={styles.roomTypes} >
                <div className={`${roomType==='open'? styles.active:''}`} onClick={()=>setRoomType('open')}>
                <img src="/images/Globe.png" alt="Globe" />
                <span>Open</span>
                </div>
                <div className={`${roomType==='social'? styles.active:''}`} onClick={()=>setRoomType('social')}>
                <img src="/images/Users.png" alt="Users" />
                <span>Social</span>
                </div>
                <div className={`${roomType==='closed'? styles.active:''}`} onClick={()=>setRoomType('closed')}>
                <img src="/images/Lock.png" alt="Lock" />
                <span>Closed</span>
                </div>
            </div>
          </div>
          <div className={styles.modelFooter} >
             Start a room,open to everyone
             <button onClick={createRoom} className={styles.modelButton}>
                 <span><img src="/images/modelButtonImg.png" alt="button" /></span>
                 Let's Go
             </button>
          </div>
        </div>
    </div>
  )
}

export default AddRoomModel;