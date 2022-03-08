import { PrismaClient } from "@prisma/client";
import cors from 'cors'
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})

app.get('/users', async (req, res) =>{
    const users = await prisma.user.findMany({ include: { hobby: true}})
    res.send(users)
})

app.post('users', async (req, res) => {
    const { fullName, image, email} = req.body
    const newUser = await prisma.user.create({ data: {fullName, image, email}})
    res.send(newUser)
})
app.get('/hobbies', async(req, res)=>{
    const hobbies =  await prisma.hobby.findMany({ include: {users: true}})
    res.send(hobbies)
})

app.listen(4000, () => { console.log('Server is running : http://localhost:4000')})