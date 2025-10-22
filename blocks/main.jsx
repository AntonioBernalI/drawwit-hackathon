// Learn more at developers.reddit.com/docs
import { Devvit, useState, useWebView, useAsync, useForm } from '@devvit/public-api';


Devvit.configure({
  redditAPI: true,
});


const createPost = async (context) => {
  const { reddit } = context;
  const subreddit = await reddit.getCurrentSubreddit();
  const post = await reddit.submitPost({
    title: 'Welcome to drawwit',
    subredditName: subreddit.name,
    // The preview appears while the post loads
    preview: <blocks>
      <zstack height={"100%"} width={"100%"} alignment={"middle center"} backgroundColor={"#000"}>
        <hstack height={"100%"} width={"100%"}>
          <image
            height="100%"
            width="100%"
            url="drawwitbackground.png"
            imageWidth={1920}
            imageHeight={1080}
            resizeMode="cover"
          />
        </hstack>
        <text size={"xxlarge"}>Loading ...</text>
      </zstack>
    </blocks>
    ,
  });

  return post;
};

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add my post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { ui } = context;
    ui.showToast(
      "Submitting your post - upon completion you'll navigate there."
    );
    const post = await createPost(context);
    ui.navigateTo(post);
  },
});

Devvit.addTrigger({
  events: ['AppInstall'],
  onEvent: async (event, context) => {
    await createPost(context);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (_context) => {

    const postId = _context.postId;

    const { data: screen, loading, error } = useAsync(
      async () => {
        const screen = await _context.redis.get(`${postId}-screen`);
        return screen ?? null;
      }
    );

    const { mount : mountClient } = useWebView({
      url: 'index.html',
      onMessage: (message, hook) => {},
    });

    if (loading) {
      return (
        <vstack width={"100%"} height={"100%"} alignment={"middle center"} backgroundColor={"#fff"}>
          <text size={"xxlarge"}>Loading...</text>
        </vstack>
      )
    } else if (error) {
      return (
        <vstack width={"100%"} height={"100%"} alignment={"middle center"} backgroundColor={"#fff"}>
          <text size={"xxlarge"} color={"#000"}>An error occurred</text>
        </vstack>
      )
    } else if (screen !== "match"){
      return (
        <zstack width={"100%"} height={"100%"}  alignment={"middle center"}>
          <hstack width={"100%"} height={"100%"}>
            <image
              url="drawwitBackground.png"
              height="100%"
              width="100%"
              imageWidth={1408}
              imageHeight={736}
              resizeMode="cover"
              description="drawwit background"
            />
          </hstack>
          <zstack height={"300px"} width={"300px"}>
            <image
              url="drawwitMainScreen.png"
              height="100%"
              width="100%"
              imageWidth={960}
              imageHeight={960}
              resizeMode="cover"
              description="drawwit background"
            />
            <vstack height={"100%"} width={"100%"}>
              <hstack width={"100%"} height={"37%"} >
              </hstack>
              <hstack width={"100%"} height={"20%"} onPress={mountClient}>
              </hstack>
              <hstack width={"100%"} height={"20%"} >
              </hstack>
              <hstack width={"100%"} height={"20%"} >
              </hstack>
            </vstack>
          </zstack>
        </zstack>
      )
    } else if (screen === "match") {
      return (
        <zstack width={"100%"} height={"100%"} alignment={"middle center"} backgroundColor={"#f00"}>
          <image
            url="drawwitBackground.png"
            height="100%"
            width="100%"
            imageWidth={1408}
            imageHeight={736}
            resizeMode="cover"
            description="drawwit background"
          />
          <hstack width={"330px"} height={"510px"} backgroundColor={"#0f0"}>
            <webview width={"64.24242424%"} height={"100%"} url={"drawwitInline.html"}>
            </webview>
            <vstack width={"35.75757576%"} height={"100%"} >
              <hstack width={"100%"} height={"18.43137255%"} backgroundColor={"rgba(255,0,255,0.48)"}>
              </hstack>
              <hstack width={"100%"} height={"81.56862745%"}>
                <image
                  url="1010.png"
                  height="100%"
                  width="100%"
                  imageWidth={118}
                  imageHeight={416}
                  resizeMode="cover"
                  description="drawwit background"
                />
              </hstack>
            </vstack>
          </hstack>

        </zstack>
      )
    }
    return (
      <vstack width="100%" height="100%" alignment="middle center" backgroundColor="#fff">
        <text size="xxlarge" color="#000">No content available</text>
      </vstack>
    );
  },
});

export default Devvit;
