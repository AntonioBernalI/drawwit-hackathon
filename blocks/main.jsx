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

    const [upperPanel, setUpperPanel] = useState("00");
    const [lowerPanel, setLowerPanel] = useState("00");

    const { data: panel, loadingPanel, errorPanel } = useAsync(
      async () => {
        const username = await _context.reddit.getCurrentUsername();
        const key = `${username}-${postId}-upvotes`;
        const exists = await _context.redis.exists(key);
        if (exists === 0) {
          await _context.redis.set(key, "0000");
          return "0000";
        } else {
          const panel = await _context.redis.get(key);
          return panel ?? null;
        }
      },
      {
        finally: (panel) => {
          if (panel) {
            setUpperPanel(panel.slice(0, 2));
            setLowerPanel(panel.slice(2));
          }
        }
      }
    );

    const { mount : mountClient } = useWebView({
      url: 'index.html',
      onMessage: (message, hook) => {},
    });

    const { mount : mountDrawwitDrawingCanvas } = useWebView({
      url: 'drawwitCanvas.html',
      onMessage: (message, hook) => {},
    });

    const { mount : mountDrawwitShop } = useWebView({
      url: 'drawwitShop.html',
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
              <hstack width={"100%"} height={"20%"} onPress={mountDrawwitShop} >
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
          <hstack width={"330px"} height={"510px"}>
            <webview width={"64.24242424%"} height={"100%"} url={"drawwitInline.html"}>
            </webview>
            <vstack width={"35.75757576%"} height={"100%"} >
              <hstack width={"100%"} height={"18.43137255%"} backgroundColor={"rgba(255,0,255,0.48)"}>
              </hstack>
              <zstack width={"100%"} height={"81.56862745%"}>
                <image
                  url={`${upperPanel}${lowerPanel}.png`} //
                  height="100%"
                  width="100%"
                  imageWidth={118}
                  imageHeight={416}
                  resizeMode="cover"
                  description="drawwit background"
                />
                <vstack height={"100%"} width={"100%"}>
                  <hstack width={"100%"} height={"13.33%"}  onPress={mountDrawwitDrawingCanvas}></hstack>
                  <hstack width={"100%"} height={"13.33%"} ></hstack>
                  <hstack width={"100%"} height={"14.05%"}>
                    <hstack
                      width={"50%"}
                      height={"100%"}
                      onPress={async () => {
                        const username = await _context.reddit.getCurrentUsername();
                        const [A, B] = upperPanel;
                        const toggledA = A === "1" ? "0" : "1";
                        const toggledB = toggledA === "1" ? "0" : B;
                        const newUpperPanel = `${toggledA}${toggledB}`;
                        const newPanelState = `${newUpperPanel}${lowerPanel}`;
                        setUpperPanel(newUpperPanel);
                        await _context.redis.set(`${username}-${postId}-upvotes`, newPanelState);

                        if(newUpperPanel==="10"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesA', 1);
                        }else if (newUpperPanel==="01"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesA', -1);
                        }

                      }}
                    >
                    </hstack>
                    <hstack
                      width={"50%"}
                      height={"100%"}
                      onPress={async () => {
                        const username = await _context.reddit.getCurrentUsername();
                        const [A, B] = upperPanel;
                        const toggledB = B === "1" ? "0" : "1";
                        const toggledA = toggledB === "1" ? "0" : A;
                        const newUpperPanel = `${toggledA}${toggledB}`;
                        const newPanelState = `${newUpperPanel}${lowerPanel}`;
                        setUpperPanel(newUpperPanel);
                        await _context.redis.set(`${username}-${postId}-upvotes`, newPanelState);

                        if(newUpperPanel==="10"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesA', 1);
                        }else if (newUpperPanel==="01"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesA', -1);
                        }

                      }}
                    >
                    </hstack>
                  </hstack>
                  <hstack width={"100%"} height={"12.01%"}  ></hstack>
                  <hstack width={"100%"} height={"12.97%"} ></hstack>
                  <hstack width={"100%"} height={"12.97%"} ></hstack>
                  <hstack width={"100%"} height={"15.01%"} >
                    <hstack
                      width={"50%"}
                      height={"100%"}
                      onPress={async () => {
                        const username = await _context.reddit.getCurrentUsername();
                        const [A, B] = lowerPanel;
                        const toggledA = A === "1" ? "0" : "1";
                        const toggledB = toggledA === "1" ? "0" : B;
                        const newLowerPanel = `${toggledA}${toggledB}`;
                        const newPanelState = `${upperPanel}${newLowerPanel}`;
                        setLowerPanel(newLowerPanel);
                        await _context.redis.set(`${username}-${postId}-upvotes`, newPanelState);

                        if(newLowerPanel==="10"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesB', 1);
                        }else if (newLowerPanel==="01"){
                          await redis.hIncrBy(`${post.id}-match`, 'votesB', -1);
                        }

                      }}
                    >
                    </hstack>
                    <hstack
                      width={"50%"}
                      height={"100%"}
                      onPress={async () => {
                        const username = await _context.reddit.getCurrentUsername();
                        const [A, B] = lowerPanel;
                        const toggledB = B === "1" ? "0" : "1";
                        const toggledA = toggledB === "1" ? "0" : A;
                        const newLowerPanel = `${toggledA}${toggledB}`;
                        const newPanelState = `${upperPanel}${newLowerPanel}`;
                        setLowerPanel(newLowerPanel);
                        await _context.redis.set(`${username}-${postId}-upvotes`, newPanelState);
                      }}
                    >
                    </hstack>
                  </hstack>
                  <hstack width={"100%"} height={"6.33%"} ></hstack>
                </vstack>
              </zstack>
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
