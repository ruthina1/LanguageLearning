// frontend/src/pages/Social/FriendsChallenges.jsx
import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import FriendList from './FriendList';
import ChallengeCard from './ChallengeCard';
import CreateChallengeModal from './CreateChallengeModal';
import { FaUsers, FaTrophy, FaSearch, FaUserPlus, FaCheck } from 'react-icons/fa';
import './FriendsChallenges.css';
import Navbar from '../../components/Layout/Navbar';

// Mock data
const mockFriends = [
  {
    id: 'user2',
    username: 'Bob Smith',
    avatar: '👨‍💻',
    progress: { level: 4, xp: 980, streak: 12 },
    lastActive: '2024-01-15T14:30:00Z',
    mutualFriends: 3,
    currentChallenge: 'Vocabulary Sprint'
  },
  {
    id: 'user3',
    username: 'Carol Davis',
    avatar: '👩‍🏫',
    progress: { level: 6, xp: 1500, streak: 25 },
    lastActive: '2024-01-15T10:15:00Z',
    mutualFriends: 5,
    currentChallenge: 'Grammar Master'
  }
];

const mockFriendRequests = [
  {
    id: 'req1',
    username: 'Frank Miller',
    avatar: '👨‍🔧',
    progress: { level: 5, xp: 1200, streak: 15 },
    mutualFriends: 2,
    sentAt: '2024-01-15T11:00:00Z'
  }
];

const mockActiveChallenges = [
  {
    id: 'challenge1',
    title: 'Vocabulary Sprint',
    type: 'vocabulary',
    creator: 'Bob Smith',
    participants: ['user1', 'user2', 'user3'],
    goal: 'Learn 50 new words',
    progress: { current: 35, target: 50 },
    endDate: '2024-01-20T23:59:59Z',
    prize: '500 XP',
    leaderboard: [
      { username: 'Alice Johnson', progress: 35 },
      { username: 'Bob Smith', progress: 28 }
    ]
  }
];

const mockSearchResults = [
  {
    id: 'user6',
    username: 'Henry Taylor',
    avatar: '👨‍🌾',
    progress: { level: 4, xp: 1100, streak: 18 },
    mutualFriends: 3
  }
];

export default function FriendsChallenges () {
  const { 
    friends, 
    friendRequests, 
    activeChallenges, 
    acceptFriendRequest,
    searchUsers,
    sendFriendRequest 
  } = useSocial();

  // Use mock data if context data is empty
  const friendsData = friends && friends.length > 0 ? friends : mockFriends;
  const requestsData = friendRequests && friendRequests.length > 0 ? friendRequests : mockFriendRequests;
  const challengesData = activeChallenges && activeChallenges.length > 0 ? activeChallenges : mockActiveChallenges;
  
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate API call with mock data
      setTimeout(() => {
        setSearchResults(mockSearchResults);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleAcceptRequest = (requestId) => {
    if (acceptFriendRequest) {
      acceptFriendRequest(requestId);
    } else {
      // Mock acceptance
      console.log('Accepted request:', requestId);
    }
  };

  const handleSendRequest = (userId) => {
    if (sendFriendRequest) {
      sendFriendRequest(userId);
    } else {
      // Mock sending
      console.log('Sent friend request to:', userId);
    }
  };

  return (
    <div className="friends-challenges-page">
      <div className="page-header">
        <h1>Social Learning</h1>
        <p>Learn together with friends and challenges</p>
      </div>

      <div className="navigation-tabs">
        <button 
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <FaUsers /> Friends ({friendsData.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          <FaTrophy /> Challenges ({challengesData.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          <FaSearch /> Discover
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'friends' && (
          <div className="friends-tab">
            {requestsData.length > 0 && (
              <div className="friend-requests-section">
                <h3>Friend Requests ({requestsData.length})</h3>
                {requestsData.map(request => (
                  <div key={request.id} className="friend-request">
                    <div className="request-info">
                      <div className="user-avatar">{request.avatar || '👤'}</div>
                      <div className="user-details">
                        <div className="username">{request.username}</div>
                        <div className="user-level">Level {request.progress.level}</div>
                        <div className="mutual-friends">{request.mutualFriends} mutual friends</div>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        <FaCheck /> Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <FriendList friends={friendsData} />
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-tab">
            <div className="challenges-header">
              <h3>Active Challenges</h3>
              <button 
                className="create-challenge-btn"
                onClick={() => setShowCreateChallenge(true)}
              >
                <FaTrophy /> Create Challenge
              </button>
            </div>

            <div className="challenges-grid">
              {challengesData.length === 0 ? (
                <div className="no-challenges">
                  <div className="no-challenges-icon">⚔️</div>
                  <h4>No active challenges</h4>
                  <p>Create a challenge to compete with friends!</p>
                  <button 
                    className="create-first-challenge"
                    onClick={() => setShowCreateChallenge(true)}
                  >
                    Create First Challenge
                  </button>
                </div>
              ) : (
                challengesData.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="discover-tab">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search for language learners..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-results">
              {searchResults.map(user => (
                <div key={user.id} className="user-result">
                  <div className="user-info">
                    <div className="user-avatar">{user.avatar || '👤'}</div>
                    <div className="user-details">
                      <div className="username">{user.username}</div>
                      <div className="user-stats">
                        Level {user.progress?.level || 0} • {user.progress?.xp || 0} XP
                        {user.mutualFriends > 0 && (
                          <span className="mutual-friends">{user.mutualFriends} mutual friends</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="add-friend-btn"
                    onClick={() => handleSendRequest(user.id)}
                  >
                    <FaUserPlus /> Add Friend
                  </button>
                </div>
              ))}
            </div>

            {searchResults.length === 0 && searchQuery.length > 2 && (
              <div className="no-results">
                <p>No users found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateChallengeModal
        show={showCreateChallenge}
        onClose={() => setShowCreateChallenge(false)}
      />
    </div>
  );
};