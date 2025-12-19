import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/home/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SignupView from '@/views/auth/SignupView.vue'
import MyPageHome from '@/views/mypage/MyPageHome.vue'
import SoloHomeView from '@/views/solo/SoloHomeView.vue'
import GroupHomeView from '@/views/group/GroupHomeView.vue'
import GroupCreateView from '@/views/group/GroupCreateView.vue'
import GroupDetailView from '@/views/group/GroupDetailView.vue'
import CommunityCreateView from '@/views/group/CommunityCreateView.vue'
import InviteJoinView from '@/views/group/InviteJoinView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },

  { path: '/mypage', name: 'mypage', component: MyPageHome },

  { path: '/solo', name: 'solo-home', component: SoloHomeView },
  { path: '/group', name: 'group-home', component: GroupHomeView },
  { path: '/group/create', name: 'group-create', component: GroupCreateView },
  { path: '/group/:id', name: 'group-detail', component: GroupDetailView },
  { path: '/group/:id/create', name: 'CommunityCreate', component: CommunityCreateView },
  { path: '/invite/:code', name: 'InviteJoin', component: InviteJoinView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
