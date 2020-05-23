import web3 from 'web3';
import { ELEMENTS_MAX_OPERATIONS } from "../constants";

export function shortenAddress(address, digits = 4) {
  // if (!isAddress(address)) {
  //   throw Error(`Invalid 'address' parameter '${address}'.`);
  // }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`;
}

export function adjustColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export function isElementComplete(element) {
  // console.log('isElementComplete ',element.connections,ELEMENTS_MAX_OPERATIONS[element.type])
  let result =
    element.connections.length >= ELEMENTS_MAX_OPERATIONS[element.type];
  // console.log('isElementComplete ',result)
  return result;
}

export function slugify(title) {
  return title.split(" ").join("").toLowerCase();
}

export function isAddress(value) {
  try {
    return web3.utils.isAddress(value)
  } catch {
    return false;
  }
}