function get_exponent(xfl: bigint) {
  if (xfl < 0n)
    throw "Invalid XFL";
  if (xfl == 0n)
    return 0n;
  return ((xfl >> 54n) & 0xFFn) - 97n;
}

function get_mantissa(xfl: bigint) {
  if (xfl < 0n)
    throw "Invalid XFL";
  if (xfl == 0n)
    return 0n;
  return xfl - ((xfl >> 54n) << 54n);
}

function is_negative(xfl: bigint) {
  if (xfl < 0n)
    throw "Invalid XFL";
  if (xfl == 0n)
    return false;
  return ((xfl >> 62n) & 1n) == 0n;
}

function to_string(xfl: bigint) {
  if (xfl < 0n)
    throw "Invalid XFL";
  if (xfl == 0n)
    return "<zero>";
  return (is_negative(xfl) ? "-" : "+") +
    get_mantissa(xfl).toString() + "E" + get_exponent(xfl).toString();
}

const xflToFloat = (xfl: bigint) => {
  return parseFloat(to_string(xfl))
}

const changeEndianness = (str: string) => {
  const result = []
  let len = str.length - 2
  while (len >= 0) {
    result.push(str.substr(len, 2))
    len -= 2
  }
  return result.join('')
}

export const hookStateXLFtoBigNumber = (stateData: string) => {
  const data = changeEndianness(stateData)
  const bi = BigInt('0x' + data)
  return xflToFloat(bi)
}
