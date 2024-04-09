export function checkInputType(input: string) {
  const youtubeVideoRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&[\w-]+)*$/;
  return youtubeVideoRegex.test(input);
}
