import React, { useEffect, useState } from 'react';
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel';
import RoomCard from '../../components/RoomCard/RoomCard';
import { getAllRooms } from '../../http';
import styles from './Rooms.module.css'
 
// const rooms = [
//     {
//         id: 1,
//         topic: 'Which framework best for frontend ?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 3,
//         topic: 'What’s new in machine learning?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 4,
//         topic: 'Why people use stack overflow?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 5,
//         topic: 'Artificial inteligence is the future?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
// ];

const Rooms = () => {
    const [showModel, setShowModel] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const openModel=()=>{
        setShowModel(true);
    }
    function onClose(){
        setShowModel(false);
    }
    return (
        <>
            <div className="container">
                <div className={styles.roomsHeader}>
                    <div className={styles.headerLeft}>
                        <span className={styles.heading}>All voice Rooms</span>
                        <div className={styles.searchBox}>
                            <img src="/images/searchIcon.png" alt="search" />
                            <input type="text" className={styles.searchInput} />
                        </div>
                    </div>
                    <div className={styles.headerRight}></div>
                    <button onClick={openModel} className={styles.startRoomButton} >
                        <img src="/images/roomStartButton.png" alt="Start Room" />
                        <span>Start a room</span>
                    </button>
                </div>
                <div className={styles.roomList}>
                    {
                        rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))
                    }
                </div>
            </div>
            
            {showModel && <AddRoomModel onClose={onClose}/>}
        </>
    );
};

export default Rooms;
