package com.naren.moviesapp.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TmdbCastMemberDto {
    private Long id;
    private String name;
    private String character;
    private String profilePath;
    private Integer order;
}
