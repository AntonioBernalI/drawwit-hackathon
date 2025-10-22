# What is Drawwit? 🎨

Imagine if you could turn any Reddit post into a creative battleground where people work together to create pixel art. That's exactly what Drawwit is!

## The Simple Idea

Drawwit is like a digital art war that happens right inside Reddit posts. Here's how it works:

**The Setup**: Someone creates a match with a word or theme (like "elephant" or "pizza"). This creates a Reddit post with two blank drawing canvases - think of them as two empty whiteboards side by side.

**The Battle**: People can spend "Ink" (the game's currency) to place colored pixels on either canvas. When you place your first pixel on a canvas, you automatically join that team. So you might be on "Team A" trying to draw the best elephant, while "Team B" is also drawing their version of an elephant.

**The Collaboration**: Multiple people work together on the same canvas, building up the artwork pixel by pixel. You can see who the top contributors are and how much Ink each team has spent.

**The Chaos**: Players can use special powers to mess with the other team's drawing (like making it darker or flipping it upside down) or help their own team (like getting bonus Ink).

**The Winner**: After 7 days, people vote on which drawing they like better, and the winning team gets rewards.

## Why It's Fun

- **It's social**: You're working with strangers to create something together
- **It's competitive**: Your team is trying to beat the other team
- **It's creative**: You're making actual art, even if it's just pixels
- **It's chaotic**: Special powers can completely change a drawing at any moment
- **It's accessible**: Anyone can jump in and contribute, even if they can't draw

Think of it like a mix between:
- The collaborative spirit of Reddit's r/place (where millions worked on one giant canvas)
- The team competition of sports
- The creativity of digital art
- The strategy of resource management games

## The Magic Behind the Scenes

The really cool part is that this all happens inside Reddit itself. You don't need to download an app or go to another website. The game lives right in Reddit posts, so you can play while browsing your normal Reddit feed.

# How Drawwit is Being Made 🛠️

Building Drawwit is like constructing a digital playground that lives inside Reddit. Here's how we're putting it all together:

## The Foundation: Reddit's Devvit Platform

We're building Drawwit using something called "Devvit" - Reddit's special toolkit for creating apps that run inside Reddit posts. It's like having a mini-website that lives inside a Reddit post instead of on its own webpage.

## The Three Main Parts

**1. The Visual Part (Client)**
This is what players see and interact with - the drawing canvases, color palettes, buttons, and all the pretty graphics. We're building this with React (a popular web technology) and designing it to look like retro pixel art to match the drawing theme.

**2. The Brain (Server)**
This is the behind-the-scenes logic that handles all the game rules, manages player data, and talks to Reddit. When you place a pixel or use a superpower, the server figures out what should happen and updates the game.

**3. The Memory (Redis Database)**
This is where we store all the game information - every pixel that's been placed, how much Ink each player has, which team is winning, etc. It's like the game's memory bank that remembers everything even when players leave and come back.

## The Building Process

**Phase 1: The Basics**
We start by creating the main screens - the home page where you start a game, and the word selection screen where you pick what everyone will be drawing.

**Phase 2: The Drawing**
Next, we build the actual drawing functionality - the canvases where people place pixels, the color picker, and the system that lets multiple people draw on the same canvas without conflicts.

**Phase 3: The Fun Stuff**
Then we add the special powers, the team competition features, and all the strategic elements that make the game exciting rather than just a drawing app.

**Phase 4: The Polish**
Finally, we make sure everything works smoothly, looks good on phones and computers, and handles lots of people playing at once.

## The Technical Challenges

**Making it Feel Real-Time**: Even though the game doesn't update instantly (like a video game might), we make it feel responsive by smartly updating the display when players take actions.

**Handling Lots of Players**: We need to make sure the game works smoothly even if hundreds of people are drawing at the same time.

**Keeping it Fair**: We have to prevent cheating and make sure the Ink economy works properly so the game stays balanced and fun.

**Mobile-Friendly**: Since most Reddit users are on their phones, everything needs to work great on small screens with touch controls.

## The Development Tools

We're using modern web development tools like TypeScript (which helps prevent bugs), Vite (which helps build the app quickly), and various testing tools to make sure everything works correctly.

The whole thing is structured as a "monorepo" - basically one big organized folder that contains all the different parts of the game, making it easier to keep everything in sync and working together.

## Why This Approach Works

By building on Reddit's platform, we get a lot of benefits:
- **Built-in users**: Reddit already has millions of people
- **No downloads**: Players don't need to install anything
- **Social features**: Comments, voting, and community features come for free
- **Trust**: People trust Reddit, so they're more likely to try our game

The end result is a game that feels native to Reddit while offering something completely new and creative for the community to enjoy together.
