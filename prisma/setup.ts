import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ['query', 'error', 'warn', 'info']})


const hobbies = [
    { 
       name: "Cycling",
       image: "https://static.toiimg.com/thumb/85201540.cms?width=680&height=512&imgsize=989394", 
       active: true 
    },
    { 
         name: "Dancing",
         image: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/female-dancer-in-motion-royalty-free-image-1575472481.jpg",
         active: true
    },
    {
         name: "Swimming",
         image: "https://cdn.britannica.com/66/162466-131-47ADB66F/Man-butterfly-stroke-pool.jpg",
          active: true
    }
]
const users = [
    {
        
        fullName: "Artiola Caka",
        hobby: 
        {connect: [
            {  name: "Cycling" }, { name: "Dancing"}
        ]},
        image : "https://avatars.dicebear.com/api/avataaars/OlaDomi.svg",
        email: "artiola@email.com"
    },
    {
        
        fullName: "Erald Caka",
        hobby: 
        {connect: [
            {  name: "Cycling"} 
        ]},
        image : "https://avatars.dicebear.com/api/avataaars/eraldcaka.svg",
        email: "erald@email.com"
    },
    {
       
        fullName: "Romina Caka",
        hobby: 
        {connect: [
            {  name: "Cycling"}, { name: "Swimming"}
        ]},
        image : "https://avatars.dicebear.com/api/avataaars/rominacaka.svg",
        email: "romina@email.com"
    }
]


async function createStuff() {
    for(const hobby of hobbies){
        await prisma.hobby.create({ data: hobby})
    }

    for(const user of users){
        await prisma.user.create({data: user})
    }
   
   
}
createStuff()