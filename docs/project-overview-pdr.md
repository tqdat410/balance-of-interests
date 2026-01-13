# Project Overview - Product Design Requirements

## Project Information

| Field | Value |
|-------|-------|
| **Name** | Can Can Loi Ich (Balance of Interests) |
| **Display** | loi ⚖ ich |
| **Type** | Educational Turn-based Strategy Game |
| **Platform** | Web (Desktop + Mobile) |
| **Course** | FPT University - MLN122 |

## Product Vision

An educational game that teaches socioeconomic balance concepts through strategic gameplay. Players must maintain harmony between three fundamental pillars of society: Government (Nha Nuoc), Businesses (Doanh Nghiep), and Workers (Nguoi Lao Dong).

## Target Audience

- Vietnamese university students
- Players interested in economics/politics education
- Casual strategy game players

## Core Gameplay

### Game Flow

```
START -> Enter Name -> Round 1-30 Loop -> Ending Screen
              |               |
              v               v
         Leaderboard    Each Round:
                        - Random turn order
                        - 3 entities take actions
                        - Events at specific rounds
                        - Check win/lose conditions
```

### Entities

| Entity | Vietnamese | Symbol | Initial Bar | Color |
|--------|------------|--------|-------------|-------|
| Government | Nha Nuoc | N | 20/50 | Red |
| Businesses | Doanh Nghiep | D | 20/50 | Blue |
| Workers | Nguoi Lao Dong | L | 20/50 | Green |

### Win/Lose Conditions

| Condition | Result | Description |
|-----------|--------|-------------|
| Any bar = 0 | **LOSE** | Game ends immediately |
| Complete 30 rounds | **WIN** | Survival ending |
| Complete 30 rounds + all bars equal | **WIN** | Harmony ending (rare) |

### Round Mechanics

1. Turn order randomized each round
2. Each entity selects from 2-3 random actions
3. Actions affect all three bars (+/- effects)
4. Round modifiers increase difficulty:
   - Rounds 1-10: Normal effects
   - Rounds 11-20: Effects reduced by 1
   - Rounds 21-30: Effects reduced by 2 (and only 2 action choices)

### Events System

| Round | Event Type | Event Name | Effect |
|-------|------------|------------|--------|
| 5 | Special (gamble) | Startup | Win: +15/+15/+30, Lose: -20 Workers |
| 10 | Forced | Thien Tai (Disaster) | -10/-10/-10 |
| 15 | Special (gamble) | Dau Tu San Pham Moi | Win: +20/+40/+20, Lose: -20 Bus |
| 20 | Forced | Khung Hoang Kinh Te | -20/-20/-20 |
| 25 | Special (gamble) | Chon Phe (Quoc Te) | Win: +49/+49/+49, Lose: -30/-30/-30 |
| 30 | Forced | Chien Tranh (War) | -30/-30/-30 |

**Special Events:**
- 10% success rate
- Can skip without effect
- Entity-specific (Workers/Business/Government)

## Actions Catalog

### Government Actions (15 total)

| Action | Gov | Bus | Worker |
|--------|-----|-----|--------|
| Tang thue Doanh nghiep | +12 | -12 | -5 |
| Giam thue Doanh nghiep | -12 | +8 | +2 |
| Tang thue TNCN | +12 | -3 | -7 |
| Giam thue TNCN | -11 | +2 | +7 |
| Dau tu co so ha tang | -14 | +5 | +9 |
| Dau tu vao Giao duc | -14 | +5 | +9 |
| Tro cap an sinh xa hoi | -12 | +3 | +7 |
| Tro cap that nghiep | -9 | 0 | +3 |
| Tang muc luong toi thieu | +2 | -13 | +7 |
| Siet chat quy dinh kinh doanh | +10 | -12 | -5 |
| Khuyen khich Startup | -12 | +3 | +6 |
| Kich cau kinh te | -16 | +12 | +6 |
| Mo rong hop tac quoc te | +3 | +3 | +3 |
| Ra soat tham nhung | +6 | -9 | +3 |
| Siet chat hang gia - gian lan | +6 | -10 | +3 |

### Business Actions (12 total)

| Action | Gov | Bus | Worker |
|--------|-----|-----|--------|
| Ep buoc tang ca | +3 | +10 | -11 |
| Cat giam nhan su | -6 | +12 | -11 |
| Dau tu cong nghe moi | +6 | +4 | +3 |
| Tron thue | -11 | +7 | -9 |
| Tang luong | +2 | -6 | +7 |
| Mo rong san xuat | +2 | +6 | +4 |
| Hoi lo quan chuc | -12 | +6 | -7 |
| Xa thai ra moi truong | -13 | +6 | -7 |
| Tang gia ban san pham | +2 | +5 | -9 |
| San xuat hang gia | -12 | +6 | -10 |
| Chay dua giam gia | -1 | +4 | -7 |
| Dao tao lao dong | +2 | +3 | +5 |

### Worker Actions (9 total)

| Action | Gov | Bus | Worker |
|--------|-----|-----|--------|
| Nang cao tay nghe | +4 | +3 | +5 |
| Nhay viec | -1 | -10 | +3 |
| Gian lan trong lao dong | -3 | -9 | +2 |
| Nghi viec | -6 | -8 | -4 |
| Tu nguyen lam them gio | +5 | +4 | +2 |
| Lam them nhieu viec | +5 | +2 | +4 |
| Dinh cong | -13 | -11 | -9 |
| Bieu tinh doi tang luong | -11 | -12 | -8 |
| Lam viec hang hai | +3 | +5 | +3 |

## User Stories

### US-001: Start New Game
**As a** player  
**I want to** enter my name and start a new game  
**So that** I can play and have my score tracked

**Acceptance Criteria:**
- Name input (2-24 characters)
- Validation with shake animation on error
- Smooth transition animation to game

### US-002: Make Strategic Decisions
**As a** player  
**I want to** see 2-3 action choices per turn  
**So that** I can make strategic decisions

**Acceptance Criteria:**
- Actions show name and image
- Effects displayed after selection
- Visual feedback on action cards

### US-003: Track Progress
**As a** player  
**I want to** see current round, turn order, and bar values  
**So that** I can plan my strategy

**Acceptance Criteria:**
- Status bars visible at all times
- Round counter (X/30)
- Current entity indicator

### US-004: Handle Events
**As a** player  
**I want to** respond to special events  
**So that** I can survive challenges or take risks

**Acceptance Criteria:**
- Event popup with image and description
- Skip/Execute options for special events
- Continue button for forced events

### US-005: View Leaderboard
**As a** player  
**I want to** see top scores  
**So that** I can compare my performance

**Acceptance Criteria:**
- Paginated results
- Best record per session
- Ranking: harmony > survival > failed

## Non-Functional Requirements

### Performance
- First Contentful Paint < 2s
- Edge Runtime for API routes
- Optimized images via Cloudinary

### Accessibility
- Responsive design (mobile, tablet, desktop)
- Vietnamese language support (custom font)
- Color-coded entities for visual distinction

### Security
- SHA-256 hash verification for scores
- 60-second timestamp window
- Server-side validation of game logic
- No client-exposed database credentials

## Success Metrics

| Metric | Target |
|--------|--------|
| Game completion rate | > 50% start games that reach an ending |
| Harmony ending rate | < 5% (designed to be rare) |
| Average session duration | 5-15 minutes |
| Mobile usage | > 30% of sessions |
