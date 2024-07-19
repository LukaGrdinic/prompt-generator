export function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function calculateWordCount(text: string) {
  let words = text.match(/\w+/g) as RegExpMatchArray;
  return words?.length;
}