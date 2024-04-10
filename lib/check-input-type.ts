export function checkInputType(input: string) {
  const youtubeVideoRegex =
    /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
  return youtubeVideoRegex.test(input);
}
