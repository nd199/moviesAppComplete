package com.naren.moviesapp.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TmdbVideoDto {

    private String id;
    private String key;
    private String name;
    private String site;
    private String type;
    private Boolean official;
    
    @JsonProperty("published_at")
    private String publishedAt;
    
    private Integer size;
}