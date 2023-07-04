import axios, { AxiosInstance } from "axios"
import { useState } from "react"

const API_URL = "http://localhost:9091/api/auth";

 class AuthService {
  // protected readonly instance: AxiosInstance
  // public constructor(url: string) {
  //   this.instance = axios.create({
  //     baseURL: url,
  //     timeout: 30000,
  //     timeoutErrorMessage: "Time out!",
  //   })
  // }

  login = (loginReq) => {
let roleId = '';
let roleName ='';

    return axios
      .post(API_URL+"/login", {
        ...loginReq
      })
      .then((res) => {
        console.log(res)
        res.data.role.map(project => {
          roleId =project.id,
          roleName =project.roleName
        })

        return {
          username: res.data.username,
          accessToken: res.data.token,
          id: res.data.id,
          roleId: roleId,
          roleName: roleName,
          expiredAt: res.data.expiredAt,
        }
      })
  };

}
export default AuthService;
