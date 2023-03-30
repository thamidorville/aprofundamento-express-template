import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

//criar um endpoint de busca especifica (por id)

app.get('/accounts/:id', (req: Request, res: Response) => {

    const id = req.params.id

    const result = accounts.find((account) => account.id === id)

    res.status(200).send(result)
})

//implemente um endpoint que seleciona um item path params(id) e o DELETA

app.delete('/accounts/:id', (req:Request, res:Response) => {

    const id = req.params.id

    const indexToRemove = accounts.findIndex((account) => account.id === id)
    if (indexToRemove >= 0) { //SIGNIFICA QUE ENCONTROU O ITEM pois se ele for -1 ele nao encontrou o indice
        accounts.splice(indexToRemove, 1) //o segundo argumento e quantos itens quero remover a partir do indice
    }
    res.status(200).send('Item deleted successfully')
})

//edicao de recursos
//implemente um endpoint de atualizacao que 
//- seleciona o item via path params (id) e 
// - recebe os dados a serem alterados via body

app.put('/accounts/:id', (req:Request, res:Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

        // const accountToEdit = accounts.find((account) => account.id === id)
            const account = accounts.find((account)=> account.id === id)
        // if (accountToEdit) {
            
        // res.status(200).send('Atualizacao realizada com sucesso')
        // }



//se na aconta o valor for undefined, mantenha o mesmo valor, senao, altere-o
// if (account){
// account.id = (newId === undefined ? account.id : newId)
// }

// se na conta houver um novo valor(truthy), altere, ou, mantenho o valor(falsy)
if (account) {
    account.id = newId || account.id 
    account.ownerName = newOwnerName || account.ownerName
    account.type = newType || account.type

    account.balance = isNaN(newBalance) ? account.balance : newBalance
}
res.status(200).send('Update performed successfully.')
})