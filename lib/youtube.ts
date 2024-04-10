// From https://github.com/Kakulukian/youtube-transcript/issues/19 by @dcsan
// If anybody is looking at making a class for this. Here is my currently working example for a quick patch. No promises it will keep working :)

import { parse } from "node-html-parser";
const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";

class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] ${message}`);
  }
}

type YtFetchConfig = {
  lang?: string; // Object with lang param (eg: en, es, hk, uk) format.
};

/**
 * Class to retrieve transcript if exist
 */
class YoutubeGrabTool {
  /**
   * Fetch transcript from YTB Video
   * @param videoId Video url or video identifier
   * @param config Object with lang param (eg: en, es, hk, uk) format.
   * Will just the grab first caption if it can find one, so no special lang caption support.
   */
  static async fetchTranscript(videoId: string, config: YtFetchConfig = {}) {
    const identifier = this.retrieveVideoId(videoId);
    const lang = config?.lang ?? "en";
    try {
      const transcriptUrl = await fetch(
        `https://www.youtube.com/watch?v=${identifier}`,
        {
          headers: {
            "User-Agent": USER_AGENT,
          },
        },
      )
        .then((res) => res.text())
        .then((html) => parse(html))
        .then((html) => this.#parseTranscriptEndpoint(html, lang));

      if (!transcriptUrl)
        throw new Error("Failed to locate a transcript for this video!");

      // Result is hopefully some XML.
      const transcriptXML = await fetch(transcriptUrl)
        .then((res) => res.text())
        .then((xml) => parse(xml));

      const chunks = transcriptXML.getElementsByTagName("text");


      let transcriptions = [];
      for (const chunk of chunks) {
        const [offset, duration] = chunk.rawAttrs.split(" ");
        transcriptions.push({
          text: chunk.text,
          offset: this.convertToMs(offset),
          duration: this.convertToMs(duration),
        });
      }
      return transcriptions;
    } catch (e: any) {
      throw new YoutubeTranscriptError(e);
    }
  }

  static convertToMs(text: string) {
    const float = parseFloat(text.split("=")[1].replace(/"/g, "")) * 1000;
    return Math.round(float);
  }

  static #parseTranscriptEndpoint(document: any, langCode?: string) {
    try {
      // Get all script tags on document page
      const scripts = document.getElementsByTagName("script");

      // find the player data script.
      const playerScript = scripts.find((script: any) =>
        script.textContent.includes("var ytInitialPlayerResponse = {"),
      );

      const dataString =
        playerScript.textContent
          ?.split("var ytInitialPlayerResponse = ")?.[1] //get the start of the object {....
          ?.split("};")?.[0] + "}"; // chunk off any code after object closure. // add back that curly brace we just cut.

      const data = JSON.parse(dataString.trim()); // Attempt a JSON parse
      const availableCaptions =
        data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

      // If languageCode was specified then search for it's code, otherwise get the first.
      let captionTrack = availableCaptions?.[0];
      if (langCode)
        captionTrack =
          availableCaptions.find((track: any) =>
            track.languageCode.includes(langCode),
          ) ?? availableCaptions?.[0];

      return captionTrack?.baseUrl;
    } catch (e: any) {
      console.error(`YoutubeTranscript.#parseTranscriptEndpoint ${e.message}`);
      return null;
    }
  }

  /**
   * Retrieve video id from url or string
   * @param videoId video url or video id
   */
  static retrieveVideoId(videoId: string) {
    if (videoId.length === 11) {
      return videoId;
    }
    const matchId = videoId.match(RE_YOUTUBE);
    if (matchId && matchId.length) {
      return matchId[1];
    }
    throw new YoutubeTranscriptError(
      "Impossible to retrieve Youtube video ID.",
    );
  }
}

export { YoutubeGrabTool, YoutubeTranscriptError };
