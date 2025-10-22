# Requirements Document

## Introduction

Drawwit is an asynchronous, community-driven pixel art battle built on Devvit for Reddit. It transforms Reddit posts into creative arenas where users collaborate, compete, and create pixel art chaos directly inside Reddit. Inspired by r/place and Civic Doodle, Drawwit is designed as a dedicated subreddit game where the entire community focuses on these creative battles.

Each match appears as a Reddit post with a creative prompt and two 100×100 pixel canvases representing competing factions. Players spend Ink (the game's resource) to draw unlimited pixels or use superpowers, collaborate with their faction, and compete for votes over a 7-day period. The game maintains an asynchronous architecture using Redis for data persistence, creating the illusion of real-time updates through smart data fetching.

## Requirements

### Requirement 1: Match Creation and Management

**User Story:** As a Reddit moderator, I want to create pixel art battle matches in my subreddit, so that my community can engage in creative competitions.

#### Acceptance Criteria

1. WHEN a moderator creates a new match THEN the system SHALL generate a Reddit post with a random or custom prompt
2. WHEN a match is created THEN the system SHALL initialize two blank 100×100 pixel canvases (Drawing A and Drawing B)
3. WHEN a match is created THEN the system SHALL set a 7-day timer for the match duration
4. WHEN a match expires THEN the system SHALL automatically determine the winner based on upvotes and distribute rewards

### Requirement 2: Ink Economy System

**User Story:** As a player, I want to earn and spend Ink to participate in matches, so that my actions have meaningful weight and I'm motivated to engage regularly.

#### Acceptance Criteria

1. WHEN a player joins the game THEN the system SHALL provide them with an initial Ink balance with unlimited pixel placement capacity
2. WHEN a player places a pixel THEN the system SHALL deduct 1 Ink and award 0.5 Ink back
3. WHEN a player votes on a drawing THEN the system SHALL award 0.5 Ink
4. WHEN hourly rewards are distributed THEN the system SHALL award 10 Ink to all players regardless of current balance
5. WHEN a player uses superpowers THEN the system SHALL deduct fixed Ink costs (to be defined)
6. WHEN a match ends THEN the system SHALL distribute Ink bonuses to winners and penalties to losers based on engagement

### Requirement 3: Pixel Drawing and Canvas Management

**User Story:** As a player, I want to draw pixels on faction canvases, so that I can contribute to my team's artwork and compete against the opposing faction.

#### Acceptance Criteria

1. WHEN a player selects a pixel on a canvas THEN the system SHALL allow them to choose a color and place the pixel for 1 Ink
2. WHEN a player places a pixel THEN the system SHALL automatically assign them to that canvas's faction
3. WHEN a pixel is placed THEN the system SHALL update the canvas in real-time for all viewers
4. WHEN a player views a canvas THEN the system SHALL display zoom controls and drawing history
5. WHEN multiple players draw simultaneously THEN the system SHALL handle concurrent pixel placement without conflicts

### Requirement 4: Faction System and Collaboration

**User Story:** As a player, I want to join and collaborate with a faction, so that I can work with teammates to create winning artwork.

#### Acceptance Criteria

1. WHEN a player spends Ink on a canvas THEN the system SHALL assign them to that canvas's faction
2. WHEN a player contributes to a faction THEN the system SHALL track their total Ink contribution for leaderboard ranking
3. WHEN viewing a match THEN the system SHALL display "Top Collaborators" leaderboards for each faction
4. WHEN viewing faction stats THEN the system SHALL show total Ink spent and total pixels placed per faction
5. WHEN a faction has activity THEN the system SHALL display faction-specific visual indicators or insignia

### Requirement 5: Superpower System

**User Story:** As a player, I want to use superpowers to help my faction or sabotage opponents, so that I can create strategic advantages and dramatic moments in matches.

#### Acceptance Criteria

1. WHEN a player activates a malicious power THEN the system SHALL apply effects to the opposing canvas (Blackout, Invert Colors, Dim Colors, Brighten Colors, Rotate 180°)
2. WHEN a player activates a beneficial power THEN the system SHALL apply positive effects to their faction (Ink Blessing, Double Brush, Ink Boost)
3. WHEN a superpower is used THEN the system SHALL deduct the fixed Ink cost from the player's balance
4. WHEN a superpower has cooldowns THEN the system SHALL prevent reuse until the cooldown expires
5. WHEN superpowers are activated THEN the system SHALL navigate to the canvas and display the updated result without special visual effects

### Requirement 6: Voting and Match Resolution

**User Story:** As a Reddit user, I want to vote on drawings using Reddit's native upvote/downvote system, so that the community can determine winning artwork through familiar mechanics.

#### Acceptance Criteria

1. WHEN a user votes on a drawing THEN the system SHALL use the app's internal voting system with dedicated voting buttons
2. WHEN votes are cast THEN the system SHALL update vote counts in Redis and display updated counts when data is fetched
3. WHEN a match timer expires THEN the system SHALL determine the winner based on the drawing with more votes from the app's voting system
4. WHEN a match ends THEN the system SHALL post a results summary in the comments
5. WHEN match results are calculated THEN the system SHALL distribute appropriate Ink rewards and penalties

### Requirement 7: Real-time UI and Visual Feedback

**User Story:** As a player, I want to see real-time updates of match progress and my Ink status, so that I can make informed decisions about when and how to participate.

#### Acceptance Criteria

1. WHEN viewing a match THEN the system SHALL display a real-time countdown timer showing time remaining
2. WHEN a player has Ink THEN the system SHALL show a visual Ink bar that updates when data is fetched from Redis
3. WHEN canvas changes occur THEN the system SHALL store updates in Redis and display changes when players fetch updated data
4. WHEN vote counts change THEN the system SHALL store updates in Redis and display updated counts when data is fetched
5. WHEN superpowers are activated THEN the system SHALL navigate to the canvas and show the updated result

### Requirement 8: Reddit Platform Integration

**User Story:** As a Reddit user, I want to access Drawwit matches seamlessly within Reddit posts, so that I can participate without leaving the platform.

#### Acceptance Criteria

1. WHEN a match is created THEN the system SHALL generate a properly formatted Reddit post using Devvit
2. WHEN users interact with the match THEN the system SHALL provide action buttons (Collaborate, Use Power) within the Reddit interface
3. WHEN users comment on match posts THEN the system SHALL allow normal Reddit commenting for community interaction
4. WHEN the app is installed THEN the system SHALL be dedicated to a single subreddit focused entirely on Drawwit gameplay
5. WHEN matches are accessed THEN the system SHALL maintain full functionality for all subreddit members

### Requirement 9: Data Persistence and Performance

**User Story:** As a system administrator, I want match data to be reliably stored and quickly accessible, so that players have a smooth experience and no progress is lost.

#### Acceptance Criteria

1. WHEN pixel data is modified THEN the system SHALL persist changes to Redis immediately
2. WHEN player Ink balances change THEN the system SHALL update stored values in real-time
3. WHEN match states are queried THEN the system SHALL respond within 200ms for optimal user experience
4. WHEN system failures occur THEN the system SHALL recover match states from persistent storage
5. WHEN concurrent users access matches THEN the system SHALL handle load without performance degradation

### Requirement 10: Asynchronous Architecture and Data Management

**User Story:** As a system architect, I want all game state to be managed through Redis with asynchronous updates, so that the application remains lightweight while providing the illusion of real-time interaction.

#### Acceptance Criteria

1. WHEN any player action occurs THEN the system SHALL store the updated state in Redis immediately
2. WHEN players view game elements THEN the system SHALL fetch current data from Redis to display updated information
3. WHEN multiple players interact simultaneously THEN the system SHALL handle concurrent Redis operations without data corruption
4. WHEN game state changes THEN the system SHALL use Redis as the single source of truth for all game data
5. WHEN players refresh or navigate THEN the system SHALL retrieve the latest state from Redis to maintain consistency

### Requirement 11: Match Lifecycle Management

**User Story:** As a player, I want matches to progress through clear phases with appropriate notifications, so that I understand the current state and can plan my participation.

#### Acceptance Criteria

1. WHEN a match enters the active phase THEN the system SHALL enable all drawing and superpower functionality
2. WHEN a match approaches expiration THEN the system SHALL provide warnings to active players
3. WHEN a match ends THEN the system SHALL disable further drawing and superpower usage
4. WHEN match results are finalized THEN the system SHALL transition the post to archive status while maintaining visibility
5. WHEN archived matches are viewed THEN the system SHALL display final artwork and historical statistics