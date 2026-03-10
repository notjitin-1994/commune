import { User, Flag, Post, Comment, Room, Message, CallLog, Conversation } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

// Demo user - India specific
export const demoUser: User = {
  id: 'user-1',
  phone: '+919876543210',
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  lastName: 'Sharma',
  avatarUrl: '',
  isAdmin: false,
  createdAt: new Date().toISOString(),
};

// Other demo users - Indian real estate agents and community members
export const demoUsers: User[] = [
  {
    id: 'user-2',
    phone: '+919876543211',
    name: 'Priya Patel',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@propconsultant.in',
    bio: 'Certified Real Estate Consultant with 10+ years experience in Mumbai residential market',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'user-3',
    phone: '+919876543212',
    name: 'Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@delhiproperties.in',
    bio: 'Property Manager | Commercial & Residential Specialist | Delhi NCR Expert',
    avatarUrl: '',
    isAdmin: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'user-4',
    phone: '+919876543213',
    name: 'Ananya Reddy',
    firstName: 'Ananya',
    lastName: 'Reddy',
    email: 'ananya.reddy@bangalorehomes.in',
    bio: 'Luxury Property Consultant | First-time Buyer Specialist | Bangalore Market Expert',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'user-5',
    phone: '+919876543214',
    name: 'Vikram Iyer',
    firstName: 'Vikram',
    lastName: 'Iyer',
    email: 'vikram.iyer@gmail.com',
    bio: 'Local homeowner and RWA member | Community advocate',
    avatarUrl: '',
    isAdmin: false,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

// Demo flags - Indian locations (Mumbai, Delhi, Bangalore, Hyderabad)
export const demoFlags: Flag[] = [
  {
    id: 'flag-1',
    userId: 'user-2',
    lat: 19.0760,
    lng: 72.8777,
    category: 2,
    title: 'Open House: 3BHK Bandra West',
    description: 'Beautiful 3BHK apartment with sea view. Newly renovated modular kitchen, Italian marble flooring. Open house this Saturday 11AM-4PM. Asking ₹4.5 Crores.',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'flag-2',
    userId: 'user-3',
    lat: 28.6139,
    lng: 77.2090,
    category: 1,
    title: 'Price Drop Alert: Luxury Condo GK-1',
    description: '3BHK penthouse unit just reduced by ₹25 Lakhs! Now ₹3.25 Crores. Building amenities include gym, swimming pool, and 24hr security. Motivated seller!',
    status: 'active',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'flag-3',
    userId: 'user-4',
    lat: 12.9716,
    lng: 77.5946,
    category: 3,
    title: 'New Launch: Prestige Greenwoods',
    description: 'Phase 2 of Prestige Greenwoods now pre-selling! 3BHK & 4BHK homes starting at ₹1.8 Crores. Model apartment open daily 10AM-7PM. Amenities include clubhouse and tennis courts.',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'flag-4',
    userId: 'user-2',
    lat: 19.0176,
    lng: 72.8562,
    category: 1,
    title: 'Urgent: Water Supply Disruption - Pali Hill',
    description: 'Emergency water supply repair affecting buildings on Pali Hill Road (Plot 45-67). Water supply expected to be restored by 6 PM today. Plan accordingly for site visits.',
    status: 'active',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'flag-5',
    userId: 'user-3',
    lat: 28.7041,
    lng: 77.1025,
    category: 2,
    title: 'First-Time Home Buyer Workshop',
    description: 'Free seminar this Saturday at Community Center, Rohini. Learn about home loans, PMAY subsidy, and the registration process. RSVP required. Hindi & English.',
    status: 'active',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'flag-6',
    userId: 'user-5',
    lat: 17.4065,
    lng: 78.4772,
    category: 3,
    title: 'Sold! Jubilee Hills Villa',
    description: 'Just closed! Congratulations to the Sharma family on their beautiful new home. Sale price: ₹8.5 Crores. This stunning 4BHK villa was on the market for just 12 days.',
    status: 'active',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'flag-7',
    userId: 'user-4',
    lat: 12.9352,
    lng: 77.6245,
    category: 2,
    title: 'Rental Available: Koramangala 1BHK',
    description: 'Furnished 1BHK in prime Koramangala location. ₹28,000/month. Modular kitchen, power backup, covered parking. Walking distance from metro. Available immediately!',
    status: 'active',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'flag-8',
    userId: 'user-2',
    lat: 19.1136,
    lng: 72.8697,
    category: 1,
    title: 'Road Closure: Andheri Flyover Construction',
    description: 'Major metro construction on Andheri Kurla Road for the next 3 weeks. Access to properties limited. Alternative routes via JVLR advised. Plan extra time for site visits.',
    status: 'active',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
];

// Demo posts - Indian real estate content
export const demoPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-2',
    flagId: 'flag-1',
    content: 'OPEN HOUSE ALERT! Do not miss this stunning 3BHK in Bandra West. Freshly renovated with modular kitchen and premium fittings. Master bedroom with walk-in wardrobe. Premium society with amenities! Stop by Saturday 11AM-4PM or DM for a private viewing. #OpenHouse #MumbaiRealEstate #Bandra',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'post-2',
    userId: 'user-3',
    flagId: 'flag-2',
    content: 'PRICE REDUCTION ALERT! The luxury penthouse in Greater Kailash Part 1 just dropped ₹25 Lakhs! This is a rare opportunity to own a 3BHK unit with city views at ₹3.25 Crores. Building has gym, swimming pool, and concierge. Motivated seller - offers reviewed Monday. Who wants a private tour?',
    category: 1,
    isNews: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'post-3',
    userId: 'user-4',
    flagId: 'flag-3',
    content: 'EXCITING NEWS! Prestige Greenwoods Phase 2 is now available for pre-launch! These 3BHK & 4BHK homes are going fast - starting at ₹1.8 Crores. I just saw the model flat and the finishes are incredible. Italian marble, modular kitchen, smart home features. DM to book your unit!',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'post-4',
    userId: 'user-5',
    flagId: 'flag-6',
    content: 'SOLD! Congratulations to the Sharma family on their beautiful new villa in Jubilee Hills! It was an honor to help them find their dream home. Sold for ₹8.5 Crores in just 12 days! Thinking of selling? Now is the time. Market is hot!',
    category: 3,
    isNews: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'post-5',
    userId: 'user-3',
    flagId: 'flag-5',
    content: 'FIRST-TIME HOME BUYERS! Join us this Saturday for a FREE workshop at Community Center, Rohini. We will cover: - Home loan process & eligibility - PMAY subsidy (up to ₹2.67 Lakhs!) - Registration & stamp duty - RERA guidelines. RSVP by Thursday - limited seats!',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'post-6',
    userId: 'user-4',
    flagId: 'flag-7',
    content: 'RENTAL ALERT! Furnished 1BHK in prime Koramangala just hit the market. ₹28,000/month includes maintenance. Modular kitchen, power backup, covered parking. Walking distance from metro station. Near restaurants & cafes. Available now!',
    category: 2,
    isNews: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'post-7',
    userId: 'user-2',
    flagId: 'flag-4',
    content: 'IMPORTANT NOTICE for my clients and fellow agents: Emergency water supply disruption on Pali Hill Road today until 6PM. If you have site visits scheduled, please inform your clients. BMC is doing emergency repairs. Will update when supply is restored.',
    category: 1,
    isNews: true,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'post-8',
    userId: 'user-5',
    flagId: 'flag-8',
    content: 'HEADS UP! Andheri Kurla Road is under major construction for Metro Line 7 for the next 3 weeks. If you are visiting properties in the area, use JVLR or Western Express Highway as alternate routes. The metro will definitely improve connectivity once complete!',
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
    content: 'Is there a servant room? And what are the maintenance charges?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    userId: 'user-4',
    content: 'The modular kitchen looks stunning! Is that Hettich or Hafele fittings?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    userId: 'user-5',
    content: 'That is a great price for GK-1! Are maintenance charges included?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'comment-4',
    postId: 'post-3',
    userId: 'user-2',
    content: 'Do they have any east-facing units available?',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'comment-5',
    postId: 'post-5',
    userId: 'user-4',
    content: 'Can we bring a family member to the workshop? My parents want to attend too.',
    isPrivate: false,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'comment-6',
    postId: 'post-7',
    userId: 'user-3',
    content: 'Thanks for the heads up! I have a 3PM showing at Building 52 - will reschedule.',
    isPrivate: true,
    createdAt: new Date(Date.now() - 2700000).toISOString(),
  },
];

// Demo rooms
export const demoRooms: Room[] = [
  {
    id: 'room-1',
    title: 'First-Time Home Buyers Discussion',
    description: 'Ask questions about home loans, registration, and buying process',
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
    title: 'RWA & Property Managers Network',
    description: 'Weekly discussion for resident welfare associations and property management',
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
    title: 'Site Visit Coordination',
    description: 'Coordinate weekend property visits and open houses',
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

// Demo conversations
export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-2'],
    lastMessageAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-3'],
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'conv-3',
    participantIds: ['user-1', 'user-4'],
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'conv-4',
    participantIds: ['user-1', 'user-5'],
    lastMessageAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

// Demo messages - India-specific chat content
export const demoMessages: Message[] = [
  // Conversation 1: Priya Patel - Property discussion
  {
    id: 'msg-1-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Hi Arjun! I wanted to follow up on the Bandra West property we discussed.',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg-1-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hi Priya! Yes, I am definitely still interested. That sea view flat is beautiful!',
    sentAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
  },
  {
    id: 'msg-1-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'Great news! The sellers have accepted a backup offer. Would you like to schedule a second visit?',
    sentAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'msg-1-4',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Absolutely! When would work? I am flexible this week.',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-1-5',
    conversationId: 'conv-1',
    senderId: 'user-2',
    content: 'How about Thursday at 6PM? I can meet you at the site.',
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
    content: 'Also, I just got the society NOC. The building is clear for sale. Good news!',
    sentAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'msg-1-8',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'That is reassuring to hear. Thanks for the update!',
    sentAt: new Date(Date.now() - 300000).toISOString(),
  },

  // Conversation 2: Rajesh Kumar - Commercial property inquiry
  {
    id: 'msg-2-1',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'Hey Arjun, thanks for reaching out about the office space in Connaught Place.',
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg-2-2',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'No problem Rajesh! I am looking for something around 2,000 sq ft for my growing team.',
    sentAt: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
  },
  {
    id: 'msg-2-3',
    conversationId: 'conv-2',
    senderId: 'user-3',
    content: 'I have a perfect unit in Nehru Place - 2,200 sq ft, recently renovated, ₹1.5 Lakhs/month. Want to see it?',
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
    content: 'Yes! 4 reserved spots plus visitor parking. Metro connectivity is excellent too. When can you visit?',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'msg-2-6',
    conversationId: 'conv-2',
    senderId: 'user-1',
    content: 'This Friday morning works for me.',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
  },

  // Conversation 3: Ananya Reddy - Luxury property consultation
  {
    id: 'msg-3-1',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: 'Hi Arjun! I hope you are doing well. I wanted to check in after the site visit last weekend.',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'msg-3-2',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'Hi Ananya! Yes, the villa in Whitefield was stunning. Still thinking about those garden views!',
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
    content: 'That is good to know. What are the maintenance charges there?',
    sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  },
  {
    id: 'msg-3-5',
    conversationId: 'conv-3',
    senderId: 'user-4',
    content: '₹15,000/month includes security, landscaping, clubhouse, and power backup. It is actually quite reasonable for the community.',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg-3-6',
    conversationId: 'conv-3',
    senderId: 'user-1',
    content: 'Thanks for the info Ananya. Let me discuss with my family and get back to you.',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
  },

  // Conversation 4: Vikram Iyer - Community/neighbor chat
  {
    id: 'msg-4-1',
    conversationId: 'conv-4',
    senderId: 'user-5',
    content: 'Hey Arjun! Welcome to the neighbourhood!',
    sentAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'msg-4-2',
    conversationId: 'conv-4',
    senderId: 'user-1',
    content: 'Thanks Vikram! Everyone has been so friendly.',
    sentAt: new Date(Date.now() - 86400000 * 5 + 7200000).toISOString(),
  },
  {
    id: 'msg-4-3',
    conversationId: 'conv-4',
    senderId: 'user-5',
    content: 'There is a RWA meeting this Saturday at the community hall. You should come!',
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
    content: 'Starts at 11AM. Tea and snacks will be served!',
    sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'msg-4-6',
    conversationId: 'conv-4',
    senderId: 'user-1',
    content: 'Will be there! Looking forward to meeting more neighbours.',
    sentAt: new Date(Date.now() - 18000000).toISOString(),
  },
];

// Demo call logs
export const demoCallLogs: CallLog[] = [
  {
    id: 'call-1',
    callerId: 'user-2',
    receiverId: 'user-1',
    callType: 'audio',
    direction: 'incoming',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    endedAt: new Date(Date.now() - 3600000 * 2 + 420000).toISOString(),
    durationSeconds: 420,
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
    durationSeconds: 900,
    status: 'completed',
  },
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
    durationSeconds: 600,
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
    durationSeconds: 360,
    status: 'completed',
  },
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
    durationSeconds: 1200,
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
    durationSeconds: 1800,
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
    durationSeconds: 300,
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
  
  // ALWAYS seed messages and conversations
  const existingMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  const existingConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
  
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
  
  // Always seed call logs if not exists
  const existingCallLogs = JSON.parse(localStorage.getItem('callLogs') || '[]');
  if (!existingCallLogs || existingCallLogs.length < demoCallLogs.length) {
    localStorage.setItem('callLogs', JSON.stringify(demoCallLogs));
    console.log('[OK] Seeded demo call logs:', demoCallLogs.length);
  }
}

// Force re-seed function
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
