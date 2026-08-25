const farmService = require('./farm.service');
const urgencyService = require('./urgency.service');
const PriorityQueue = require('../utils/priorityQueue');

class ProcessEngineService {
  /**
   * Compare priority of two items: { farm, urgency }
   * Returns true if 'a' has higher priority than 'b'.
   * 
   * Priority Rules:
   * 1. urgencyScore DESC
   * 2. quantity DESC
   * 3. harvestTime ASC (earlier harvest time gets higher priority)
   */
  comparePriority(a, b) {
    if (a.urgency.urgencyScore !== b.urgency.urgencyScore) {
      return a.urgency.urgencyScore > b.urgency.urgencyScore;
    }

    if (a.farm.quantity !== b.farm.quantity) {
      return a.farm.quantity > b.farm.quantity;
    }

    const timeA = new Date(a.farm.harvestTime).getTime();
    const timeB = new Date(b.farm.harvestTime).getTime();
    return timeA < timeB;
  }

  /**
   * Process all active farms and return prioritized results
   */
  async processFarms() {
    const farms = await farmService.getAllFarms();

    if (!farms || farms.length === 0) {
      return {
        totalFarms: 0,
        processedFarms: 0,
        prioritizedFarms: []
      };
    }

    const pq = new PriorityQueue((a, b) => this.comparePriority(a, b));

    for (const farm of farms) {
      const urgency = urgencyService.calculateUrgency(farm);
      pq.enqueue({ farm, urgency });
    }

    const prioritizedFarms = [];
    const totalFarms = farms.length;

    while (!pq.isEmpty()) {
      const item = pq.dequeue();
      prioritizedFarms.push({
        farmId: item.farm._id ? item.farm._id.toString() : item.farm.id,
        productName: item.farm.productName,
        productType: item.farm.productType,
        quantity: item.farm.quantity,
        harvestTime: item.farm.harvestTime,
        shelfLife: item.farm.shelfLife,
        remainingShelfLife: item.urgency.remainingShelfLife,
        remainingPercentage: item.urgency.remainingPercentage,
        urgencyScore: item.urgency.urgencyScore,
        urgencyLevel: item.urgency.urgencyLevel,
        isExpired: item.urgency.isExpired
      });
    }

    return {
      totalFarms,
      processedFarms: prioritizedFarms.length,
      prioritizedFarms
    };
  }
}

module.exports = new ProcessEngineService();
