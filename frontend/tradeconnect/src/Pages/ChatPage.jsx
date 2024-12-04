import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import MessageContainer from '../components/MessageContainer.jsx';

const ChatPage = () => {
    const [isSideVisible, setIsSideVisible] = useState(true);

    const handleSelectUser = (user) => {
        if (user && window.innerWidth < 768) {
            setIsSideVisible(false);
        }
    };

    const handleSideVisibility = () => {
        setIsSideVisible(true);
    };

    return (
        <div className='h-screen max-h-screen overflow-hidden w-screen'>
            {/* Main container */}
            <div className='relative h-full flex md:flex-row w-full'>
                {/* Sidebar */}
                <div className={`
                    ${isSideVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    transition-transform duration-300 ease-in-out
                    fixed md:relative 
                    top-0 left-0 
                    h-full w-full md:w-[350px] 
                    bg-white 
                    z-30
                    border-r border-gray-200
                `}>
                    <Sidebar onSelectUser={handleSelectUser} />
                </div>

                {/* Message Container */}
                <div className={`
                    ${!isSideVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                    transition-transform duration-300 ease-in-out
                    fixed md:relative
                    top-0 left-0
                    h-full w-full md:flex-1
                    bg-gray-100
                    z-20
                `}>
                    <MessageContainer 
                        onBackUser={handleSideVisibility} 
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;