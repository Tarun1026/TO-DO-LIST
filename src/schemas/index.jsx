import * as Yup from "yup";
export const ToDoListSchema =Yup.object({
    list:Yup.string().min(2).max(50).required("List should be atleast 2 characters")
})