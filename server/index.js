const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const champion = require('./champion')

const schema = buildSchema(`
  type Query {
    language: String,
    getChampions: [Champion],
    getChampionByName(name: String!): Champion
  }
  
  type Champion {
    name: String
    attackDamage: Float
  }
  
  
  type Mutation {
    updateAttackDamage(name: String!, attackDamage: Float): Champion,
    makeNewChampion(name: String!, attackDamage: Float): Champion
    removeChampion(name: String!, attackDamage: Float): Champion
  }
  `
)

const champions = [
    new champion('Ashe', 100),
    new champion('Vayne', 200)
]

const rootValue = {
    language: () => 'GraphQL',
    getChampions: () => champions,
    getChampionByName: ({ name }) => {
        return champions.find(x => x.name === name)
    },
    updateAttackDamage: ({ name, attackDamage = 150 }) => {
        const champion = champions.find(x => x.name === name)
        champion.attackDamage = attackDamage
        return champion
    },
    makeNewChampion: ({name, attackDamage}) => {
        champions.push({name: name, attackDamage: attackDamage})
        return champion;
    },
    removeChampion: ({name}) => {
        champions.forEach((champion, idx) => {
            champion.name === name ? champions.splice(idx, 1) : ''
        })
        return champion;
    }
}



const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
    rootValue, schema, graphiql: true
}))

app.listen(4000, () => console.log('Listening on 4000'))

