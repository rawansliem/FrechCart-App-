"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerSchema, registerSchemaType } from './../../schema/register.scheme';
import { zodResolver } from '@hookform/resolvers/zod'
import  axios  from 'axios';
import { toast } from "sonner";



export default function Register() {
  const form=useForm<registerSchemaType>({
    defaultValues:{
       name:"",
      email:"",
      password:"",
      rePassword:"",
      phone:""
  
    },
    resolver:zodResolver(registerSchema)
    
  
});
  async function handleRegister(values:registerSchemaType){
   
    try{
       const response= await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup",values);

if (response.data.message==="success")
{
   toast.success("you registered successfully",{position:"top-center",duration:3000})

}
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Registration failed";
        toast.error(message, { position: "top-center", duration: 3000 });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
          duration: 3000,
        });
      }
    }
    
  }
  return <>
  
  <div  className="mx-auto w-1/2 my-12">
  
  <h1 className='text-3xl text-green-500 text-center font-bold my-4'>Register Now</h1>
  <Form{...form}>
 <form  onSubmit={form.handleSubmit(handleRegister)}>
   <FormField
    control={form.control}
    name="name"
    render={({field}) => (
      <FormItem>
        <FormLabel  className='text-green-400 text-md'>Name :</FormLabel> <FormLabel/>
        <FormControl>
          <Input {...field} />
    
        </FormControl>
        <FormDescription />
        <FormMessage/>
      </FormItem>
    )}
  />
    <FormField
    control={form.control}
    name="email"
    render={({field}) => (
      <FormItem>
        <FormLabel  className='text-green-400 text-md'>Email :</FormLabel> <FormLabel/>
        <FormControl>
          <Input type='email' {...field} />
    
        </FormControl>
        <FormDescription />
        <FormMessage/>
      </FormItem>
    )}
  />
    <FormField
    control={form.control}
    name="password"
    render={({field}) => (
      <FormItem>
        <FormLabel  className='text-green-400 text-md'>Password :</FormLabel> <FormLabel/>
        <FormControl>
          <Input type='password' {...field} />
    
        </FormControl>
        <FormDescription />
        <FormMessage/>
      </FormItem>
    )}
  />
    <FormField
    control={form.control}
    name="rePassword"
    render={({field}) => (
      <FormItem>
        <FormLabel  className='text-green-400 text-md'>re-password :</FormLabel> <FormLabel/>
        <FormControl>
          <Input  type='password'{...field} />
    
        </FormControl>
        <FormDescription />
        <FormMessage/>
      </FormItem>
    )}
  />
      <FormField
    control={form.control}
    name="phone"
    render={({field}) => (
      <FormItem>
        <FormLabel  className='text-green-400 text-md'>Phone :</FormLabel> <FormLabel/>
        <FormControl>
          <Input type="tel" {...field} />
    
        </FormControl>
        <FormDescription />
        <FormMessage/>
      </FormItem>
    )}
  />
  <Button className='mt-4 bg-green-500 hover:bg-green-700 cursor-pointer w-full'>Register Now</Button>
 </form>

</Form>
  
  
  
  
  
  
  
  
  
  
  </div> 
  
  
  
  
  
  
  
  
  
  </>
}
