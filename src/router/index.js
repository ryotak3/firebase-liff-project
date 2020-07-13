import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PizzaList from '../views/PizzaList.vue'
import CreatePoll from '../views/CreatePoll.vue'
import Poll from '../views/Poll.vue'
import OptionVoters from '../views/OptionVoters.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/products',
  name: 'PizzaList',
  component: PizzaList
},
{
  path: '/create-poll',
  name: 'CreatePoll',
  component: CreatePoll
},
{
  path: '/poll',
  name: 'Poll',
  component: Poll
},
{
  path: '/poll/:pollId/option/:optionValue',
  name: 'OptionVoters',
  component: OptionVoters
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router