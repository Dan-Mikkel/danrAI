function sigmoid(x: number): number {
  return 1.0 / (1.0 + Math.exp(-x));
}

function sigmoidSkewed(x: number): number {
  return sigmoid(x * 12.0 - 6.0);
}

export function setCpuLimit(): number {
  const bucketCeiling = 9500;
  const bucketFloor = 2000;
  const cpuMin = 0.6;

  if (Game.cpu.limit === undefined) {
    // We are in the simulator
    return 1000;
  }

  if (Game.cpu.bucket > bucketCeiling) {
    return Game.cpu.tickLimit - 10;
  } else if (Game.cpu.bucket < 1000) {
    return Game.cpu.limit * 0.4;
  } else if (Game.cpu.bucket < bucketFloor) {
    return Game.cpu.limit * cpuMin;
  } else {
    const bucketRange = bucketCeiling - bucketFloor;
    const depthInRange = (Game.cpu.bucket - bucketFloor) / bucketRange;
    const minAssignable = Game.cpu.limit * cpuMin;
    const maxAssignable = Game.cpu.tickLimit - 15;
    return Math.round(minAssignable + sigmoidSkewed(depthInRange) * (maxAssignable - minAssignable));
  }
}
