package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Admin;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class AdminInviteDTOMapper implements Function<Admin, AdminInviteDTO> {

    @Override
    public AdminInviteDTO apply(Admin admin) {
        return new AdminInviteDTO(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getDepartment(),
                admin.getIsActive(),
                admin.getCreatedAt()
        );
    }
}
