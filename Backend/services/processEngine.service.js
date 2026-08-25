const farmService = require('./farm.service');
const warehouseService = require('./warehouse.service');
const truckService = require('./truck.service');
const roadService = require('./road.service');
const urgencyService = require('./urgency.service');
const storageService = require('./storage.service');
const truckAssignmentService = require('./truckAssignment.service');
const roadFeasibilityService = require('./roadFeasibility.service');
const pathfindingService = require('./pathfinding.service');
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
   * Helper to format node identifier for a farm or warehouse
   */
  getNodeIdentifier(entity) {
    if (!entity) return null;
    if (entity.name && typeof entity.name === 'string') return entity.name.trim();
    if (entity.location && typeof entity.location.latitude === 'number' && typeof entity.location.longitude === 'number') {
      return `${entity.location.latitude},${entity.location.longitude}`;
    }
    return null;
  }

  /**
   * Process all active farms: Urgency -> Storage -> Truck -> Road Graph -> Dijkstra Route
   */
  async processFarms() {
    const [farms, warehouses, trucks, roads] = await Promise.all([
      farmService.getAllFarms(),
      warehouseService.getAllWarehouses(),
      truckService.getAllTrucks(),
      roadService.getAllRoads()
    ]);

    if (!farms || farms.length === 0) {
      return {
        totalFarms: 0,
        processedFarms: 0,
        prioritizedFarms: [],
        truckAssignments: []
      };
    }

    // Map warehouses by ID for quick lookup
    const warehouseMap = new Map();
    warehouses.forEach(w => {
      const id = w._id ? w._id.toString() : w.id;
      warehouseMap.set(id, w);
    });

    // Initialize temporary truck states in memory
    const truckStates = truckAssignmentService.initTruckStates(trucks);

    const pq = new PriorityQueue((a, b) => this.comparePriority(a, b));

    for (const farm of farms) {
      const urgency = urgencyService.calculateUrgency(farm);
      pq.enqueue({ farm, urgency });
    }

    const prioritizedFarms = [];
    const totalFarms = farms.length;

    while (!pq.isEmpty()) {
      const item = pq.dequeue();
      const storageFeasibility = storageService.findSuitableWarehouses(item.farm, warehouses);

      let truckAssignmentResult;
      let routeResult = null;

      if (!storageFeasibility.canFullyAccommodate) {
        truckAssignmentResult = {
          assigned: false,
          reason: 'STORAGE_NOT_AVAILABLE'
        };
      } else {
        const bestTruckState = truckAssignmentService.selectBestTruck(item.farm, truckStates);
        if (bestTruckState) {
          truckAssignmentResult = truckAssignmentService.assignFarmToTruck(item.farm, bestTruckState);

          // Calculate Dijkstra shortest path from farm location node to selected warehouse node
          const selectedWh = storageFeasibility.selectedWarehouse;
          const warehouseDoc = selectedWh ? warehouseMap.get(selectedWh.warehouseId) : null;

          const sourceNode = this.getNodeIdentifier(item.farm);
          const destNode = this.getNodeIdentifier(warehouseDoc) || (selectedWh ? selectedWh.name : null);

          if (sourceNode && destNode) {
            // Build truck-specific graph for pathfinding
            const truckGraphObj = roadFeasibilityService.buildTruckGraph(bestTruckState.truck, roads);
            routeResult = pathfindingService.findShortestPath(truckGraphObj.graph, sourceNode, destNode);
          }
        } else {
          truckAssignmentResult = {
            assigned: false,
            reason: 'NO_FEASIBLE_TRUCK'
          };
        }
      }

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
        isExpired: item.urgency.isExpired,
        storage: storageFeasibility,
        truckAssignment: truckAssignmentResult,
        route: routeResult
      });
    }

    // Build truck-specific graphs only for assigned trucks summary
    const truckSummary = truckStates.map((ts) => {
      let graphResult = {
        feasibleRoads: [],
        graph: {},
        routePossible: false
      };

      if (ts.assignedFarms.length > 0) {
        graphResult = roadFeasibilityService.buildTruckGraph(ts.truck, roads);
      }

      return {
        truckId: ts.truckId,
        name: ts.name,
        capacity: ts.capacity,
        initialLoad: ts.initialLoad,
        assignedLoad: ts.assignedLoad,
        remainingCapacity: ts.remainingCapacity,
        assignedFarms: ts.assignedFarms,
        roadFeasibility: graphResult
      };
    });

    return {
      totalFarms,
      processedFarms: prioritizedFarms.length,
      prioritizedFarms,
      truckAssignments: truckSummary
    };
  }
}

module.exports = new ProcessEngineService();
