const Plan = require("../models/plan");
const { ObjectId } = require("mongoose").SchemaTypes;
// Plan.insertMany([
//   {
//     "_id":"starter",
//     "min": 2000,"max":7500,"pt":3900,"tr":15600
//   },
//   {
//     "_id": "gold","min":20000,"max":100000,"pt":60000,"tr":240000
//   },
//   {
    
// _id:
// "silver",
// min:
// 7500,
// max:
// 20000,
// pt:
// 13750,
// tr:55000
//   }
// ])

module.exports = {
  fetchPlans: async () => await Plan.find({}),
  // .populate({path: "user", select: {"fname": 1, "lname": 1, "_id": 0}})
  fetchPlan: async (planId) => {
    const plan = await Plan.findById(planId);
    return plan;
  },

  savePlan: async () => {
    await Plan.insertMany([
      {
        _id: "starter",
        min: 300,
        max: 7500,
        pt: 3900,
        tr: 15600,
      },
      {
        _id: "silver",
        min: 7500,
        max: 20000,
        pt: 13750,
        tr: 55000,
      },
      {
        _id: "gold",
        min: 20000,
        max: 100000,
        pt: 60000,
        tr: 240000,
      },
    ]);
  },
  updatePlan: async (req, res) => {
    const foundPlan = await Plan.findOne(req.params._id);
    foundPlan.min = req.body.min;
    foundPlan.max = req.body.max;
    foundPlan.pt = req.body.pt;
    foundPlan.tr = req.body.tr;
    await foundPlan.save();
    res.status(200).json({
      message: "Update Successful",
    });
  },
};
