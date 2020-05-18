export function shortenAddress(address, digits = 4) {
    // if (!isAddress(address)) {
    //   throw Error(`Invalid 'address' parameter '${address}'.`);
    // }
    return `${address.substring(0, digits + 2)}...${address.substring(
      42 - digits
    )}`;
  }

export function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}