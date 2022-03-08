import { PrismaClient } from "@prisma/client";
import cors from 'cors'
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()



app.listen(4000, () => { console.log('Server is running : http://localhost:4000')})