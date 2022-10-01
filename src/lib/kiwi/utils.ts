export const getWordFromByteRange = function (
  byte: Uint8Array,
  start: number,
  end: number
) {
  let text = "";
  while (start < end) {
    start++;
    text += String.fromCharCode(byte[start]);
  }
  return text;
};

export const getOneWordFromByte = function (byte: Uint8Array, start: number) {
  let end = start;
  // if the letter equal space, that word end;
  while (byte[end] != 0) end++;

  for (var i = start; i < end; i++) {
    const char = byte[i];
    if (char > 127) throw "e";
  }

  return getWordFromByteRange(byte, start, end);
};

export function quote(text: string): string {
  return JSON.stringify(text);
}

export function error(text: string, line: number, column: number): never {
  var error = new Error(text);
  (error as any).line = line;
  (error as any).column = column;
  throw error;
}
