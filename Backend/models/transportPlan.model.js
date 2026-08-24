const mongoose = require('mongoose');
const { Schema } = mongoose;

const transportPlanSchema = new Schema(
  {
    truck: {
      type: Schema.Types.ObjectId,
      ref: 'Truck',
      required: [true, 'Truck reference is required']
    },
    farms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
      }
    ],
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse reference is required']
    },
    pickupOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
      }
    ],
    totalLoad: {
      type: Number,
      min: [0, 'Total load cannot be negative'],
      default: 0
    },
    remainingCapacity: {
      type: Number,
      min: [0, 'Remaining capacity cannot be negative'],
      default: 0
    },
    totalDistance: {
      type: Number,
      min: [0, 'Total distance cannot be negative'],
      default: 0
    },
    estimatedTime: {
      type: Number,
      min: [0, 'Estimated time cannot be negative'],
      default: 0
    },
    totalCost: {
      type: Number,
      min: [0, 'Total cost cannot be negative'],
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        message: 'Status must be PLANNED, IN_PROGRESS, COMPLETED, or CANCELLED'
      },
      default: 'PLANNED'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TransportPlan', transportPlanSchema);
