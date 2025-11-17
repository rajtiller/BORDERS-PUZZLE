// CREATE FILE: src/utils/gameHelpers.ts
import type { Token, Region } from "../types";

export function isTokenInRegion(token: Token, region: Region): boolean {
  const dx = token.x - region.x;
  const dy = token.y - region.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= region.radius;
}

export function calculateRegionSum(tokens: Token[], region: Region): number {
  return tokens
    .filter((token) => isTokenInRegion(token, region))
    .reduce((sum, token) => sum + token.value, 0);
}

export function isRegionComplete(tokens: Token[], region: Region): boolean {
  return calculateRegionSum(tokens, region) === region.target;
}

export function areAllRegionsComplete(
  tokens: Token[],
  regions: Region[]
): boolean {
  return regions.every((region) => isRegionComplete(tokens, region));
}
