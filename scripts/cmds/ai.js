const a = require("axios"),
      t = require("tinyurl");

const fontMap = {
  ' ': ' ',
    'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧',
  'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯',
  'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷',
  'Y': '𝖸', 'Z': '𝖹', 'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿',
  'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇',
  'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏',
  'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
};

function normalizeText(text) {
  const boldPattern = /\*\*(.*?)\*\*/g;

  function applyFontMap(str) {
    return str
      .split('')
      .map(char => fontMap[char] || char)
      .join('');
  }

  return text.replace(boldPattern, (match, p1) => `${applyFontMap(p1)}`);
}

function formatResponse(content) {
  const header = `🌌🧑🏻‍🔧 | 𝘼𝙎𝙏𝙍𝙊 𝘼𝙎𝙎𝙄𝙎𝙏𝘼𝙉𝙏 𝘼𝙉𝙎𝙒𝙀𝙍𝙀𝘿\n━━━━━━━━━━━━━━━━\n`;
  const footer = `━━━━━━━━━━━━━━━━`;
  return `${header}${content.trim()}\n${footer}`;
}

global.api = {
  s: "https://www.samirxpikachu.run" + ".place",
  fallbacks: [
    "http://samirxpikachuio.onrender.com",
    "http://samirxzy.onrender.com"
  ]
};

async function fetchFromAPI(url) {
  try {
    const response = await a.get(url);
    return response;
  } catch (error) {
    console.error("Primary API failed:", error.message);
    for (const fallback of global.api.fallbacks) {
      try {
        const response = await a.get(url.replace(global.api.s, fallback));
        return response;
      } catch (error) {
        console.error("Fallback API failed:", error.message);
      }
    }
    throw new Error("All APIs failed.");
  }
}

module.exports = {
  config: {
    name: "ai", 
    version: "1.0",
    author: "Samir OE",
    countDown: 5,
    role: 0,
    category: "ai"
  },
  onStart: async function({ message: m, event: e, args: r, commandName: n }) {
    try {
      let s;
      const i = e.senderID;

      if ("message_reply" === e.type && ["photo", "sticker"].includes(e.messageReply.attachments?.[0]?.type)) {
        s = await t.shorten(e.messageReply.attachments[0].url);
      }

      const o = r.join(" ") + ", short direct answer";
      const url = s ? `&url=${encodeURIComponent(s)}` : '';

      const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(o)}&system=default${url}&uid=${i}`;
      const c = await fetchFromAPI(apiURL);

      if (c.data && c.data.candidates && c.data.candidates.length > 0) {
        const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
        const formattedMessage = formatResponse(responseText);

        m.reply({
          body: formattedMessage
        }, (r, o) => {
          global.GoatBot.onReply.set(o.messageID, {
            commandName: n,
            messageID: o.messageID,
            author: i
          });
        });
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  },

  onReply: async function({ message: m, event: e, Reply: r, args: n }) {
    try {
      let { author: o, commandName: c } = r;
      if (e.senderID !== o) return;

      const i = n.join(" ") + ", short direct answer";
      const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(i)}&system=default&uid=${e.senderID}`;

      const d = await fetchFromAPI(apiURL);

      if (d.data && d.data.candidates && d.data.candidates.length > 0) {
        const responseText = normalizeText(d.data.candidates[0].content.parts[0].text);
        const formattedMessage = formatResponse(responseText);

        m.reply({
          body: formattedMessage
        }, (t, n) => {
          global.GoatBot.onReply.set(n.messageID, {
            commandName: c,
            messageID: n.messageID,
            author: e.senderID
          });
        });
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  },

  onChat: async function({ message: m, event: e, args: r }) {
    try {
      const i = e.senderID;
      const text = r.join(" ").trim();

      if (/^(-?[aA][iI])\s*$/.test(text)) {
        let query = 'hello'; 

        const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(query)}&system=default&uid=${i}`;
        const c = await fetchFromAPI(apiURL);

        if (c.data && c.data.candidates && c.data.candidates.length > 0) {
          const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
          const formattedMessage = formatResponse(responseText);

          m.reply({
            body: formattedMessage
          }, (r, o) => {
            global.GoatBot.onReply.set(o.messageID, {
              commandName: 'ai',
              messageID: o.messageID,
              author: i
            });
          });
        }

      } else if (/^(-?[aA][iI])\s/.test(text)) {
        let query = text.replace(/^(-?[aA][iI])\s/, '').trim(); // User-provided query text
        query += ", short direct answer.";

        const apiURL = `${global.api.s}/gemini?text=${encodeURIComponent(query)}&system=default&uid=${i}`;
        const c = await fetchFromAPI(apiURL);

        if (c.data && c.data.candidates && c.data.candidates.length > 0) {
          const responseText = normalizeText(c.data.candidates[0].content.parts[0].text);
          const formattedMessage = formatResponse(responseText);

          m.reply({
            body: formattedMessage
          }, (r, o) => {
            global.GoatBot.onReply.set(o.messageID, {
              commandName: 'ai',
              messageID: o.messageID,
              author: i
            });
          });
        }
      }

    } catch (t) {
      console.error("Error:", t.message);
    }
  }
};
