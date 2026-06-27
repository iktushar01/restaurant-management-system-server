import { FloorPlanService } from "../floorPlan/floorPlan.service";

const getSeatLayout = async () => {
    const floorPlan = await FloorPlanService.getFloorPlan();
    return floorPlan;
};

export const DashboardService = {
    getSeatLayout,
};
