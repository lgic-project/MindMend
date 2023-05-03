package org.example.beans;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountResp {
    String username;
    Integer userId;
    Integer accountId;
    Integer profileId;
    Integer addressId;
    String firstName;
    String lastName;
    String email;
    String gender;
    String phone;
    String image;
    String country;
    String city;
    String zipCode;
    String state;
    String street;

}
