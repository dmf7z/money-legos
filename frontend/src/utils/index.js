export function shortenAddress(address, digits = 4) {
    // if (!isAddress(address)) {
    //   throw Error(`Invalid 'address' parameter '${address}'.`);
    // }
    return `${address.substring(0, digits + 2)}...${address.substring(
      42 - digits
    )}`;
  }