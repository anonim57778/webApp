export function Calculate(position: number, reward: number): number {
    if (position <= 0) {
      throw new Error("Position must be greater than 0");
    }
    
    return Math.floor(reward / position);
  }