import { ByteBuffer, decodeBinarySchema, compileSchema } from "./lib/kiwi";
import { inflateRaw } from "uzip";

const transfer8to32 = function (
  fileByte: Uint8Array,
  start: number,
  cache: Uint8Array
) {
  cache[0] = fileByte[start + 0];
  cache[1] = fileByte[start + 1];
  cache[2] = fileByte[start + 2];
  cache[3] = fileByte[start + 3];
};

const int32 = new Int32Array(1);
const uint8 = new Uint8Array(int32.buffer);
const uint32 = new Uint32Array(int32.buffer);

const calcEnd = function (fileByte: Uint8Array, start: number) {
  transfer8to32(fileByte, start, uint8);
  return uint32[0];
};

export const getFigJsonData = (fileBuffer: Buffer) => {
  const fileByte: Uint8Array = new Uint8Array(fileBuffer);

  // 8 bits for figma comment;
  let start = 8;

  calcEnd(fileByte, start);

  start += 4;
  const result = [];
  while (start < fileByte.length) {
    var end = calcEnd(fileByte, start);
    start += 4;

    let byteTemp = fileByte.slice(start, start + end);

    if (!(fileByte[start] == 137 && fileByte[start + 1] == 80)) {
      byteTemp = inflateRaw(byteTemp);
    }

    result.push(byteTemp);
    start += end;
  }

  const [schemaByte, dataByte] = result;

  const schemaBB = new ByteBuffer(schemaByte);

  const schema = decodeBinarySchema(schemaBB);

  const dataBB = new ByteBuffer(dataByte);

  const schemaHelper = compileSchema(schema);

  return schemaHelper[`decodeMessage`](dataBB);
};
