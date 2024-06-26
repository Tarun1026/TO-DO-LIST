import * as Yup from "yup";
export const ToDoListSchema =Yup.object({
    list:Yup.string().min(2).max(50).required("List should be atleast 2 characters"),
    description:Yup.string().min(10).max(100).required("Description should be atleat 10 characters"),
    dueDate: Yup.date().required("Due Date is required")
    
})