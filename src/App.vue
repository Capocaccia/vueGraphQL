<template>
  <div id="app">
    <h3>Example 1</h3>
    <div>
      Data: {{ example1 }}
    </div>
    <button @click="getLanguage">Get Language</button>
    <hr>
    <h3>Example 2</h3>
    <div>
      Data:
      <div v-for="(champion, idx) in champions" :key="idx">
        {{ champion }}
      </div>
    </div>
    <button @click="getChampions">Get Champions</button>
    <hr>
    <h3>Example 4</h3>
    Name: <input v-model="name">
    <div>
      Data:
      {{ champion }}
    </div>
    <button @click="getChampionByName">Get Champion</button>
    <hr>
    <h3>Example 4: Update Existing</h3>
    Name: <input v-model="name">
    Attack Damage: <input v-model.number="attack">
    <div>
      Data:
      {{ updatedChampion }}
    </div>
    <button @click="updateAttackDamage">Update Champion</button>
    <hr>
    <h3>Example 5: Create New</h3>
    Name: <input v-model="name">
    Attack Damage: <input v-model.number="attack">
    <div>
      Data:
      {{ updatedChampion }}
    </div>
    <button @click="makeNewChampion">Add New Champion</button>
    <hr>
    <h3>Example 5: Delete</h3>
    Name: <input v-model="name">
    <div>
      Data:
      {{ updatedChampion }}
    </div>
    <button @click="removeChampion">Remove Champion</button>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

<script>
  import axios from 'axios'
  export default {
    name: 'app',
    data () {
      return {
        example1: '',
        champions: null,
        champion: null,
        updatedChampion: null,
        number: null,
        name: null,
        newChampion: null,
        attack: null
      }
    },
    methods: {
      async getLanguage () {
        try {
          const res = await axios.post(
                  'http://localhost:4000/graphql', {
                    query: '{ language }'
                  })
          this.example1 = res.data.data.language
        } catch (e) {
          console.log('err', e)
        }
      },
      async getChampions () {
        const res = await axios.post(
                'http://localhost:4000/graphql', {
                  query: `{
          getChampions {
            name
          }
        }`
                })
        this.champions = res.data.data
      },
      async getChampionByName () {
        const res = await axios.post(
                'http://localhost:4000/graphql', {
                  query: `
          query GetChampionByName($championName: String!) {
            getChampionByName(name: $championName) {
              name
              attackDamage
            }
          }`,
                  variables: {
                    championName: this.name
                  }
                })
        this.champion = res.data.data.getChampionByName
      },
      async updateAttackDamage () {
        const res = await axios.post('http://localhost:4000/graphql', {
          query: `
        mutation UpdateAttackDamage(
          $championName: String!,  $attackDamage: Float) {
          updateAttackDamage(name: $championName, attackDamage: $attackDamage) {
            name
            attackDamage
          }
        }`,
          variables: {
            championName: this.name,
            attackDamage: this.attack
          }
        })
        this.updatedChampion = res.data.data.updateAttackDamage
      },
      async makeNewChampion () {
        const res = await axios.post('http://localhost:4000/graphql', {
          query: `
        mutation makeNewChampion(
          $championName: String!,  $attackDamage: Float) {
          makeNewChampion(name: $championName, attackDamage: $attackDamage) {
            name
            attackDamage
          }
        }`,
          variables: {
            championName: this.name,
            attackDamage: this.attack
          }
        })
        this.newChampion = res.data.data.makeNewChampion
      },
      async removeChampion () {
        const res = await axios.post('http://localhost:4000/graphql', {
          query: `
        mutation removeChampion(
          $championName: String!) {
          removeChampion(name: $championName) {
            name
          }
        }`,
          variables: {
            championName: this.name
          }
        })
        this.newChampion = res.data.data.removeChampion
      }
    }
  }
</script>