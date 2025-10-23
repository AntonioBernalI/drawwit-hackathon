# AI Prompt Generation Workflow with Kiro

## How Kiro Helped Create Context-Aware AI Prompts

### The Challenge
Creating effective prompts for Google AI Studio (or any image generation AI) typically requires manually describing every detail about your project's style, theme, and requirements. This often leads to generic results that don't match your actual project vision.

### The Kiro Advantage

#### 1. **Project Context Understanding**
Instead of starting from scratch, I was able to:
- Read through the entire `drawwit` codebase
- Analyze the React components and UI structure
- Understand the pixel art gaming aesthetic from the existing code
- Identify the Reddit integration and social features
- Discover the pincel/brush-based painting approach from the canvas implementation

#### 2. **Automatic Style Detection**
By examining files like:
- `blocks/main.jsx` - Understanding the Reddit Devvit integration
- `src/client/src/App.jsx` - Seeing the prompt selection interface
- `src/canvas/src/App.jsx` - Discovering the drawing canvas approach
- `devvit.json` - Understanding the platform constraints and features

I could automatically infer:
- The retro gaming aesthetic
- The pixel art style requirements
- The mobile-first design (375x551 resolution)
- The Reddit community focus
- The competitive/social aspects (upvotes, ink system)

#### 3. **Contextual Prompt Creation**
Rather than creating a generic "design a drawing app" prompt, I crafted a highly specific prompt that included:
- Exact technical specifications from the project
- The established visual language and theming
- Platform-specific requirements (Reddit integration)
- User interaction patterns already implemented
- The specific painting methodology (pincels vs strokes)

### The Workflow in Action

1. **Project Analysis**: I explored the codebase to understand drawwit's architecture and style
2. **Context Extraction**: Identified key visual and functional elements
3. **Prompt Crafting**: Created a detailed, project-specific prompt for Google AI Studio
4. **Iterative Refinement**: Updated the prompt based on your feedback about pixel art style and pincel-based painting

### Why This Beats Generic AI Tools

#### Traditional Approach:
- Start with vague descriptions
- Miss project-specific details
- Require multiple iterations to get style right
- Results often don't match existing codebase aesthetic

#### Kiro-Assisted Approach:
- Leverages existing project context
- Automatically includes technical constraints
- Maintains consistency with established design patterns
- Produces prompts that generate assets fitting seamlessly into your project

### The Result
A comprehensive Google AI Studio prompt that generates UI mockups specifically tailored to:
- Drawwit's pixel art aesthetic
- Reddit's gaming community
- Mobile-optimized dimensions
- Pincel-based painting interaction
- Social features integration

### Future Applications
This workflow can be applied to any project where you need AI-generated assets that match your existing codebase style, whether it's:
- UI mockups
- Game assets
- Marketing materials
- Documentation illustrations

The key is having an AI assistant that can read and understand your project context, then translate that understanding into effective prompts for specialized AI tools.
