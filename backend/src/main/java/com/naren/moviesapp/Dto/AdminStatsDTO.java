package com.naren.moviesapp.Dto;

import java.util.List;

public record AdminStatsDTO(
        long totalAdmins,
        long activeAdmins,
        List<Object[]> departmentStats
) {
}
