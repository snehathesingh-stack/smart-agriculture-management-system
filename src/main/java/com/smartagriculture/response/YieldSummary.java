package com.smartagriculture.response;

public class YieldSummary {

    private Double totalExpectedYield;
    private Double totalActualYield;
    private Double yieldDifference;
    private Double performancePercentage;

    public YieldSummary(Double totalExpectedYield,
                        Double totalActualYield,
                        Double yieldDifference,
                        Double performancePercentage) {
        this.totalExpectedYield = totalExpectedYield;
        this.totalActualYield = totalActualYield;
        this.yieldDifference = yieldDifference;
        this.performancePercentage = performancePercentage;
    }

    public Double getTotalExpectedYield() {
        return totalExpectedYield;
    }

    public Double getTotalActualYield() {
        return totalActualYield;
    }

    public Double getYieldDifference() {
        return yieldDifference;
    }

    public Double getPerformancePercentage() {
        return performancePercentage;
    }
}