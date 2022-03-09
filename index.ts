import { PrismaClient } from "@prisma/client";
import cors from 'cors'
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})

app.get('/users', async (req, res) =>{
    const allUsers = await prisma.user.findMany({ include: { hobby: true}})
    res.send(allUsers)
})

app.get('/users/:id', (req, res)=> {
    const id = Number(req.params.id)
})

app.get('/users/:email', async(req, res) => {
    const email = req.params.email

    try{
        const user = await prisma.user.findFirst({
            where: {email},
            include: { hobby: true}
        })

        if(user){
            res.send(user)
        }else{
            res.status(404).send({ error: 'User not found.'})
        }
    } catch (err){
        //@ts-ignore
        res.status(404).send(`<pre>${err.message}</pre>`)

    }
})

app.post('/users', async (req, res) => {
    const { fullName, image, email, hobby = []} = req.body

    try{
        const newUser = await prisma.user.create({
             data: {
                 fullName,
                  image, 
                  email,
                  hobby: {
                      //an array of {where, create} data for hobby
                    connectOrCreate: hobby.map((hobby: any) => ({
                        //try to find hobby if it exists
                    where: {name: hobby.name},
                    // if it doesnt exist, create a new hobby
                    create: hobby
                    }))
                  }
                },
                include: {
                    hobby: true
                }
            })
            res.send(newUser)
    }catch (err) {
        //@ts-ignore
        res.status(400).send({ err: err.message})
    }
})


app.post('/addHobby', async(req, res) => {
   const {email, hobby} =req.body

   //do convoluted checking
   try{
       const user = await prisma.user.update({
           where: { email: email}, 
           data: {
               hobby: {
                   connectOrCreate: {
                       where: {name : hobby.name},
                       create: hobby
                   }
               }
           },
           include: {
               hobby : true
           }
       })
       res.send(user)
   }catch (err){
       //@ts-ignore
        res.status(404).send(`<pre>${err.message}</pre>`)
   }
})

app.patch('/addHobbyToUser',async (req, res) => {
    const {email, hobby} = req.body

    try{
        const updatedUser = await prisma.user.update({
            where: {email: email},
            data: {hobby: {connect: {name: hobby}}},
            include: {hobby : true}
        })
        res.send(updatedUser)
    }catch (err){
        //@ts-ignore
        res.status(404).send(`<pre>${err.message}</pre>`)
    }
})


app.patch('/removeHobbyFromUser', async(req, res )=> {
    const { email, hobby} = req.body

    try{
        const updatedUser = await prisma.user.update({
            where: {email},
            data: {hobby: {disconnect : {name: hobby}}},
            include: {hobby : true}
        })
        res.send(updatedUser)
    }catch (err) {
        //@ts-ignore
        res.status(404).send(`<pre>${err.message}</pre>`)
    }
})




// app.patch('/users/:id',async (req, res) => {
//     const id = Number(req.params.id)
//     const {fullName, email, image, hobby} = req.body

//     await prisma.user.update({
//         where: {id : id},
//         data: {email: email, fullName : fullName, hobby: {connectOrCreate: []}}
//     })
// })

app.get('/hobbies', async(req, res)=>{
    const hobbies =  await prisma.hobby.findMany({ include: {users: true}})
    res.send(hobbies)
})

app.get('/hobbies/:name',async (req, res) => {
    const name = req.params.name

    try{
const hobby = await prisma.hobby.findUnique({
    where: {name},
    include: {users : true}
})
if(hobby){
    res.send(hobby)
}else{
    res.status(404).send({error: 'Hobby not found!'})
}
    } catch(err){
        //@ts-ignore
        res.status(400).send(`<pre>${err.message}</pre>`)
    }
})



app.listen(4000, () => { console.log('Server is running : http://localhost:4000')})