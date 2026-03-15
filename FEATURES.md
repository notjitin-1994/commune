# Commune Feature Requirements

**Document Version:** 1.0  
**Last Updated:** March 15, 2026  
**Project:** Commune - Community Communication Platform

---

## 📋 Overview

This document outlines the feature requirements for Commune's next development phase. These requirements were gathered from stakeholder feedback and product planning sessions.

---

## 🏷️ Feature 1: Map Tags ↔ Posts Relationship

### Description
Create a relationship system between map location tags and posts.

### Requirements
- **Tag Creation:** Tags can be created independently
- **Post Creation:** Posts can be created with or without tag linkage
- **Optional Linking:** Tags can optionally be linked during post creation
- **Relationship Rules:**
  - One tag can have many posts (1:N)
  - One post can have maximum one tag (N:1)
  - Location tags aggregate multiple posts

### Use Cases
- Users can browse posts by map location
- Tags serve as geographic categories for content
- Posts without tags appear in general feed

---

## 📸 Feature 2: Photo Upload on Posts

### Description
Enable image attachments for posts.

### Requirements
- Photo upload is **optional** during post creation
- Support common image formats (JPG, PNG, WebP)
- Image compression and optimization
- Thumbnail generation for feed display

### Technical Considerations
- Storage solution (Supabase Storage recommended)
- Image size limits
- CDN for fast delivery
- EXIF data stripping for privacy

---

## 💼 Feature 3: Workspace (Rooms Redesign)

### Description
Redesign the Rooms feature into a WhatsApp-style workspace system.

### Key Principles
- **Privacy-First:** No unique IDs, names, or contact info visible to other members
- **Anonymous Participation:** Users interact without exposing personal data
- **Project-Focused:** Built around work/tasks rather than social connection

### Comparison
| Aspect | Old (Teams-style) | New (WhatsApp-style) |
|--------|-------------------|----------------------|
| Visibility | User identities exposed | Anonymous/role-based |
| Purpose | Meetings & calls | Project collaboration |
| Privacy | Low | High |

### Requirements
- Group messaging without identity exposure
- Role-based permissions
- Project context integration
- Message threading for tasks

---

## 👥 Feature 4: Account Tiers & Network System

### Account Types

#### 1. Paid Broker Account
- **Network Creation:** Can build own network
- **Member Types:** Can add both free and paid brokers
- **User Access:** Can add paid users to their network
- **Permissions:** Full project management capabilities

#### 2. Free Broker Account
- **Network:** Cannot create own network
- **Access:** Can join existing broker networks
- **Limitations:** No network management, can participate in projects

#### 3. Paid User Account
- **Purpose:** For finding brokers and available roles
- **Network:** Joins broker networks, doesn't create them
- **Discovery:** Can browse and apply for roles

### Network Rules
```
Paid Broker Network:
├── Free Brokers (participants)
├── Paid Brokers (participants)  
└── Paid Users (seekers)

Free Broker:
└── Joins other networks (no own network)

Paid User:
└── Joins broker networks to find opportunities
```

---

## ✅ Feature 5: Project Management System

### Overview
Comprehensive project management integrated with map and network features.

### Core Components

#### 1. Project Creation
- Create projects from map tags
- Auto-link all posts under that tag to the project
- Set project visibility (network-only, public, private)

#### 2. User Management
- **Admin:** Full control, can add/remove users
- **Add Users:** Admin can invite both paid and free accounts to project
- **Role Assignment:** Assign roles during invitation

#### 3. Checklist System
- Create checklist templates
- Templates can be:
  - Global (apply to all users)
  - Role-specific (apply to users with specific roles)
  - User-specific (apply to individual users)
- Tasks have:
  - Title and description
  - Due dates
  - Completion status
  - Assignment

#### 4. Task Tracking
- View all tasks by project
- Filter by user, role, or status
- Progress indicators
- Notifications for due dates

### User Flow
```
1. Broker creates project from map tag
   ↓
2. All posts under tag become project context
   ↓
3. Broker invites users (paid/free) to project
   ↓
4. Admin assigns roles to users
   ↓
5. Checklist templates auto-generate tasks
   ↓
6. Users complete tasks, updates visible to admin
```

---

## 🔐 Privacy & Security Requirements

### Data Privacy
- No phone number sharing between users
- No email exposure in workspaces
- Anonymous identifiers for group participation
- Role-based data access

### Access Control
- Network-level permissions
- Project-level permissions
- Role-based feature access
- Tier-based limitations

---

## 📱 UI/UX Considerations

### Mobile-First
- All features optimized for mobile
- Touch-friendly interfaces
- Offline capability where possible

### Accessibility
- Screen reader support
- High contrast modes
- Font size adjustments

### Performance
- Lazy loading for posts
- Image optimization
- Efficient map rendering

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (images) |
| Real-time | Supabase Realtime |
| Maps | Leaflet + OpenStreetMap |

---

## 📊 Database Schema Notes

### New Tables Needed
- `tags` - Map location tags
- `posts` - User posts (with optional tag_id)
- `workspaces` - WhatsApp-style groups
- `workspace_members` - Anonymous membership
- `account_tiers` - Tier definitions
- `networks` - Broker networks
- `network_members` - Network relationships
- `projects` - Project definitions
- `project_members` - Project assignments
- `checklist_templates` - Reusable checklists
- `checklist_items` - Individual tasks
- `tasks` - User task assignments

---

## 🚀 Implementation Priority

### Phase 1: Foundation
1. Account tiers system
2. Basic network structure
3. Photo upload on posts

### Phase 2: Core Features
1. Map tags ↔ posts relationship
2. Workspace redesign
3. Project creation

### Phase 3: Management
1. Checklist system
2. Task assignment
3. Progress tracking

### Phase 4: Polish
1. Notifications
2. Analytics dashboard
3. Performance optimization

---

## 📝 Notes for Developers

- **Kimi Code CLI:** This document should be referenced when implementing any of the above features
- **Context:** All features are interconnected—consider impact on other systems
- **Testing:** Each feature needs unit tests and integration tests
- **Documentation:** Update API docs and user guides as features ship

---

*For questions or clarifications, refer to the stakeholder feedback log in `memory/commune-feedback.md`*
