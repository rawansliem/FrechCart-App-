"use server"
import getMyToken from "../utilities/getMyToken"


export default async function  getLoggedUserCart (){
    const token = await getMyToken()
    if (!token) {
      return { status: "error", message: "Please login to be able to see cart!", data: [] };
    }
    const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart',{
        method:'GET',
        headers:{
            token,
            "Content-Type":"application/json"
        }
});
const payload = await response.json();
return payload
}