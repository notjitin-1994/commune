import { User, Flag, Post, Comment, Room, Message, CallLog, Conversation } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

// Demo user
export const demoUser: User = {
  id: 'user-1',
  phone: '+1234567890',
  name: 'Alex Johnson',
  firstName: 'Alex',
  lastName: 'Johnson',
  avatarUrl: '',
  isAdmin: false,
  createdAt: new Date().toISOString(),
};

// Other demo users - Real estate agents and community members
export const demoUsers: User[] = [
  {
    id: 'user-2',
    phone: '+0987654321',
    name: 'Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@realtypro.com',
    bio: 'Licensed Realtor with 10+ years experience in residential sales',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'user-3',
    phone: '+1122334455',
    name: 'Mike Williams',
    firstName: 'Mike',
    lastName: 'Williams',
    email: 'mike.w@homefinders.com',
    bio: 'Property Manager | Commercial Real Estate Specialist',
    avatarUrl: '',
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'user-4',
    phone: '+5544332211',
    name: 'Emma Davis',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@luxehomes.com',
    bio: 'Luxury Property Consultant | First-time Buyer Specialist',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'user-5',
    phone: '+6677889900',
    name: 'David Park',
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@gmail.com',
    bio: 'Local homeowner and community advocate',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

// Demo flags - Real Estate relevant locations
export const demoFlags: Flag[] = [
  {
    id: 'flag-1',
    userId: 'user-2',
    lat: 40.7128,
    lng: -74.0060,
    category: 2,
    title: 'Open House: 123 Main St',
    description: 'Beautiful 3BR/2BA colonial. Newly renovated kitchen, hardwood floors throughout. Open house this Saturday 1-4PM. Asking $675,000.',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'flag-2',
    userId: 'user-3',
    lat: 40.7580,
    lng: -73.9855,
    category: 1,
    title: 'Price Drop Alert: Luxury Condo',
    description: '2BR penthouse unit just reduced by $50K! Now $825,000. Building amenities include gym, pool, and 24hr concierge. Motivated seller!',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'flag-3',
    userId: 'user-4',
    lat: 40.7282,
    lng: -73.7949,
    category: 3,
    title: 'New Construction: Oak Valley Estates',
    description: 'Phase 2 of Oak Valley now pre-selling! 4BR/3BA homes starting at $850K. Model home open daily 10AM-6PM. HOA includes pool and tennis courts.',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'flag-4',
    userId: 'user-2',
    lat: 40.6892,
    lng: -74.0445,
    category: 1,
    title: 'Urgent: Water Shutoff - Maple Ave',
    description: 'Emergency water main repair affecting properties 45-67 Maple Ave. Water service expected to be restored by 6 PM today. Plan accordingly for showings.',
    status: 'active',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'flag-5',
    userId: 'user-3',
    lat: 40.7489,
    lng: -73.9680,
    category: 2,
    title: 'First-Time Buyer Workshop',
    description: 'Free seminar this Saturday at Community Center. Learn about mortgages, down payment assistance programs, and the home buying process. RSVP required.',
    status: 'active',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'flag-6',
    userId: 'user-5',
    lat: 40.7614,
    lng: -73.9776,
    category: 3,
    title: 'Sold! 456 Park Avenue',
    description: 'Just closed! Congratulations to the new homeowners. Sale price: $1.2M. This stunning 4BR townhouse was on the market for just 8 days.',
    status: 'active',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'flag-7',
    userId: 'user-4',
    lat: 40.7023,
    lng: -74.0115,
    category: 2,
    title: 'Rental Available: Downtown Loft',
    description: '1BR loft in historic building. $2,400/month. Stainless appliances, exposed brick, rooftop access. Available immediately. Pet friendly!',
    status: 'active',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'flag-8',
    userId: 'user-2',
    lat: 40.7289,
    lng: -73.9871,
    category: 1,
    title: 'Road Closure: Elm St Construction',
    description: 'Major repaving project on Elm St between 5th and 8th. Access to properties limited. Alternative routes advised for the next 2 weeks.',
    status: 'active',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

// Demo posts - Real Estate relevant content, each linked to a flag
export const demoPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    flagId: 'flag-1', // Open House: 123 Main St
    content: 'OPEN HOUSE ALERT! Don\'t miss this stunning colonial at 123 Main St. Freshly renovated kitchen with quartz counters and stainless appliances. Master suite with walk-in closet. Great school district! Stop by Saturday 1-4PM or DM me for a private showing. #OpenHouse #DreamHome #RealEstate',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'post-2',
    userId: 'user-3',
    flagId: 'flag-2', // Price Drop: Luxury Condo
    content: 'PRICE REDUCTION ALERT! The luxury penthouse downtown just dropped $50K! This is a rare opportunity to own a 2BR unit with skyline views at $825K. Building has gym, pool, and concierge. Motivated seller - offers reviewed Monday. Who wants a private tour?',
    category: 1,
    isNews: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post-3',
    userId: 'user-4',
    flagId: 'flag-3', // New Construction
    content: 'EXCITING NEWS! Oak Valley Estates Phase 2 is now available for pre-sale! These 4BR/3BA homes are going fast - starting at $850K. I just walked the model home and the finishes are incredible. Quartz, hardwood, smart home features. DM me to reserve your lot before they\'re gone!',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'post-4',
    userId: 'user-5',
    flagId: 'flag-6', // Sold property
    content: 'SOLD! Congratulations to the Martinez family on their beautiful new home at 456 Park Avenue! It was an honor to help them navigate this competitive market. Sold for $1.2M in just 8 days! Thinking of selling? Now is the time. Let\'s talk about your home\'s value.',
    category: 3,
    isNews: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'post-5',
    userId: 'user-3',
    flagId: 'flag-5', // First-time buyer workshop
    content: 'FIRST-TIME BUYERS! Join us this Saturday for a FREE workshop at the Community Center. We\'ll cover: - Mortgage pre-approval process - Down payment assistance programs (up to $15K available!) - What to expect during closing - Market trends. RSVP by Thursday - spots filling fast!',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'post-6',
    userId: 'user-4',
    flagId: 'flag-7', // Rental available
    content: 'RENTAL ALERT! Gorgeous 1BR loft in historic downtown building just hit the market. $2,400/month includes water/trash. Exposed brick, high ceilings, stainless appliances. Rooftop deck with city views! Pet friendly. Available now. First month + security to move in.',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'post-7',
    userId: 'user-2',
    flagId: 'flag-4', // Water shutoff
    content: 'IMPORTANT NOTICE for my clients and fellow agents: Emergency water shutoff on Maple Ave (properties #45-67) today until 6PM. If you have showings scheduled, please inform your buyers. The city is doing emergency repairs. I\'ll update when service is restored.',
    category: 1,
    isNews: true,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'post-8',
    userId: 'user-5',
    flagId: 'flag-8', // Road closure
    content: 'HEADS UP! Elm St is under major construction between 5th and 8th for the next 2 weeks. If you\'re visiting properties in the area, use Maple or Oak as alternate routes. The repaving will definitely improve the neighborhood once complete! Plan extra time for showings.',
    category: 1,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

// Demo comments
export const demoComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    userId: 'user-3',
    content: 'Is there a basement? And what are the property taxes?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    userId: 'user-4',
    content: 'The kitchen renovation looks stunning in the photos! Is that quartz or granite?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    userId: 'user-5',
    content: 'That\'s a great price for that location! Are HOAs included?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'comment-4',
    postId: 'post-3',
    userId: 'user-2',
    content: 'Do they have any lots with walk-out basements available?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'comment-5',
    postId: 'post-5',
    userId: 'user-4',
    content: 'Can you bring a co-buyer to the workshop? My partner and I want to attend together.',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'comment-6',
    postId: 'post-7',
    userId: 'user-3',
    content: 'Thanks for the heads up! I have a 3PM showing at #52 - will reschedule.',
    isPrivate: true,
    createdAt: new Date(Date.now() - 2700000).toISOString(),
  },
];

// Demo rooms
export const demoRooms: Room[] = [
  {
    id: 'room-1',
    title: 'First-Time Home Buyers Chat',
    description: 'Ask questions about the buying process',
    creatorId: 'user-2',
    adminIds: ['user-2'],
    isPrivate: false,
    maxParticipants: 50,
    status: 'open',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    participantCount: 12,
  },
  {
    id: 'room-2',
    title: 'Agent Network Meeting',
    description: 'Weekly real estate professional networking',
    creatorId: 'user-3',
    adminIds: ['user-3'],
    isPrivate: false,
    maxParticipants: 30,
    status: 'open',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    participantCount: 8,
  },
  {
    id: 'room-3',
    title: 'Open House Debrief',
    description: 'Discussion about this weekend\'s showings',
    creatorId: 'user-4',
    adminIds: ['user-4'],
    isPrivate: true,
    maxParticipants: 15,
    status: 'open',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    participantCount: 5,
  },
];

// Demo conversations - More comprehensive chat data
export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-2'],
    lastMessageAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-3'],
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'conv-3',
    participantIds: ['user-1', 'user-4'],
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 'conv-4',
    participantIds: ['user-1', 'user-5'],
    lastMessageAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
  },
];

// Demo messages - Comprehensive chat history for each conversation
export const demoMessages: Message[] = [
  // Conversation 1: Sarah Chen - Active property discussion
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Hi Alex! I wanted to follow up on the 123 Main St property we discussed.',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hi Sarah! Yes, I\'m definitely still interested. That colonial is beautiful!',
    sentAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
  },
  {
    id: 'msg-1-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Great news! The sellers just accepted a backup offer position. Would you like to schedule a second viewing?',
    sentAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'msg-1-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Absolutely! When would work? I\'m flexible this week.',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-1-5',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'How about Thursday at 6PM? I can meet you there.',
    sentAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg-1-6',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Perfect, see you then!',
    sentAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'msg-1-7',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Also, I just got the inspection report back. The roof is in great condition - only minor repairs needed.',
    sentAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'msg-1-8',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'That\'s reassuring to hear. Thanks for the update!',
    sentAt: new Date(Date.now() - 300000).toISOString(),
  },

  // Conversation 2: Mike Williams - Commercial property inquiry
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'Hey Alex, thanks for reaching out about the downtown office space.',
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg-2-2',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'No problem Mike! I\'m looking for something around 2,000 sq ft for my growing team.',
    sentAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
  },
  {
    id: 'msg-2-3',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'I have a perfect unit on 5th Ave - 2,200 sq ft, recently renovated, $4,500/month. Want to see it?',
    sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'msg-2-4',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'That sounds ideal! Does it have parking?',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg-2-5',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'Yes! 4 dedicated spots plus visitor parking. When can you tour?',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'msg-2-6',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'This Friday morning works for me.',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
  },

  // Conversation 3: Emma Davis - Luxury property consultation
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: 'Hi Alex! I hope you\'re doing well. I wanted to check in after the open house last weekend.',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'msg-3-2',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'Hi Emma! Yes, the penthouse was stunning. Still thinking about those views!',
    sentAt: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
  },
  {
    id: 'msg-3-3',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: 'They really are spectacular! The seller is motivated and we might be able to negotiate on the price.',
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg-3-4',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'That\'s good to know. What\'s the HOA situation there?',
    sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'msg-3-5',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: '$850/month includes all amenities - pool, gym, concierge, and parking. It\'s actually quite reasonable for the building.',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg-3-6',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'Thanks for the info Emma. Let me discuss with my partner and get back to you.',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
  },

  // Conversation 4: David Park - Community/neighbor chat
  {
    id: 'msg-4-1',
    conversationId: 'conv-4',
    senderId: 'user-5',
    content: 'Hey Alex! Welcome to the neighborhood!',
    sentAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'msg-4-2',
    conversationId: 'conv-4',
    senderId: 'user-1',
    content: 'Thanks David! Everyone has been so friendly.',
    sentAt: new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
  },
  {
    id: 'msg-4-3',
    conversationId: 'conv-4',
    senderId: 'user-5',
    content: 'There\'s a neighborhood BBQ this Saturday at the park. You should come!',
    sentAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'msg-4-4',
    conversationId: 'conv-4',
    senderId: 'user-1',
    content: 'That sounds great! What time?',
    sentAt: new Date(Date.now() - 86400000 * 4 + 3600000).toISOString(),
  },
  {
    id: 'msg-4-5',
    conversationId: 'conv-4',
    senderId: 'user-5',
    content: 'Starts at 2PM. Bring a side dish if you can!',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'msg-4-6',
    conversationId: 'conv-4',
    senderId: 'user-1',
    content: 'Will do! Looking forward to meeting more neighbors.',
    sentAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

// Demo call logs - More comprehensive call history
export const demoCallLogs: CallLog[] = [
  // Recent calls
  {
    id: 'call-1',
    callerId: 'user-2',
    receiverId: 'user-1',
    callType: 'audio',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    endedAt: new Date(Date.now() - 3600000 * 2 + 420000).toISOString(),
    durationSeconds: 420, // 7 min
    status: 'completed',
  },
  {
    id: 'call-2',
    callerId: 'user-1',
    receiverId: 'user-3',
    callType: 'video',
    direction: 'outgoing',
    startedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    endedAt: new Date(Date.now() - 3600000 * 4 + 900000).toISOString(),
    durationSeconds: 900, // 15 min
    status: 'completed',
  },
  // Yesterday's calls
  {
    id: 'call-3',
    callerId: 'user-4',
    receiverId: 'user-1',
    callType: 'video',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    status: 'missed',
  },
  {
    id: 'call-4',
    callerId: 'user-1',
    receiverId: 'user-2',
    callType: 'audio',
    direction: 'outgoing',
    startedAt: new Date(Date.now() - 86400000 + 7200000).toISOString(),
    endedAt: new Date(Date.now() - 86400000 + 7800000).toISOString(),
    durationSeconds: 600, // 10 min
    status: 'completed',
  },
  {
    id: 'call-5',
    callerId: 'user-5',
    receiverId: 'user-1',
    callType: 'audio',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 86400000 + 18000000).toISOString(),
    endedAt: new Date(Date.now() - 86400000 + 18600000).toISOString(),
    durationSeconds: 360, // 6 min
    status: 'completed',
  },
  // Older calls
  {
    id: 'call-6',
    callerId: 'user-3',
    receiverId: 'user-1',
    callType: 'video',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'declined',
  },
  {
    id: 'call-7',
    callerId: 'user-1',
    receiverId: 'user-4',
    callType: 'audio',
    direction: 'outgoing',
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 3 + 1200000).toISOString(),
    durationSeconds: 1200, // 20 min
    status: 'completed',
  },
  {
    id: 'call-8',
    callerId: 'user-2',
    receiverId: 'user-1',
    callType: 'video',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 4 + 1800000).toISOString(),
    durationSeconds: 1800, // 30 min
    status: 'completed',
  },
  {
    id: 'call-9',
    callerId: 'user-5',
    receiverId: 'user-1',
    callType: 'audio',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'missed',
  },
  {
    id: 'call-10',
    callerId: 'user-1',
    receiverId: 'user-3',
    callType: 'audio',
    direction: 'outgoing',
    startedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 6 + 300000).toISOString(),
    durationSeconds: 300, // 5 min
    status: 'completed',
  },
];

// Function to seed all data
export function seedAllData() {
  if (typeof window === 'undefined') return;
  
  // Always seed users if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([demoUser, ...demoUsers]));
  }
  
  // Always seed flags if not exists
  if (!localStorage.getItem('flags')) {
    localStorage.setItem('flags', JSON.stringify(demoFlags));
  }
  
  // Always seed posts if not exists
  if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify(demoPosts));
  }
  
  // Always seed comments if not exists
  if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify(demoComments));
  }
  
  // Always seed rooms if not exists
  if (!localStorage.getItem('rooms')) {
    localStorage.setItem('rooms', JSON.stringify(demoRooms));
  }
  
  // ALWAYS seed messages and conversations (force refresh for chat data)
  // This ensures chat data is always available
  const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  const existingConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
  
  // Seed if empty OR if demo data version changed (check by comparing lengths)
  const needsMessageSeed = !existingMessages || existingMessages.length < demoMessages.length;
  const needsConversationSeed = !existingConversations || existingConversations.length < demoConversations.length;
  
  if (needsMessageSeed) {
    localStorage.setItem('messages', JSON.stringify(demoMessages));
    console.log('[OK] Seeded demo messages:', demoMessages.length);
  } else {
    console.log('[INFO] Messages already seeded:', existingMessages.length);
  }
  
  if (needsConversationSeed) {
    localStorage.setItem('conversations', JSON.stringify(demoConversations));
    console.log('[OK] Seeded demo conversations:', demoConversations.length);
  } else {
    console.log('[INFO] Conversations already seeded:', existingConversations.length);
  }
  
  // Always seed call logs if not exists or empty
  const existingCallLogs = JSON.parse(localStorage.getItem('callLogs') || '[]');
  if (!existingCallLogs || existingCallLogs.length < demoCallLogs.length) {
    localStorage.setItem('callLogs', JSON.stringify(demoCallLogs));
    console.log('[OK] Seeded demo call logs:', demoCallLogs.length);
  }
}

// Force re-seed function (call this to reset all data)
export function forceReseed() {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('users', JSON.stringify([demoUser, ...demoUsers]));
  localStorage.setItem('flags', JSON.stringify(demoFlags));
  localStorage.setItem('posts', JSON.stringify(demoPosts));
  localStorage.setItem('comments', JSON.stringify(demoComments));
  localStorage.setItem('rooms', JSON.stringify(demoRooms));
  localStorage.setItem('messages', JSON.stringify(demoMessages));
  localStorage.setItem('conversations', JSON.stringify(demoConversations));
  localStorage.setItem('callLogs', JSON.stringify(demoCallLogs));
  
  console.log('All data re-seeded!');
  window.location.reload();
}
