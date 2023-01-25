import { Router } from 'express'
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../db.js'

const auth = Router()


// SIGNUP ROUTE
auth.post('/signup', [
  check("email", "Please provide a valid email")
    .isEmail(),
  check("password", "Please provide a password that is greater than 5 characters.")
    .isLength({
      min: 6
    }),
  check("username", "Please provide a username that is greater than 5 characters.")
    .isLength({
      min: 6
    })
], async (req, res) => {
  try {
    const { username, email, password } = req.body

  // VALIDATED THE INPUT
  const errors = validationResult(req)

  if (!errors.isEmpty())
    return res.status(400).json({
      errors: errors.array()
    })

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = { username, email, password: hashedPassword }

  const insertedUser = await UserModel.create(newUser)

  // Payload
  const token = await jwt.sign({
    newUser
    // Below, use an ENV reference
  }, "nfb32iur32ibfqfvi3vf932bg932g932", {
    expiresIn: 360000
  })

  res.status(201).json({ insertedUser, token })

  } catch (err) {
    res.status(500).send({ error: err.message })
  }
  
})

auth.post('/login', async (req, res) => {
  try {
  const { email, password } = req.body
  
  // Check if user with email exists
  const loginUser = { email, password }

  // Check if the password if valid
  if(!await bcrypt.compare(password, comparedUser[0].password)){
    return res.status(404).json({
        errors: [
            {
                msg: "Bcrypt" 
            }
        ]
    })
  }

  const comparedUser = await UserModel.find(loginUser)
  console.log(comparedUser)

  console.log(password)
  console.log(comparedUser[0].password)

  if(comparedUser.length === 0){
    return res.status(422).json({
        errors: [
            {
                msg: "Length",
            }
        ]
    })
    }

    res.json("sup")

  } catch (error) {
    res.status(500).send({error: error.message})
  }
  
  // // Check if the password if valid
  // if(!await bcrypt.compare(password, user.password)){
  //   return res.status(404).json({
  //       errors: [
  //           {
  //               msg: "Invalid Credentials" 
  //           }
  //       ]
  //   })
  // }

  // // Send JSON WEB TOKEN
  // const token = await jwt.sign({email}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000})

  // res.json({
  //     token
  // })
})

export default auth