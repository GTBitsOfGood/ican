import { BadRequestError } from "@/types/exceptions";

// Not sure where to put it, needed it because typescript gets mad if I try to access proxy parameters
export function getProxyParam(proxy: unknown, index: number): string {
  // Given all the checks, this should never happen
  if (!Array.isArray(proxy) || proxy.length < index) {
    throw new BadRequestError(`Invalid proxy index of ${index}`);
  }

  return proxy[index];
}
